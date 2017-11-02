/**
 * Created by Alex Bartfeld
 */
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

    //Constants
    var PRELOAD = 'preload';
    var PREFETCH = 'prefetch';
    var DNS_PREFETCH = 'dns-prefetch';
    var PRE_CONNECT = 'preconnect';

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

    /**
     * This function is mainly used to adjust the arguments
     * @param func
     * @param args
     * @param options
     */
    function execute(func, args, options) {
        var param = slice.call(args)[0];
        if (param.constructor === String) {
            param = param.split(',');
        }
        func(param, options);
    }

    /**
     * @param featureTestResult - bool
     * @param urls
     * @param options
     */
    function strategy(featureTestResult, urls, options) {
        var url;
        if (featureTestResult) {
            for (var i = 0, j = urls.length; i < j; i++) {
                url = urls[i];
                options.href = url;
                createLinkTag(options);
            }
        }
    }

    /*****************************************************************************************/

    // Preload

    /*
     * Preload focuses on current navigation and fetches resources with high-priority.
     * It is also important to note that preload does not block the window’s onload event.
     *
     * Preloaded resources using the "as" attribute will have the
     * same resource priority as the type of resource they are requesting.
     * Preloaded resources without an "as" will otherwise be requested with the same
     * priority as async XHR (so High)
     *
     * Resources:
     * https://www.keycdn.com/blog/resource-hints/
     */

    /*****************************************************************************************/

    /**
     * @param urls [Array]
     * @param options {Object}
     * @private
     */
    function _preLoad(urls, options) {
        options ? (options.rel = PRELOAD) : (options = {rel: PRELOAD});
        strategy(preLoadLinkSupported, urls, options);
    }

    /*****************************************************************************************/

    // Prefetch

    /*
    * Prefetch is a low priority resource hint that allows the browser to fetch resources
    * in the background (idle time) that might be needed later,
    * and store them in the browser’s cache
    *
    * Prefetch serves a slightly different use case — a future navigation by the user
    * (e.g between views or pages) where fetched resources and requests need to persist across navigations.
    * If Page A initiates a prefetch request for critical resources needed for Page B,
    * the critical resource and navigation requests can be completed in parallel.
    * If we used preload for this use case, it would be immediately cancelled on Page A’s unload.
    *
    * When pre-fetching document the url supplied must be exactly as the url that will be used for the actual url
    *
    * Resources:
    * https://www.keycdn.com/blog/resource-hints/
    * https://medium.com/reloading/preload-prefetch-and-priorities-in-chrome-776165961bbf
    */

    /*****************************************************************************************/

    /**
     * @param urls [Array]
     * @param options {Object}
     * @private
     */
    function _preFetch(urls, options) {
        options ? (options.rel = PREFETCH) : (options = {rel: PREFETCH});
        strategy(preFetchLinkSupported, urls, options);
    }

    /*****************************************************************************************/

    // DNS Prefetch

    /**
     * Dns resolution is a process of converting a domain/hostname to an ip address
     * required to access a resource (this process is what converts a user friendly
     * url like: http://qnimate.com to http://85.72.179.121 ); this requires a certain time
     * and adds to the page loading process.
     */

    /*****************************************************************************************/

    /**
     * @param urls [Array]
     * @param options {Object}
     * @private
     */
    function _dnsPreFetch(urls, options) {
        options ? (options.rel = DNS_PREFETCH) : (options = {rel: DNS_PREFETCH});
        strategy(dnsPreFetchSupported, urls, options);
    }

    /*****************************************************************************************/

    // Preconnect

    /*****************************************************************************************/

    /**
     * @param urls [Array]
     * @param options {Object}
     * @private
     */
    function _preConnect(urls, options) {
        options ? (options.rel = PRE_CONNECT) : (options = {rel: PRE_CONNECT});
        strategy(preConnectSupported, urls, options);
    }

    /*****************************************************************************************/

    // Public APIs

    /*****************************************************************************************/

    preLoader.document = (function () {
        var type = 'document';
        return {
            preFetch: function () {
                execute(_preFetch, arguments, {
                    as: type
                });
            }
        };
    }());

    preLoader.image = (function () {
        var type = 'image';
        return {
            preFetch: function () {
                execute(_preFetch, arguments, {
                    as: type
                });
            },
            preLoad: function () {
                execute(_preLoad, arguments, {
                    as: type
                });
            }
        }
    }());

    preLoader.script = (function () {
        var type = 'script';
        return {
            preFetch: function () {
                execute(_preFetch, arguments, {
                    as: type
                });
            },
            preLoad: function () {
                execute(_preLoad, arguments, {
                    as: type
                });
            }
        };
    }());

    preLoader.font = (function () {
        var type = 'font';
        return {
            preFetch: function () {
                execute(_preFetch, arguments, {
                    as: type,
                    crossOrigin: 'anonymous'
                });
            },
            preLoad: function () {
                execute(_preLoad, arguments, {
                    as: type,
                    crossOrigin: 'anonymous' // Preloaded fonts without cross-origin will be double fetched
                });
            }
        };
    }());

    preLoader.dnsPreFetch = function () {
        execute(_dnsPreFetch, arguments, {});
    };

    preLoader.preConnect = function () {
        execute(_preConnect, arguments, {});
    };

    /*****************************************************************************************/

    return preLoader;
});