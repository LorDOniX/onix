(function() {
	Event = Event || window.Event;
	Event.prototype.stopPropagation = Event.prototype.stopPropagation || function() {
		this.cancelBubble = true;
	};
	Event.prototype.preventDefault = Event.prototype.preventDefault || function () {
		this.returnValue = false;
	};
})();
if (!String.prototype.trim) {
	String.prototype.trim = function () {
		return this.replace(/^\s+|\s+$/g, '');
	};
}
if(!Array.isArray) {
	/**
	 * Array.isArray dle ES5 - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/isArray
	 */
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
if (!("console" in window)) {
	var emptyFn = function() {};
	window.console = {};
	["log", "warn", "error", "clear", "info"].forEach(function(name) {
		window.console[name] = emptyFn;
	});
}
if (!Object.keys) {
	/**
	 * Object.keys dle ES5 - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys
	 */
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
(function() {
  if(navigator.appVersion.indexOf('MSIE 8') > 0) {
    var _slice = Array.prototype.slice;
    Array.prototype.slice = function() {
      if(this instanceof Array) {
        return _slice.apply(this, arguments);
      } else {
        var result = [];
        var start = (arguments.length >= 1) ? arguments[0] : 0;
        var end = (arguments.length >= 2) ? arguments[1] : this.length;
        for(var i=start; i<end; i++) {
          result.push(this[i]);
        }
        return result;
      }
    };
  }
})();
if (!Object.create) {
	/**
	 * Object.create dle ES5 - https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Object/create
	 */
	Object.create = function (o) {
		if (arguments.length > 1) { throw new Error("Object.create polyfill only accepts the first parameter"); }
		var tmp = function() {};
		tmp.prototype = o;
		return new tmp();
	};
}
if (!Function.prototype.bind) {
	/**
	 * ES5 Function.prototype.bind
	 * Vrací funkci zbindovanou do zadaného kontextu.
	 * Zbylé volitelné parametry jsou předány volání vnitřní funkce.
	 * @param {object} thisObj Nový kontext
	 * @returns {function}
	 */
	Function.prototype.bind = function(thisObj) {
		var fn = this;
		var args = Array.prototype.slice.call(arguments, 1);
		return function() {
			return fn.apply(thisObj, args.concat(Array.prototype.slice.call(arguments)));
		}
	}
};
if (!("addEventListener" in document)) {
	var w = Window.prototype;
	var h = HTMLDocument.prototype;
	var e = Element.prototype;
	w["addEventListener"] = h["addEventListener"] = e["addEventListener"] = function(eventName, listener) {
		if (eventName == "DOMContentLoaded") {
			document.attachEvent("onreadystatechange", function() {
				if (document.readyState === "complete") {
					listener();
				}
			});
		}
		else {
			var obj = this;
			this.attachEvent("on" + eventName, function() {
				return listener.apply(obj, arguments);
			});
		}
	};
	w["removeEventListener"] = h["removeEventListener"] = e["removeEventListener"] = function(eventName, listener) {
		return this.detachEvent("on" + eventName, listener);
	};
}
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
onix = (function() {
	/**
	 * Module object - handles one module object with services, factories etc.
	 * This object cannot be used in dependency injection!
	 * 
	 * @class $module
	 */
	var $module = function(name, dependencies) {
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
	};
	/**
	 * Module constants.
	 *
	 * @property {Object}
	 * @type {Object}
	 * @member $module
	 * @private
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
	/**
	 * Parse parameters. From param parse function and dependencies.
	 *
	 * @property {Function}
	 * @param  {Array|Function} param 
	 * @return {Object} Parse object
	 * @member $module
	 */
	$module.parseParam = function(param) {
		var fn;
		var inject = [];
		if (Array.isArray(param)) {
			param.every(function(item) {
				if (typeof item === "function") {
					fn = item;
					return false;
				}
				else if (typeof item === "string") {
					inject.push(item);
				}
				return true;
			}, this);
		}
		else {
			fn = param;
		}
		return {
			fn: fn,
			inject: inject
		}
	};
	/**
	 * Get filter name.
	 * 
	 * @param  {String} name
	 * @return {String}
	 * @member $module
	 */
	$module.getFilterName = function(name) {
		name = name || "";
		return $module.CONST.FILTER_NAME + name[0].toUpperCase() + name.substr(1, name.length - 1);
	};
	/**
	 * Get dependencies.
	 * 
	 * @return {Array}
	 * @member $module
	 */
	$module.prototype.getDependencies = function() {
		return this._dependencies;
	};
	/**
	 * Get module name.
	 * 
	 * @return {String}
	 * @member $module
	 */
	$module.prototype.getName = function() {
		return this._name;
	};
	/**
	 * Get module configs.
	 * 
	 * @return {Array}
	 * @member $module
	 */
	$module.prototype.getConfigs = function() {
		return this._configs;
	};
	/**
	 * Get module runs.
	 * 
	 * @return {Array}
	 * @member $module
	 */
	$module.prototype.getRuns = function() {
		return this._runs;
	};
	/**
	 * Get module objects.
	 * 
	 * @return {Array}
	 * @member $module
	 */
	$module.prototype.getObjects = function() {
		return this._objects;
	};
	/**
	 * Add provider to the application.
	 *
	 * @chainable
	 * @param  {String} name 
	 * @param  {Function} param
	 * @member $module
	 */
	$module.prototype.provider = function(name, param) {
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
	};
	/**
	 * Add service to the application.
	 *
	 * @chainable
	 * @param  {String} name 
	 * @param  {Function|Array} param
	 * @member $module
	 */
	$module.prototype.service = function(name, param) {
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
	};
	/**
	 * Add factory to the application.
	 *
	 * @chainable
	 * @param  {String} name 
	 * @param  {Function|Array} param
	 * @member $module
	 */
	$module.prototype.factory = function(name, param) {
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
	};
	/**
	 * Add new constant.
	 *
	 * @chainable
	 * @param  {String} name
	 * @param  {Object} param
	 * @member $module
	 */
	$module.prototype.constant = function(name, obj) {
		if (!name || !obj) {
			return this;
		}
		this._objects[name] = {
			name: name,
			cache: obj,
			type: $module.CONST.TYPE.CONSTANT
		};
		return this;
	};
	/**
	 * Add a new value.
	 *
	 * @chainable
	 * @param  {String} name
	 * @param  {Object} param
	 * @member $module
	 */
	$module.prototype.value = function(name, obj) {
		if (!name || !obj) {
			return this;
		}
		this._objects[name] = {
			name: name,
			cache: obj,
			type: $module.CONST.TYPE.VALUE
		};
		return this;
	};
	/**
	 * Add filter to the application.
	 *
	 * @chainable
	 * @param  {String} name 
	 * @param  {Function|Array} param
	 * @member $module
	 */
	$module.prototype.filter = function(name, param) {
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
	};
	/**
	 * Add a new config.
	 *
	 * @chainable
	 * @param  {Array|Function} param With DI
	 * @member $module
	 */
	$module.prototype.config = function(param) {
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
	};
	/**
	 * Add a new run.
	 * 
	 * @param  {Array|Function} param With DI
	 * @member $module
	 */
	$module.prototype.run = function(param) {
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
	};
	/**
	 * Modules object - handles all modules in the application; runs object.
	 * This object cannot be used in dependency injection!
	 *
	 * @class $modules
	 */
	var $modules = {
		/**
		 * All modules array.
		 *
		 * @private
		 * @member $modules
		 * @type {Array}
		 */
		_modules: [],
		/**
		 * All modules object - quick access.
		 *
		 * @private
		 * @member $modules
		 * @type {Object}
		 */
		_modulesObj: {},
		/**
		 * Modules constants.
		 *
		 * @private
		 * @member $modules
		 * @type {Ojbect}
		 */
		_CONST: {
			MODULE_SEPARATOR: "::",
		},
		/**
		 * Function which does nothing.
		 *
		 * @private
		 * @member $modules
		 */
		_noop: function() {
		},
		/**
		 * Event - Dom LOAD.
		 *
		 * @member $modules
		 */
		domLoad: function() {
			var configs = [];
			var runs = [];
			this._modules.forEach(function(module) {
				var error = false;
				var dependencies = module.getDependencies();
				dependencies.every(function(dep) {
					if (!(dep in this._modulesObj)) {
						console.error("Module '" + this._name + "' dependency '" + dep + "' not found!");
						error = true;
						return false;
					}
					else {
						return true;
					}
				}, this);
				if (!error) {
					configs = configs.concat(module.getConfigs());
					runs = runs.concat(module.getRuns());
				}
			}, this);
			// run all configs
			configs.forEach(function(config) {
				this.run(config, true);
			}, this);
			// run all runs
			runs.forEach(function(run) {
				this.run(run);
			}, this);
		},
		/**
		 * Get object by his name.
		 *
		 * @param {String} name Object name
		 * @return {Object} Object data
		 * @member $modules
		 * @private
		 */
		_getObject: function(name) {
			var output = null;
			var searchModuleName = "";
			var searchObjectName = "";
			if (name.indexOf(this._CONST.MODULE_SEPARATOR) != -1) {
				var parts = name.split(this._CONST.MODULE_SEPARATOR);
				if (parts.length == 2) {
					searchModuleName = parts[0];
					searchObjectName = parts[1];
				}
				else {
					console.error("Get object " + name + " error! Wrong module separator use.");
					return null;
				}
			}
			else {
				searchObjectName = name;
			}
			this._modules.every(function(module) {
				var moduleObjects = module.getObjects();
				if (searchModuleName) {
					if (module.getName() != searchModuleName) return true;
					if (searchObjectName in moduleObjects) {
						output = moduleObjects[searchObjectName];
						return false;
					}
					else {
						console.error("Get object " + searchObjectName + " error! Cannot find object in the module " + searchModuleName + ".");
						return false;
					}
				}
				else {
					if (searchObjectName in moduleObjects) {
						output = moduleObjects[searchObjectName];
						return false;
					}
					else return true;
				}
			});
			return output;
		},
		/**
		 * Run object configuration; returns his cache (data).
		 *
		 * @param  {Object}  obj Object configuration
		 * @param  {Boolean} [isConfig] Is config phase?
		 * @param  {Array} [parent] Parent objects
		 * @return {Object}
		 * @member $modules
		 */
		run: function(obj, isConfig, parent) {
			parent = parent || [];
			if (parent.indexOf(obj.name) != -1) {
				console.error("Circular dependency error! Object name: " + obj.name + ", parents: " + parent.join("|"));
				return null;
			}
			var inject = [];
			if (obj.provider) {
				var providerObj = this._getObject(obj.provider);
				if (!providerObj.cache) {
					var providerFn = providerObj.fn || this._noop;
					providerObj.cache = new providerFn();
				}
				var getFn = providerObj.cache["$get"] || this._noop;
				var pp = $module.parseParam(getFn);
				obj.fn = pp.fn;
				obj.inject = pp.inject;
				delete obj.provider;
			}
			if (obj.inject && obj.inject.length) {
				obj.inject.forEach(function(objName) {
					if (typeof objName === "string") {
						var injObj = this._getObject(objName);
						if (!injObj) {
							console.error("Object name: " + objName + " not found!");
							inject.push(null);
						}
						else {
							inject.push(this.run(injObj, isConfig, obj.name ? parent.concat(obj.name) : parent));
						}
					}
					else if (typeof objName === "object") {
						inject.push(objName);
					}
				}, this);
			}
			// config phase
			if (isConfig) {
				switch (obj.type) {
					case $module.CONST.TYPE.PROVIDER:
						if (!obj.cache) {
							var fn = obj.fn || this._noop;
							obj.cache = new fn();
						}
						return obj.cache;
						break;
					case $module.CONST.TYPE.CONSTANT:
						return obj.cache;
						break;
					case $module.CONST.TYPE.CONFIG:
						var fn = obj.fn || this._noop;
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
							var fn = obj.fn || this._noop;
							obj.cache = fn.apply(fn, inject);
						}
						return obj.cache;
						break;
					case $module.CONST.TYPE.SERVICE:
						if (!obj.cache) {
							var fn = obj.fn || this._noop;
							var serviceObj = Object.create(fn.prototype);
							fn.apply(serviceObj, inject);
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
						var fn = obj.fn || this._noop;
						return fn.apply(fn, inject);
						break;
					default:
						return null;
				}
			}
		},
		/**
		 * Add a new module to the application.
		 * 
		 * @param {String} name Module name
		 * @param {Array} [dependencies] Module dependencies
		 * @return {Object} Created module
		 * @member $modules
		 */
		addModule: function(name, dependencies) {
			var module = new $module(name, dependencies);
			this._modulesObj[name] = module
			this._modules.push(module);
			return module;
		}
	};
	// bind DOM ready
	document.addEventListener("DOMContentLoaded", $modules.domLoad.bind($modules));
	/**
	 * Main framework object, which is created like new module with name 'onix'.
	 * Module has addtional functions.
	 * 
	 * @class onix
	 */
	var onix = $modules.addModule("onix");
	/**
	 * Add a new module to the application.
	 * 
	 * @param {String} name Module name
	 * @param {Array} [dependencies] Module dependencies
	 * @return {$module} Created module
	 * @member onix
	 */
	onix.module = function(name, dependencies) {
		return $modules.addModule(name, dependencies);
	};
	/**
	 * Empty function.
	 *
	 * @member onix
	 */
	onix.noop = function() {
	};
	/**
	 * Framework info.
	 *
	 * @member onix
	 */
	onix.info = function() {
		console.log(
			"OnixJS framework\n" +
			"2.5.2/16. 5. 2016\n" +
			"source: https://gitlab.com/LorDOniX/onix\n" +
			"documentation: https://gitlab.com/LorDOniX/onix/tree/master/docs\n" +
			"@license MIT\n" +
			"* - Free for use in both personal and commercial projects\n"
		);
	};
	onix.factory("$di", function() {
		/**
		 * Helper factory for dependency injection and parsing function parameters.
		 * 
		 * @class $di
		 */
		return {
			/**
			 * Parse parameters. From param parse function and dependencies.
			 *
			 * @property {Function}
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
			run: function(runObj) {
				if (!runObj) return null;
				if (!runObj.fn) {
					runObj.fn = function() {};
				}
				// def. type
				runObj.type = $module.CONST.TYPE.RUN;
				return $modules.run(runObj);
			}
		}
	});
	return onix;
})();
/**
 * Filter process input data and output can be used in template or in the code.
 *
 * @class $filter
 */
onix.factory("$filter", [
	"$di",
function(
	$di
) {
	var emptyFilter = function(value) {
		return value || "";
	};
	/**
	 * Return filter by his name or returns empty filter. Filter name is concatenation of $filter + Filter name.
	 * 
	 * @param  {String} filterName 
	 * @return {Object}
	 * @member $filter
	 */
	return function(filterName) {
		if (!filterName) {
			return emptyFilter;
		}
		// get filter name
		filterName = $di.getFilterName(filterName);
		return $di.run({
			fn: function(moduleObj) {
				return moduleObj || emptyFilter;
			},
			inject: [filterName]
		});
	};
}]);
onix.factory("$q", function() {
	/**
	 * Promise implementation which is similar to angular $q.
	 * 
	 * @class $q
	 */
	var $q = function() {
		/**
		 * Promise states.
		 *
		 * @member $q
		 * @private
		 */
		this._STATES = {
			IDLE: 0,
			RESOLVED: 1,
			REJECTED: 2
		};
		// current state
		this._state = this._STATES.IDLE;
		// all funcs
		this._funcs = [];
		// done data
		this._finishData = null;
	};
	/**
	 * Resolve all functions.
	 *
	 * @param  {Boolean} isError
	 * @member $q
	 * @private
	 */
	$q.prototype._resolveFuncs = function(isError) {
		this._funcs.forEach(function(fnItem) {
			if (fnItem["finally"] || (fnItem.isError && isError) || (!fnItem.isError && !isError)) {
				(fnItem.fn)(this._finishData);
			}
		}, this);
		// clear array
		this._funcs.length = 0;
		this._state = isError ? this._STATES.REJECTED : this._STATES.RESOLVED;
	};
	/**
	 * Is promise already finished?
	 *
	 * @return {Boolean}
	 * @member $q
	 * @private
	 */
	$q.prototype._isAlreadyFinished = function() {
		if (this._state != this._STATES.IDLE) {
			this._resolveFuncs(this._state == this._STATES.REJECTED);
		}
	};
	/**
	 * Resolve promise using obj.
	 *
	 * @param  {Object} obj
	 * @member $q
	 */
	$q.prototype.resolve = function(obj) {
		this._finishData = obj;
		this._resolveFuncs(false);
	};
	/**
	 * Reject promise using obj.
	 *
	 * @param  {Object} obj
	 * @member $q
	 */
	$q.prototype.reject = function(obj) {
		this._finishData = obj;
		this._resolveFuncs(true);
	};
	/**
	 * After promise resolve/reject call then (okFn, errorFn).
	 *
	 * @chainable
	 * @param {Function} [cbOk]
	 * @param {Function} [cbError]
	 * @member $q
	 */
	$q.prototype.then = function(cbOk, cbError) {
		if (cbOk && typeof cbOk === "function") {
			this._funcs.push({
				fn: cbOk,
				isError: false
			});
		}
		if (cbError && typeof cbError === "function") {
			this._funcs.push({
				fn: cbError,
				isError: true
			});
		}
		this._isAlreadyFinished();
		return this;
	};
	/**
	 * After promise resolve call then cbOk.
	 *
	 * @chainable
	 * @param  {Function} cbOk
	 * @member $q
	 */
	$q.prototype.done = function(cbOk) {
		this._funcs.push({
			fn: cbOk,
			isError: false
		});
		this._isAlreadyFinished();
		return this;
	};
	/**
	 * After promise reject call then cbError.
	 *
	 * @chainable
	 * @param  {Function} cbError
	 * @member $q
	 */
	$q.prototype.error = function(cbError) {
		this._funcs.push({
			fn: cbError,
			isError: true
		});
		this._isAlreadyFinished();
		return this;
	};
	/**
	 * Finally for promise.
	 *
	 * @method finally
	 * @chainable
	 * @param  {Function} cb
	 * @member $q
	 */
	$q.prototype["finally"] = function(cb) {
		this._funcs.push({
			fn: cb,
			"finally": true
		});
		this._isAlreadyFinished();
		return this;
	};
	return {
		/**
		 * Resolve all promises in the array.
		 *
		 * @param {$q[]} promises
		 * @return {$q}
		 * @member $q
		 */
		all: function(promises) {
			var promise = new $q();
			if (Array.isArray(promises)) {
				var count = promises.length;
				var test = function() {
					count--;
					if (count == 0) {
						promise.resolve();
					}
				};
				promises.forEach(function(item) {
					item["finally"](test);
				});
			}
			else {
				promise.resolve();
			}
			return promise;
		},
		/**
		 * Deferable object of the promise.
		 *
		 * @return {$q}
		 * @member $q
		 */
		defer: function() {
			return new $q();
		},
		/**
		 * Is object promise?
		 * 
		 * @param  {Object}  obj Tested object
		 * @return {Boolean}
		 * @member $q
		 */
		isPromise: function(obj) {
			return obj instanceof $q;
		}
	};
});
onix.factory("$myQuery", function() {
	/**
	 * DOM manipulation in the style of jquery.
	 * 
	 * @class $myQuery
	 * @chainable
	 * @param {String|HTMLElement|Array} value
	 * @param {HTMLElement} [parent]
	 * @member $myQuery
	 */
	var $myQuery = function(value, parent) {
		this._els = [];
		parent = parent || document;
		if (typeof value === "string") {
			if (parent instanceof $myQuery) {
				parent = parent.getEl();
			}
			this._els = parent.querySelectorAll(value);
		}
		else if (Array.isArray(value)) {
			this._els = value;
		}
		else {
			this._els.push(value);
		}
		return this;
	};
	/**
	 * Operation on elements.
	 * 
	 * @param  {Function} cb
	 * @param  {Function} [scope]
	 * @member $myQuery
	 * @private
	 */
	$myQuery.prototype._operation = function(cb, scope) {
		// NodeList -> Array
		if (!Array.isArray(this._els)) {
			this._els = Array.prototype.slice.call(this._els);
		}
		this._els.forEach(function(item, ind) {
			cb.apply(scope || cb, [item, ind]);
		});
	};
	/**
	 * Set or get all - cover function.
	 * 
	 * @chainable
	 * @param  {String} [newValue]
	 * @param  {String} attr
	 * @member $myQuery
	 * @private
	 */
	$myQuery.prototype._setGetAll = function(newValue, attr) {
		if (newValue) {
			this._operation(function(item) {
				item[attr] = newValue;
			});
			return this;
		}
		else {
			var values = [];
			this._operation(function(item) {
				values.push(item[attr]);
			});
			if (!values.length) {
				return null;
			}
			else if (values.length == 1) {
				return values[0];
			}
			else {
				return values;
			}
		}
	};
	/**
	 * Get original element.
	 *
	 * @param  {Number} [ind]
	 * @return {HTMLElement}
	 * @member $myQuery
	 */
	$myQuery.prototype.getEl = function(ind) {
		ind = ind || 0;
		if (ind > this._els.length) {
			return null;
		}
		else {
			return this._els[ind];
		}
	};
	/**
	 * Get or set attribute.
	 *
	 * @chainable
	 * @param  {String} name
	 * @param  {String} [newValue]
	 * @return {String|Array}
	 * @member $myQuery
	 */
	$myQuery.prototype.attr = function(name, newValue) {
		if (newValue) {
			this._operation(function(item) {
				item.setAttribute(name, newValue);
			});
			return this;
		}
		else {
			var values = [];
			this._operation(function(item) {
				values.push(item.getAttribute(name));
			});
			if (!values.length) {
				return null;
			}
			else if (values.length == 1) {
				return values[0];
			}
			else {
				return values;
			}
		}
	};
	/**
	 * Get or set src.
	 * 
	 * @param  {String} [newValue]
	 * @return {String}
	 * @member $myQuery
	 */
	$myQuery.prototype.src = function(newValue) {
		return this._setGetAll(newValue, "src");
	};
	/**
	 * Hide element.
	 * 
	 * @chainable
	 * @member $myQuery
	 */
	$myQuery.prototype.hide = function() {
		this._operation(function(item) {
			item.style.display = "none";
		});
		return this;
	};
	/**
	 * Show element.
	 *
	 * @chainable
	 * @param  {String} [displayStyle]
	 * @member $myQuery
	 */
	$myQuery.prototype.show = function(displayStyle) {
		this._operation(function(item) {
			item.style.display = displayStyle || "";
		});
		return this;
	};
	/**
	 * Get or set value.
	 *
	 * @chainable
	 * @param  {String} [newValue]
	 * @return {String}
	 * @member $myQuery
	 */
	$myQuery.prototype.val = function(newValue) {
		return this._setGetAll(newValue, "value");
	};
	/**
	 * Get or set HTML.
	 * 
	 * @param  {String} [newValue]
	 * @return {String}
	 * @member $myQuery
	 */
	$myQuery.prototype.html = function(newValue) {
		return this._setGetAll(newValue, "innerHTML");
	};
	/**
	 * Append another element to this one.
	 *
	 * @chainable
	 * @param  {HTMLElement} child
	 * @member $myQuery
	 */
	$myQuery.prototype.append = function(child) {
		this._operation(function(item) {
			item.appendChild(child);
		});
		return this;
	};
	/**
	 * Add CSS class.
	 *
	 * @chainable
	 * @param  {String} className
	 * @member $myQuery
	 */
	$myQuery.prototype.addClass = function(className) {
		this._operation(function(item) {
			item.classList.add(className);
		});
		return this;
	};
	/**
	 * Remove CSS class.
	 *
	 * @chainable
	 * @param  {String} className
	 * @member $myQuery
	 */
	$myQuery.prototype.removeClass = function(className) {
		this._operation(function(item) {
			item.classList.remove(className);
		});
		return this;
	};
	/**
	 * Toggle CSS class.
	 *
	 * @chainable
	 * @param  {String} className
	 * @member $myQuery
	 */
	$myQuery.prototype.toggleClass = function(className) {
		this._operation(function(item) {
			item.classList.toggle(className);
		});
		return this;
	};
	/**
	 * Get width.
	 * 
	 * @return {Number}
	 * @member $myQuery
	 */
	$myQuery.prototype.width = function() {
		var width = 0;
		this._operation(function(item) {
			width += item.offsetWidth;
		});
		return width;
	};
	/**
	 * Get height.
	 * 
	 * @return {Number}
	 * @member $myQuery
	 */
	$myQuery.prototype.height = function() {
		var height = 0;
		this._operation(function(item) {
			height += item.offsetHeight;
		});
		return height;
	};
	/**
	 * Click event.
	 *
	 * @chainable
	 * @param  {Function} cb
	 * @param  {Function} [scope]
	 * @member $myQuery
	 */
	$myQuery.prototype.click = function(cb, scope) {
		this._operation(function(item) {
			item.addEventListener("click", function(event) {
				cb.apply(scope || cb, [event, item]);
			});
		});
		return this;
	};
	/**
	 * Change event.
	 *
	 * @chainable
	 * @param  {Function} cb
	 * @param  {Function} [scope]
	 * @member $myQuery
	 */
	$myQuery.prototype.change = function(cb, scope) {
		this._operation(function(item) {
			item.addEventListener("change", function(event) {
				cb.apply(scope || cb, [event, item]);
			});
		});
		return this;
	};
	/**
	 * Foreach.
	 *
	 * @chainable
	 * @param  {Function} cb
	 * @param  {Function} [scope]
	 * @member $myQuery
	 */
	$myQuery.prototype.forEach = function(cb, scope) {
		this._operation(function(item, ind) {
			cb.apply(scope || cb, [item, ind]);
		});
		return this;
	};
	/**
	 * Remove element.
	 *
	 * @chainable
	 * @member $myQuery
	 */
	$myQuery.prototype.remove = function() {
		this._operation(function(item) {
			item.parentNode.removeChild(item);
		});
		return this;
	};
	/**
	 * Prepend element.
	 *
	 * @chainable
	 * @param  {HTMLElement} child
	 * @member $myQuery
	 */
	$myQuery.prototype.prepend = function(child) {
		this._operation(function(item) {
			item.parentNode.insertBefore(child, item);
		});
		return this;
	};
	/**
	 * Empty element - clear all its children.
	 * Much faster than innerHTML = "".
	 * 
	 * @chainable
	 * @member $myQuery
	 */
	$myQuery.prototype.empty = function() {
		this._operation(function(item) {
			while (item.firstChild) {
				item.removeChild(item.firstChild);
			}
		});
		return this;
	};
	/**
	 * Get all elements length.
	 * 
	 * @return {Number}
	 * @member $myQuery
	 */
	$myQuery.prototype.len = function() {
		return this._els.length;
	};
	/**
	 * Quick acces to myQuery and DOM manipulation.
	 *
	 * @param  {String|HTMLElement|Array} value
	 * @param {HTMLElement} [parent]
	 * @return {$myQuery}
	 * @member onix
	 * @property {Function}
	 */
	onix.element = function(value, parent) {
		return new $myQuery(value, parent);
	};
	return {
		 /**
		 * Main cover function.
		 * 
		 * @param  {String|HTMLElement|Array} value
		 * @param {HTMLElement} [parent]
		 * @return {$myQuery}
		 * @member $myQuery
		 */
		get: function(value, parent) {
			return new $myQuery(value, parent);
		}
	};
});
/**
 * Run for cache $myQuery object.
 */
onix.run(["$myQuery", function() {
}]);
/**
 * Commom functions used in whole application.
 *
 * @class $common
 */
onix.service("$common", [
	"$q",
function(
	$q
) {
	/**
	 * Object copy, from source to dest.
	 *
	 * @param  {Object} dest
	 * @param  {Object} source
	 * @member $common
	 * @private
	 */
	this._objCopy = function(dest, source) {
		Object.keys(source).forEach(function(prop) {
			if (source.hasOwnProperty(prop)) {
				var sourceVal = source[prop];
				var sourceType = typeof sourceVal;
				// array
				if (Array.isArray(sourceVal)) {
					// array - copy object to another array - keep referencings on array, objects
					var newArray = [];
					sourceVal.forEach(function(item) {
						newArray.push(item);
					});
					dest[prop] = newArray;
				}
				// not null and object
				else if (sourceVal && sourceType === "object") {
					// recursive copy
					if (!(prop in dest)) {
						dest[prop] = {};
 					}
					this._objCopy(dest[prop], sourceVal);
				}
				else {
					// string, numbers, functions
					dest[prop] = sourceVal;
				}
			}
		}.bind(this));
	};
	/**
	 * Get cookie by her name.
	 *
	 * @param  {String} name
	 * @return {String}
	 * @member $common
	 * @private
	 */
	this.getCookie = function(name) {
		var cookieValue = null;
		if (document.cookie && document.cookie != '') {
			var cookies = document.cookie.split(';');
			cookies.every(function(cookie) {
				cookie = cookie.trim();
				if (cookie.substring(0, name.length + 1) == (name + '=')) {
					cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
					return false;
				}
				else return true;
			});
		}
		return cookieValue;
	};
	/**
	 * Confirm window, returns promise.
	 *
	 * @param  {String} txt
	 * @return {$q}
	 * @member $common
	 */
	this.confirm = function(txt) {
		var promise = $q.defer();
		if (confirm(txt)) {
			promise.resolve();
		}
		else {
			promise.reject();
		}
		return promise;
	};
	/**
	 * Merge multiple objects into the single one.
	 *
	 * @return {Object}
	 * @member $common
	 */
	this.merge = function() {
		var count = arguments.length;
		var dest = {};
		if (count > 0) {
			for (var i = 0; i < count; i++) {
				var source = arguments[i];
				this._objCopy(dest, source);
			}
		}
		return dest;
	};
	/**
	 * Extend one object by other; from source to dest.
	 *
	 * @param  {Object} dest
	 * @param  {Object} source
	 * @member $common
	 */
	this.extend = function(dest, source) {
		dest = dest || {};
		source = source || {};
		this._objCopy(dest, source);
	};
	/**
	 * Bind function arguments without scope.
	 *
	 * @param  {Function} cb
	 * @return {Function}
	 * @member $common
	 */
	this.bindWithoutScope = function(cb) {
		var bindArgs = Array.prototype.slice.call(arguments, 1);
		return function () {
			var internalArgs = Array.prototype.slice.call(arguments, 0);
			var args = Array.prototype.concat(internalArgs, bindArgs);
			return cb.apply(this, args);
		};
	};
	/**
	 * Missing for each for Node array.
	 *
	 * @param  {Object[]} nodes
	 * @param  {Function} cb
	 * @param  {Object|Function} scope
	 * @member $common
	 */
	this.nodesForEach = function(nodes, cb, scope) {
		cb = cb || function() {};
		if (nodes) {
			Array.prototype.slice.call(nodes).forEach(function(item, ind) {
				cb.apply(scope || cb, [item, ind]);
			});
		}
	};
	/**
	 * Reverse for each.
	 *
	 * @param  {Array} arr
	 * @param {Function} cb
	 * @param {Function} scope
	 * @member $common
	 */
	this.reverseForEach = function (arr, cb, scope) {
		arr = arr || [];
		cb = cb || function() {};
		for (var i = arr.length - 1; i >= 0; i--) {
			cb.apply(scope || this, [arr[i], i]);
		}
	};
	/**
	 * HEX value to DEC.
	 *
	 * @param  {String} hex
	 * @return {Number}
	 * @member $common
	 */
	this.hxToDe = function(hex) {
		hex = hex.toLowerCase();
		switch (hex) {
			case "a":
				return 10;
			case "b":
				return 11;
			case "c":
				return 12;
			case "d":
				return 13;
			case "e":
				return 14;
			case "f":
				return 15;
			default:
				return parseInt(hex, 10);
		}
	};
	/**
	 * HEX value to RGB.
	 *
	 * @param  {String} hexColor
	 * @return {Object}
	 * @member $common
	 */
	this.hexToRGB = function(hexColor) {
		if (hexColor[0] == "#") {
			hexColor = hexColor.replace("#", "");
			if (hexColor.length == 3) {
				return {
					r: this.hxToDe(hexColor[0]) * 16 + this.hxToDe(hexColor[0]),
					g: this.hxToDe(hexColor[1]) * 16 + this.hxToDe(hexColor[1]),
					b: this.hxToDe(hexColor[2]) * 16 + this.hxToDe(hexColor[2])
				};
			}
			else {
				return {
					r: this.hxToDe(hexColor[0]) * 16 + this.hxToDe(hexColor[1]),
					g: this.hxToDe(hexColor[2]) * 16 + this.hxToDe(hexColor[3]),
					b: this.hxToDe(hexColor[4]) * 16 + this.hxToDe(hexColor[5])
				};
			}
		}
		else {
			return hexColor;
		}
	};
	/**
	 * Is value element?
	 *
	 * @param  {Object} val
	 * @return {Boolean}
	 * @member $common
	 */
	this.isElement = function(val) {
		return (val instanceof HTMLElement);
	};
	/**
	 * Is item object?
	 * 
	 * @param  {Object} item
	 * @return {Boolean}
	 * @member $common
	 */
	this.isObject = function(item) {
		return (typeof item === "object" && !Array.isArray(item) && item !== null);
	};
	/**
	 * Cover function for console.log, which allows to replace {0..n} occurences inside string.
	 * First argument is string, other arguments are for replace objects by key.
	 * 
	 * @member $common
	 */
	this.col = function() {
		var args = Array.prototype.slice.call(arguments);
		var output = "";
		var params = {};
		args.forEach(function(arg, ind) {
			if (ind == 0) {
				output = arg;
			}
			else {
				params["[{]" + (ind - 1) + "[}]"] = arg;
			}
		});
		Object.keys(params).forEach(function(param) {
			output = output.replace(new RegExp(param, "g"), params[param]);
		});
		if (output) {
			console.log(output);
		}
	};
	/**
	 * Size to KB/MB.
	 * 
	 * @param  {Number} size
	 * @return {String}
	 * @member $common
	 */
	this.humanLength = function(size) {
		size = size || 0;
		var sizeKB = size / 1024;
		var sizeMB = size / (1024 * 1024);
		if (sizeKB < 1024) {
			return sizeKB.toFixed(2) + " KB";
		}
		else {
			return sizeMB.toFixed(2) + " MB";
		}
	};
	/**
	 * Chaining multiple methods with promises, returns promise.
	 * 
	 * @param  {Object[]} opts
	 * @param  {String|Function} opts.method Function or method name inside scope
	 * @param  {Object} opts.scope Scope for method function
	 * @param  {Array} opts.args Additional arguments for function
	 * @return {$q}
	 * @member $common
	 */
	this.chainPromises = function(opts) {
		var promise = $q.defer();
		this._chainPromisesInner(opts, promise, []);
		return promise;
	};
	/**
	 * Inner method for chaining promises.
	 * 
	 * @param  {Object[]} opts
	 * @param  {String|Function} opts.method Function or method name inside scope
	 * @param  {Object} opts.scope Scope for method function
	 * @param  {Array} opts.args Additional arguments for function
	 * @param  {promise} promise Done promise $q
	 * @param  {Array} outArray Array for output from all executed promises
	 * @member $common
	 */
	this._chainPromisesInner = function(opts, promise, outArray) {
		var firstItem = opts.shift();
		if (firstItem) {
			// string or function itself
			var fn;
			var error = false;
			switch (typeof firstItem.method) {
				case "string":
					if (!firstItem.scope || !(firstItem.method in firstItem.scope)) {
						error = true;
					}
					else {
						fn = firstItem.scope[firstItem.method];
						if (typeof fn !== "function") {
							error = true;
						}
					}
					break;
				case "function":
					fn = firstItem.method;
					break;
				default:
					error = true;
			}
			if (!error) {
				fn.apply(firstItem.scope || fn, firstItem.args || []).then(function(data) {
					outArray.push(data);
					this._chainPromisesInner(opts, promise, outArray);
				}.bind(this), function(err) {
					outArray.push(err);
					this._chainPromisesInner(opts, promise, outArray);
				}.bind(this));
			}
			else {
				promise.resolve(outArray);
			}
		}
		else {
			promise.resolve(outArray);
		}
	};
}]);
