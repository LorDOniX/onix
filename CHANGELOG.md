# Change Log

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
