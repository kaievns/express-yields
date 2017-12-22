const co = require('co');
const Layer = require('express/lib/router/layer');

const noop = () => {};

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
};

function wrapGenerator(original) {
  const wrapped = co.wrap(original);
  return function(req, res, next = noop) {
    wrapped(req, res)
        .then(() => !res.finished && next())
        .catch(next);
  };
};

function wrapAsync(fn) {
  return (req, res, next = noop) => {
    fn(req, res, next)
      .then(() => !res.finished && next())
      .catch(next);
  }
};
