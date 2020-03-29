import * as path from 'path';
import * as egg from 'egg';
const is = require('is-type-of');
const { composeArrayToObject } = require('./util');
// ts-ignore
const { wrapClass, wrapObject } = require('./util');
const FileLoader = require('./file_loader');
const ContextLoader = require('./context_loader');

export class AppWorkerLoader extends egg.AppWorkerLoader {
  loadModule(moduleName: string) {
    // const controllerPath = path.join(__dirname, `../../module/${moduleName}/controller`);
    // console.log(controllerPath);
    const servicePath = path.join(__dirname, `../../module/${moduleName}/service`);
    // const repoPath = path.join(__dirname, `../../module/${moduleName}/repo`);
    this.loadToContext(servicePath, 'service', { property: 'bp' });
    // const controllerPath = path.join(__dirname, `../../module/${moduleName}/controller`);
    // this.loadToApp(controllerPath, 'controllers');
    // this.loadToContext(repoPath, 'repo', { property: 'bp' });
    // this.loadToContext(controllerPath, 'controller', { property: 'bp' });
    // this.loadToContext(servicePath, 'service');
    // this.loadToContext(repoPath, 'repo');
  }

  loadModuleToApp(directory, declareTo, opt) {
    const target = {};
    const property = composeArrayToObject(declareTo.split('.'), target);
    Object.assign(this.app, property);
    opt = Object.assign(
      {},
      {
        directory,
        target,
        inject: this.app
      },
      opt
    );
    const timingKey = `Load "${String(property)}" to Application`;
    (this as any).timing.start(timingKey);
    new FileLoader(opt).loadModule(declareTo);
    (this as any).timing.end(timingKey);
  }

  loadModuleToContext(directory, declareTo, opt) {
    const property = composeArrayToObject(declareTo.split('.'));
    opt = Object.assign(
      {},
      {
        directory,
        property,
        inject: this.app
      },
      opt
    );

    const timingKey = `Load "${String(property)}" to Context`;
    (this as any).timing.start(timingKey);
    new ContextLoader(opt, declareTo).loadModule(declareTo);
    (this as any).timing.end(timingKey);
  }

  load() {
    const appOpt = {
      caseStyle: 'lower',
      initializer: (_obj, opt) => {
        // let obj = { bp: _obj } as any;
        console.log('_obj');
        console.log(_obj);
        let obj = _obj;
        if (
          is.function(obj) &&
          !is.generatorFunction(obj) &&
          !is.class(obj) &&
          !is.asyncFunction(obj)
        ) {
          obj = obj(this.app);
        }
        if (is.class(obj)) {
          obj.prototype.pathName = opt.pathName;
          obj.prototype.fullPath = opt.path;
          return wrapClass(obj);
        }
        if (is.object(obj)) {
          return wrapObject(obj, opt.path);
        }
        // support generatorFunction for forward compatbility
        if (is.generatorFunction(obj) || is.asyncFunction(obj)) {
          return wrapObject({ 'module.exports': obj }, opt.path)['module.exports'];
        }
        return obj;
      }
    };
    const contextOpt = {
      call: true,
      caseStyle: 'lower',
      fieldClass: 'serviceClasses',
      directory: this.getLoadUnits().map(unit => path.join(unit.path, 'module/bp/service'))
    };

    const controllerPath = path.join(__dirname, '../../module/bp/controller');
    this.loadModuleToApp(controllerPath, 'module.bp.controller', appOpt);
    const servicePath = path.join(__dirname, '../../module/bp/service');
    this.loadModuleToContext(servicePath, 'module.bp.service', contextOpt);
    // const repoPath = path.join(__dirname, `../../module/${moduleName}/repo`);
    // this.loadToContext(servicePath, 'bp', { property: 'module' });

    //   这里加载 你的目录包括controller，router，比如app1， app2，backend,  frontend，admin等
    //   目录这块 考虑配置到config 中就好了
    // let directory = path.join(this.config.baseDir, 'app2/controller');
    // this.loadToApp(directory, 'controller', opt);
    // this.loadFile(path.join(this.config.baseDir, 'app2/router.js'));

    // directory = path.join(this.config.baseDir, 'app1/controller');
    // this.loadToApp(directory, 'controller', opt);
    // this.loadFile(path.join(this.config.baseDir, 'app1/router.js'));
    console.log(contextOpt)
    super.load();
    console.log('lodaed');
  }
}
