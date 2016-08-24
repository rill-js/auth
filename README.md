<h1 align="center">
  <!-- Logo -->
  <img src="https://raw.githubusercontent.com/rill-js/rill/master/Rill-Icon.jpg" alt="Rill"/>
  <br/>
  @rill/auth
	<br/>

  <!-- Stability -->
  <a href="https://nodejs.org/api/documentation.html#documentation_stability_index">
    <img src="https://img.shields.io/badge/stability-experimental-orange.svg?style=flat-square" alt="API stability"/>
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
npm install @rill/auth
```

# Example

```js
const rill = require('rill')
const app = rill()
const auth = require('@rill/auth')

app.use(auth())
app.use((ctx, next)=> {
	var user = ...

	// A user can be anything.
	ctx.login(user)

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
	"ttl": "1 hour",
	"refresh": true
}
```

# Utilities

## auth.isLoggedIn({ else })
Creates a middleware that will only continue if a user is logged in.
If the `else` option is supplied it will redirect when the user is not logged in.

```js
app.use(auth.isLoggedIn({ else: '/login' }))
```

## auth.isLoggedOut({ else })
Creates a middleware that will only continue if a user is logged out.
If the `else` option is supplied it will redirect when the user is logged in.

```js
app.use(auth.isLoggedOut({ else: '/dashboard' }))
```

### Contributions

* Use `npm test` to run tests.

Please feel free to create a PR!
