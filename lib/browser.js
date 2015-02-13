// Load in our module
var Pinboard = require('./pinboard');

// Define `browser-request` as its handler
Pinboard.request = require('browser-request');

// Export our module
window.Pinboard = module.exports = Pinboard;
