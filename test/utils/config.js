// Load in our credentials
var credentials = {
  type: 'token',
  username: 'testuser',
  token: 'abcdef'
};
try {
  // test-credentials = {type, username, token}
  credentials = require('../test-credentials');
} catch (err) {
  console.error('Error while loading `test/test-credentials.json`. ' +
      'Assuming we want to use `nine-track` fixtures, using default credentials. ' +
      'If not, please see Testing section in `README.md`', err);
}
exports.credentials = credentials;

// Set up our server URL
exports.fakePinboardUrl = {
  protocol: 'http:',
  hostname: 'localhost',
  port: 9001,
  pathname: '/v1'
};
