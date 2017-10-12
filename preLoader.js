(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory(root));
    } else if (typeof exports === 'object') {
        module.exports = factory(root);
    } else {
        root.PreLoader = factory(root); // @todo rename plugin
    }
})(typeof global !== "undefined" ? global : this.window || this.global, function (root) {
    'use strict';

    var PreLoader = {}; // Object for public APIs
    // In order not to loose reference to the created object and to avoid it's deletion
    // by the garbage collector the new image is saved in the fetchedImages object
    // Accessing the assets from memory is quicker than from dick cache
    var fetchedImages = {};
    // feature testing
    var testLink = document.createElement('link');
    var isRelListSupported = !!testLink.relList;
    var preLoadLinkSupported = isRelListSupported && testLink.relList.supports('preload');
    var preFetchLinkSupported = isRelListSupported && testLink.relList.supports('prefetch');

    /*****************************************************************************************/

    function loadImageStrategy(url) {
        var img = new Image();
        img.src = url;
        return img;
    }

    function loadLinkStrategy(url) {
        var link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = url;
        document.head.appendChild(link);
        return link
    }

    function preLoad(args) {
        var url, neverLoaded;
        // choosing pre-loading strategy
        if (preLoadLinkSupported) {
            for (var i = 0, j = args.length; i < j; i++) {
                url = args[i];
                loadLinkStrategy(url);
            }
        } else {
            // setTimeout used to ensure pre-loading will happen after all the main assets are downloaded
            // as much as possilbe
            setTimeout(function () {
                for (var i = 0, j = args.length; i < j; i++) {
                    url = args[i];
                    neverLoaded = fetchedImages[url] !== '' && !fetchedImages[url];
                    if (neverLoaded) {
                        fetchedImages[url] = (loadImageStrategy(url));
                    }
                }
            }, 3000);
        }
    }

    PreLoader.preLoad = function () {
        var args = [].slice.call(arguments);

        if (document.readyState === 'complete') {
            preLoad(args);
        } else {
            addEventListener('load', preLoad.bind(null, args));
        }
    };

    /*****************************************************************************************/

    function preFetchLinkStrategy(url) {
        var link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = url;
        document.head.appendChild(link);
    }

    function preFetch(args) {
        var url;
        if (preFetchLinkSupported) {
            for (var i = 0, j = args.length; i < j; i++) {
                url = args[i];
                preFetchLinkStrategy(url);
            }
        }
    }

    PreLoader.preFetch = function () {
        var args = [].slice.call(arguments);

        if (document.readyState === 'complete') {
            preFetch(args);
        } else {
            addEventListener('load', preFetch.bind(null, args));
        }
    };

    window.PreLoader = PreLoader;

    return PreLoader;
});