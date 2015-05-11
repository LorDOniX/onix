/**
 * @namespace Onix
 */
Onix = (function() {
	var Onix = {
		/**
		 * Framework version.
		 * 
		 * @private
		 * @type {String}
		 * @memberof Onix
		 */
		_VERSION: "1.1.2",

		/**
		 * Framework date.
		 * 
		 * @private
		 * @type {String}
		 * @memberof Onix
		 */
		_DATE: "11. 5. 2015",

		/**
		 * All factories, constants...
		 * 
		 * @private
		 * @type {Object}
		 * @memberof Onix
		 */
		_objects: {},

		/**
		 * Onix configuration
		 * 
		 * @private
		 * @type {Object}
		 * @memberof Onix
		 */
		_config: {},

		/**
		 * All run functions
		 * 
		 * @private
		 * @type {Array}
		 * @memberof Onix
		 */
		_runs: [],

		/**
		 * App object types
		 * 
		 * @private
		 * @type {Object}
		 * @memberof Onix
		 */
		_TYPES: {
			SERVICE: 1,
			FACTORY: 2
		},

		/**
		 * APP init - DOM load.
		 * 
		 * @private
		 * @memberof Onix
		 */
		_init: function() {
			document.addEventListener("DOMContentLoaded", function() {
				var di = this._di(this._run);

				di.fn.apply(this, di.args);
			}.bind(this));
		},

		/**
		 * Dependency injection.
		 * 
		 * @private
		 * @param  {Array|Function} param
		 * @return {Object}
		 * @memberof Onix
		 */
		_di: function(param) {
			var fn;
			var args = [];

			if (Array.isArray(param)) {
				param.every(function(item) {
					if (typeof item === "function") {
						fn = item;
						return false;
					}
					else {
						args.push(this._objects[item]);
					}

					return true;
				}, this);
			}
			else {
				fn = param;
			}

			return {
				fn: fn,
				args: args
			};
		},

		/**
		 * Add new object to the database.
		 * 
		 * @private
		 * @param {String} name
		 * @param {Enum} type
		 * @param {Array|Function} param
		 * @memberof Onix
		 */
		_addObject: function(name, type, param) {
			try {
				var di = this._di(param);

				this._objects[name] = type == this._TYPES.SERVICE 
					? new (Function.prototype.bind.apply(di.fn, [null].concat(di.args)))
					: di.fn.apply(di.fn, di.args)
			}
			catch (err) {
				console.error("Onix._addObject error " + err + " in " + name);
			}
		},

		/**
		 * Application run.
		 * 
		 * @private
		 * @memberof Onix
		 */
		_run: [
			"i18n",
			"Templates",
			"Loader",
			"Router",
			"MyQuery",
		function(
			i18n,
			Templates,
			Loader,
			Router,
			MyQuery
		) {
			// binds
			this.element = function(value, parent) {
				return new MyQuery.get(value, parent);
			};

			// inits
			Loader.init();
			Router.init();

			var afterRun = function() {
				// run runs array
				this._runs.forEach(function(item) {
					var di = this._di(item);

					new (Function.prototype.bind.apply(di.fn, [null].concat(di.args)));
				}.bind(this));

				// templates init
				Templates.init().done(function() {
					// router go
					Router.go();
				});
			}.bind(this);
			
			if (this.config("LOCALIZATION").LANG && this.config("LOCALIZATION").PATH) {
				window._ = i18n._.bind(i18n);
				i18n.setLanguage(this.config("LOCALIZATION").LANG);
				i18n.loadLanguage(this.config("LOCALIZATION").LANG, this.config("LOCALIZATION").PATH).done(afterRun);
			}
			else {
				afterRun();
			}
		}],

		/**
		 * Add a new service
		 * 
		 * @public
		 * @param  {String} name
		 * @param  {Array|Function} param With DI
		 * @memberof Onix
		 */
		service: function(name, param) {
			this._addObject(name, this._TYPES.SERVICE, param);
		},

		/**
		 * Add a new factory
		 * 
		 * @public
		 * @param  {String} name
		 * @param  {Array|Function} param With DI
		 * @memberof Onix
		 */
		factory: function(name, param) {
			this._addObject(name, this._TYPES.FACTORY, param);
		},

		/**
		 * Add a new run
		 * 
		 * @public
		 * @param  {Array|Function} param With DI
		 * @memberof Onix
		 */
		run: function(param) {
			this._runs.push(param);
		},

		/**
		 * Add new constant
		 * 
		 * @public
		 * @param  {String} name
		 * @param  {Object} param
		 * @memberof Onix
		 */
		constant: function(name, obj) {
			this._objects[name] = obj;
		},

		/**
		 * Get/Set configuration
		 * 
		 * @public
		 * @param  {String|Object} param
		 * @return  {Object}
		 * @memberof Onix
		 */
		config: function(param) {
			if (typeof param === "string") {
				// get
				return this._config[param] || {};
			}
			else {
				// set - update config object
				Object.keys(param).forEach(function(key) {
					this._config[key] = param[key];
				}.bind(this));
			}
		},

		/**
		 * Get object by name
		 * 
		 * @public
		 * @param  {String} name
		 * @return {Function|Object}
		 * @memberof Onix
		 */
		getObject: function(name) {
			name = name || "";

			return this._objects[name];
		}
	};

	// init app
	Onix._init();

	return Onix;
})();
/**
 * Main framework configuration
 * @namespace CONFIG
 */
Onix.config({
	/**
	 * Localization
	 *
	 * @public
	 * @type {Object}
	 * @memberof CONFIG
	 */
	LOCALIZATION: {
		LANG: "cs",
		PATH: "/js/locale/cs.json"
	},

	/**
	 * Resource urls
	 *
	 * @public
	 * @type {Object}
	 * @memberof CONFIG
	 */
	URLS: {
		HOME: "/api/home/"
	},

	/**
	 * Template delimiter
	 *
	 * @public
	 * @type {Object}
	 * @memberof CONFIG
	 */
	TMPL_DELIMITER: {
		LEFT: "{{",
		RIGHT: "}}"
	},

	/**
	 * Detail page selector
	 *
	 * @public
	 * @type {String}
	 * @memberof CONFIG
	 */
	DETAIL_SEL: ".detail"
});
/**
 * @namespace Events
 * @description DI: Common; Returns interface _Events;
 */
Onix.factory("Events", [
	"Common",
function(
	Common
) {
	/**
 	 * @interface _Events
 	 * @description Parent: Events;
 	 */
	return {
		/**
		 * All events. { name: name, event: function, scope, [once] }
		 * 
		 * @private
		 * @type {Array}
		 * @memberof _Events
		 */
		_allEvents: [],

		/**
		 * Get all events by his name.
		 * 
		 * @private
		 * @param  {String} name 
		 * @return {Array}
		 * @memberof _Events
		 */
		_getEvents: function (name) {
			var events = [];

			this._allEvents.forEach(function(item, ind) {
				if (name == item.name) {
					events.push({
						item: item,
						pos: ind
					});
				}
			});

			return events;
		},

		/**
		 * Add new event to the stack.
		 * 
		 * @public
		 * @param  {String}   name 
		 * @param  {Function} fn   
		 * @param  {Object|Function}   scope
		 * @memberof _Events
		 */
		on: function (name, fn, scope) {
			this._allEvents.push({ 
				name: name,
				fn: fn,
				scope: scope
			});
		},

		/**
		 * Remove event from the stack.
		 * 
		 * @public
		 * @param  {String}   name 
		 * @param  {Function} [fn]
		 * @memberof _Events
		 */
		off: function (name, fn) {
			var events = this._getEvents(name);

			Common.reverseForEach(events, function(item) {
				if (!fn || fn && item.fn == fn) {
					this._allEvents.splice(item.pos, 1);
				}
			}, this);
		},

		/**
		 * Add one time event to the stack.
		 * 
		 * @public
		 * @param  {String}   name 
		 * @param  {Function} [fn]
		 * @param  {Object|Function}   scope
		 * @memberof _Events
		 */
		once: function (name, fn, scope) {
			this._allEvents.push({ 
				name: name,
				fn: fn,
				scope: scope,
				once: true
			});
		},

		/**
		 * Trigger event with arguments 0..n
		 * 
		 * @public
		 * @param  {String} name
		 * @memberof _Events
		 */
		trigger: function (name) {
			var events = this._getEvents(name);
			var args = arguments;
			var onceArray = [];

			events.forEach(function(event) {
				var newArgs = Array.prototype.slice.call(args, 0);
				newArgs.shift();

				var item = event.item;

				item.fn.apply(item.scope || this, newArgs);
				if (item.once) {
					onceArray.push(event.pos);
				}
			}, this);

			Common.reverseForEach(onceArray, function(pos) {
				this._allEvents.splice(pos, 1);
			}, this);
		}
	};
}]);
Onix.factory("Promise", function() {
	/**
	 * @class _Promise
	 * @description Parent: Promise;
	 */
	var _Promise = function() {
		/**
		 * Promise states
		 * @const
		 * @memberof _Promise
		 */
		this._E_STATES = {
			IDLE: 0,
			RESOLVED: 1,
			REJECTED: 2
		};

		// current state
		this._state = this._E_STATES.IDLE;

		// all funcs
		this._funcs = [];

		// done data
		this._finishData = null;
	};

	/**
	 * Resolve all functions
	 *
	 * @private
	 * @param  {Boolean} isError
	 * @memberof _Promise
	 */
	_Promise.prototype._resolveFuncs = function(isError) {
		this._funcs.forEach(function(fnItem) {
			if (fnItem["finally"] || (fnItem.isError && isError) || (!fnItem.isError && !isError)) {
				(fnItem.fn)(this._finishData);
			}
		}, this);
		
		// clear array
		this._funcs.length = 0;
		this._state = isError ? this._E_STATES.REJECTED : this._E_STATES.RESOLVED;
	};

	/**
	 * Is promise already finished?
	 *
	 * @private
	 * @return {Boolean}
	 * @memberof _Promise
	 */
	_Promise.prototype._isAlreadyFinished = function() {
		if (this._state != this._E_STATES.IDLE) {
			this._resolveFuncs(this._state == this._E_STATES.REJECTED);
		}
	};

	/**
	 * Resolve promise using obj.
	 *
	 * @public
	 * @param  {Object} obj
	 * @memberof _Promise
	 */
	_Promise.prototype.resolve = function(obj) {
		this._finishData = obj;
		this._resolveFuncs(false);
	};

	/**
	 * Reject promise using obj.
	 *
	 * @public
	 * @param  {Object} obj
	 * @memberof _Promise
	 */
	_Promise.prototype.reject = function(obj) {
		this._finishData = obj;
		this._resolveFuncs(true);
	};

	/**
	 * After promise resolve/reject call then (okFn, errorFn)
	 *
	 * @public
	 * @param {Function} [cbOk]
	 * @param {Function} [cbError]
	 * @return {_Promise}
	 * @memberof _Promise
	 */
	_Promise.prototype.then = function(cbOk, cbError) {
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
	 * After promise resolve call then cbOk
	 *
	 * @public
	 * @param  {Function}   cbOk
	 * @return {_Promise}
	 * @memberof _Promise
	 */
	_Promise.prototype.done = function(cbOk) {
		this._funcs.push({
			fn: cbOk,
			isError: false
		});

		this._isAlreadyFinished();

		return this;
	};

	/**
	 * After promise reject call then cbError
	 *
	 * @public
	 * @param  {Function}   cbError
	 * @return {_Promise}
	 * @memberof _Promise
	 */
	_Promise.prototype.error = function(cbError) {
		this._funcs.push({
			fn: cbError,
			isError: true
		});

		this._isAlreadyFinished();

		return this;
	};

	/**
	 * Finally for promise
	 *
	 * @function finally
	 * @public
	 * @param  {Function}   cb
	 * @return {_Promise}
	 * @memberof _Promise
	 */
	_Promise.prototype["finally"] = function(cb) {
		this._funcs.push({
			fn: cb,
			"finally": true
		});

		this._isAlreadyFinished();

		return this;
	};

	/**
 	 * @namespace Promise
 	 */
	return {
		/**
		 * Resolve all promises in the array
		 *
		 * @public
		 * @param {Array} promises
		 * @return {_Promise}
		 * @memberof Promise
		 */
		all: function(promises) {
			var promise = new _Promise();

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
		 * @public
		 * @return {_Promise}
		 * @memberof Promise
		 */
		defer: function() {
			return new _Promise();
		}
	}
});
Onix.factory("MyQuery", function() {
	/**
	 * Parent: MyQuery; Cover function
	 * 
	 * @class _MyQuery
	 * @param {String|NodeElement|Array} value
	 * @param {NodeElement} [parent]
	 * @return {Himself}
	 */
	var _MyQuery = function(value, parent) {
		this._els = [];
		parent = parent || document;

		if (typeof value === "string") {
			this._els = parent.querySelectorAll(value);
		}
		else if (Array.isArray(value)) {
			this._els = value;
		}
		else {
			// node element todo
			this._els.push(value);
		}

		return this;
	};

	/**
	 * Operation on elements
	 * 
	 * @private
	 * @param  {Function} cb
	 * @param  {Function} scope
	 * @memberof _MyQuery
	 */
	_MyQuery.prototype._operation = function(cb, scope) {
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
	 * @private
	 * @param  {String} newValue
	 * @param  {String} attr
	 * @memberof _MyQuery
	 */
	_MyQuery.prototype._setGetAll = function(newValue, attr) {
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
	 * @public
	 * @param  {Number} [ind]
	 * @return {NodeElement|Null}
	 * @memberof _MyQuery
	 */
	_MyQuery.prototype.getEl = function(ind) {
		ind = ind || 0;

		if (ind > this._els.length) {
			return null;
		}
		else {
			return this._els[ind];
		}
	};

	/**
	 * Get or set attribute
	 * 
	 * @public
	 * @param  {String} name 
	 * @param  {String} [newValue]
	 * @return {Himself|String|Array}
	 * @memberof _MyQuery
	 */
	_MyQuery.prototype.attr = function(name, newValue) {
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
	 * Get or set src
	 * 
	 * @public
	 * @param  {String} [newValue]
	 * @return {Himself|String}
	 * @memberof _MyQuery
	 */
	_MyQuery.prototype.src = function(newValue) {
		return this._setGetAll(newValue, "src");
	};

	/**
	 * Hide element
	 * 
	 * @public
	 * @return {Himself}
	 * @memberof _MyQuery
	 */
	_MyQuery.prototype.hide = function() {
		this._operation(function(item) {
			item.style.display = "none";
		});

		return this;
	};

	/**
	 * Show element
	 * 
	 * @public
	 * @param  {String} [displayStyle]
	 * @return {Himself}
	 * @memberof _MyQuery
	 */
	_MyQuery.prototype.show = function(displayStyle) {
		this._operation(function(item) {
			item.style.display = displayStyle || "block";
		});

		return this;
	};

	/**
	 * Get or set value
	 * 
	 * @public
	 * @param  {String} [newValue]
	 * @return {Himself|String}
	 * @memberof _MyQuery
	 */
	_MyQuery.prototype.val = function(newValue) {
		return this._setGetAll(newValue, "value");
	};

	/**
	 * Get or set HTML
	 * 
	 * @public
	 * @param  {String} [newValue]
	 * @return {Himself|String}
	 * @memberof _MyQuery
	 */
	_MyQuery.prototype.html = function(newValue) {
		return this._setGetAll(newValue, "innerHTML");
	};

	/**
	 * Append another element to this one
	 * TODO: cannot use on n elements
	 * 
	 * @public
	 * @param  {NodeElement} child
	 * @return {Himself}
	 * @memberof _MyQuery
	 */
	_MyQuery.prototype.append = function(child) {
		this._operation(function(item) {
			item.appendChild(child);
		});

		return this;
	};

	/**
	 * Add css class
	 * 
	 * @public
	 * @param  {String} className
	 * @return {Himself}
	 * @memberof _MyQuery
	 */
	_MyQuery.prototype.addClass = function(className) {
		this._operation(function(item) {
			item.classList.add(className);
		});

		return this;
	};

	/**
	 * Remove css class
	 * 
	 * @public
	 * @param  {String} className
	 * @return {Himself}
	 * @memberof _MyQuery
	 */
	_MyQuery.prototype.removeClass = function(className) {
		this._operation(function(item) {
			item.classList.remove(className);
		});

		return this;
	};

	/**
	 * Toggle css class
	 * 
	 * @public
	 * @param  {String} className
	 * @return {Himself}
	 * @memberof _MyQuery
	 */
	_MyQuery.prototype.toggleClass = function(className) {
		this._operation(function(item) {
			item.classList.toggle(className);
		});

		return this;
	};

	/**
	 * Get width
	 * 
	 * @public
	 * @return {Number}
	 * @memberof _MyQuery
	 */
	_MyQuery.prototype.width = function() {
		var width = 0;

		this._operation(function(item) {
			width += item.offsetWidth;
		});

		return width;
	};

	/**
	 * Get height
	 * 
	 * @public
	 * @return {Number}
	 * @memberof _MyQuery
	 */
	_MyQuery.prototype.height = function() {
		var height = 0;

		this._operation(function(item) {
			height += item.offsetHeight;
		});

		return height;
	};

	/**
	 * Click event
	 * 
	 * @public
	 * @param  {Function} cb
	 * @param  {Function} scope
	 * @return {Himself}
	 * @memberof _MyQuery
	 */
	_MyQuery.prototype.click = function(cb, scope) {
		this._operation(function(item) {
			item.addEventListener("click", function(event) {
				cb.apply(scope || cb, [event, item]);
			});
		});

		return this;
	};

	/**
	 * Change event
	 * 
	 * @public
	 * @param  {Function} cb
	 * @param  {Function} scope
	 * @return {Himself}
	 * @memberof _MyQuery
	 */
	_MyQuery.prototype.change = function(cb, scope) {
		this._operation(function(item) {
			item.addEventListener("change", function(event) {
				cb.apply(scope || cb, [event, item]);
			});
		});

		return this;
	};

	/**
	 * Foreach
	 * 
	 * @public
	 * @param  {Function} cb
	 * @param  {Function} scope
	 * @return {Himself}
	 * @memberof _MyQuery
	 */
	_MyQuery.prototype.forEach = function(cb, scope) {
		this._operation(function(item, ind) {
			cb.apply(scope || cb, [item, ind]);
		});

		return this;
	};

	/**
	 * Remove element
	 * 
	 * @public
	 * @return {Himself}
	 * @memberof _MyQuery
	 */
	_MyQuery.prototype.remove = function() {
		this._operation(function(item) {
			item.parentNode.removeChild(item);
		});

		return this;
	};

	/**
	 * Prepend element
	 * 
	 * @public
	 * @param  {NodeElement} child
	 * @return {Himself}
	 * @memberof _MyQuery
	 */
	_MyQuery.prototype.prepend = function(child) {
		this._operation(function(item) {
			item.parentNode.insertBefore(child, item);
		});

		return this;
	};

	/**
	 * Get all elements length
	 * 
	 * @public
	 * @return {Number}
	 * @memberof _MyQuery
	 */
	_MyQuery.prototype.len = function() {
		return this._els.length;
	};

	/**
 	 * @namespace MyQuery
 	 */
	return {
		 /**
		 * Main cover function.
		 * 
		 * @public
		 * @param  {String|NodeElement|Array} value
		 * @param {NodeElement} [parent]
		 * @return {_MyQuery}
		 * @memberof MyQuery
		 */
		get: function(value, parent) {
			return new _MyQuery(value, parent);
		}
	};
});
/**
 * @namespace DOM
 */
Onix.service("DOM", function() {
	/**
	 * Create DOM from the configuration.
	 * config: {
	 * 	el string: element name
	 * 	attrs json: attributes
	 * 	child array: children, with same config
	 * 	events array
	 * 	innerHTML -- default
	 * 	value
	 * 	multiple...
	 * }
	 * exported - to this object will be exported all marked elements (_exported attr.)
	 *
	 * @public
	 * @param  {Object} config
	 * @param  {Object} [exported]
	 * @return {NodeElement}
	 * @memberof DOM
	 */
	this.create = function(config, exported) {
		var el = document.createElement(config.el);

		Object.keys(config).forEach(function(key) {
			switch (key) {
				case "el":
					break;

				case "attrs":
					Object.keys(config.attrs).forEach(function(attr) {
						el.setAttribute(attr, config.attrs[attr]);
					});
					break;

				case "events":
					config.events.forEach(function(item) {
						el.addEventListener(item.event, item.fn);
					});
					break;

				case "child":
					config.child.forEach(function(child) {
						el.appendChild(this.create(child, exported));
					}, this);
					break;

				case "_exported":
					exported[config._exported] = el;
					break;

				case "class":
					var value = config["class"];

					if (typeof value === "string") {
						el.classList.add(value);
					}
					else if (Array.isArray(value)) {
						value.forEach(function(item) {
							el.classList.add(item);
						});
					}
					break;

				default:
					el[key] = config[key];
			}
		}, this);

		return el;
	};

	/**
	 * Get element from the document.
	 *
	 * @public
	 * @param  {String|Array} els     els = "" -> element; array [] -> {...}
	 * @param  {NodeElement} parent
	 * @return {NodeElement}
	 * @memberof DOM
	 */
	this.get = function(els, parent) {
		var output;
		parent = parent || document;

		if (typeof els === "string" && els) {
			output = parent.querySelector(els);
		}
		else if (Array.isArray(els)) {
			output = {};

			els.forEach(function(item) {
				if (typeof item === "string") {
					var name = item.replace(/^[.# ]+/g, "");

					output[name] = parent.querySelector(item);
				}
				else {
					var name = item.sel.replace(/^[.# ]+/g, "");

					output[item.name || name] = parent.querySelector(item.sel);
				}
			});
		}

		return output;
	};
});
/**
 * @namespace $location
 */
Onix.service("$location", function() {
	// ------------------------ public ----------------------------------------
	
	/**
	 * Page refresh.
	 *
	 * @public
	 * @memberof $location
	 */
	this.refresh = function() {
		window.location.reload();
	};

	/**
	 * Create a new search url.
	 * 
	 * @public
	 * @param  {Object} obj
	 * @return {String}
	 * @memberof $location
	 */
	this.createSearchURL = function(obj) {
		var newURL = [];

		if (obj) {
			// write
			var newURL = [];

			Object.keys(obj).forEach(function(key) {
				newURL.push(key + "=" + encodeURIComponent(obj[key]));
			});
		}

		if (newURL.length) {
			return "?" + newURL.join("&");
		}
		else return "";
	};

	/**
	 * Get or set new url search. obj -> set new url from obj; !obj -> create obj from search part of url
	 *
	 * @public
	 * @param  {Object} [obj]
	 * @return {Null|Object}
	 * @memberof $location
	 */
	this.search = function(obj) {
		if (obj) {
			// write
			var newURL = this.createSearchURL(obj);

			if (newURL) {
				window.location.search = newURL;
			}
		}
		else {
			// read
			var data = location.search;
			var output = {};

			if (data) {
				data = data.replace("?", "");

				data.split("&").forEach(function(item) {
					var parts = item.split("=");
					
					output[parts[0]] = decodeURIComponent(parts[1]);
				});
			}

			return output;
		}
	};

	/**
	 * Get current location
	 *
	 * @public
	 * @return {String}
	 * @memberof $location
	 */
	this.get = function() {
		return window.location.pathname;
	};
	
});
/**
 * @namespace Router
 * @description DI: $location;
 */
Onix.service("Router", [
	"$location",
function(
	$location
) {
	/**
	 * All routes
	 *
	 * @private
	 * @type {Array}
	 * @memberof Router
	 */
	this._routes = [];

	/**
	 * Otherwise route
	 *
	 * @private
	 * @type {Object}
	 * @memberof Router
	 */
	this._otherwise = null;

	/**
	 * Router init.
	 *
	 * @public
	 * @memberof Router
	 */
	this.init = function() {
	};

	/**
	 * Add route to router.
	 *
	 * @public
	 * @param  {String} url 
	 * @param  {String} page
	 * @param  {Function} [fn]
	 * @return {Himself}
	 * @memberof Router
	 */
	this.route = function(url, page, fn) {
		this._routes.push({
			url: url,
			page: page,
			fn: fn
		});

		return this;
	};

	/**
	 * Otherwise
	 *
	 * @public
	 * @param  {String} page
	 * @param  {Function} [fn]
	 * @return {Himself}
	 * @memberof Router
	 */
	this.otherwise = function(page, fn) {
		this._otherwise = {
			page: page,
			fn: fn
		};

		return this;
	};

	/**
	 * Router GO.
	 *
	 * @public
	 * @memberof Router
	 */
	this.go = function() {
		var path = $location.get();
		var find = false;
		var page = "";
		var data = {};

		this._routes.every(function(item) {
			if (path.match(new RegExp(item.url))) {
				page = item.page;
				data = item.fn();
				find = true;
				
				return false;
			}
			else {
				return true;
			}
		});

		if (!find && this._otherwise) {
			page = this._otherwise.page;
			data = this._otherwise.fn();
		}

		if (page) {
			var pageObj = Onix.getObject(page);

			if (pageObj) {
				pageObj._setConfig(data);
				pageObj._init();
			}
		}
	};
}]);
/**
 * @namespace Notify
 * @description DI: Promise;
 */
Onix.service("Notify", [
	"Promise",
function(
	Promise
) {
	/**
	 * Notification object
	 *
	 * @class _Notify
	 * @description Parent: Notify;
	 * @param {NodeElement} el
	 */
	var _Notify = function(el) {
		this._el = el;

		this._HIDE_TIMEOUT = 1500; // [ms]

		this._options = {
			"ok": "alert-success",
			"error": "alert-danger",
			"info": "alert-info"
		};

		return this;
	};

	/**
	 * Reset classess
	 *
	 * @public
	 * @memberof _Notify
	 */
	_Notify.prototype.reset = function() {
		Object.keys(this._options).forEach(function(key) {
			this._el.classList.remove(this._options[key]);
		}.bind(this));

		return this;
	};

	/**
	 * Show OK state
	 * 
	 * @public
	 * @param  {String} txt
	 * @memberof _Notify
	 */
	_Notify.prototype.ok = function(txt) {
		this._el.classList.add(this._options["ok"]);
		this._el.innerHTML = txt;

		return this;
	};

	/**
	 * Show ERROR state
	 * 
	 * @public
	 * @param  {String} txt      
	 * @memberof _Notify
	 */
	_Notify.prototype.error = function(txt) {
		this._el.classList.add(this._options["error"]);
		this._el.innerHTML = txt;

		return this;
	};

	/**
	 * Show INFO state
	 *
	 * @public
	 * @param  {String} txt      
	 * @memberof _Notify
	 */
	_Notify.prototype.info = function(txt) {
		this._el.classList.add(this._options["info"]);
		this._el.innerHTML = txt;

		return this;
	};

	/**
	 * Timeout hide.
	 *
	 * @public
	 * @return {Promise}
	 * @memberof _Notify
	 */
	_Notify.prototype.hide = function() {
		var promise = Promise.defer();

		setTimeout(function() {
			this.reset();
			
			promise.resolve();
		}.bind(this), this._HIDE_TIMEOUT);

		return promise;
	};

	/**
	 * Main public access to the notify obj.
	 *
	 * @public
	 * @param  {NodeElement} el
	 * @return {_Notify}
	 * @memberof Notify
	 */
	this.get = function(el) {
		return new _Notify(el);
	};
}]);
/**
 * @namespace Common
 * @description DI: Promise;
 */
Onix.service("Common", [
	"Promise",
function(
	Promise
) {
	/**
	 * Object copy, from source to dest
	 *
	 * @private
	 * @param  {Object} dest
	 * @param  {Object} source
	 * @memberof Common
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
	 * Get cookie by her name
	 *
	 * @public
	 * @param  {String} name
	 * @return {String}     
	 * @memberof Common
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
	 * Confirm window.
	 *
	 * @public
	 * @param  {String} txt
	 * @return {Promise}
	 * @memberof Common
	 */
	this.confirm = function(txt) {
		var promise = Promise.defer();

		if (confirm(txt)) {
			promise.resolve();
		}
		else {
			promise.reject();
		}

		return promise;
	};

	/**
	 * Create one object from arguments
	 *
	 * @public
	 * @param  {Object|Function} mainObj
	 * @param  {Object|Function|Array} a data | dependicies
	 * @param  {Object|Function} [b] data | dependicies
	 * @return {Object}
	 * @memberof Common
	 */
	this.create = function(mainObj, a, b) {
		var args = [];

		if (a && b && Array.isArray(a)) {
			// a == dependicies
			// b == data

			// arguments
			a.forEach(function(item) {
				args.push(Onix.getObject(item));
			});
		}

		// data
		args.push(mainObj);

		// data override
		args.push(b || a);

		return this.merge.apply(this, args);
	};

	/**
	 * Merge X objects into the single one.
	 *
	 * @public
	 * @return {Object}
	 * @memberof Common
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
	 * @public
	 * @param  {Object} dest
	 * @param  {Object} source
	 * @memberof Common
	 */
	this.extend = function(dest, source) {
		dest = dest || {};
		source = source || {};

		this._objCopy(dest, source);
	};

	/**
	 * Bind function arguments without scope
	 *
	 * @public
	 * @param  {Function} cb
	 * @return {Function}
	 * @memberof Common
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
	 * @public
	 * @param  {NodeArray} nodes
	 * @param  {Function} cb
	 * @param  {Object|Function}   scope
	 * @memberof Common
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
	 * Reverse for each
	 *
	 * @public
	 * @param  {Array} arr 
	 * @param {Function} cb
	 * @param {Function} scope
	 * @memberof Common
	 */
	this.reverseForEach = function (arr, cb, scope) {
		arr = arr || [];
		cb = cb || function() {};

		for (var i = arr.length - 1; i >= 0; i--) {
			cb.apply(scope || this, [arr[i], i]);
		}
	};

	/**
	 * HEX value to DEC
	 *
	 * @public
	 * @param  {String} hex
	 * @return {Number}    
	 * @memberof Common
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
	 * HEX value to RGB
	 *
	 * @public
	 * @param  {String} hexColor
	 * @return {Object}         
	 * @memberof Common
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
	 * If EXPR then function
	 *
	 * @public
	 * @param  {Boolean} expr  test if (EXPR)
	 * @param  {Function} fn
	 * @param  {Function} scope
	 * @memberof Common
	 */
	this.ift = function(expr, th, scope) {
		if (expr) {
			th.apply(scope || th, [expr]);
		}
	};
}]);
/**
 * @namespace Loader
 * @description DI: DOM;
 */
Onix.service("Loader", [
	"DOM",
function(
	DOM
) {
	/**
	 * Create Loader.
	 *
	 * @private
	 * @memberof Loader
	 */
	this._create = function() {
		this._el = DOM.create({
			el: "div",
			"class": "loader"
		});

		// insert into the body on first position
		document.body.insertBefore(this._el, document.body.firstChild);
	};
	
	/**
	 * Loader init.
	 *
	 * @public
	 * @memberof Loader
	 */
	this.init = function() {
		this._create();
	};

	/**
	 * Start loader.
	 *
	 * @public
	 * @memberof Loader
	 */
	this.start = function() {
		this._el.classList.add("start");
	};

	/**
	 * End loader.
	 *
	 * @public
	 * @memberof Loader
	 */
	this.end = function() {
		this._el.classList.remove("start");
		this._el.classList.add("end");

		setTimeout(function() {
			this._el.classList.remove("end");
			this._el.classList.add("hide");

			setTimeout(function() {
				this._el.classList.remove("hide");
			}.bind(this), 350);
		}.bind(this), 150);
	};
}]);
/**
 * @namespace Templates
 * @description DI: Common, Promise, Http;
 */
Onix.service("Templates", [
	"Common",
	"Promise",
	"Http",
function(
	Common,
	Promise,
	Http
) {
	/**
	 * Array with templates for preload before applications starts.
	 *
	 * @private
	 * @type {Array}
	 * @memberof Templates
	 */
	this._preloads = [];
	
	/**
	 * Template cache.
	 *
	 * @private
	 * @type {Object}
	 * @memberof Templates
	 */
	this._cache = {};

	/**
	 * Regular expressions
	 *
	 * @private
	 * @type {Object}
	 * @memberof Templates
	 */
	this._RE = {
		VARIABLE: /[$_a-zA-Z][$_a-zA-Z0-9]+/g,
		NUMBERS: /[-]?[0-9]+[.]?([0-9e]+)?/g,
		STRINGS: /["'][^"']+["']/g,
		JSONS: /[{][^}]+[}]/g,
		ALL: /[-]?[0-9]+[.]?([0-9e]+)?|["'][^"']+["']|[{][^}]+[}]|[$_a-zA-Z][$_a-zA-Z0-9]+/g
	};

	/**
	 * Parse a function name from the string.
	 *
	 * @private
	 * @param  {String} value
	 * @return {String}      
	 * @memberof Templates
	 */
	this._parseFnName = function(value) {
		value = value || "";

		return value.match(/[a-zA-Z0-9_]+/)[0];
	};

	/**
	 * Parse arguments from the string -> makes array from them
	 *
	 * @private
	 * @param  {String} value
	 * @param  {Object} config { event, element... }
	 * @return {Array}
	 * @memberof Templates
	 */
	this._parseArgs = function(value, config) {
		argsValue = value ? value.replace(/^[^(]+./, "").replace(/\).*$/, "") : "";

		var args = [];
		var matches = argsValue.match(this._RE.ALL);
		
		if (matches) {
			var all = [];

			matches.forEach(function(item) {
				var value;

				if (item.match(this._RE.STRINGS)) {
					value = item.substr(1, item.length - 2)
				}
				else if (item.match(this._RE.NUMBERS)) {
					value = parseFloat(item);
				}
				else if (item.match(this._RE.JSONS)) {
					value = JSON.parse(item);
				}
				else if (item.match(this._RE.VARIABLE)) {
					var variable = item.match(this._RE.VARIABLE)[0];

					if (variable == "$event") {
						value = config.event;
					}
					else if (variable == "$element") {
						value = config.el;
					}
					else {
						// todo - maybe eval with scope
						value = null;
					}
				}

				all.push({
					value: value,
					pos: argsValue.indexOf(item)
				});
			}, this);

			if (all.length) {
				all.sort(function(a, b) {
					return a.pos - b.pos
				}).forEach(function(item) {
					args.push(item.value);
				});
			}
		}

		return args;
	};

	/**
	 * Init - get all templates from the page.
	 *
	 * @public
	 * @memberof Templates
	 */
	this.init = function() {
		var promise = Promise.defer();

		Onix.element("script[type='text/template']").forEach(function(item) {
			this.add(item.id, item.innerHTML);
		}, this);

		if (this._preloads.length) {
			var all = [];

			this._preloads.forEach(function(item) {
				all.push(this.load(item.key, item.path));
			}, this);

			Promise.all(all)["finally"](function() {
				promise.resolve();
			});
		}
		else {
			promise.resolve();
		}

		return promise;
	};
	
	/**
	 * Add new item to the cachce
	 *
	 * @public
	 * @param {String} key 
	 * @param {String} data
	 * @memberof Templates
	 */
	this.add = function(key, data) {
		this._cache[key] = data;
	};

	/**
	 * Compile one template - replaces all ocurances of {} by model
	 *
	 * @public
	 * @param  {String} key  Template key/name
	 * @param  {Object} data Model
	 * @return {String}
	 * @memberof Templates
	 */
	this.compile = function(key, data) {
		var tmpl = this.get(key);
		var cnf = Onix.config("TMPL_DELIMITER");

		if (data) {
			Object.keys(data).forEach(function(key) {
				tmpl = tmpl.replace(new RegExp(cnf.LEFT + "[ ]*" + key + "[ ]*" + cnf.RIGHT, "g"), data[key]);
			});
		}

		return tmpl;
	};

	/**
	 * Get template from the cache
	 *
	 * @public
	 * @param  {String} key Template key/name
	 * @return {String}
	 * @memberof Templates
	 */
	this.get = function(key) {
		return this._cache[key] || "";
	};

	/**
	 * Bind all elements in the root element.
	 * Supports: click, change, bind
	 *
	 * @public
	 * @param  {NodeElement} root
	 * @param  {Object|Function} scope
	 * @memberof Templates
	 */
	this.bindTemplate = function(root, scope) {
		var allElements = Onix.element("*[data-click], *[data-change], *[data-bind]", root);

		if (allElements.len()) {
			var newEls = {};

			allElements.forEach(function(item) {
				var dataClick = item.getAttribute("data-click");
				var dataChange = item.getAttribute("data-change");
				var dataBind = item.getAttribute("data-bind");

				if (dataClick && this._parseFnName(dataClick) in scope) {
					item.addEventListener("click", Common.bindWithoutScope(function(event, templScope) {
						var value = this.getAttribute("data-click");
						var fnName = templScope._parseFnName(value);
						var args = templScope._parseArgs(value, {
							el: this,
							event: event
						});

						scope[fnName].apply(scope, args);
					}, this));
				}

				if (dataChange && this._parseFnName(dataChange) in scope) {
					item.addEventListener("change", Common.bindWithoutScope(function(event, templScope) {
						var value = this.getAttribute("data-change");
						var fnName = templScope._parseFnName(value);
						var args = templScope._parseArgs(value, {
							el: this,
							event: event
						});

						scope[fnName].apply(scope, args);
					}, this));
				}

				if (dataBind) {
					newEls[dataBind] = item;
				}
			}, this);

			if ("addEls" in scope && typeof scope.addEls === "function") {
				scope.addEls(newEls);
			}
		}
	};

	/**
	 * Add template for preload.
	 *
	 * @public
	 * @param  {String} key 
	 * @param  {String} path
	 * @memberof Templates
	 */
	this.preload = function(key, path) {
		this._preloads.push({
			key: key,
			path: path
		});
	};

	/**
	 * Load template from the path.
	 *
	 * @public
	 * @param  {String} key
	 * @param  {String} path
	 * @return {Promise}
	 * @memberof Templates
	 */
	this.load = function(key, path) {
		var promise = Promise.defer();

		Http.createRequest({
			url: path
		}).then(function(data) {
			this.add(key, data.data);

			promise.resolve();
		}.bind(this), function(data) {
			promise.reject();
		});

		return promise;
	};
}]);
/**
 * @namespace Http
 * @description DI: Promise;
 */
Onix.service("Http", [
	"Promise",
function(
	Promise
) {
	/**
	 * https://developer.mozilla.org/en-US/docs/Web/Guide/Using_FormData_Objects
	 * Prepare post data
	 *
	 * @private
	 * @param  {Object|Array} data { name, value }
	 * @return {FormData}
	 * @memberof Http
	 */
	this._preparePostData = function(data) {
		var formData = new FormData();

		if (data) {
			if (Array.isArray(data)) {
				data.forEach(function(item) {
					formData.append(item.name, item.value);
				});
			}
			else {
				Object.keys(data).forEach(function(key) {
					formData.append(key, data[key]);
				});
			}
		}

		return formData;
	};

	/**
	 * Update URL by get data.
	 *
	 * @private
	 * @param  {String} url
	 * @param  {Array} data { name, value }
	 * @return {String}    
	 * @memberof Http
	 */
	this._updateURL = function(url, data) {
		if (data) {
			var add = [];

			if (Array.isArray(data)) {
				data.forEach(function(item) {
					add.push(item.name + "=" + encodeURIComponent(item.value));
				});

				url += (url.indexOf("?") == -1 ? "?" : "") + add.join("&");
			}
		}

		return url;
	};

	/**
	 * Request types
	 *
	 * @public
	 * @const
	 * @memberof Http
	 */
	this.POST_TYPES = {
		JSON: 1,
		FORM_DATA: 2
	};

	/**
	 * Http methods.
	 *
	 * @public
	 * @const
	 * @memberof Http
	 */
	this.METHOD = {
		POST: "POST",
		GET: "GET",
		DELETE: "DELETE",
		PATCH: "PATCH"
	};

	/**
	 * Create new XHR request.
	 *
	 * @public
	 * @param  {Object} config { url, method, [getData], [postData], [headers {type, value}] }
	 * @return {Promise}
	 * @memberof Http
	 */
	this.createRequest = function(config) {
		var promise = Promise.defer();
		var request = new XMLHttpRequest();

		config = config || {};

		var method = config.method || this.METHOD.GET;
		var url = config.url || "";

		if (!url) {
			promise.reject();
			return promise;
		}

		url = this._updateURL(url, config.getData);

		request.onerror = function () { promise.reject(); };
		request.open(method, url, true);
		request.onreadystatechange = function() {
			if (request.readyState == 4) {
				var responseData = request.responseText || "";
				var responseType = request.getResponseHeader("Content-Type");
				var promiseData = null;

				if (responseType == "application/json") {
					promiseData = responseData.length ? JSON.parse(responseData) : {};
				}
				else {
					promiseData = responseData;
				}

				// 200 ok
				// 201 created
				// 204 succesfully deleted
				// 403 unautorized
				promise[request.status >= 200 && request.status < 300 ? "resolve" : "reject"]({
					status: request.status,
					data: promiseData,
					url: url,
					method: method
				});
			}
		};

		try {
			// add headers
			var headers = config.headers;
			if (headers && Array.isArray(headers)) {
				headers.forEach(function(header) {
					request.setRequestHeader(header.type, header.value);
				});
			}

			if (method == this.METHOD.GET) {
				request.setRequestHeader('Accept', 'application/json');
			}

			var type = config.postType || this.POST_TYPES.JSON;

			if (config.postData && type == this.POST_TYPES.JSON) {
				request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
				request.send(JSON.stringify(config.postData));
			}
			else if (config.postData && type == this.POST_TYPES.FORM_DATA) {
				request.send(this._preparePostData(config.postData));
			}
			else {
				request.send();
			}
		}
		catch (err) {
			promise.reject();
		}

		return promise;
	};
}]);
/**
 * @namespace i18n
 * @description DI: Http, Promise;
 */
Onix.service("i18n", [
	"Http",
	"Promise",
function(
	Http,
	Promise
) {
	/**
	 * All langs data.
	 *
	 * @private
	 * @type {Object}
	 * @memberof i18n
	 */
	this._langs = {};

	/**
	 * Current language
	 *
	 * @private
	 * @type {String}
	 * @memberof i18n
	 */
	this._currentLang = "";

	/**
	 * Add new language
	 *
	 * @public
	 * @param {String} lang Language key
	 * @param {Object} data
	 * @memberof i18n
	 */
	this.addLanguage = function(lang, data) {
		this._langs[lang] = data;
	};

	/**
	 * Set new language by his key.
	 *
	 * @public
	 * @param {String} lang Language key
	 * @memberof i18n
	 */
	this.setLanguage = function(lang) {
		this._currentLang = lang;
	};

	/**
	 * Get text function. Translate for the current language and the key.
	 *
	 * @public
	 * @param  {String} key
	 * @return {String}    
	 */
	this._ = function(key) {
		key = key || "";
		var lObj = this._langs[this._currentLang];
		var translate = "";

		if (lObj) {
			var parts = key.split(".");
			var len = parts.length;

			parts.every(function(item, ind) {
				if (item in lObj) {
					lObj = lObj[item];

					if (ind == len - 1) {
						translate = lObj;
						return false;
					}
				}
				else return false;

				// go on
				return true;
			});
		}

		return translate;
	};

	/**
	 * Load language from the file.
	 *
	 * @public
	 * @param  {String} lang Language key
	 * @param  {String} url  Path to the file
	 * @return {Promise}
	 * @memberof i18n
	 */
	this.loadLanguage = function(lang, url) {
		var promise = Promise.defer();

		Http.createRequest({
			url: url
		}).then(function(data) {
			this.addLanguage(lang, data.data);
			promise.resolve();
		}.bind(this), function(data) {
			promise.resolve();
		});

		return promise;
	};
}]);
Onix.factory("Page", [
	"DOM",
	"Templates",
	"Common",
function(
	DOM,
	Templates,
	Common
) {
	/**
	 * @interface _Page
	 * @description Parent: Page;
	 */
	var _Page = {
		/**
		 * Set config.
		 *
		 * @private
		 * @param {Object} config
		 * @memberof _Page
		 */
		_setConfig: function(config) {
			this._config = config;
		},

		/**
		 * Init page - called from App; runs _afterInit
		 * 
		 * @private
		 * @memberof _Page
		 */
		_init: function() {
			var config = this._getConfig();
			this._els = {};

			// each page contanins only one detail div
			var rootEl = DOM.get(Onix.config("DETAIL_SEL"));

			if (config.els) {
				this._els = DOM.get(config.els, rootEl);
			}

			Templates.bindTemplate(rootEl, this);

			this._afterInit();
		},

		/**
		 * Get page element by his name.
		 *
		 * @private
		 * @param  {String} name
		 * @return {NodeElemetn}     
		 * @memberof _Page
		 */
		_getEl: function(name) {
			return this._els[name];
		},

		/**
		 * Get page config.
		 *
		 * @private
		 * @return {Object}
		 * @memberof _Page
		 */
		_getConfig: function() {
			return this._config || {};
		},

		/**
		 * Get page data object.
		 *
		 * @private
		 * @return {Object}
		 * @memberof _Page
		 */
		_getPageData: function() {
			return this._config && this._config.js_data ? this._config.js_data : {};
		},

		/**
		 * After init
		 *
		 * @private
		 * @abstract
		 * @memberof _Page
		 */
		_afterInit: function() {

		},

		/**
		 * Add new els to this._els; this function can be called from Templates
		 *
		 * @public
		 * @param {Object} newEls
		 * @memberof _Page
		 */
		addEls: function(newEls) {
			newEls = newEls || {};

			Object.keys(newEls).forEach(function(key) {
				this._els[key] = newEls[key];
			}, this);
		}
	};

	/**
 	 * @namespace Page
 	 * @description DI: DOM, Templates, Common;
 	 */
	return {
		/**
		 * Create a new page
		 *
		 * @public
		 * @param  {Object|Function} a page data | dependicies
		 * @param  {Object|Function} [b] page data | dependicies
		 * @return {_Page}
		 * @memberof Page
		 */
		create: function(a, b) {
			return Common.create(_Page, a, b);
		}
	};
}]);
Onix.factory("Snippet", [
	"Templates",
	"Common",
function(
	Templates,
	Common
) {
	/**
	 * @interface _Snippet
	 * @description Parent: Snippet;
	 */
	var _Snippet = {
		/**
		 * Get snippet config.
		 *
		 * @private
		 * @return {Object}
		 * @memberof _Snippet
		 */
		_getConfig: function() {
			return this._config;
		},

		/**
		 * Get snippet element.
		 *
		 * @private
		 * @param  {String} name
		 * @return {NodeElement}
		 * @memberof _Snippet
		 */
		_getEl: function(name) {
			return this._els[name];
		},

		/**
		 * Get snippet parent.
		 *
		 * @private
		 * @return {NodeElement}
		 * @memberof _Snippet
		 */
		_getParent: function() {
			return this._parent;
		},

		/**
		 * Abstract method.
		 *
		 * @private
		 * @param  {Object} config
		 * @memberof _Snippet
		 */
		_create: function(config) {
			return null;
		},

		/**
		 * Set snippet name.
		 *
		 * @private
		 * @param {String} name
		 * @memberof _Snippet
		 */
		_setName: function(name) {
			this._name = name;
		},

		/**
		 * Setup
		 *
		 * @private
		 * @abstract
		 * @memberof _Snippet
		 */
		_setup: function() {

		},

		/**
		 * Active
		 *
		 * @private
		 * @abstract
		 * @memberof _Snippet
		 */
		_activate: function() {

		},

		/**
		 * Deactivate
		 *
		 * @private
		 * @abstract
		 * @memberof _Snippet
		 */
		_deactivate: function() {

		},

		/**
		 * Init snippet
		 *
		 * @public
		 * @param  {Object} config
		 * @param  {Object} parent parent page
		 * @return {NodeElement} root el
		 * @memberof _Snippet
		 */
		init: function(config, parent) {
			this._config = config || {};
			this._parent = parent;
			this._els = {};
			this._name = "";
			this._root = this._create(config);

			return this._root;
		},

		/**
		 * Add new els to this._els; this function can be called from Templates
		 *
		 * @public
		 * @param {Object} newEls { key, value - node element}
		 * @memberof _Snippet
		 */
		addEls: function(newEls) {
			newEls = newEls || {};

			Object.keys(newEls).forEach(function(key) {
				this._els[key] = newEls[key];
			}, this);
		},

		/**
		 * Setup snippet - is called after init. Runs _setup()
		 *
		 * @public
		 * @memberof _Snippet
		 */
		setup: function() {
			Templates.bindTemplate(this._root, this);
			
			this._setup();
		},

		/**
		 * Activate snippet - run _activate()
		 *
		 * @public
		 * @memberof _Snippet
		 */
		activate: function() {
			this._activate();
		},

		/**
		 * Deactivate snippet - run _deactivate()
		 *
		 * @public
		 * @memberof _Snippet
		 */
		deactivate: function() {
			this._deactivate();
		},

		/**
		 * Get snippet name.
		 *
		 * @public
		 * @return {String}
		 * @memberof _Snippet
		 */
		getName: function() {
			return this._name;
		}
	};

	/**
 	 * @namespace Snippet
 	 * @description DI: Templates, Common;
 	 */
	return {
		/**
		 * Create a new snippet
		 *
		 * @public
		 * @param  {Object|Function} a snippet data | dependicies
		 * @param  {Object|Function} [b] snippet data | dependicies
		 * @return {_Snippet}
		 * @memberof Snippet
		 */
		create: function(a, b) {
			return Common.create(_Snippet, a, b);
		}
	};
}]);
/**
 * @namespace Select
 * @description DI: Common, Events; Returns class _Select;
 */
Onix.factory("Select", [
	"Common",
	"Events",
function(
	Common,
	Events
) {
	/**
	 * Main class
	 *
	 * @class _Select
	 * @description Parent: Select;
	 * @param {NodeElement} el Where element has class "dropdown"
	 */
	var _Select = function(el) {
		// extend our class
		Common.extend(this, Events);

		this._CONST = {
			CAPTION_SEL: ".dropdown-toggle",
			OPTIONS_SEL: ".dropdown-menu a",
			OPEN_DROPDOWN_SEL: ".dropdown.open",
			OPEN_CLASS: "open",
			ACTIVE_CLASS: "active"
		};

		this._el = el;

		this._bind(el);
	};

	/**
	 * Bind clicks on the select.
	 *
	 * @private
	 * @param {NodeElement} el Where element has class "dropdown"
	 * @memberof _Select
	 */
	_Select.prototype._bind = function(el) {
		var captionEl = el.querySelector(this._CONST.CAPTION_SEL);
		var con = this._CONST;

		// click on the caption
		captionEl.addEventListener("click", function(e) {
			e.stopPropagation();

			var isOpen = el.classList.contains(con.OPEN_CLASS);

			var removeAllOpened = function() {
				// remove all
				Onix.element(con.OPEN_DROPDOWN_SEL).forEach(function(item) {
					item.classList.remove("open");
				});
			};

			removeAllOpened();

			if (isOpen) {
				// outside click
				window.removeEventListener("click");
			}
			else {
				// outside click
				window.addEventListener("click", function(e) {
					removeAllOpened();
					window.removeEventListener("click");
				});

				el.classList.add(con.OPEN_CLASS);
			}
		});

		Onix.element(this._CONST.OPTIONS_SEL, el).forEach(function(option) {
			option.addEventListener("click", Common.bindWithoutScope(function(e, scope) {
				e.stopPropagation();

				if (!this.parentNode.classList.contains(con.ACTIVE_CLASS)) {
					// remove previously selected
					this.parentNode.parentNode.querySelector("." + con.ACTIVE_CLASS).classList.remove(con.ACTIVE_CLASS);

					// add to the current
					this.parentNode.classList.add(con.ACTIVE_CLASS);

					el.classList.remove(con.OPEN_CLASS);

					// trigger click
					var value = this.getAttribute("data-value") || "";
					scope.trigger("change", value);
				}
			}, this));
		}, this);
	};

	return _Select;
}]);
