describe("cookies", function() {
    "use strict";

    var cookies = require("../src/cookies");
    var utils = require("../src/utils");

    function clearCookies() {
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
    }

    beforeEach(function() {
        clearCookies();
        expect(document.cookie).toEqual("");
    });

    // Could add last spec to do this but make sure we keep the cookies cleared after running
    // all specs
    afterEach(function() {
        clearCookies();
    });

    describe("get", function() {
        it("should return for existing key", function(){
            document.cookie = "a=b";
            expect(cookies.get("a")).toEqual("b");
        });

        it("should return null for unknown key", function() {
            document.cookie = "c=b";
            expect(cookies.get("a")).toEqual(null);
        });

        it("should return null for null key", function() {
            expect(cookies.get(null)).toEqual(null);
        });

        it("should return null for undefined key", function() {
            expect(cookies.get()).toEqual(null);
        });

        it("should return empty value", function() {
            document.cookie = "a=";
            expect(cookies.get("a")).toEqual("");
        });

        it("should unescape", function() {
            document.cookie = "a=" + encodeURIComponent("$");
            expect(cookies.get("a")).toEqual("$");
        });

        it("should handle quoted", function() {
            document.cookie = 'a="b@c.com\\"\\\\\\""';
            expect(cookies.get("a")).toEqual('b@c.com"\\"');
        });

        it("should parse json", function() {
            document.cookie = "a=" + utils.toJson({b:"c"});
            expect(cookies.get("a")).toEqual({b: "c"});
        });

        it("should return raw for malformed json", function(){
            document.cookie = "a={b:";
            expect(cookies.get("a")).toEqual("{b:");
        });

        it("should preserve leading and trailing spaces", function() {
            document.cookie = "a=" + encodeURIComponent(" b ");
            expect(cookies.get("a")).toEqual(" b ");
        });
    });

    describe("set", function() {
        it("should save", function() {
            cookies.set("a", "b");
            expect(cookies.get("a")).toEqual("b");
        });

        it("should save number", function() {
            cookies.set("a", 1);
            expect(cookies.get("a")).toEqual(1);
        });

        it("should save quoted string", function() {
            cookies.set("a", 'b\"');
            expect(cookies.get("a")).toEqual('b"');
        });

        it("should save object", function() {
            cookies.set("a", {b: "c"});
            expect(cookies.get("a")).toEqual({b: "c"});
        });

        it("should save special characters", function() {
            cookies.set("a", "$");
            expect(cookies.get("a")).toEqual("$");
        });

        it("should save empty value", function() {
            cookies.set("a", "");
            expect(cookies.get("a")).toEqual("");
        });

        it("should save null", function() {
            cookies.set("a", null);
            expect(cookies.get("a")).toEqual(null);
        });

        it("should save undefined as string", function() {
            cookies.set("a", undefined);
            expect(cookies.get("a")).toEqual("undefined");
        });

        it("should save leading and trailing spaces", function() {
            cookies.set(" a ", " b ");
            expect(cookies.get(" a ")).toEqual(" b ");
        });

        it("should save with expires days from now", function() {
            var oneDayFromNow = new Date();
            oneDayFromNow.setDate(oneDayFromNow.getDate() + 1);

            var expected = "a=b; expires=" + oneDayFromNow.toUTCString();

            expect(cookies.set("a", "b", {expires:1})).toEqual(expected);
        });

        it("should save with expires as Date instance", function() {
            var date = new Date();
            var expected = "a=b; expires=" + date.toUTCString();

            expect(cookies.set("a", "b", {expires:date})).toEqual(expected);
        });

        it("should save with domain", function() {
            expect(cookies.set("a", "b", {domain:".test.com"})).toEqual("a=b; domain=.test.com");
        });

        it("should save with path", function() {
            expect(cookies.set("a", "b", {path:"/test"})).toEqual("a=b; path=/test");
        });

        it("should save with secure", function() {
            expect(cookies.set("a", "b", {secure: true})).toEqual("a=b; secure");
        });
    });

    describe("remove", function() {
        it("should remove", function() {
            cookies.set("a", "b");
            cookies.remove("a");

            expect(document.cookie).toEqual("");
        });

        it("should return true if exists", function(){
            cookies.set("a", "b");
            expect(cookies.remove("a")).toEqual(true);
        });

        it("should return false if doesn't exist", function() {
            expect(cookies.remove("a")).toEqual(false);
        });

        it("should not throw error for null key", function(){
            cookies.remove(null);
        });

        it("should not throw error for undefined key", function(){
            cookies.remove(undefined);
        });

        // can't fully test domain or path, but lets do what we can...

        it("should remove with same path specified", function() {
            cookies.set("a", "b", {path: "/"});
            cookies.remove("a", {path: "/"});

            expect(document.cookie).toEqual("");
        });

        it("should not remove if different path", function(){
            cookies.set("a", "b", {path: "/"});
            cookies.remove("a", {path: "/a"});

            expect(document.cookie).toEqual("a=b");
        });

        it("should not remove if different domain", function() {
            cookies.set("a", "b");
            cookies.remove("a", {domain: ".test.com"});

            expect(document.cookie).toEqual("a=b");
        });
    });

    describe("exists", function() {
        it("should return true if exists", function() {
            cookies.set("a", "b");
            expect(cookies.exists("a")).toEqual(true);
        });

        it("should return false if only exists for different path", function() {
            cookies.set("a", "b", {path: "/a"});
            expect(cookies.exists("a")).toEqual(false);
        });

        it("should return false if only exists for different domain", function() {
            cookies.set("a", "b", {domain: ".test.com"});
            expect(cookies.exists("a")).toEqual(false);
        });

        it("should return false if doesn't exist", function() {
            expect(cookies.exists("a")).toEqual(false);
        });

        it("should return false for null key", function() {
            expect(cookies.exists(null)).toEqual(false);
        });

        it("should return false for undefined key", function() {
            expect(cookies.exists(undefined)).toEqual(false);
        });
    });

    it("should clear all cookies", function(){
        cookies.set("a", 1);
        cookies.set("b", 2);
        cookies.set("c", 3);

        cookies.clear();

        expect(document.cookie).toEqual("");
    });

    describe("forEach", function() {
        it("should iterate all cookies", function() {
            cookies.set("a", 1);
            cookies.set("b", 2);

            var expected = [["a", 1], ["b", 2]];
            var index = 0;

            cookies.forEach(function(value, name) {
                expect(expected[index]).toEqual([name, value]);
                index++;
            });
        });

        it("should call iterator with context", function() {
            cookies.set("a", 1);

            var context = null;
            cookies.forEach(function() {
                context = this;
            }, this);

            expect(context).toBe(this);
        });
    });
});