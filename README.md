# PreLoader

PreLoader is a script that leverage browser native caipabilites to create resource hints.
Current version of the API allows to load and cache asset types like: document, image and script.
As well as to use dns-prefech and preconnect link attributes.

## Setting up is easy!

in the WPL projects add the following to bower.json:
"pre-loader": "git@bitbucket.org:galacoraltelavivrd/preloader.git#{version}"
The loaded script will be downloaded in to the components directory.

add the pre-loader as a property in the require.conf.js under "path":
'pre-loader': '../components/pre-loader/dist/pre-loader'

now it's ready to be used:
var preLoader = require('pre-loader');
preLoader.document.preFetch('https://what.ever.com');

## API

preLoader.document.preFetch
preLoader.document.preLoad

preLoader.image.preFetch
preLoader.image.preLoad

preLoader.script.preFetch
preLoader.script.preLoad

preLoader.dnsPreFetch

preLoader.preConnect