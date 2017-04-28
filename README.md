# ExpressJS Yields

A dead simple ES6 generators and ES7 async/await support hack for [ExpressJS](http://expressjs.com)

## Usage

```
npm install express-yields --save
```

Then require this script somewhere __before__ you start using it:

```js
const express = require('express');
const yields = require('express-yields');
const User = require('./models/user');
const app = express();

app.get('/users', function* (req, res) {
  const users = yield User.findAll(); // <- some Promise
  res.send(users);
});

// or with node 7 async/await
app.get('/users', async (req, res) => {
  const users = await User.findAll(); // <- some Promise
  res.send(users);
});
```

## A Notice About Calling `next`

As we all know express sends a function called `next` into the middleware, which
then needs to be called with or without error to make it move the request handling
to the next middleware. It still works, but in case of a generator function, you
don't need to do that. If you want to pass an error, just throw a normal exception:

```js
app.use(function * (req, res) {
  const user = yield User.findByToken(req.get('authorization'));

  if (!user) throw Error("access denied");
});

// the same with Node 7 async/await
app.use(async (req, res) => {
  const user = await User.findByToken(req.get('authorization'));

  if (!user) throw Error("access denied");
});
```

## How Does This Work?

This is a minimalistic and unintrusive hack. Instead of patching all methods
on an express `Router`, it wraps the `Layer#handle` property in one place, leaving
all the rest of the express guts intact.

The idea is that you require the patch once and then use the `'express'` lib the
usual way in the rest of your application.

## Copyright & License

All code in this repository released under the terms of the ISC license.

Copyright (C) 2016 Nikolay Nemshilov
