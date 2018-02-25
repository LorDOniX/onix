# Change Log

## 4.0.3 (25. 2. 2018)

* remove async polyfill
* update str format, replaceAll
* new method for $i18n addStructuredLang

## 4.0.2 (19. 2. 2018)

* sortable - drag & drop
* repositioner-x

## 4.0.1 (15. 2. 2018)

* add new methods

## 4.0.0 (15. 2. 2018)

* new import version
* new documentation via jsdoc
* no dist - see test folders, which have src files used in them

## 3.0.3 (14. 9. 2017)

* json viewer fix

## 3.0.2 (25. 11. 2016)

* bundler update

## 3.0.1 (9. 11. 2016)

* new bundler system
* change directory hierarchy: core (onix.js), core -> common
* onix.min.css new file (2 css files instead of one)

## 3.0.0 (3. 11. 2016)

* add $jsonViewer for visualise JSON objects
* add $lightbox for visualise images
* add $popup for popup windows and alert replace
* $common - add method compareObjects
* $location - add method decodeSearchValue, parseURL - parsing url to object
* $dom - create method accepts "text" for creating text node
* $features - add property MOUSE_WHEEL_EVENT_NAME
* $resize - add method isActive
* new test setion for utils
* img and img-test server rules

## 2.9.0 (31. 8. 2016)

* $template - data- for events is replaced by data-event-; elPrefix -> elEventPrefix rename;
* $date - format method (date string format)
* $common - timeDuration method (time duration string)

## 2.8.8 (11. 8. 2016)

* $job - bugfix taskDoneObj - ES6 transpilation

## 2.8.7 (9. 8. 2016)

* $crop - restore method sets new width and height (bugfix)
* $common - cloneValue bugfix (boolean)

## 2.8.6 (5. 8. 2016)

* $modules - caching objects
* $math - new method getMiddleAngle
* bundler - dist & version info fix

## 2.8.5 (3. 8. 2016)

* $http - bugfix for default value getResponseHeader()

## 2.8.4 (3. 8. 2016)

* $myQuery - multiple mousemove bugfix (one is mousewheel)
* $common - new method valueFromObject - get value from object using path

## 2.8.3 (3. 8. 2016)

* $http - application/json index of

## 2.8.2 (26. 7. 2016)

* bundler update - refactoring
* $event - _eventInit moved to constructor; update all occurances (framework + test website)
* test site - _constructor method move to constructor()

## 2.8.1 (21. 7. 2016)

* common - chainPromisesInner is private
* $common - formatSize bugfix (1000 vs 1024)
* bundler little optimazing and refactoring

## 2.8.0 (20. 7. 2016)

* bundler update - fixes, ES6 error output; uglify IE8 fix;
* common - chainPromises resolved now with object (+rejected key)
* $common - chainPromises resolved now with object (+rejected key); cloneValue remove recursive arg (_cloneValue);
* $myQuery - add mouseWheel event; bind and unbind method for add/remove event listener
* test site with docs menu item

## 2.7.9 (17. 7. 2016)

* onix.match - similar to string.match() with own delimeters
* onix.split - similar to string.split() with own delimeter
* $i18n - regular expressions refactoring; uses onix.match|onix.split
* $template - regular expressions refactoring; uses onix.match|onix.split

## 2.7.8 (14. 7. 2016)

* bundler - has his own directory
* polyfills update for ES6
* string.format - $common.col use it
* $i18n - missing key is on the output, before it was empty string
* ES6 presets + plugins
* $previewImages - method show returns boolean
* $features - media queries support

## 2.7.7 (11. 7. 2016)

* $myQuery - fix creating DOM elements from string; bugfix element regex;

## 2.7.6 (11. 7. 2016)

* $location - method get returns also search part of the url
* $route - method go update

## 2.7.5 (10. 7. 2016)

* $myQuery - prepend() bugfix

## 2.7.4 (8. 7. 2016)

* $dom - bugfix

## 2.7.3 (8. 7. 2016)

* $common - cssNameToJS method (uses $dom, $myQuery)
* $dom - css attribute
* $myQuery - add events; methods (parent, insertBefore); refactoring
* update test home page

## 2.7.2 (7. 7. 2016)

* bundler - add websocket
* reload -server - dynamic update from bundler to test site
* $features - localStorage test
* $localStorage - update with $features
* test for $localStorage
$ windows update - EOL, watcher

## 2.7.1 (1. 7. 2016)

* add es5-sham polyfill
* polyfills.js - add slice.call, Object.create -> sham;
* bundler - fix ES6 transpilation with "dist"
* test menu - remove dependency on $dom
* fixes for older browsers

## 2.7.0 (1. 7. 2016)

* ES6 (Babel) all src files + home test files; inheritance over extends keyword
* bundler rewrite; split to class files; cache for faster transpilation
* $promise - flattening
* $common - cancelEvents method
* $location - objToURL method
* jsduck - now only from one file, output is in the file

## 2.6.6 (22. 6. 2016)

* es6 bundler.js option
* $crop - fitToArea method; setDim change;
* $image - getCanvas change;

## 2.6.5 (22. 6. 2016)

* $crop - style fix

## 2.6.4 (22. 6. 2016)

* fix bundler EOL on windows
* fix bundler watch
* ie8 fixes (catch, export key words); $template getAttributes method
* polyfills - fix add/remove eventListener for IE8
* $features - browser features constants
* $select - window -> document
* $crop - setCenter is not part of constructor

## 2.6.3 (20. 6. 2016)

* $event - add scope for .off method

## 2.6.2 (14. 6. 2016)

* $slider - input keyup bugfix

## 2.6.1 (14. 6. 2016)

* $dom - create: child does not have to be an array
* $template - el prefix and data bind can be changed in config phase; object -> function
* onix - $modules object -> function
* $loader - object -> function

## 2.6.0 (13. 6. 2016)

* $template - all events bind
* $anonymizer - bugfix, document mouse implementation
* $slider - document mouse implementation, mouse wheel constant
* $cookie - set, remove methods
* $date - addDays method
* $q - deleted
* $common - chainPromises is moved from $q
* framework uses $promise instead of $q
* polyfills Date.now
* test page

## 2.5.13 (13. 6. 2016)

* $event allEvents fix

## 2.5.12 (10. 6. 2016)

* angular controller/directive comptability - only used for module import, these functions do nothing
* crop area fix

## 2.5.11 (10. 6. 2016)

* $crop - new util for cropping images for example; test example
* $math.setRange new function ($anonymizer is using it)

## 2.5.10 (3. 6. 2016)

* $anonymizer bugfix - no image

## 2.5.9 (3. 6. 2016)

* $resize is factory

## 2.5.8 (3. 6. 2016)

* $common cloneValue
* $event is now only function, remove bindEvents
* update test

## 2.5.7 (2. 6. 2016)

* $common inherit - new method for functions inheritance
* $resize - new service which handles window resize event
* $event off bugfix

## 2.5.6 (30. 5. 2016)

* $event off bugfix

## 2.5.5 (25. 5. 2016)

* $common humanLength -> formatSize with TB, GB support
* change directory hierarchy - test folder, remove static
* main.less compile for test website
* only one place for header update

## 2.5.4 (20. 5. 2016)

* bugfixing - $anonymizer
* $slider wheel support

## 2.5.3 (18. 5. 2016)

* move $common getCookies -> $cookie service
* move $common chainPromises -> $q
* add $slider - selector for number within the range
* add $anonymizer - canvas for image preview with posibility for add geometries
* change test website
* $loader add getSpinner method

## 2.5.2 (16. 5. 2016)

* add minimal framework version
* add $math service - different mathematical alghoritms
* add $date service - date converts

## 2.5.1 (13. 5. 2016)

* $common doJobs moved to $job.multipleJobs

## 2.5.0 (12. 5. 2016)

* onix.css - separated css file for framework
* $promise - es6 implementation of Promise functionality
* removed $uploadImages
* add $image - image functions (getCanvas, readFromFile...)
* add $previewImages - this service can show you image previews with EXIF rotation
* removed git loader
* add css3 loader - spinner
* $common doJobs method

## 2.4.0 (4. 5. 2016)

* add language during config phase - i18n is now provider
* disable options for _ underscore
* add aditional parameters to the route controllers ($routeParams)
* documentation update
* $localStorage old browsers fix
* $route controller update
* $event has now public method "bindEvents"; cannot be inheritated by $event
* udate testing website

## 2.3.3 (4. 5. 2016)

* udate testing website
* add TODO

## 2.3.3 (3. 5. 2016)

* add $filter functionality in the angular way
* add filter support to the template system (via "|")
* built in filters: lowercase, uppercase, json

## 2.3.2 (28. 4. 2016)

* upload images - set loading gif url

## 2.3.1 (28. 4. 2016)

* remove $common.create
* add $dependency service which handles DI
* $modules.run is public and accepts object for injection

## 2.3.0 (28. 4. 2016)

* add module system

## 2.2.3 (27. 4. 2016)

* handle circular dependency injection problem

## 2.2.2 (27. 4. 2016)

* add providers
* change application in angular way
* dynamic object load
* remove grunt
* bundler.js
* add isPromise to $q

## 2.2.1 (19. 4. 2016)

* update and bugfixing example files
* add functions to $common (chainPromises, col...)

## 2.2.0 (18. 4. 2016)

* add EXIF library
* add local storage
* add upload images
* change directory structure
* add support for message format in i18n

## 2.1.1 (6. 1. 2016)

* route is not executed after run functions
* polyfills for IE8 support
* firefox SELECT fix

## 2.1.0 (15. 7. 2015)

* remove controller & directive
* whole framework is in angular way, but is like dependency injection framework

## 2.0.0 (29. 6. 2015)

* complete change to angular way
* add shadow dom - it's in the development state; not ready for user and it is not included into the final js framework

## 1.1.4 (29. 6. 2015)

* Common.isElement function
* notify support for element output
* snippet isLocked function
* new service Provide - decorator function

## 1.1.3 (18. 6. 2015)

* add support for keydown data event

## 1.1.2

*once event

## 1.1.1

* promise refactor

## 1.0.0

* framework release
