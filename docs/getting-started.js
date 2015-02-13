// Create a client
// API token can be found at: https://pinboard.in/settings/password
var Pinboard = require('../');
var pinboard = new Pinboard({
  auth: {
    type: 'token',
    username: 'your-username',
    token: 'your-token'
  }
});
pinboard = new Pinboard({auth: require('../test/test-credentials.json')});

// Find out when we last updated a post
pinboard.postsUpdate({
  format: 'json'
}, console.log); //
