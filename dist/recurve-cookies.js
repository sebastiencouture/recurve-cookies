/*!
recurve-cookies.js - v0.1.0
Created by Sebastien Couture on 2015-03-22.

git://github.com/sebastiencouture/recurve-cookies.git

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
*/

(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.cookies = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var utils = require("./utils");

/**
 * Wrapper around document.cookie to make dealing with cookies a bit more pleasant. Handles serialization and parsing
 * of object values.
 */
module.exports = {
    /**
     * Retrieve a cookie value, handles parsing JSON string
     *
     * @param key
     * @returns {*} the value (string, int, object, etc.)
     */
    get: function(key) {
        var value = null;

        forEachCookie(function(cookie, name){
            if (name === key) {
                var rawValue = utils.afterSeparator(cookie, "=");
                value = parse(rawValue);

                return false;
            }
        });

        return value;
    },

    /**
     * Set a cookie value, handles Object serialization
     *
     * @param key
     * @param value
     * @param options options.expires Date, options.domain String, options.path String, options.secure boolean
     * @returns {string} serialized cookie value
     */
    set: function(key, value, options) {
        if (utils.isUndefined(options)) {
            options = {};
        }

        if (utils.isNumber(options.expires)) {
            options.expires = addDaysFromNow(options.expires);
        }

        var cookie = encodeURIComponent(key) + "=" + serialize(value);
        if (utils.isDate(options.expires)) {
            cookie +=  "; expires=" + options.expires.toUTCString();
        }
        if (options.domain) {
            cookie += "; domain=" + options.domain;
        }
        if (options.path) {
            cookie += "; path=" + options.path;
        }
        if (options.secure) {
            cookie += "; secure";
        }

        document.cookie = cookie;
        return cookie;
    },

    /**
     * Removes a cookie value
     *
     * @param key
     * @param options options.domain String, options.path String
     * @returns {boolean} true if removed, false otherwise
     */
    remove: function(key, options) {
        if (utils.isUndefined(options)) {
            options = {};
        }

        if (!this.exists(key)) {
            return false;
        }

        var updated = encodeURIComponent(key) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        if (options.domain) {
            updated += "; domain=" + options.domain;
        }
        if (options.path) {
            updated += "; path=" + options.path;
        }

        document.cookie = updated;

        return true;
    },

    /**
     * Checks if a cookie exists
     *
     * @param key
     * @returns {boolean} true if exists, false otherwise
     */
    exists: function(key) {
        var exists = false;
        forEachCookie(function(cookie, name){
            if (name === key) {
                exists = true;
                return false;
            }
        });

        return exists;
    },

    /**
     * Clear out all cookies.
     *
     * Will only clear cookies that can be cleared (i.e. same path/domain)
     */
    clear: function() {
        var cookies = document.cookie.split(";");

        for (var index = 0; index < cookies.length; index++) {
            var cookie = cookies[index];
            deleteCookie(cookie.split("=")[0]);
        }

        function deleteCookie(name) {
            var pathSplit = location.pathname.split('/');
            var pathCurrent = ' path=';

            document.cookie = name + '=; expires=Thu, 01-Jan-1970 00:00:01 GMT;';

            for (var index = 0; index < pathSplit.length; index++) {
                var pathPart = pathSplit[index];

                pathCurrent += ((pathCurrent.substr(-1) != '/') ? '/' : '') + pathPart;
                document.cookie = name + '=; expires=Thu, 01-Jan-1970 00:00:01 GMT;' + pathCurrent + ';';
            }
        }
    },

    /**
     * Iterate through all cookie values
     *
     * @param iterator callback method. (value, name) are passed as parameters
     * @param context of the callback
     */
    forEach: function(iterator, context) {
        forEachCookie(function(cookie, name){
            var rawValue = utils.afterSeparator(cookie, "=");
            var value = parse(rawValue);

            iterator.call(context, value, name);
        });
    }
};

function forEachCookie(iterator) {
    var cookies = document.cookie ? document.cookie.split(";") : [];

    for (var index = 0; index < cookies.length; index++) {
        var cookie = cookies[index];

        cookie = cookie.trim();
        var name = decodeURIComponent(utils.beforeSeparator(cookie, "="));
        iterator(cookie, name);
    }
}

function addDaysFromNow(days) {
    var date = new Date();
    date.setDate(date.getDate() + days);

    return date;
}

function serialize(value) {
    var string = utils.isObject(value) ? utils.toJson(value) : String(value);
    return encodeURIComponent(string);
}

function parse(value) {
    if (!utils.isString(value)) {
        return null;
    }

    // quoted cookie, unescape
    if (0 === value.indexOf('"')) {
        value = value.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
    }

    try {
        value = decodeURIComponent(value);
        return utils.fromJson(value);
    }
    catch(e) {
        return value;
    }
}
},{"./utils":3}],2:[function(require,module,exports){
"use strict";

module.exports = require("./cookies");
},{"./cookies":1}],3:[function(require,module,exports){
"use strict";

function isString(value) {
    return (value instanceof String || "string" == typeof value);
}

function isUndefined(value) {
    return value === void 0;
}

function isObject(value) {
    return value === Object(value) || isFunction(value);
}

function isNumber(value) {
    return "[object Number]" === Object.prototype.toString.call(value);
}

function isDate(value) {
    return "[object Date]" === Object.prototype.toString.call(value);
}

function isFunction(value) {
    return "[object Function]" === Object.prototype.toString.call(value);
}

// Only intended to be used with strings
function beforeSeparator(str, separator) {
    if (!str || !separator) {
        return null;
    }

    var index = str.indexOf(separator);
    return -1 < index ? str.substring(0, index) : null;
}

// Only intended to be used with strings
function afterSeparator(str, separator) {
    if (!str || !separator) {
        return null;
    }

    var index = str.indexOf(separator);
    return -1 < index ? str.substring(index + 1) : null;
}

function toJson(obj) {
    if (isUndefined(obj)) {
        return undefined;
    }

    return JSON.stringify(obj);
}

function fromJson(str) {
    return isString(str) ? JSON.parse(str) : str;
}

module.exports = {
    isString: isString,
    isUndefined: isUndefined,
    isObject: isObject,
    isNumber: isNumber,
    isDate: isDate,
    beforeSeparator: beforeSeparator,
    afterSeparator: afterSeparator,
    toJson: toJson,
    fromJson: fromJson
};
},{}]},{},[2])(2)
});