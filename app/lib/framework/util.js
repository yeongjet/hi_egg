const is = require('is-type-of');
const utility = require('utility');
const co = require('co');

const callFn = async (fn, args, ctx) => {
  args = args || [];
  if (!is.function(fn)) return;
  if (is.generatorFunction(fn)) fn = co.wrap(fn);
  return ctx ? fn.call(ctx, ...args) : fn(...args);
};

const FULLPATH = Symbol('EGG_LOADER_ITEM_FULLPATH');
// wrap the class, yield a object with middlewares
function wrapClass(Controller) {
  let proto = Controller.prototype;
  const ret = {};
  // tracing the prototype chain
  while (proto !== Object.prototype) {
    const keys = Object.getOwnPropertyNames(proto);
    for (const key of keys) {
      // getOwnPropertyNames will return constructor
      // that should be ignored
      if (key === 'constructor') {
        continue;
      }
      // skip getter, setter & non-function properties
      const d = Object.getOwnPropertyDescriptor(proto, key);
      // prevent to override sub method
      if (is.function(d.value) && !ret.hasOwnProperty(key)) {
        ret[key] = methodToMiddleware(Controller, key);
        ret[key][FULLPATH] =
          Controller.prototype.fullPath + '#' + Controller.name + '.' + key + '()';
      }
    }
    proto = Object.getPrototypeOf(proto);
  }
  return ret;

  function methodToMiddleware(Controller, key) {
    return function classControllerMiddleware(...args) {
      const controller = new Controller(this);
      if (!this.app.config.controller || !this.app.config.controller.supportParams) {
        args = [this];
      }
      return callFn(controller[key], args, controller);
    };
  }
}

// wrap the method of the object, method can receive ctx as it's first argument
function wrapObject(obj, path, prefix) {
  const keys = Object.keys(obj);
  const ret = {};
  for (const key of keys) {
    if (is.function(obj[key])) {
      const names = utility.getParamNames(obj[key]);
      if (names[0] === 'next') {
        throw new Error(
          `controller \`${prefix || ''}${key}\` should not use next as argument from file ${path}`
        );
      }
      ret[key] = functionToMiddleware(obj[key]);
      ret[key][FULLPATH] = `${path}#${prefix || ''}${key}()`;
    } else if (is.object(obj[key])) {
      ret[key] = wrapObject(obj[key], path, `${prefix || ''}${key}.`);
    }
  }
  return ret;

  function functionToMiddleware(func) {
    const objectControllerMiddleware = async function(...args) {
      if (!this.app.config.controller || !this.app.config.controller.supportParams) {
        args = [this];
      }
      return await callFn(func, args, this);
    };
    for (const key in func) {
      objectControllerMiddleware[key] = func[key];
    }
    return objectControllerMiddleware;
  }
}

// ['abc', 'bbc', 'ccc'] => { abc: { bbc: ccc: {} } }
const composeArrayToObject = (array, init = {}) => {
  if (Array.isArray(array)) {
    let curr = array.pop();
    curr = { [curr]: init };
    while (array.length) {
      const key = array.pop();
      curr = { [key]: curr };
    }
    return curr;
  }
};

module.exports = {
  wrapClass,
  wrapObject,
  composeArrayToObject
};
