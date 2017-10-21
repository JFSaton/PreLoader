(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory(root));
    } else if (typeof exports === 'object') {
        module.exports = factory(root);
    } else {
        root.preLoader = factory(root);
    }
})(typeof global !== "undefined" ? global : this.window || this.global, function (root) {
    'use strict';

    var preLoader = {}; // Object for public APIs

    // feature testing
    var testLink = document.createElement('link');
    var preLoadLinkSupported = !!DOMTokenListSupports(testLink.relList, 'preload');
    var preFetchLinkSupported = !!DOMTokenListSupports(testLink.relList, 'prefetch');
    var dnsPreFetchSupported = !!DOMTokenListSupports(testLink.relList, 'dns-prefetch');
    var preConnectSupported = !!DOMTokenListSupports(testLink.relList, 'preconnect');
    // no support for - prerender - since it was deprecated in Chrome 58;

    // Create local references to array methods we'll want to use later.
    var slice = [].slice;

    /*****************************************************************************************/

    // util functions

    /*****************************************************************************************/

    function DOMTokenListSupports(tokenList, token) {
        if (!tokenList || !tokenList.supports) {
            return;
        }
        try {
            return tokenList.supports(token);
        } catch (e) {
            if (e instanceof TypeError) {
                console.log("The DOMTokenList doesn't have a supported tokens list");
            } else {
                console.error("That shouldn't have happened");
            }
        }
    }

    function createLinkTag(options) {
        var link = document.createElement('link');
        for (var prop in options) {
            if (options.hasOwnProperty(prop)) {
                link[prop] = options[prop];
            }
        }
        document.head.appendChild(link);
    }

    function execute(func, args, options) {
        if (document.readyState === 'complete') {
            func(args, options);
        } else {
            addEventListener('load', func.bind(null, args, options));
        }
    }

    function strategy(featureTestResult, urls, options, errorMsg) {
        var url;
        if (featureTestResult) {
            for (var i = 0, j = urls.length; i < j; i++) {
                url = urls[i];
                options.href = url;
                createLinkTag(options);
            }
        } else {
            console.error(errorMsg);
        }
    }

    function createFunc() {
        var args = slice.call(arguments);
        execute(args[0], args[1], args[2]);
    }

    /*****************************************************************************************/

    // Preload

    /*
     * Preload is different from prefetch in that it focuses on current navigation
     * and fetches resources with high-priority.
     * Prefetch focuses on fetching resources for the next navigation which are low priority.
     * It is also important to note that preload does not block the window’s onload event.
     *
     * Info taken from: https://www.keycdn.com/blog/resource-hints/
     */

    /*****************************************************************************************/

    /**
     * @param urls {Array}
     * @param options {Object}
     * @private
     */
    function _preLoad(urls, options) {
        strategy(preLoadLinkSupported, urls, options, 'link preloading is not supported');
    }

    /*****************************************************************************************/

    // Prefetch

    /*
    * Prefetch is a low priority resource hint that allows the browser to fetch resources
    * in the background (idle time) that might be needed later,
    * and store them in the browser’s cache
    *
    * Info taken from: https://www.keycdn.com/blog/resource-hints/
    */

    /*****************************************************************************************/

    /**
     * @param urls {Array}
     * @param options {Object}
     * @private
     */
    function _preFetch(urls, options) {
        strategy(preFetchLinkSupported, urls, options, 'link prefetching is not supported');
    }

    /*****************************************************************************************/

    // DNS Prefetch

    /*****************************************************************************************/

    /**
     * @param urls {Array}
     * @param options {Object}
     * @private
     */
    function _dnsPreFetch(urls, options) {
        strategy(dnsPreFetchSupported, urls, options, 'link dns-prefetching is not supported');
    }

    /*****************************************************************************************/

    // Preconnect

    /*****************************************************************************************/

    function _preConnect(urls, options) {
        strategy(preConnectSupported, urls, options, 'link preconnecting is not supported');
    }

    /*****************************************************************************************/

    // Public APIs

    /*****************************************************************************************/

    preLoader.document = (function () {
        var type = 'document';
        return {
            preFetch: function () {
                createFunc(_preFetch, arguments, {
                    rel: 'prefetch',
                    as: type
                });
            },
            preLoad: function () {
                var args = slice.call(arguments);
                var options = {
                    rel: 'preload',
                    as: type
                };
                execute(_preLoad, args, options)
            }
        };
    }());

    preLoader.image = (function () {
        var type = 'image';
        return {
            preLoad: function () {
                var args = slice.call(arguments);
                var options = {
                    rel: 'preload',
                    as: type
                };
                execute(_preLoad, args, options)
            }
        }
    }());

    preLoader.script = (function () {
        var type = 'script';
        return {
            preLoad: function () {
                var args = slice.call(arguments);
                var options = {
                    rel: 'preload',
                    as: type
                };
                execute(_preLoad, args, options)
            }
        };
    }());

    preLoader.dnsPreFetch = function () {
        var args = slice.call(arguments);
        var options = {
            rel: 'dns-prefetch'
        };
        execute(_dnsPreFetch, args, options);
    };

    preLoader.preConnect = function () {
        var args = slice.call(arguments);
        var options = {
            rel: 'preconnect',
            crossOrigin: true
        };
        execute(_preConnect, args, options);
    };

    /*****************************************************************************************/

    return preLoader;
});