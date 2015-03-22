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