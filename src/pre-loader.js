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

    /**
     * On place to slice the args
     * @param func
     * @param args
     * @param options
     */
    function execute(func, args, options) {
        func(slice.call(args), options);
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

    /*****************************************************************************************/

    // Preload

    /*
     * Preload is different from prefetch in that it focuses on current navigation
     * and fetches resources with high-priority.
     * It is also important to note that preload does not block the window’s onload event.
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
        options && (options.rel = 'preload');
        strategy(preLoadLinkSupported, urls, options, 'link preloading is not supported');
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
        options && (options.rel = 'prefetch');
        strategy(preFetchLinkSupported, urls, options, 'link prefetching is not supported');
    }

    /*****************************************************************************************/

    // DNS Prefetch

    /*****************************************************************************************/

    /**
     * @param urls [Array]
     * @param options {Object}
     * @private
     */
    function _dnsPreFetch(urls, options) {
        options && (options.rel = 'dns-prefetch');
        strategy(dnsPreFetchSupported, urls, options, 'link dns-prefetching is not supported');
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
        options && (options.rel = 'preconnect');
        strategy(preConnectSupported, urls, options, 'link preconnecting is not supported');
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
            },
            preLoad: function () {
                execute(_preLoad, arguments, {
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
                    crossOrigin: 'anonymous'
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