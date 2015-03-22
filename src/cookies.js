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