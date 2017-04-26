const co = require('co');
const Layer = require('express/lib/router/layer');

Object.defineProperty(Layer.prototype, "handle", {
  enumerable: true,
  get: function() { return this.__handle; },
  set: function(fn) {
    if (isGenerator(fn)) {
      fn = wrapGenerator(fn);
    }

    if (isAsync(fn)) {
      fn = wrapAsync(fn);
    }

    this.__handle = fn;
  }
});

function isGenerator(fn) {
  const type = Object.toString.call(fn.constructor);
  return type.indexOf('GeneratorFunction') !== -1;
}

function isAsync(fn) {
  const type = Object.toString.call(fn.constructor);
  return type.indexOf('AsyncFunction') !== -1;
}

function wrapGenerator(original) {
  const wrapped = co.wrap(original);
  return function() {
    const args = [].slice.call(arguments);
    if(args.length === 4){
      return original.apply(this, args)
    }

    const res = args[1];
    const next = args[2];

    return wrapped.apply(this, args).then(() => {
      !res.headersSent && next();
    }).catch(err => next(err || {}));
  };
}

function wrapAsync(fn) {
  return function(){
    const args = [].slice.call(arguments);
    const val = fn.apply(this, args);

    if(args.length !== 4) {
      val.catch(err => args[2](err || {}));
    }

    return val;
  }
}
