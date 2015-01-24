// Load in our module
var Pinboard = require('./pinboard');

// Define `request` as its handler
Pinboard.request = require('request');

// Export our module
module.exports = Pinboard;
