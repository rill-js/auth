var ms         = require("ms");
module.exports = auth;

/**
 * Creates a Middleware function that attaches a session user to the context.
 */
function auth (options) {
	options     = options || {};
	var ID      = options.key || "rill_auth";
	var ttl     = options.ttl;
	var refresh = options.refresh;
	if (typeof ttl === "string") ttl = ms(ttl);

	return function authMiddleware (ctx, next) {
		var req = ctx.req;
		var res = ctx.res;
		var cookieOptions = {};

		if (req.cookies[ID]) {
			ctx.locals.user = JSON.parse(req.cookies[ID]);

			if (refresh) {
				if (ttl) cookieOptions.expires = new Date(new Date + ttl);
				res.cookie(id, req.cookies[ID], cookieOptions);
			}
		}

		/**
		 * Login a user and save them in the rill session.
		 */
		ctx.login = function login (user) {
			ctx.locals.user = user;
			if (ttl) cookieOptions.expires = new Date(new Date + ttl);
			res.cookie(ID, JSON.stringify(user), cookieOptions);
		};

		/**
		 * Remove a user from a rill session.
		 */
		ctx.logout = function logout () {
			delete ctx.locals.user;
			res.clearCookie(ID);
		};

		/**
		 * Check if a user is logged in.
		 */
		ctx.isLoggedIn = function isLoggedIn () {
			return ctx.locals.user != null;
		};

		/**
		 * Check if a user is logged out.
		 */
		ctx.isLoggedOut = function isLoggedOut () {
			return ctx.locals.user == null;
		};

		return next();
	}
}

/**
 * Creates a middleware that only proceeds if a user is logged in.
 */
auth.isLoggedIn = function isLoggedIn (options) {
	return function isLoggedInMiddleware (ctx, next) {
		if (ctx.isLoggedIn()) return next();
		else if (options && options.else) ctx.res.redirect(options.else);
	}
};

/**
 * Creates a middleware that only proceeds if a user is not logged in.
 */
auth.isLoggedOut = function isLoggedOut (options) {
	return function isLoggedOutMiddleware (ctx, next) {
		if (ctx.isLoggedOut()) return next();
		else if (options && options.else) ctx.res.redirect(options.else);
	}
};
