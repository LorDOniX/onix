/**
 * OnixJS framework
 * 2.8.6/5. 8. 2016
 * source: https://gitlab.com/LorDOniX/onix
 * documentation: https://gitlab.com/LorDOniX/onix/tree/master/docs
 * minimal version: contains [src/libs/polyfills.js, src/onix/onix.js, src/onix/filter.js]
 * @license MIT
 * - Free for use in both personal and commercial projects
 */
// ie shim for slice on host objects like NamedNodeMap, NodeList, and HTMLCollection
(function () {
  'use strict';
  var _slice = Array.prototype.slice;
  try {
    // Can't be used with DOM elements in IE < 9
    _slice.call(document.documentElement);
  } catch (e) { // Fails in IE < 9
    // This will work for genuine arrays, array-like objects, 
    // NamedNodeMap (attributes, entities, notations),
    // NodeList (e.g., getElementsByTagName), HTMLCollection (e.g., childNodes),
    // and will not fail on other DOM objects (as do DOM elements in IE < 9)
    Array.prototype.slice = function(begin, end) {
      // IE < 9 gets unhappy with an undefined end argument
      end = (typeof end !== 'undefined') ? end : this.length;
      // For native Array objects, we use the native slice function
      if (Object.prototype.toString.call(this) === '[object Array]'){
        return _slice.call(this, begin, end); 
      }
      // For array like object we handle it ourselves.
      var i, cloned = [],
        size, len = this.length;
      // Handle negative value for "begin"
      var start = begin || 0;
      start = (start >= 0) ? start : Math.max(0, len + start);
      // Handle negative value for "end"
      var upTo = (typeof end == 'number') ? Math.min(end, len) : len;
      if (end < 0) {
        upTo = len + end;
      }
      // Actual expected size of the slice
      size = upTo - start;
      if (size > 0) {
        cloned = new Array(size);
        if (this.charAt) {
          for (i = 0; i < size; i++) {
            cloned[i] = this.charAt(start + i);
          }
        } else {
          for (i = 0; i < size; i++) {
            cloned[i] = this[start + i];
          }
        }
      }
      return cloned;
    };
  }
}());
(function() {
	// event
	Event = Event || window.Event;
	Event.prototype.stopPropagation = Event.prototype.stopPropagation || function() {
		this.cancelBubble = true;
	};
	Event.prototype.preventDefault = Event.prototype.preventDefault || function () {
		this.returnValue = false;
	};
	// btoa
	if (!("btoa" in window)) {
		window.btoa = function(val) {
			return val;
		}
	}
	// array
	if(!Array.isArray) {
		// Array.isArray by ES5 - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/isArray
		Array.isArray = function (vArg) {
			return Object.prototype.toString.call(vArg) === "[object Array]";
		};
	}
	if (!Array.prototype.forEach) { 
		Array.prototype.forEach = function(cb, _this) {
		    var len = this.length;
		    for (var i=0;i<len;i++) { 
				if (i in this) { cb.call(_this, this[i], i, this); }
			}
		}
	}
	if (!Array.prototype.every) { 
		Array.prototype.every = function(cb, _this) {
		    var len = this.length;
		    for (var i=0;i<len;i++) {
				if (i in this && !cb.call(_this, this[i], i, this)) { return false; }
		    }
		    return true;
		}
	}
	if (!Array.prototype.indexOf) { 
		Array.prototype.indexOf = function(item, from) {
		    var len = this.length;
		    var i = from || 0;
		    if (i < 0) { i += len; }
		    for (;i<len;i++) {
				if (i in this && this[i] === item) { return i; }
		    }
		    return -1;
		}
	}
	// objects
	// Object.keys by ES5 - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys
	if (!Object.keys) {
	    Object.keys = (function () {
	        'use strict';
	        var hasOwnProperty = Object.prototype.hasOwnProperty,
	            hasDontEnumBug = !({toString: null}).propertyIsEnumerable('toString'),
	            dontEnums = [
	                'toString',
	                'toLocaleString',
	                'valueOf',
	                'hasOwnProperty',
	                'isPrototypeOf',
	                'propertyIsEnumerable',
	                'constructor'
	            ],
	            dontEnumsLength = dontEnums.length;
	        return function (obj) {
	            if (typeof obj !== 'object' && (typeof obj !== 'function' || obj === null)) {
	                throw new TypeError('Object.keys called on non-object');
	            }
	            var result = [], prop, i;
	            for (prop in obj) {
	                if (hasOwnProperty.call(obj, prop)) {
	                    result.push(prop);
	                }
	            }
	            if (hasDontEnumBug) {
	                for (i = 0; i < dontEnumsLength; i++) {
	                    if (hasOwnProperty.call(obj, dontEnums[i])) {
	                        result.push(dontEnums[i]);
	                    }
	                }
	            }
	            return result;
	        };
	    }());
	}
	// Object.defineProperty
	try {
		Object.defineProperty({}, "a", {value:3});
	} catch (e) {
		var nativeDefineProperty = Object.defineProperty;
		Object.defineProperty = function(obj, prop, descriptor) {
			try {
				return nativeDefineProperty.apply(Object, arguments);
			} catch (e) {
				obj[prop] = descriptor.value;
				return obj;
			}
		}
		Object.defineProperties = function(obj, props) {
		    for (var p in props) {
		        Object.defineProperty(obj, p, props[p]);
		    }
			return obj;
		}
	}
	// object.create
	if (!Object.create) {
		Object.create = function(proto, props) {
		    var tmp = function() {};
		    tmp.prototype = proto;
		    var result = new tmp();
		    Object.defineProperties(result, props);
		    return result;
		}
	}
	// Object.getPrototypeOf
	var testObject = {};
	if (!(Object.setPrototypeOf || testObject.__proto__)) {
		var nativeGetPrototypeOf = Object.getPrototypeOf;
		Object.getPrototypeOf = function(object) {
			if (object.__proto__) {
				return object.__proto__;
			} else {
				return nativeGetPrototypeOf.call(Object, object);
			}
		}
	}
	// date timestamp by ES5 - http://dailyjs.com/2010/01/07/ecmascript5-date/
	if (!Date.now) {
		Date.now = function() { return +(new Date); }
	}
	// functions
	if (!Function.prototype.bind) {
		Function.prototype.bind = function(thisObj) {
			var fn = this;
			var args = Array.prototype.slice.call(arguments, 1);
			return function() {
				return fn.apply(thisObj, args.concat(Array.prototype.slice.call(arguments)));
			}
		}
	};
	// strings
	if (!String.prototype.trim) {
		String.prototype.trim = function () {
			return this.replace(/^\s+|\s+$/g, '');
		};
	}
	if (!String.prototype.replaceAll) {
		String.prototype.replaceAll = function(target, replacement) {
			return this.split(target).join(replacement);
		};
	}
	// "hi {0}".format("Roman") => "hi Roman" {0..n}, args...
	if (!String.prototype.format) {
		String.prototype.format = function() {
			var args = Array.prototype.slice.call(arguments);
			var output = this.toString();
			args.forEach(function(arg, ind) {
				output = output.replace(new RegExp("{\\s*" + ind + "\\s*}", "g"), arg);
			});
			return output;
		};
	}
	// console
	if (!("console" in window)) {
		var emptyFn = function() {};
		window.console = {};
		["log", "warn", "error", "clear", "info"].forEach(function(name) {
			window.console[name] = emptyFn;
		});
	}
	// old ie
	if (!("addEventListener" in document)) {
		var w = Window.prototype;
		var h = HTMLDocument.prototype;
		var e = Element.prototype;
		document["addEventListener"] = w["addEventListener"] = h["addEventListener"] = e["addEventListener"] = function(eventName, listener) {
			if (!this.__eventListeners) {
				this.__eventListeners = {};
			}
			if (eventName == "DOMContentLoaded") {
				this.attachEvent("onreadystatechange", function() {
					if (document.readyState === "complete") {
						listener();
					}
				});
			}
			else {
				if (!this.__eventListeners[eventName]) {
					this.__eventListeners[eventName] = [];
				}
				var fn = function() {
					return listener.apply(this, arguments);
				}.bind(this);
				this.__eventListeners[eventName].push({
					fn: fn,
					listener: listener
				});
				this.attachEvent("on" + eventName, fn);
			}
		};
		document["removeEventListener"] = w["removeEventListener"] = h["removeEventListener"] = e["removeEventListener"] = function(eventName, listener) {
			var all = this.__eventListeners || {};
			var items = all[eventName] || [];
			var fn = null;
			var pos = -1;
			for (var i = 0; i < items.length; i++) {
				var item = items[i];
				if (item.listener == listener) {
					fn = item.fn;
					pos = i;
					break;
				}
			}
			if (fn) {
				items.splice(pos, 1);
				if (!items.length) {
					delete all[eventName];
				}
				return this.detachEvent("on" + eventName, fn);
			}
			else return null;
		};
	}
	// dom classList
	if (!("classList" in document.documentElement) && window.Element) {
		(function () {
			var prototype = Array.prototype,
			indexOf = prototype.indexOf,
			slice = prototype.slice,
			push = prototype.push,
			splice = prototype.splice,
			join = prototype.join;
			function DOMTokenList(elm) {
				this._element = elm;
				if (elm.className == this._classCache) { return; }
				this._classCache = elm.className;
				if (!this._classCache) { return; }
				var classes = this._classCache.replace(/^\s+|\s+$/g,'').split(/\s+/);
				for (var i = 0; i < classes.length; i++) {
					push.call(this, classes[i]);
				}
			}
			window.DOMTokenList = DOMTokenList;
			function setToClassName(el, classes) {
				el.className = classes.join(" ");
			}
			DOMTokenList.prototype = {
				add: function(token) {
					if (this.contains(token)) { return; }
					push.call(this, token);
					setToClassName(this._element, slice.call(this, 0));
				},
				contains: function(token) {
					return (indexOf.call(this, token) != -1);
				},
				item: function(index) {
					return this[index] || null;
				},
				remove: function(token) {
					var i = indexOf.call(this, token);
					if (i == -1) { return; }
					splice.call(this, i, 1);
					setToClassName(this._element, slice.call(this, 0));
				},
				toString: function() {
					return join.call(this, " ");
				},
				toggle: function(token) {
					if (indexOf.call(this, token) == -1) {
						this.add(token);
						return true;
					} else {
						this.remove(token);
						return false;
					}
				}
			};
			function defineElementGetter (obj, prop, getter) {
				if (Object.defineProperty) {
					Object.defineProperty(obj, prop, {
						get: getter
					});
				} else {
					obj.__defineGetter__(prop, getter);
				}
			}
			defineElementGetter(Element.prototype, "classList", function() {
				return new DOMTokenList(this);
			});
		})();
	}
})();
var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
onix = function () {
	/* ************************************* $module **************************** */
	/**
  * Module object - handles one module object with services, factories etc.
  * This object cannot be used in dependency injection!
  * 
  * @class $module
  */
	var $module = function () {
		/**
   * New module.
   * 
   * @param  {String} name Module name
   * @param  {Array} dependencies Other modules dependencies
   */
		function $module(name, dependencies) {
			_classCallCheck(this, $module);
			/**
    * All objects.
    *
    * @type {Object}
    * @member $module
    * @private
    */
			this._objects = {};
			/**
    * All run objects.
    *
    * @type {Object}
    * @member $module
    * @private
    */
			this._runs = [];
			/**
    * All config objects.
    *
    * @type {Object}
    * @member $module
    * @private
    */
			this._configs = [];
			/**
    * Module name.
    * 
    * @type {String}
    * @member $module
    * @private
    */
			this._name = name || "";
			/**
    * Module dependencies.
    * 
    * @type {Array}
    * @member $module
    * @private
    */
			this._dependencies = dependencies || [];
		}
		/**
   * Parse parameters. From param parse function and dependencies.
   *
   * @property {Function}
   * @param  {Array|Function} param 
   * @return {Object} Parse object
   * @member $module
   * @static
   * @method parseParam
   */
		_createClass($module, [{
			key: "getDependencies",
			/**
    * Get dependencies.
    * 
    * @return {Array}
    * @member $module
    * @method getDependencies
    */
			value: function getDependencies() {
				return this._dependencies;
			}
			/**
    * Get module name.
    * 
    * @return {String}
    * @member $module
    * @method getName
    */
		}, {
			key: "getName",
			value: function getName() {
				return this._name;
			}
			/**
    * Get module configs.
    * 
    * @return {Array}
    * @member $module
    * @method getConfigs
    */
		}, {
			key: "getConfigs",
			value: function getConfigs() {
				return this._configs;
			}
			/**
    * Get module runs.
    * 
    * @return {Array}
    * @member $module
    * @method getRuns
    */
		}, {
			key: "getRuns",
			value: function getRuns() {
				return this._runs;
			}
			/**
    * Get module objects.
    * 
    * @return {Array}
    * @member $module
    * @method getObjects
    */
		}, {
			key: "getObjects",
			value: function getObjects() {
				return this._objects;
			}
			/**
    * Add provider to the application.
    *
    * @chainable
    * @param  {String} name 
    * @param  {Function} param
    * @member $module
    * @method provider
    */
		}, {
			key: "provider",
			value: function provider(name, param) {
				if (!name || !param) {
					return this;
				}
				var pp = $module.parseParam(param);
				this._objects[name + $module.CONST.PROVIDER_NAME] = {
					name: name + $module.CONST.PROVIDER_NAME,
					inject: pp.inject,
					fn: pp.fn,
					cache: null,
					type: $module.CONST.TYPE.PROVIDER
				};
				this._objects[name] = {
					name: name,
					inject: null,
					fn: null,
					cache: null,
					provider: name + $module.CONST.PROVIDER_NAME,
					type: $module.CONST.TYPE.FACTORY
				};
				return this;
			}
			/**
    * Add service to the application.
    *
    * @chainable
    * @param  {String} name 
    * @param  {Function|Array} param
    * @member $module
    * @method service
    */
		}, {
			key: "service",
			value: function service(name, param) {
				if (!name || !param) {
					return this;
				}
				var pp = $module.parseParam(param);
				this._objects[name] = {
					name: name,
					inject: pp.inject,
					fn: pp.fn,
					cache: null,
					type: $module.CONST.TYPE.SERVICE
				};
				return this;
			}
			/**
    * Add factory to the application.
    *
    * @chainable
    * @param  {String} name 
    * @param  {Function|Array} param
    * @member $module
    * @method factory
    */
		}, {
			key: "factory",
			value: function factory(name, param) {
				if (!name || !param) {
					return this;
				}
				var pp = $module.parseParam(param);
				this._objects[name] = {
					name: name,
					inject: pp.inject,
					fn: pp.fn,
					cache: null,
					type: $module.CONST.TYPE.FACTORY
				};
				return this;
			}
			/**
    * Add new constant.
    *
    * @chainable
    * @param  {String} name
    * @param  {Object} param
    * @member $module
    * @method constant
    */
		}, {
			key: "constant",
			value: function constant(name, obj) {
				if (!name || !obj) {
					return this;
				}
				this._objects[name] = {
					name: name,
					cache: obj,
					type: $module.CONST.TYPE.CONSTANT
				};
				return this;
			}
			/**
    * Add a new value.
    *
    * @chainable
    * @param  {String} name
    * @param  {Object} param
    * @member $module
    * @method value
    */
		}, {
			key: "value",
			value: function value(name, obj) {
				if (!name || !obj) {
					return this;
				}
				this._objects[name] = {
					name: name,
					cache: obj,
					type: $module.CONST.TYPE.VALUE
				};
				return this;
			}
			/**
    * Add filter to the application.
    *
    * @chainable
    * @param  {String} name 
    * @param  {Function|Array} param
    * @member $module
    * @method filter
    */
		}, {
			key: "filter",
			value: function filter(name, param) {
				if (!name || !param) {
					return this;
				}
				var pp = $module.parseParam(param);
				this._objects[$module.getFilterName(name)] = {
					name: name,
					inject: pp.inject,
					fn: pp.fn,
					cache: null,
					type: $module.CONST.TYPE.FILTER
				};
				return this;
			}
			/**
    * Add a new config.
    *
    * @chainable
    * @param  {Array|Function} param With DI
    * @member $module
    * @method config
    */
		}, {
			key: "config",
			value: function config(param) {
				if (!param) {
					return this;
				}
				var pp = $module.parseParam(param);
				this._configs.push({
					fn: pp.fn,
					inject: pp.inject,
					type: $module.CONST.TYPE.CONFIG
				});
				return this;
			}
			/**
    * Add a new run.
    *
    * @chainable
    * @param  {Array|Function} param With DI
    * @member $module
    * @method run
    */
		}, {
			key: "run",
			value: function run(param) {
				if (!param) {
					return this;
				}
				var pp = $module.parseParam(param);
				this._runs.push({
					fn: pp.fn,
					inject: pp.inject,
					type: $module.CONST.TYPE.RUN
				});
				return this;
			}
			/**
    * Add a new controller - only for back comptability with angular modules.
    * This feature is not implemented!
    *
    * @chainable
    * @member $module
    * @method controller
    */
		}, {
			key: "controller",
			value: function controller() {
				return this;
			}
			/**
    * Add a new directive - only for back comptability with angular modules.
    * This feature is not implemented!
    *
    * @chainable
    * @member $module
    * @method directive
    */
		}, {
			key: "directive",
			value: function directive() {
				return this;
			}
		}], [{
			key: "parseParam",
			value: function parseParam(param) {
				var fn = void 0;
				var inject = [];
				if (Array.isArray(param)) {
					param.every(function (item) {
						if (typeof item === "function") {
							fn = item;
							return false;
						} else if (typeof item === "string") {
							inject.push(item);
						}
						return true;
					});
				} else {
					fn = param;
				}
				return {
					fn: fn,
					inject: inject
				};
			}
			/**
    * Get filter name.
    * 
    * @param  {String} name
    * @return {String}
    * @member $module
    * @static
    * @method getFilterName
    */
		}, {
			key: "getFilterName",
			value: function getFilterName(name) {
				name = name || "";
				return $module.CONST.FILTER_NAME + name[0].toUpperCase() + name.substr(1);
			}
		}]);
		return $module;
	}();
	;
	/**
  * Module constants.
  *
  * @property {Object}
  * @type {Object}
  * @member $module
  * @private
  * @static
  */
	$module.CONST = {
		PROVIDER_NAME: "Provider",
		FILTER_NAME: "$filter",
		TYPE: {
			PROVIDER: 1,
			SERVICE: 2,
			FACTORY: 3,
			CONSTANT: 4,
			VALUE: 5,
			FILTER: 6,
			CONFIG: 7,
			RUN: 8
		}
	};
	/* ************************************* $modules **************************** */
	/**
  * Modules object - handles all modules in the application; runs object.
  * This object cannot be used in dependency injection!
  *
  * @class $modules
  */
	var $modules = function () {
		function $modules() {
			var _this = this;
			_classCallCheck(this, $modules);
			/**
    * All modules array.
    *
    * @private
    * @member $modules
    * @type {Array}
    */
			this._modules = [];
			/**
    * All modules object - quick access.
    *
    * @private
    * @member $modules
    * @type {Object}
    */
			this._modulesObj = {};
			/**
    * All objects cache - quick access.
    *
    * @private
    * @member $modules
    * @type {Object}
    */
			this._objectsCache = {};
			/**
    * Modules constants.
    *
    * @private
    * @member $modules
    * @type {Object}
    */
			this._CONST = {
				MODULE_SEPARATOR: "::"
			};
			// bind DOM ready
			document.addEventListener("DOMContentLoaded", function () {
				_this._domLoad();
			});
		}
		/**
   * Event - Dom LOAD.
   *
   * @member $modules
   * @private
   * @method _domLoad
   */
		_createClass($modules, [{
			key: "_domLoad",
			value: function _domLoad() {
				var _this2 = this;
				var configs = [];
				var runs = [];
				this._modules.forEach(function (module) {
					var error = false;
					var dependencies = module.getDependencies();
					dependencies.every(function (dep) {
						if (!(dep in _this2._modulesObj)) {
							console.error("Module '" + _this2._name + "' dependency '" + dep + "' not found!");
							error = true;
							return false;
						} else {
							return true;
						}
					});
					if (!error) {
						configs = configs.concat(module.getConfigs());
						runs = runs.concat(module.getRuns());
					}
				});
				// run all configs
				configs.forEach(function (config) {
					_this2.run(config, true);
				});
				// run all runs
				runs.forEach(function (run) {
					_this2.run(run);
				});
			}
			/**
    * Get object by his name.
    *
    * @param {String} name Object name
    * @return {Object} Object data
    * @member $modules
    * @private
    * @method _getObject
    */
		}, {
			key: "_getObject",
			value: function _getObject(name) {
				var _this3 = this;
				var output = null;
				// get from cache
				if (name in this._objectsCache) {
					output = this._objectsCache[name];
				} else {
					var _ret = function () {
						var searchModuleName = "";
						var searchObjectName = "";
						if (name.indexOf(_this3._CONST.MODULE_SEPARATOR) != -1) {
							var parts = name.split(_this3._CONST.MODULE_SEPARATOR);
							if (parts.length == 2) {
								searchModuleName = parts[0];
								searchObjectName = parts[1];
							} else {
								console.error("Get object " + name + " error! Wrong module separator use.");
								return {
									v: null
								};
							}
						} else {
							searchObjectName = name;
						}
						_this3._modules.every(function (module) {
							var moduleObjects = module.getObjects();
							if (searchModuleName) {
								if (module.getName() != searchModuleName) return true;
								if (searchObjectName in moduleObjects) {
									output = moduleObjects[searchObjectName];
									return false;
								} else {
									console.error("Get object " + searchObjectName + " error! Cannot find object in the module " + searchModuleName + ".");
									return false;
								}
							} else {
								if (searchObjectName in moduleObjects) {
									output = moduleObjects[searchObjectName];
									return false;
								} else {
									return true;
								}
							}
						});
						// save to cache
						_this3._objectsCache[name] = output;
					}();
					if ((typeof _ret === "undefined" ? "undefined" : _typeof(_ret)) === "object") return _ret.v;
				}
				return output;
			}
		}, {
			key: "noop",
			/**
    * Function which does nothing.
    *
    * @member $modules
    * @method noop
    */
			value: function noop() {}
			/**
    * Run object configuration; returns his cache (data).
    *
    * @param  {Object}  obj Object configuration
    * @param  {Boolean} [isConfig] Is config phase?
    * @param  {Array} [parent] Parent objects
    * @return {Object}
    * @member $modules
    * @method run
    */
		}, {
			key: "run",
			value: function run(obj, isConfig, parent) {
				var _this4 = this;
				parent = parent || [];
				if (parent.indexOf(obj.name) != -1) {
					console.error("Circular dependency error! Object name: " + obj.name + ", parents: " + parent.join("|"));
					return null;
				}
				var inject = [];
				if (obj.provider) {
					var providerObj = this._getObject(obj.provider);
					if (!providerObj.cache) {
						var providerFn = providerObj.fn || this.noop;
						providerObj.cache = new providerFn();
					}
					var getFn = providerObj.cache["$get"] || this.noop;
					var pp = $module.parseParam(getFn);
					obj.fn = pp.fn;
					obj.inject = pp.inject;
					delete obj.provider;
				}
				if (obj.inject && obj.inject.length) {
					obj.inject.forEach(function (objName) {
						if (typeof objName === "string") {
							var injObj = _this4._getObject(objName);
							if (!injObj) {
								console.error("Object name: " + objName + " not found!");
								inject.push(null);
							} else {
								inject.push(_this4.run(injObj, isConfig, obj.name ? parent.concat(obj.name) : parent));
							}
						} else if ((typeof objName === "undefined" ? "undefined" : _typeof(objName)) === "object") {
							inject.push(objName);
						}
					});
				}
				// config phase
				if (isConfig) {
					switch (obj.type) {
						case $module.CONST.TYPE.PROVIDER:
							if (!obj.cache) {
								var _fn = obj.fn || this.noop;
								obj.cache = new _fn();
							}
							return obj.cache;
							break;
						case $module.CONST.TYPE.CONSTANT:
							return obj.cache;
							break;
						case $module.CONST.TYPE.CONFIG:
							var fn = obj.fn || this.noop;
							return fn.apply(fn, inject);
							break;
						default:
							return null;
					}
				}
				// run phase
				else {
						switch (obj.type) {
							case $module.CONST.TYPE.FACTORY:
							case $module.CONST.TYPE.FILTER:
								if (!obj.cache) {
									var _fn3 = obj.fn || this.noop;
									obj.cache = _fn3.apply(_fn3, inject);
								}
								return obj.cache;
								break;
							case $module.CONST.TYPE.SERVICE:
								if (!obj.cache) {
									var _fn4 = obj.fn || this.noop;
									var serviceObj = Object.create(_fn4.prototype);
									_fn4.apply(serviceObj, inject);
									obj.cache = serviceObj;
								}
								return obj.cache;
								break;
							case $module.CONST.TYPE.VALUE:
								return obj.cache;
								break;
							case $module.CONST.TYPE.CONSTANT:
								return obj.cache;
								break;
							case $module.CONST.TYPE.RUN:
								var _fn2 = obj.fn || this.noop;
								return _fn2.apply(_fn2, inject);
								break;
							default:
								return null;
						}
					}
			}
			/**
    * Add a new module to the application.
    * 
    * @param {String} name Module name
    * @param {Array} [dependencies] Module dependencies
    * @return {Object} Created module
    * @member $modules
    * @method addModule
    */
		}, {
			key: "addModule",
			value: function addModule(name, dependencies) {
				var module = new $module(name, dependencies);
				this._modulesObj[name] = module;
				this._modules.push(module);
				return module;
			}
		}]);
		return $modules;
	}();
	;
	// new instance from $modules class
	var $modulesInst = new $modules();
	/* ************************************* onix **************************** */
	/**
  * Main framework object, which is created like new module with name 'onix'.
  * Module has addtional functions.
  * 
  * @class onix
  */
	var onix = $modulesInst.addModule("onix");
	/**
  * Add a new module to the application.
  * 
  * @param {String} name Module name
  * @param {Array} [dependencies] Module dependencies
  * @return {$module} Created module
  * @static
  * @member onix
  */
	onix.module = function (name, dependencies) {
		return $modulesInst.addModule(name, dependencies);
	};
	/**
  * Empty function.
  *
  * @member onix
  * @method noop
  * @static
  */
	onix.noop = $modulesInst.noop;
	/**
  * Return all occurences between left and right delimeter inside string value.
  * 
  * @param  {String} txt Input string
  * @param  {String} leftDelimeter  one or more characters
  * @param  {String} rightDelimeter one or more characters
  * @method match
  * @static
  * @return {Array}
  */
	onix.match = function (txt, leftDelimeter, rightDelimeter) {
		var matches = [];
		var open = 0;
		var ldl = leftDelimeter.length;
		var rdl = rightDelimeter.length;
		var match = "";
		for (var i = 0; i < txt.length; i++) {
			var item = txt[i];
			var lpos = i - ldl + 1;
			var rpos = i - rdl + 1;
			// one sign - only check; more - check current + prev items to match leftDelimeter
			if (ldl == 1 && item == leftDelimeter || ldl > 1 && (lpos >= 0 ? txt.substr(lpos, ldl) : "") == leftDelimeter) {
				open++;
				if (open == 1) {
					continue;
				}
			}
			// same as left + remove
			if (rdl == 1 && item == rightDelimeter || rdl > 1 && (rpos >= 0 ? txt.substr(rpos, rdl) : "") == rightDelimeter) {
				open--;
				if (rdl > 1) {
					// remove rightDelimeter rest parts
					match = match.substr(0, match.length - rdl + 1);
				}
			}
			if (open > 0) {
				match += item;
			}
			if (!open && match.length) {
				matches.push(match);
				match = "";
			}
		}
		return matches;
	};
	/**
  * Split string with delimeter. Similar to string.split(), but keeps opening strings/brackets in the memory.
  * "5, {x:5, c: 6}, 'Roman, Peter'".split(",") => ["5", " {x:5", " c: 6}", " 'Roman", " Peter'"]
  * onix.split("5, {x:5, c: 6}, 'Roman, Peter'", ",") => ["5", "{x:5, c: 6}", "'Roman, Peter"]
  * 
  * @param  {String} txt Input string
  * @param  {String} delimeter one character splitter
  * @method match
  * @static
  * @return {Array}
  */
	onix.split = function (txt, delimeter) {
		txt = txt || "";
		delimeter = delimeter || ",";
		var open = 0;
		var matches = [];
		var match = "";
		var strStart = false;
		var len = txt.length;
		for (var i = 0; i < len; i++) {
			var item = txt[i];
			switch (item) {
				case "'":
				case '"':
					if (strStart) {
						strStart = false;
						open--;
					} else {
						strStart = true;
						open++;
					}
					break;
				case "{":
				case "[":
					open++;
					break;
				case "}":
				case "]":
					open--;
					break;
			}
			// delimeter
			if (item == delimeter && !open) {
				if (match.length) {
					matches.push(match);
				}
				match = "";
			} else {
				match += item;
			}
			// end
			if (i == len - 1 && match.length) {
				matches.push(match);
			}
		}
		return matches;
	};
	/**
  * Framework info.
  *
  * version: 2.8.6
  * date: 5. 8. 2016
  * @member onix
  * @static
  */
	onix.info = function () {
		console.log('OnixJS framework\n'+
'2.8.6/5. 8. 2016\n'+
'source: https://gitlab.com/LorDOniX/onix\n'+
'documentation: https://gitlab.com/LorDOniX/onix/tree/master/docs\n'+
'@license MIT\n'+
'- Free for use in both personal and commercial projects\n');
	};
	/* ************************************* $di **************************** */
	onix.factory("$di", function () {
		/**
   * Helper factory for dependency injection and parsing function parameters.
   * 
   * @class $di
   */
		return {
			/**
    * Parse parameters. From param parse function and dependencies.
    *
    * @param  {Array|Function} param 
    * @return {Object} Parse object
    * @member $di
    */
			parseParam: $module.parseParam,
			/**
    * Get filter name.
    * 
    * @param  {String} name
    * @return {String}
    * @member $di
    */
			getFilterName: $module.getFilterName,
			/**
    * Run function with possible inject - handles dependency injection.
    * 
    * @param  {Object} runObj
    * @param  {Function} runObj.fn
    * @param  {Array} runObj.inject
    * @return {Object} Function output
    * @member $di
    */
			run: function run(runObj) {
				if (!runObj) return null;
				if (!runObj.fn) {
					runObj.fn = function () {};
				}
				// def. type
				runObj.type = $module.CONST.TYPE.RUN;
				return $modulesInst.run(runObj);
			}
		};
	});
	return onix;
}();
/**
 * Filter process input data and output can be used in template or in the code.
 *
 * @class $filter
 */
onix.factory("$filter", ["$di", function ($di) {
	/**
  * Return filter by his name or returns empty filter. Filter name is concatenation of $filter + Filter name.
  *
  * @method filter
  * @param  {String} filterName 
  * @return {Object}
  * @member $filter
  */
	return function (filterName) {
		var emptyFilter = function emptyFilter(value) {
			return value || "";
		};
		if (!filterName) {
			return emptyFilter;
		}
		return $di.run({
			fn: function fn(moduleObj) {
				return moduleObj || emptyFilter;
			},
			// get filter name for injection
			inject: [$di.getFilterName(filterName)]
		});
	};
}]);