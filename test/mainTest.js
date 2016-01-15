var assert  = require("assert");
var agent   = require("supertest").agent;
var Rill    = require("rill");
var auth    = require("../");

describe("Rill/Auth", function () {
	it("should error without a session", function (done) {
		var request = agent(
			Rill()
				.use(function (ctx, next) {
					return next()
						.then(done.bind(null, new Error("No Error")))
						.catch(done.bind(null, null))
				})
				.use(auth())
				.listen()
		);

		request.get("/").end(function () {})
	});

	it("should work", function (done) {
		var request = agent(
			Rill()
				.use(auth())
				.get("/login", respond(200, function (ctx) {
					assert(!ctx.isLoggedIn());
					assert(ctx.isLoggedOut());
					ctx.login({ id: 1 });
					assert.deepEqual(ctx.locals.user, { id: 1 });
					assert(ctx.isLoggedIn());
					assert(!ctx.isLoggedOut());
				}))
				.get("/logout", respond(200, function (ctx) {
					assert(ctx.isLoggedIn());
					assert(!ctx.isLoggedOut());
					assert.deepEqual(ctx.locals.user, { id: 1 });
					ctx.logout();
					assert(!ctx.isLoggedIn());
					assert(ctx.isLoggedOut());
				}))
				.get("/login-restricted", auth.isLoggedIn(), respond(200))
				.get("/logout-restricted", auth.isLoggedOut(), respond(200))
				.listen()
		);

		Promise.all([
			// Initially logged out.
			request
				.get("/login-restricted")
				.expect(404),
			request
				.get("/logout-restricted")
				.expect(200),
		])
		.then(function () {
			// Trigger login.
			return request
				.get("/login")
				.expect(200);
		})
		.then(function (res) {
			// Check login.
			return Promise.all([
				request
					.get("/login-restricted")
					.expect(200),
				request
					.get("/logout-restricted")
					.expect(404)
			]);
		})
		.then(function () {
			// Trigger logout.
			return request
				.get("/logout")
				.expect(200);
		})
		.then(function () {
			// Check logged out.
			return Promise.all([
				request
					.get("/login-restricted")
					.expect(404),
				request
					.get("/logout-restricted")
					.expect(200)
			]);
		})
		.then(done.bind(null, null))
		.catch(done)
	});
});

function respond (status, test) {
	return function (ctx) {
		ctx.res.status = status;
		if (typeof test === "function") test(ctx);
	};
}
