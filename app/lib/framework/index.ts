import * as path from 'path';
import * as egg from 'egg';
import { AppWorkerLoader } from './loader';

const EGG_PATH = Symbol.for('egg#eggPath');
const EGG_LOADER = Symbol.for('egg#loader');

class Application extends egg.Application {
  get [EGG_PATH]() {
    return path.dirname(__dirname);
  }
  // 覆盖 Egg 的 Loader，启动时使用这个 Loader
  get [EGG_LOADER]() {
    return AppWorkerLoader;
  }
}

export = Object.assign(egg, {
  Application,
  // 自定义的 Loader 也需要 export，上层框架需要基于这个扩展
  AppWorkerLoader
});
