// Load in our dependencies
var xtend = require('xtend');
var request = require('request');

/**
 * Pinboard API library constructor
 * @param params {Object} Container for our parameters
 * @param params.auth {Object} Container for authentication credentials
 * @param params.auth.type {String} Type of authentication to use. Valid types are 'http' and 'token' (default)
 * @param params.auth.username {String} Username to use during authentication
 * @param params.auth.password {String} Password to use during HTTP authentication
 * @param params.auth.token {String} Token to use during token authentication
 */
function Pinboard(params) {
  // Verify we have either HTTP or API auth
  var auth = params.auth;
  if (!auth) {
    throw new Error('`params.auth` is required for `Pinboard` constructor but it wasn\'t provided');
  }

  // If there is no username, bail out
  if (auth.username === undefined) {
    throw new Error('`params.auth.username` is required for authentication. Please provide it.');
  }

  // If we are performing HTTP authentication
  if (auth.type === 'http') {
    // If there is no password, bail out
    if (auth.password === undefined) {
      throw new Error('`params.auth.password` is required for HTTP authentication. Please provide it.');
    }

    // Otherwise, set up our HTTP url
    this.url = _.extend({}, Pinboard.url, {

    });
  // Otherwise, set up token auth (default)
  } else {

  }
}
Pinboard.url = {
  protocol: 'https:',
  hostname: 'api.pinboard.in',
  pathname: '/v1'
};

// Export our constructor
module.exports = Pinboard;
