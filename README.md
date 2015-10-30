# Rill Auth
Simple session login and logout for Rill.

# Installation

#### Npm
```console
npm install @rill/auth
```

# Example

```javascript
const rill    = require("rill");
const app     = rill();
const session = require("@rill/session");
const auth    = require("@rill/auth");

app.use(session());
app.use(auth());
app.use(function (req, res, next) {
	var user = ...;

	// A user can be anything.
	this.login(user);

	// User is attached to session and context.
	this.user === user; // true
	this.session.user === user; // true

	// Test if a user is logged in.
	this.isLoggedIn(); // true
	this.isLoggedOut(); // false

	// Removes the user from the session.
	this.logout();
});

// Route that only allows logged in users.
app.get("/a", auth.isLoggedIn(), ...);

// Route that only allows logged out in users.
app.get("/b", auth.isLoggedOut(), ...);
```


### Contributions

* Use gulp to run tests.

Please feel free to create a PR!
