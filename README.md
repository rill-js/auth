<h1 align="center">
  <!-- Logo -->
  <img src="https://raw.githubusercontent.com/rill-js/rill/master/Rill-Icon.jpg" alt="Rill"/>
  <br/>
  @rill/auth
  <br/>

  <!-- Stability -->
  <a href="https://nodejs.org/api/documentation.html#documentation_stability_index">
    <img src="https://img.shields.io/badge/stability-stable-brightgreen.svg?style=flat-square" alt="API stability"/>
  </a>
  <!-- Standard -->
  <a href="https://github.com/feross/standard">
    <img src="https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square" alt="Standard"/>
  </a>
  <!-- NPM version -->
  <a href="https://npmjs.org/package/@rill/auth">
    <img src="https://img.shields.io/npm/v/@rill/auth.svg?style=flat-square" alt="NPM version"/>
  </a>
  <!-- Downloads -->
  <a href="https://npmjs.org/package/@rill/auth">
    <img src="https://img.shields.io/npm/dm/@rill/auth.svg?style=flat-square" alt="Downloads"/>
  </a>
  <!-- Gitter Chat -->
  <a href="https://gitter.im/rill-js/rill">
    <img src="https://img.shields.io/gitter/room/rill-js/rill.svg?style=flat-square" alt="Gitter Chat"/>
  </a>
</h1>

Simple session authentication with login and logout for Rill with support for timeouts, refreshes and more.

# Installation

```console
npm install @rill/session @rill/auth
```

# Example

```js
const rill = require('rill')
const app = rill()
const session = require('@rill/session')
const auth = require('@rill/auth')

// Setup middleware
app.use(session()) // A session is required
app.use(auth())

// Work with authentication.
app.use((ctx, next)=> {
  var user = ...

  // A user can be anything.
  ctx.login(user, {
    ttl: '30 minutes', // optionally override ttl option
    refresh: false // optionally override refresh option
  })

  // User is attached to and a cookie created.
  ctx.locals.user === user //-> true

  // Test if a user is logged in.
  ctx.isLoggedIn() //-> true
  ctx.isLoggedOut() //-> false

  // Removes the user cookie.
  ctx.logout()
});

// Route that only allows logged in users.
app.get('/a', auth.isLoggedIn(), ...)

// Route that only allows logged out in users.
app.get('/b', auth.isLoggedOut(), ...)
```

# Options

```js
// To enable a login that automatically refreshes and expires after 1 hour of inactivity you can use:
{
  "key": "different-cookie-key", // change cookie name
  "ttl": "1 hour", // change when the auth expires.
  "refresh": true // automatically reset auth expiry on page load.
}
```

# Utilities

## auth.isLoggedIn({ fail, redirect, fallback })
Creates a middleware that will only continue if a user is logged in.

If the `fail` option is supplied it will throw a 401 error with the provided message when the user is not logged in.

```js
app.use(auth.isLoggedIn({ fail: 'You must be logged in to access the api.' }))
```

If the `redirect` option is supplied it will redirect when the user is not logged in.

```js
app.use(auth.isLoggedIn({ redirect: '/login' }))
```

If the `fallback` option is supplied it will call the fallback function when the user is not logged in.

```js
app.use(auth.isLoggedIn({ fallback: handleUserNotLoggedIn }))
function handleUserNotLoggedIn (ctx, next) {...}
```

Otherwise nothing will happen but the next middleware will not be called.

## auth.isLoggedOut({ fail, redirect, fallback })

If the `fail` option is supplied it will throw a 401 error with the provided message when the user is logged in.

```js
app.use(auth.isLoggedOut({ fail: 'This page is only accessable when not logged in' }))
```

If the `redirect` option is supplied it will redirect when the user is logged in.

```js
app.use(auth.isLoggedOut({ redirect: '/dashboard' }))
```

If the `fallback` option is supplied it will call the fallback function when the user is logged in.

```js
app.use(auth.isLoggedOut({ fallback: handleUserLoggedIn }))
function handleUserLoggedIn (ctx, next) {...}
```

Otherwise nothing will happen but the next middleware will not be called.

### Contributions

* Use `npm test` to run tests.

Please feel free to create a PR!
