const Layer = require('express/lib/router/layer');

Object.defineProperty(Layer.prototype, "handle", {
  enumerable: true,
  get: function() { return this.__handle; },
  set: function(fn) {
    fn = wrap(fn);

    this.__handle = fn;
  }
});

function wrap(fn) {
  return (req, res, next) => {
    const routePromise = fn(req, res, next);

    if (routePromise && routePromise.catch && typeof routePromise.catch === 'function') {
      routePromise.catch(err => next(err));
    }

    return routePromise;
  }
};
