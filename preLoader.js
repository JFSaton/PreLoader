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

    preLoader.document = {};
    preLoader.script = {};
    preLoader.image = {};

    // feature testing
    var testLink = document.createElement('link');
    var preLoadLinkSupported = DOMTokenListSupports(testLink.relList, 'preload');
    var preFetchLinkSupported = DOMTokenListSupports(testLink.relList, 'prefetch');
    var preRenderLinkSupported = false; // due to a very vague browser support;

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

    function createLinkTag(url, options) {
        var link = document.createElement('link');
        if (url) {
            link.href = url;
        } else {
            return false;
        }
        if (options.rel) {
            link.rel = options.rel;
        }
        if (options.as) {
            link.as = options.as;
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

    function preLoad(args, options) {
        var url;
        if (preLoadLinkSupported) {
            for (var i = 0, j = args.length; i < j; i++) {
                url = args[i];
                createLinkTag(url, options);
            }
        } else {
            console.error('link preloading is not supported');
        }
    }

    preLoader.image.load = function () {
        var args = [].slice.call(arguments);
        var options = {
            rel: 'preload',
            as: 'image'
        };
        execute(preLoad, args, options)
    };

    preLoader.script.load = function () {
        var args = [].slice.call(arguments);
        var options = {
            rel: 'preload',
            as: 'script'
        };
        execute(preLoad, args, options)
    };

    preLoader.document.load = function () {
        var args = [].slice.call(arguments);
        var options = {
            rel: 'preload',
            as: 'document'
        };
        execute(preLoad, args, options)
    };

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

    function preFetch(args, options) {
        var url;
        if (preFetchLinkSupported) {
            for (var i = 0, j = args.length; i < j; i++) {
                url = args[i];
                createLinkTag(url, options);
            }
        } else {
            console.error('link prefetching is not supported');
        }
    }

    preLoader.document.fetch = function () {
        var args = [].slice.call(arguments);
        var options = {
            rel: 'prefetch',
            as: 'document'
        };
        execute(preFetch, args, options);
    };

    /*****************************************************************************************/

    window.preLoader = preLoader;

    return preLoader;
});