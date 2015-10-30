var rill = require("rill");
var ctx  = rill.Context.prototype;

/**
 * Creates a Middleware function that attaches a session user to the context.
 */
function auth (options) {
	return function authMiddleware (req, res, next) {
		if (this.session && this.session.user) {
			this.user = this.session.user;
		}

		return next();
	}
}

/**
 * Creates a middleware that only proceeds if a user is logged in.
 */
function isLoggedIn (options) {
	return function isLoggedInMiddleware (req, res, next) {
		if (this.isLoggedIn()) return next();
	}
}

/**
 * Creates a middleware that only proceeds if a user is not logged in.
 */
function isLoggedOut () {
	return function isLoggedOutMiddleware (req, res, next) {
		if (this.isLoggedOut()) return next();
	}
}

/**
 * Login a user and save them in the rill session.
 */
ctx.login = function login (user) {
	if (this.session) this.session.user = user;
	this.user = user;
};

/**
 * Remove a user from a rill session.
 */
ctx.logout = function logout () {
	if (this.session) delete this.session.user;
	delete this.user;
};

/**
 * Check if a user is logged in.
 */
ctx.isLoggedIn = function isLoggedIn () {
	return this.user != null;
};

/**
 * Check if a user is logged out.
 */
ctx.isLoggedOut = function isLoggedOut () {
	return this.user == null;
};

auth.isLoggedIn  = isLoggedIn;
auth.isLoggedOut = isLoggedOut;
module.exports   = auth;