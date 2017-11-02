# PreLoader

PreLoader is a script that leverage browser native caipabilites to create resource hints.
Current version of the API allows to load and cache asset types like: document, image, script, font.
As well as to use dns-prefech and preconnect link attributes.

## Setting up is easy!

In the WPL projects add the following to bower.json:
"pre-loader": "git@bitbucket.org:galacoraltelavivrd/preloader.git#{version}"
The loaded script will be downloaded in to the components directory.
add the pre-loader as a property in the require.conf.js under "path":
'pre-loader': '../components/pre-loader/dist/pre-loader'
now it's ready to be used:
var preLoader = require('pre-loader');
preLoader.document.preFetch('https://what.ever.com');

## API

###### Document

preLoader.document.preFetch

###### Image

preLoader.image.preFetch

preLoader.image.preLoad

###### Font

preLoader.script.preFetch

preLoader.script.preLoad

###### General

preLoader.dnsPreFetch

preLoader.preConnect

##General Data

preload: focuses on current navigation and fetches resources with high-priority. (can not be done on type document)

prefetch: is a low priority resource hint that allows the browser to fetch resources in the background
(idle time) that might be needed later.
When pre-fetching document the url supplied must be exactly as the url that will be used for the actual url
(Pre-fetching of only the domain will not give the wanted results)

dns-prefetch: Dns resolution is a process of converting a domain/hostname to an ip address required to access
a resource (this process is what converts a user friendly url like: http://qnimate.com to http://85.72.179.121 );
this requires a certain time and adds to the page loading process.

## Use Cases

When a user opens a menu, buttons in the menu are links are external, running preLoader.document.preFetch on the
exact urls of the menu will help to cut down the redirection when it actual happens.



