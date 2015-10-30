var assert  = require("assert");
var agent   = require("./agent");
var Rill    = require("rill");
var session = require("@rill/session");
var auth    = require("../");

describe("Rill/Auth", function () {
	after(agent.clear);

	it("should work", function (done) {
		var request = agent.create(
			Rill()
				.use(session())
				.use(auth())
				.get("/login", respond(200, function (req, res) {
					assert(!this.isLoggedIn());
					assert(this.isLoggedOut());
					this.login({ id: 1 });
					assert(this.isLoggedIn());
					assert(!this.isLoggedOut());
				}))
				.get("/logout", respond(200, function (req, res) {
					assert(this.isLoggedIn());
					assert(!this.isLoggedOut());
					this.logout();
					assert(!this.isLoggedIn());
					assert(this.isLoggedOut());
				}))
				.get("/login-restricted", auth.isLoggedIn(), respond(200))
				.get("/logout-restricted", auth.isLoggedOut(), respond(200))
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
		.then(function () {
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
	return function (req, res) {
		res.status = status;
		if (typeof test === "function") test.call(this, req, res);
	};
}