'use strict'
module.exports = auth

/**
 * Creates a Middleware function that attaches a session user to the context.
 */
function auth (config) {
  config = config || {}
  var ID = config.key || 'rill_auth'

  return function authMiddleware (ctx, next) {
    var session = ctx.session
    var locals = ctx.locals
    ctx.assert(session, 500, '@rill/auth requires @rill/session to work.')
    locals.user = session.get(ID)

    /**
     * Login a user and save them in the rill session.
     */
    ctx.login = function login (user, options) {
      options = options || {}
      locals.user = user
      if ('ttl' in config && !('ttl' in options)) options.ttl = config.ttl
      if ('refresh' in config && !('refresh' in options)) options.refresh = config.refresh
      session.set(ID, user, options)
    }

    /**
     * Remove a user from a rill session.
     */
    ctx.logout = function logout () {
      locals.user = undefined
      session.delete(ID)
    }

    /**
     * Check if a user is logged in.
     */
    ctx.isLoggedIn = function isLoggedIn () {
      return locals.user != null
    }

    /**
     * Check if a user is logged out.
     */
    ctx.isLoggedOut = function isLoggedOut () {
      return locals.user == null
    }

    return next()
  }
}

/**
 * Creates a middleware that only proceeds if a user is logged in.
 */
auth.isLoggedIn = function isLoggedIn (options) {
  options = options || {}
  return function isLoggedInMiddleware (ctx, next) {
    if (ctx.isLoggedIn()) return next()
    if (options.fail) return ctx.fail(401, options.fail)
    if (options.redirect) return ctx.res.redirect(options.redirect)
    if (options.fallback) return options.fallback(ctx, next)
  }
}

/**
 * Creates a middleware that only proceeds if a user is not logged in.
 */
auth.isLoggedOut = function isLoggedOut (options) {
  options = options || {}
  return function isLoggedOutMiddleware (ctx, next) {
    if (ctx.isLoggedOut()) return next()
    if (options.fail) return ctx.fail(401, options.fail)
    if (options.redirect) return ctx.res.redirect(options.redirect)
    if (options.fallback) return options.fallback(ctx, next)
  }
}
