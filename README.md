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
`pinboard.js` exposes `Pinboard` as its `module.exports`.

### `new Pinboard(params)`
Creates a new Pinboard client

- params `Object` - Container for parameters
    - auth `Object` - Container for authentication info
        - type `String` - Type of authentication to use
            - This can be `http` (username + password) or `token` (username + API token)
            - By default, we use `token` based authentication
        - username `String` - Username to authenticate with
        - password `String` - Password to use for `http` authentication
            - If you are performing `token` auth, then this is not required
            - This is the password you use to log in to Pinboard
        - token `String` - Password to use for `token` authentication
            - If you are performing `http` auth, then this is not required
            - This is the second half of the token provided on https://pinboard.in/settings/password
                - For example, if the page lists "twolfson:abcd", then your token is "abcd"
- url `Object` - URL parameters to use instead of normal Pinboard url
    - This should be in the format expected by `node's url.format` method (e.g. `protocol`, `hostname`, `pathname`)
        - http://nodejs.org/api/url.html#url_url_format_urlobj
    - By default, this is `{protocol: 'https:', hostname: 'api.pinboard.in', pathname: '/v1'}`

**Using token auth:**

```js
// API token can be found at: https://pinboard.in/settings/password
new Pinboard({
  auth: {
    type: 'token',
    username: 'your-username',
    token: 'your-token'
  }
});
```

**Using http auth:**

```js
// Credentials are the same you use to log in with
new Pinboard({
  auth: {
    type: 'http',
    username: 'your-username',
    password: 'your-password'
  }
});
```

### Methods
All methods are light wrappers around the Pinboard API.

https://pinboard.in/api

The function signature will consistently be:

`(options, cb)`

- options `Object` - Parameters to pass through to Pinboard API
    - For example, if the endpoint says it requires `url`, then you must pass in something like `{url: 'http://mywebsite.com/'}`
    - format `String` - Format to output content as
        - This can be `json` or `xml`
        - We will not parse the output content (e.g. JSON will be a `String`)
        - By default, Pinboard will return `xml`
- cb `Function` - Response handler
    - `cb` should have a signature of `(err, res, body)`
        - We leverage `request` so the format of each item is the same
            - https://github.com/request/request
    - err `Error|null` - If an error occurred, then this will be it
        - For example, if the server is down, then this can be an `ECONNREFUSED` error
    - res `Object` - Response message from server
        - statusCode `Number` - Status code for response (e.g. `200` for success)
        - headers `Object` - Container for response headers
        - Further information can be found in http://nodejs.org/api/http.html#http_http_incomingmessage
    - body `String` - Body from response
        - If `json` was requested via `format`, then this will be JSON. Otherwise, it will be XML.

**Example request for JSON:**

```js
pinboard.postsUpdate({
  format: 'json'
}, console.log); // {"update_time":"2015-02-13T09:08:22Z"}
```

### `pinboard.postsUpdate(options, cb)`

- See [Methods](#methods) for `options` and `cb` documentation

TODO: Build browser.js for dist

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
