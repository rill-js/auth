# Rill Auth
Simple session login and logout for Rill.

# Installation

#### Npm
```console
npm install @rill/auth
```

# Example

```js
const rill    = require("rill");
const app     = rill();
const session = require("@rill/session");
const auth    = require("@rill/auth");

app.use(session());
app.use(auth());
app.use(function (ctx, next) {
	var user = ...;

	// A user can be anything.
	ctx.login(user);

	// User is attached to session and context.
	ctx.locals.user === user; // true
	ctx.session.get("user") === user; // true

	// Test if a user is logged in.
	ctx.isLoggedIn(); // true
	ctx.isLoggedOut(); // false

	// Removes the user from the session.
	ctx.logout();
});

// Route that only allows logged in users.
app.get("/a", auth.isLoggedIn(), ...);

// Route that only allows logged out in users.
app.get("/b", auth.isLoggedOut(), ...);
```

# Options

```js
// All options are passed the @rill/session cache (https://github.com/DylanPiercey/receptacle#user-content-setkey-value-options).
// Interally
// To enable a login that automatically refreshes and expires after 1 hour of inactivity you can use:
{
	"ttl": "1 hour",
	"refresh": true
}
```

# Utilities

## auth.isLoggedIn({ else })
Creates a middleware that will only continue if a user is logged in.
If the `else` option is supplied it will redirect when the user is not logged in.

```js
app.use(auth.isLoggedIn({ else: "/login" }));
```

## auth.isLoggedOut({ else })
Creates a middleware that will only continue if a user is logged out.
If the `else` option is supplied it will redirect when the user is logged in.

```js
app.use(auth.isLoggedOut({ else: "/dashboard" }));
```

### Contributions

* Use gulp to run tests.

Please feel free to create a PR!
