describe("utils", function() {
    "use strict";

    var utils = require("../src/utils");

    describe("isUndefined", function() {
        it("should detect undefined", function() {
            expect(utils.isUndefined(undefined)).toEqual(true);
        });

        it("should detect undefined as no argument", function() {
            expect(utils.isUndefined()).toEqual(true);
        });

        it("should not detect number", function() {
            expect(utils.isUndefined(0)).toEqual(false);
        });

        it("should not detect boolean", function() {
            expect(utils.isUndefined(false)).toEqual(false);

        });

        it("should not detect NaN", function() {
            expect(utils.isUndefined(NaN)).toEqual(false);
        });
    });

    describe("isString", function() {
        var string;

        it("should detect empty string", function() {
            string = "";
            expect(utils.isString(string)).toEqual(true);
        });

        it("should detect string", function() {
            string = "test string";
            expect(utils.isString(string)).toEqual(true);
        });

        it("should detect new String()", function() {
            string = new String("test string"); // jshint ignore:line
            expect(utils.isString(string)).toEqual(true);
        });

        it("should not detect numbers", function() {
            expect(utils.isString(123)).toEqual(false);
        });
    });

    describe("isObject", function() {
        var object;

        it("should detect {}", function() {
            object = {};
            expect(utils.isObject(object)).toEqual(true);
        });

        it("should detect new Object()", function() {
            object = new Object(); // jshint ignore:line
            expect(utils.isObject(object)).toEqual(true);
        });

        it("should detect {} with properties", function() {
            object = {name: "Sebastien"};
            expect(utils.isObject(object)).toEqual(true);
        });

        it("should detect arrays", function(){
            object = [1,2,3];
            expect(utils.isObject(object)).toEqual(true);
        });

        it("should detect function arguments", function(){
            function test(){
                expect(utils.isObject(arguments)).toEqual(true);
            }

            test();
        });

        it("should detect functions", function(){
            object = function(){};
            expect(utils.isObject(object)).toEqual(true);
        });

        it("should not detect undefined", function() {
            expect(utils.isObject(undefined)).toEqual(false);
        });

        it("should not detect null", function(){
            expect(utils.isObject(null)).toEqual(false);
        });

        it("should not detect literal string", function(){
            expect(utils.isObject("sebastien")).toEqual(false);
        });

        it("should detect new String()", function(){
            expect(utils.isObject(new String("sebastien"))).toEqual(true); // jshint ignore:line
        });

        it("should not detect number", function(){
            expect(utils.isObject(1)).toEqual(false);
        });

        it("should not detect boolean", function(){
            expect(utils.isObject(true)).toEqual(false);
        });
    });

    describe("isNumber", function(){
        it("should detect number", function() {
            expect(utils.isNumber(1)).toEqual(true);
        });

        it("should not detect numeric strings", function(){
            expect(utils.isNumber("1")).toEqual(false);
        });

        it("should not detect undefined as number", function(){
            expect(utils.isNumber()).toEqual(false);
        });

        it("should detect NaN as number", function(){
            expect(utils.isNumber(NaN)).toEqual(true);
        });

        it("should detect infinity as number", function(){
            expect(utils.isNumber(Number.POSITIVE_INFINITY)).toEqual(true);
        });
    });

    describe("isDate", function(){
        it("should detect date instance", function(){
            expect(utils.isDate(new Date())).toEqual(true);
        });

        it("should not detect numbers", function(){
            expect(utils.isDate(123)).toEqual(false);
        });

        it("should not detect objects", function(){
            expect(utils.isDate({})).toEqual(false);
        });
    });

    describe("beforeSeparator", function(){
        it("should find before string separator", function(){
            expect(utils.beforeSeparator("example=2", "=")).toEqual("example");
        });

        it("should find before first separator", function(){
            expect(utils.beforeSeparator("example=2&test=3", "=")).toEqual("example");
        });

        it("should find before number separator", function(){
            expect(utils.beforeSeparator("example2test", 2)).toEqual("example");
        });

        it("should not find for null separator", function(){
            expect(utils.beforeSeparator("example=2", null)).toEqual(null);
        });

        it("should not find for undefined separator", function(){
            expect(utils.beforeSeparator("example=2", undefined)).toEqual(null);
        });

        it("should not find for null string", function(){
            expect(utils.beforeSeparator(null, "=")).toEqual(null);
        });

        it("should not find for undefined string", function(){
            expect(utils.beforeSeparator(undefined, "=")).toEqual(null);
        });
    });

    describe("afterSeparator", function(){
        it("should find after string separator", function(){
            expect(utils.afterSeparator("example=2", "=")).toEqual("2");
        });

        it("should find after first separator", function(){
            expect(utils.afterSeparator("example=2&test=3", "=")).toEqual("2&test=3");
        });

        it("should find after number separator", function(){
            expect(utils.afterSeparator("example2test", 2)).toEqual("test");
        });

        it("should not find for null separator", function(){
            expect(utils.afterSeparator("example=2", null)).toEqual(null);
        });

        it("should not find for undefined separator", function(){
            expect(utils.afterSeparator("example=2", undefined)).toEqual(null);
        });

        it("should not find for null string", function(){
            expect(utils.afterSeparator(null, "=")).toEqual(null);
        });

        it("should not find for undefined string", function(){
            expect(utils.afterSeparator(undefined, "=")).toEqual(null);
        });
    });

    describe("toJson", function(){
        it("should stringify objects", function(){
            var obj = {a: 1, b: 2};
            var json = utils.toJson(obj);

            expect(json).toEqual('{"a":1,"b":2}');
        });

        it("should stringify numbers", function(){
            expect(utils.toJson(1)).toEqual("1");
        });
    });

    describe("fromJson", function(){
        it("should parse string", function(){
            var str = '{"a":1,"b":2}';
            var obj = utils.fromJson(str);

            expect(obj).toEqual({a:1, b:2});
        });

        it("should return same value for number", function(){
            expect(utils.fromJson(1)).toEqual(1);
        });

        it("should return same value for array", function(){
            expect(utils.fromJson([1, 2])).toEqual([1, 2]);
        });

        it("should return same value for object", function(){
            expect(utils.fromJson({a:1, b:2})).toEqual({a:1, b:2});
        });

        it("should return null for null", function(){
            expect(utils.fromJson(null)).toEqual(null);
        });

        it("should return undefined for undefined", function(){
            expect(utils.fromJson(undefined)).toEqual(undefined);
        });

        it("should throw error for invalid string", function(){
            var str = "{a:b";
            expect(function(){
                utils.fromJson(str);
            }).toThrow(); // jshint ignore:line
        });
    });
})