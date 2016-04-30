# ExpressJS Yields

A dead simple ES6 generators support hack for [ExpressJS](http://expressjs.com)

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
```

## How Does This Work?

This is a very minimalistic and unintrusive hack. Instead of patching all methods
on an express `Router`, it wraps the `Layer#handle` property in one place, leaving
all the rest of the express guts intact.

The idea is that you require the patch once and then use the `'express'` lib the
usual way in the rest of your application.

## Copyright & License

All code in this repository is released under the terms of the ISC license.

Copyright (C) 2016 Nikolay Nemshilov
