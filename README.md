recurve-cookies [![Build Status](https://secure.travis-ci.org/sebastiencouture/recurve-cookies.png?branch=master)](https://travis-ci.org/sebastiencouture/recurve-cookies)
===

Cookies Javascript library for the browser.

Wrapper around `document.cookie` to make dealing with cookies a bit more pleasant. Handles serialization and parsing
of object values.

## Usage

### Example

```javascript
cookies.set("a", {something: 1}, {
    expires: twoDaysFromNow,
    domain: "a",
    path: "b",
    secure: true
});

cookies.get("a"); // returns {something: 1}
cookies.exists("a");
cookies.forEach(function(value, key) {
    // iterate all cookies
});

cookies.clear();
```

For more examples, take a look at the [unit tests](test/cookies.spec.js)

## Running the Tests

```
grunt test
```

## Installation

The library is UMD compliant. Registers on `window.cookies` for global.

```
npm install recurve-cookies
```
```
bower install recurve-cookies
```

## Browser Support

IE8+

## License

The MIT License (MIT)

Copyright (c) 2015 Sebastien Couture

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.