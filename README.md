# pinboard.js [![Build status](https://travis-ci.org/twolfson/pinboard.js.png?branch=master)](https://travis-ci.org/twolfson/pinboard.js)

Library for talking to the [Pinboard API][]

This was written as part of [`firefox-pinboard`][] to communicate with [Pinboard][]. We chose to write `pinboard.js` to allow for handling of errors that previous libraries did not expose (e.g. `ECONNREFUSED`).

[Pinboard]: http://pinboard.in/
[Pinboard API]: https://pinboard.in/api/
[`firefox-pinboard`]: https://github.com/twolfson/firefox-pinboard

## Getting Started
Install the module with: `npm install pinboard.js`

```js
// Create a client
// API token can be found at: https://pinboard.in/settings/password
var Pinboard = require('pinboard.js');
var pinboard = new Pinboard({
  auth: {
    type: 'token',
    username: 'your-username',
    token: 'your-token'
  }
});

// Find out when we last updated a post
pinboard.postsUpdate({
  format: 'json'
}, console.log); // {"update_time":"2015-02-13T09:08:22Z"}
```

## Documentation
_(Coming soon)_

TODO: Document `format: json`

TODO: Build browser.js for dist

## Examples
_(Coming soon)_

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint via `npm run lint` and test via `npm test`.

### Testing
We currently require an active Pinboard account for testing. Please output your `auth` parameters for the `Pinboard` constructor into `test/test-credentials.json` before running the tests. These are `.gitignore'd` and should present no issue.

```js
{
  "type": "token",
  "username": "twolfson",
  "token": "abcdef..."
}
```

## Donating
Support this project and [others by twolfson][gratipay] via [gratipay][].

[![Support via Gratipay][gratipay-badge]][gratipay]

[gratipay-badge]: https://cdn.rawgit.com/gratipay/gratipay-badge/2.x.x/dist/gratipay.png
[gratipay]: https://www.gratipay.com/twolfson/

## Unlicense
As of Jan 23 2015, Todd Wolfson has released this repository and its contents to the public domain.

It has been released under the [UNLICENSE][].

[UNLICENSE]: UNLICENSE
