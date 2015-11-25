module.exports = auth;

/**
 * Creates a Middleware function that attaches a session user to the context.
 */
function auth (options) {
	return function authMiddleware (ctx, next) {
		var session = ctx.session;

		if (!session) throw new Error("@rill/auth requires a session to work. Check out @rill/session.")
		if (session.has("user")) ctx.locals.user = session.get("user");

		/**
		 * Login a user and save them in the rill session.
		 */
		ctx.login = function login (user) {
			ctx.locals.user = user;
			session.set("user", user);
		};

		/**
		 * Remove a user from a rill session.
		 */
		ctx.logout = function logout () {
			delete ctx.locals.user;
			session.delete("user");
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
	}
};

/**
 * Creates a middleware that only proceeds if a user is not logged in.
 */
auth.isLoggedOut = function isLoggedOut () {
	return function isLoggedOutMiddleware (ctx, next) {
		if (ctx.isLoggedOut()) return next();
	}
};