const co = require('co');
const Layer = require('express/lib/router/layer');

Object.defineProperty(Layer.prototype, "handle", {
  enumerable: true,
  get: function() { return this.__handle; },
  set: function(fn) {
    if (isGenerator(fn)) {
      fn = wrap(fn);
    }

    this.__handle = fn;
  }
});

function isGenerator(fn) {
  const type = Object.toString.call(fn.constructor);
  return type.indexOf('GeneratorFunction') !== -1;
}

function wrap(original) {
  const wrapped = co.wrap(original);
  return function(req, res, next) {
    wrapped(req, res, next).catch(next);
  };
};
