Onix = (function() {
	var Onix = {
		// ------------------------ private ---------------------------------------
		
		/**
		 * Framework info.
		 * @type {String}
		 */
		_VERSION: "1.0.0",
		_DATE: "4. 5. 2015",

		/**
		 * All factories, constants...
		 * @type {Object}
		 */
		_objects: {},

		/**
		 * Onix configuration
		 * @type {Object}
		 */
		_config: {},

		/**
		 * All run functions
		 * @type {Array}
		 */
		_runs: [],

		/**
		 * App object types
		 * @type {Object}
		 */
		_TYPES: {
			SERVICE: 1,
			FACTORY: 2
		},

		/**
		 * APP init - DOM load.
		 */
		_init: function() {
			document.addEventListener("DOMContentLoaded", function() {
				var di = this._di(this._run);

				di.fn.apply(this, di.args);
			}.bind(this));
		},

		/**
		 * Dependency injection.
		 * @param  {Array|Function} param
		 * @return {Object}      
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
		 * @param {String} name
		 * @param {Enum} type
		 * @param {Array|Function} param
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
				Templates.init();
				
				// router go
				Router.go();
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

		// ------------------------ public ----------------------------------------

		/**
		 * Add a new service
		 * @param  {String} name
		 * @param  {Array|Function} param With DI
		 */
		service: function(name, param) {
			this._addObject(name, this._TYPES.SERVICE, param);
		},

		/**
		 * Add a new factory
		 * @param  {String} name
		 * @param  {Array|Function} param With DI
		 */
		factory: function(name, param) {
			this._addObject(name, this._TYPES.FACTORY, param);
		},

		/**
		 * Add a new run
		 * @param  {Array|Function} param With DI
		 */
		run: function(param) {
			this._runs.push(param);
		},

		/**
		 * Add new constant
		 * @param  {String} name
		 * @param  {Object} param
		 */
		constant: function(name, obj) {
			this._objects[name] = obj;
		},

		/**
		 * Get/Set configuration
		 * @param  {String|Object} param
		 * @return  {Object}
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
		 * @param  {String} name
		 * @return {Function|Object}
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
Onix.config({
	/**
	 * Localization
	 * @type {Object}
	 */
	LOCALIZATION: {
		LANG: "cs",
		PATH: "/js/locale/cs.json"
	},

	/**
	 * Resource urls
	 * @type {Object}
	 */
	URLS: {
		HOME: "/api/home/"
	},

	/**
	 * Detail page selector
	 * @type {String}
	 */
	DETAIL_SEL: ".detail"
});
Onix.factory("Events", function() {
	return {
		// ------------------------ private ---------------------------------------
		
		/**
		 * All events. { name: name, event: function }
		 * @type {Array}
		 */
		_allEvents: [],

		/**
		 * Get all events by his name.
		 * @param  {String} name 
		 * @return {Array}      
		 */
		_getEvents: function (name) {
			var events = [];

			this._allEvents.forEach(function(item, ind) {
				if (name == item.name) {
					events.push({
						pos: ind,
						fn: item.fn,
						scope: item.scope
					});
				}
			});

			return events;
		},

		// ------------------------ public ----------------------------------------
		
		/**
		 * Add new event to the stack.
		 * @param  {String}   name 
		 * @param  {Function} fn   
		 * @param  {Object|Function}   scope
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
		 * @param  {String}   name 
		 * @param  {Function} [fn]  
		 */
		off: function (name, fn) {
			var events = this._getEvents(name);

			for (var i = events.length - 1; i >= 0; i--) {
				if (!fn || fn && events[i].fn == fn) {
					this._allEvents.splice(events[i].pos, 1);
				}
			}
		},

		/**
		 * Trigger event with arguments 0..n
		 * @param  {String} name
		 */
		trigger: function (name) {
			var events = this._getEvents(name);
			var args = arguments;

			events.forEach(function(event) {
				var newArgs = Array.prototype.slice.call(args, 0);
				newArgs.shift();

				event.fn.apply(event.scope || this, newArgs);
			}, this);
		}
	};
});
Onix.factory("Promise", function() {
	// ------------------------ private ---------------------------------------
	
	var Promise = function() {
		/**
		 * Promise states
		 * @type {Object}
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
	 * @param  {Boolean} isError
	 */
	Promise.prototype._resolveFuncs = function(isError) {
		this._funcs.forEach(function(fnItem) {
			if ((fnItem.isError && isError) || (!fnItem.isError && !isError)) {
				(fnItem.fn)(this._finishData);
			}
		}, this);
		
		this._funcs.length = 0;
		this._state = isError ? this._E_STATES.REJECTED : this._E_STATES.RESOLVED;
	};

	/**
	 * Is promise already finished?
	 * @return {Boolean}
	 */
	Promise.prototype._isAlreadyFinished = function() {
		if (this._state != this._E_STATES.IDLE) {
			this._resolveFuncs(this._state == this._E_STATES.REJECTED);
		}
	};

	// ------------------------ public ----------------------------------------

	/**
	 * Resolve promise using obj.
	 * @param  {Object} obj
	 */
	Promise.prototype.resolve = function(obj) {
		this._finishData = obj;
		this._resolveFuncs(false);
	};

	/**
	 * Reject promise using obj.
	 * @param  {Object} obj
	 */
	Promise.prototype.reject = function(obj) {
		this._finishData = obj;
		this._resolveFuncs(true);
	};

	/**
	 * After promise resolve/reject call then (okFn, errorFn)
	 * @param {Function} [cbOk]
	 * @param {Function} [cbError]
	 * @return {Promise}
	 */
	Promise.prototype.then = function(cbOk, cbError) {
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
	 * @param  {Function}   cbOk
	 * @return {Promise}
	 */
	Promise.prototype.done = function(cbOk) {
		this._funcs.push({
			fn: cbOk,
			isError: false
		});

		this._isAlreadyFinished();

		return this;
	};

	/**
	 * After promise reject call then cbError
	 * @param  {Function}   cbError
	 * @return {Promise}
	 */
	Promise.prototype.error = function(cbError) {
		this._funcs.push({
			fn: cbError,
			isError: true
		});

		this._isAlreadyFinished();

		return this;
	};

	return Promise;
});
Onix.factory("MyQuery", function() {
	// ------------------------ private ---------------------------------------
	
	/**
	 * Cover function
	 * @param {String|NodeElement|Array} value
	 * @param {NodeElement} [parent]
	 * @return {Himself}
	 */
	var MyQuery = function(value, parent) {
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
	 * @param  {Function} cb
	 * @param  {Function} scope
	 */
	MyQuery.prototype._operation = function(cb, scope) {
		for (var i = 0; i < this._els.length; i++) {
			cb.apply(scope || cb, [this._els[i], i]);
		}
	};

	/**
	 * Set or get all - cover function.
	 * @param  {String} newValue
	 * @param  {String} attr
	 */
	MyQuery.prototype._setGetAll = function(newValue, attr) {
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
	 * @param  {Number} [ind]
	 * @return {NodeElement|Null}
	 */
	MyQuery.prototype.getEl = function(ind) {
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
	 * @param  {String} name 
	 * @param  {String} [newValue]
	 * @return {Himself|String|Array}
	 */
	MyQuery.prototype.attr = function(name, newValue) {
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
	 * @param  {String} [newValue]
	 * @return {Himself|String}
	 */
	MyQuery.prototype.src = function(newValue) {
		return this._setGetAll(newValue, "src");
	};

	/**
	 * Hide element
	 * @return {Himself}
	 */
	MyQuery.prototype.hide = function() {
		this._operation(function(item) {
			item.style.display = "none";
		});

		return this;
	};

	/**
	 * Show element
	 * @param  {String} [displayStyle]
	 * @return {Himself}
	 */
	MyQuery.prototype.show = function(displayStyle) {
		this._operation(function(item) {
			item.style.display = displayStyle || "block";
		});

		return this;
	};

	/**
	 * Get or set value
	 * @param  {String} [newValue]
	 * @return {Himself|String}
	 */
	MyQuery.prototype.val = function(newValue) {
		return this._setGetAll(newValue, "value");
	};

	/**
	 * Get or set HTML
	 * @param  {String} [newValue]
	 * @return {Himself|String}
	 */
	MyQuery.prototype.html = function(newValue) {
		return this._setGetAll(newValue, "innerHTML");
	};

	/**
	 * Append another element to this one
	 * TODO: cannot use on n elements
	 * @param  {NodeElement} child
	 * @return {Himself}
	 */
	MyQuery.prototype.append = function(child) {
		this._operation(function(item) {
			item.appendChild(child);
		});

		return this;
	};

	/**
	 * Add css class
	 * @param  {String} className
	 * @return {Himself}
	 */
	MyQuery.prototype.addClass = function(className) {
		this._operation(function(item) {
			item.classList.add(className);
		});

		return this;
	};

	/**
	 * Remove css class
	 * @param  {String} className
	 * @return {Himself}
	 */
	MyQuery.prototype.removeClass = function(className) {
		this._operation(function(item) {
			item.classList.remove(className);
		});

		return this;
	};

	/**
	 * Toggle css class
	 * @param  {String} className
	 * @return {Himself}
	 */
	MyQuery.prototype.toggleClass = function(className) {
		this._operation(function(item) {
			item.classList.toggle(className);
		});

		return this;
	};

	/**
	 * Get width
	 * @return {Number}
	 */
	MyQuery.prototype.width = function() {
		var width = 0;

		this._operation(function(item) {
			width += item.offsetWidth;
		});

		return width;
	};

	/**
	 * Get height
	 * @return {Number}
	 */
	MyQuery.prototype.height = function() {
		var height = 0;

		this._operation(function(item) {
			height += item.offsetHeight;
		});

		return height;
	};

	/**
	 * Click event
	 * @param  {Function} cb
	 * @param  {Function} scope
	 * @return {Himself}
	 */
	MyQuery.prototype.click = function(cb, scope) {
		this._operation(function(item) {
			item.addEventListener("click", function(event) {
				cb.apply(scope || cb, [event, item]);
			});
		});

		return this;
	};

	/**
	 * Change event
	 * @param  {Function} cb
	 * @param  {Function} scope
	 * @return {Himself}
	 */
	MyQuery.prototype.change = function(cb, scope) {
		this._operation(function(item) {
			item.addEventListener("change", function(event) {
				cb.apply(scope || cb, [event, item]);
			});
		});

		return this;
	};

	/**
	 * Foreach
	 * @param  {Function} cb
	 * @param  {Function} scope
	 * @return {Himself}
	 */
	MyQuery.prototype.forEach = function(cb, scope) {
		this._operation(function(item, ind) {
			cb.apply(scope || cb, [item, ind]);
		});

		return this;
	};

	/**
	 * Remove element
	 * @return {Himself}
	 */
	MyQuery.prototype.remove = function() {
		this._operation(function(item) {
			item.parentNode.removeChild(item);
		});

		return this;
	};

	/**
	 * Prepend element
	 * @param  {NodeElement} child
	 * @return {Himself}
	 */
	MyQuery.prototype.prepend = function(child) {
		this._operation(function(item) {
			item.parentNode.insertBefore(child, item);
		});

		return this;
	};

	/**
	 * Get all elements length
	 * @return {Number}
	 */
	MyQuery.prototype.len = function() {
		return this._els.length;
	};

	// ------------------------ public ---------------------------------------

	return {
		 /**
		 * Main cover function.
		 * @param  {String|NodeElement|Array} value
		 * @param {NodeElement} [parent]
		 * @return {MyQuery}
		 */
		get: function(value, parent) {
			return new MyQuery(value, parent);
		}
	};
});
Onix.service("DOM", function() {
	// ------------------------ public ----------------------------------------
	
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
	 * @param  {Object} config
	 * @param  {Object} [exported]
	 * @return {NodeElement}
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
	 * @param  {String|Array} els     els = "" -> element; array [] -> {...}
	 * @param  {NodeElement} parent
	 * @return {NodeElement}
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
Onix.service("$location", function() {
	// ------------------------ public ----------------------------------------
	
	/**
	 * Page refresh.
	 */
	this.refresh = function() {
		window.location.reload();
	};

	/**
	 * Create a new search url.
	 * @param  {Object} obj
	 * @return {String}    
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
	 * @param  {Object} [obj]
	 * @return {Null|Object}
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
	 * @return {String}
	 */
	this.get = function() {
		return window.location.pathname;
	};
	
});
Onix.service("Router", [
	"$location",
function(
	$location
) {
	// ------------------------ private ---------------------------------------
	
	/**
	 * All routes
	 * @type {Array}
	 */
	this._routes = [];

	/**
	 * Otherwise route
	 * @type {Object}
	 */
	this._otherwise = null;

	// ------------------------ public ----------------------------------------
	
	/**
	 * Router init.
	 */
	this.init = function() {
	};

	/**
	 * Add route to router.
	 * @param  {String} url 
	 * @param  {String} page
	 * @param  {Function} [fn]
	 * @return {Himself}
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
	 * @param  {String} page
	 * @param  {Function} [fn]
	 * @return {Himself}
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
Onix.service("Notify", [
	"Promise",
function(
	Promise
) {
	// ------------------------ private ----------------------------------------
	
	/**
	 * Notification object
	 * @param {NodeElement} el
	 */
	var Notify = function(el) {
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
	 */
	Notify.prototype.reset = function() {
		Object.keys(this._options).forEach(function(key) {
			this._el.classList.remove(this._options[key]);
		}.bind(this));

		return this;
	};

	/**
	 * Show OK state
	 * @param  {String} txt
	 */
	Notify.prototype.ok = function(txt) {
		this._el.classList.add(this._options["ok"]);
		this._el.innerHTML = txt;

		return this;
	};

	/**
	 * Show ERROR state
	 * @param  {String} txt      
	 */
	Notify.prototype.error = function(txt) {
		this._el.classList.add(this._options["error"]);
		this._el.innerHTML = txt;

		return this;
	};

	/**
	 * Show INFO state
	 * @param  {String} txt      
	 */
	Notify.prototype.info = function(txt) {
		this._el.classList.add(this._options["info"]);
		this._el.innerHTML = txt;

		return this;
	};

	/**
	 * Timeout hide.
	 * @return {Promise}
	 */
	Notify.prototype.hide = function() {
		var promise = new Promise();

		setTimeout(function() {
			this.reset();
			
			promise.resolve();
		}.bind(this), this._HIDE_TIMEOUT);

		return promise;
	};

	// ------------------------ public ----------------------------------------
	
	/**
	 * Main public access to the notify obj.
	 * @param  {NodeElement} el
	 * @return {Notify}
	 */
	this.get = function(el) {
		return new Notify(el);
	};
}]);
Onix.service("Common", [
	"Promise",
function(
	Promise
) {
	// ------------------------ private ---------------------------------------
	
	/**
	 * Object copy, from source to dest
	 * @param  {Object} dest
	 * @param  {Object} source
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

	// ------------------------ public ----------------------------------------
	
	/**
	 * Get cookie by her name
	 * @param  {String} name
	 * @return {String}     
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
	 * @param  {String} txt
	 * @return {Promise}
	 */
	this.confirm = function(txt) {
		var promise = new Promise();

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
	 * @param  {Object|Function} mainObj
	 * @param  {Object|Function|Array} a data | dependicies
	 * @param  {Object|Function} [b] data | dependicies
	 * @return {Object}
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
	 * @return {Object}
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
	 * @param  {Object} dest
	 * @param  {Object} source
	 */
	this.extend = function(dest, source) {
		dest = dest || {};
		source = source || {};

		this._objCopy(dest, source);
	};

	/**
	 * Bind function arguments without scope
	 * @param  {Function} cb
	 * @return {Function}
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
	 * @param  {NodeArray} nodes
	 * @param  {Function} cb
	 * @param  {Object|Function}   scope
	 */
	this.nodesForEach = function(nodes, cb, scope) {
		cb = cb || function() {};
		
		if (nodes) {
			for (var i = 0; i < nodes.length; i++) {
				cb.apply(scope || cb, [nodes[i], i]);
			}
		}
	};

	/**
	 * HEX value to DEC
	 * @param  {String} hex
	 * @return {Number}    
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
	 * @param  {String} hexColor
	 * @return {Object}         
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
}]);
Onix.service("Loader", [
	"DOM",
function(
	DOM
) {
	// ------------------------ private ---------------------------------------
	
	/**
	 * Create Loader.
	 */
	this._create = function() {
		this._el = DOM.create({
			el: "div",
			"class": "loader"
		});

		// insert into the body on first position
		document.body.insertBefore(this._el, document.body.firstChild);
	};

	// ------------------------ public ----------------------------------------
	
	/**
	 * Loader init.
	 */
	this.init = function() {
		this._create();
	};

	/**
	 * Start loader.
	 */
	this.start = function() {
		this._el.classList.add("start");
	};

	/**
	 * End loader.
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
Onix.service("Templates", [
	"Common",
function(
	Common
) {
	// ------------------------ private ---------------------------------------
	
	/**
	 * Template cache.
	 * @type {Object}
	 */
	this._cache = {};

	/**
	 * Regular expressions
	 * @type {Object}
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
	 * @param  {String} value
	 * @return {String}      
	 */
	this._parseFnName = function(value) {
		value = value || "";

		return value.match(/[a-zA-Z0-9_]+/)[0];
	};

	/**
	 * Parse arguments from the string -> makes array from them
	 * @param  {String} value
	 * @param  {Object} config { event, element... }
	 * @return {Array}
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

	// ------------------------ public ----------------------------------------
	
	/**
	 * Init - get all templates from the page.
	 */
	this.init = function() {
		Onix.element("script[type='text/template']").forEach(function(item) {
			this.add(item.id, item.innerHTML);
		}, this);
	};
	
	/**
	 * Add new item to the cachce
	 * @param {String} key 
	 * @param {String} data
	 */
	this.add = function(key, data) {
		this._cache[key] = data;
	};

	/**
	 * Compile one template - replaces all ocurances of {} by model
	 * @param  {String} key  Template key/name
	 * @param  {Object} data Model
	 * @return {String}
	 */
	this.compile = function(key, data) {
		var tmpl = this.get(key);

		if (data) {
			Object.keys(data).forEach(function(key) {
				tmpl = tmpl.replace(new RegExp("{" + key + "}", "g"), data[key]);
			});
		}

		return tmpl;
	};

	/**
	 * Get template from the cache
	 * @param  {String} key Template key/name
	 * @return {String}
	 */
	this.get = function(key) {
		return this._cache[key] || "";
	};

	/**
	 * Bind all elements in the root element.
	 * Supports: click, change, bind
	 * @param  {NodeElement} root
	 * @param  {Object|Function} scope
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
}]);
Onix.service("Http", [
	"Promise",
function(
	Promise
) {
	// ------------------------ private ---------------------------------------
	
	/**
	 * https://developer.mozilla.org/en-US/docs/Web/Guide/Using_FormData_Objects
	 * Prepare post data
	 * @param  {Object|Array} data { name, value }
	 * @return {FormData}
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
	 * @param  {String} url
	 * @param  {Array} data { name, value }
	 * @return {String}    
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

	// ------------------------ public ----------------------------------------
	
	/**
	 * Request types
	 * @type {Object}
	 */
	this.POST_TYPES = {
		JSON: 1,
		FORM_DATA: 2
	};

	/**
	 * Http methods.
	 * @type {Object}
	 */
	this.METHOD = {
		POST: "POST",
		GET: "GET",
		DELETE: "DELETE",
		PATCH: "PATCH"
	};

	/**
	 * Create new XHR request.
	 * @param  {Object} config { url, method, [getData], [postData], [headers {type, value}] }
	 * @return {Promise}
	 */
	this.createRequest = function(config) {
		var promise = new Promise();
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
Onix.service("i18n", [
	"Http",
	"Promise",
function(
	Http,
	Promise
) {
	// ------------------------ private ---------------------------------------
	
	/**
	 * All langs data.
	 * @type {Object}
	 */
	this._langs = {};

	/**
	 * Current language
	 * @type {String}
	 */
	this._currentLang = "";

	// ------------------------ public ----------------------------------------

	/**
	 * Add new language
	 * @param {String} lang Language key
	 * @param {Object} data
	 */
	this.addLanguage = function(lang, data) {
		this._langs[lang] = data;
	};

	/**
	 * Set new language by his key.
	 * @param {String} lang Language key
	 */
	this.setLanguage = function(lang) {
		this._currentLang = lang;
	};

	/**
	 * Get text function. Translate for the current language and the key.
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
	 * @param  {String} lang Language key
	 * @param  {String} url  Path to the file
	 * @return {Promise}
	 */
	this.loadLanguage = function(lang, url) {
		var promise = new Promise();

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
	// ------------------------ private ---------------------------------------
	
	var Page = {
		/**
		 * Set config.
		 * @param {Object} config
		 */
		_setConfig: function(config) {
			this._config = config;
		},

		/**
		 * Init page - called from App; runs _afterInit
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
		 * @param  {String} name
		 * @return {NodeElemetn}     
		 */
		_getEl: function(name) {
			return this._els[name];
		},

		/**
		 * Get page config.
		 * @return {Object}
		 */
		_getConfig: function() {
			return this._config || {};
		},

		/**
		 * Get page data object.
		 * @return {Object}
		 */
		_getPageData: function() {
			return this._config && this._config.js_data ? this._config.js_data : {};
		},

		/**
		 * Abstract method
		 */
		_afterInit: function() {

		},

		// ------------------------ public ----------------------------------------

		/**
		 * Add new els to this._els; this function can be called from Templates
		 * @param {Object} newEls
		 */
		addEls: function(newEls) {
			newEls = newEls || {};

			Object.keys(newEls).forEach(function(key) {
				this._els[key] = newEls[key];
			}, this);
		}
	};

	// --- public ----
	
	return {
		/**
		 * Create new page
		 * @param  {Object|Function} a page data | dependicies
		 * @param  {Object|Function} [b] page data | dependicies
		 * @return {Page}
		 */
		create: function(a, b) {
			return Common.create(Page, a, b);
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
	// ------------------------ private ---------------------------------------
	
	var Snippet = {
		/**
		 * Get snippet config.
		 * @return {Object}
		 */
		_getConfig: function() {
			return this._config;
		},

		/**
		 * Get snippet element.
		 * @param  {String} name
		 * @return {NodeElement}
		 */
		_getEl: function(name) {
			return this._els[name];
		},

		/**
		 * Get snippet parent.
		 * @return {NodeElement}
		 */
		_getParent: function() {
			return this._parent;
		},

		/**
		 * Abstract method.
		 * @param  {Object} config
		 */
		_create: function(config) {
			return null;
		},

		/**
		 * Set snippet name.
		 * @param {String} name
		 */
		_setName: function(name) {
			this._name = name;
		},

		/**
		 * Abstract method.
		 */
		_setup: function() {

		},

		/**
		 * Abstract method.
		 */
		_activate: function() {

		},

		/**
		 * Abstract method.
		 */
		_deactivate: function() {

		},

		// ------------------------ public ----------------------------------------
		
		/**
		 * Init snippet
		 * @param  {Object} config
		 * @param  {Object} parent parent page
		 * @return {NodeElement} root el
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
		 * @param {Object} newEls { key, value - node element}
		 */
		addEls: function(newEls) {
			newEls = newEls || {};

			Object.keys(newEls).forEach(function(key) {
				this._els[key] = newEls[key];
			}, this);
		},

		/**
		 * Setup snippet - is called after init. Runs _setup()
		 */
		setup: function() {
			Templates.bindTemplate(this._root, this);
			
			this._setup();
		},

		/**
		 * Activate snippet - run _activate()
		 */
		activate: function() {
			this._activate();
		},

		/**
		 * Deactivate snippet - run _deactivate()
		 */
		deactivate: function() {
			this._deactivate();
		},

		/**
		 * Get snippet name.
		 * @return {String}
		 */
		getName: function() {
			return this._name;
		}
	};

	// --- public ----
	
	return {
		/**
		 * Create new snippet
		 * @param  {Object|Function} a snippet data | dependicies
		 * @param  {Object|Function} [b] snippet data | dependicies
		 * @return {Page}
		 */
		create: function(a, b) {
			return Common.create(Snippet, a, b);
		}
	};
}]);
Onix.factory("Select", [
	"Common",
	"Events",
function(
	Common,
	Events
) {
	// ------------------------ private ---------------------------------------
	
	/**
	 * Main class
	 * @param {NodeElement} el Where element has class "dropdown"
	 */
	var Select = function(el) {
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
	 * @param {NodeElement} el Where element has class "dropdown"
	 */
	Select.prototype._bind = function(el) {
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

	// ------------------------ public ----------------------------------------

	return Select;
}]);
