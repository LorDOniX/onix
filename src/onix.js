onix = (function() {
	/**
	 * Module object - handles one module object with services, factories etc.
	 *
	 * @class $module
	 */
	var $module = function(name, dependencies) {
		/**
		 * All objects
		 *
		 * @type {Object}
		 * @member $module
		 * @private
		 */
		this._objects = {};

		/**
		 * All run objects
		 *
		 * @type {Object}
		 * @member $module
		 * @private
		 */
		this._runs = [];

		/**
		 * All config objectss
		 *
		 * @type {Object}
		 * @member $module
		 * @private
		 */
		this._configs = [];

		/**
		 * Module name
		 * 
		 * @type {String}
		 * @member $module
		 * @private
		 */
		this._name = name || "";

		/**
		 * Module dependencies
		 * 
		 * @type {Array}
		 * @member $module
		 * @private
		 */
		this._dependencies = dependencies || [];
	};

	/**
	 * Module constants
	 *
	 * @property {Object}
	 * @type {Object}
	 * @member $module
	 * @private
	 */
	$module.CONST = {
		PROVIDER_NAME: "Provider",
		TYPE: {
			PROVIDER: 1,
			SERVICE: 2,
			FACTORY: 3,
			CONSTANT: 4,
			VALUE: 5,
			CONFIG: 6,
			RUN: 7
		}
	};

	/**
	 * Parse parameters. From param parse function and dependencies
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
	 * Get dependencies
	 * 
	 * @return {Array}
	 * @member $module
	 */
	$module.prototype.getDependencies = function() {
		return this._dependencies;
	};

	/**
	 * Get module name
	 * 
	 * @return {String}
	 * @member $module
	 */
	$module.prototype.getName = function() {
		return this._name;
	};

	/**
	 * Get module configs
	 * 
	 * @return {Array}
	 * @member $module
	 */
	$module.prototype.getConfigs = function() {
		return this._configs;
	};

	/**
	 * Get module runs
	 * 
	 * @return {Array}
	 * @member $module
	 */
	$module.prototype.getRuns = function() {
		return this._runs;
	};

	/**
	 * Get module objects
	 * 
	 * @return {Array}
	 * @member $module
	 */
	$module.prototype.getObjects = function() {
		return this._objects;
	};

	/**
	 * Add provider to the application
	 *
	 * @chainable
	 * @param  {String} name 
	 * @param  {Function} param
	 * @member $module
	 */
	$module.prototype.provider = function(name, param) {
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
	 * Add service to the application
	 *
	 * @chainable
	 * @param  {String} name 
	 * @param  {Function|Array} param
	 * @member $module
	 */
	$module.prototype.service = function(name, param) {
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
	 * Add factory to the application
	 *
	 * @chainable
	 * @param  {String} name 
	 * @param  {Function|Array} param
	 * @member $module
	 */
	$module.prototype.factory = function(name, param) {
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
	 * Add new constant
	 *
	 * @chainable
	 * @param  {String} name
	 * @param  {Object} param
	 * @member $module
	 */
	$module.prototype.constant = function(name, obj) {
		this._objects[name] = {
			name: name,
			cache: obj,
			type: $module.CONST.TYPE.CONSTANT
		};

		return this;
	};

	/**
	 * Add a new value
	 *
	 * @chainable
	 * @param  {String} name
	 * @param  {Object} param
	 * @member $module
	 */
	$module.prototype.value = function(name, obj) {
		this._objects[name] = {
			name: name,
			cache: obj,
			type: $module.CONST.TYPE.VALUE
		};

		return this;
	};

	/**
	 * Add a new config
	 *
	 * @chainable
	 * @param  {Array|Function} param With DI
	 * @member $module
	 */
	$module.prototype.config = function(param) {
		var pp = $module.parseParam(param);

		this._configs.push({
			fn: pp.fn,
			inject: pp.inject,
			type: $module.CONST.TYPE.CONFIG
		});

		return this;
	};

	/**
	 * Add a new run
	 * 
	 * @param  {Array|Function} param With DI
	 * @member $module
	 */
	$module.prototype.run = function(param) {
		var pp = $module.parseParam(param);

		this._runs.push({
			fn: pp.fn,
			inject: pp.inject,
			type: $module.CONST.TYPE.RUN
		});

		return this;
	};

	/**
	 * Modules object - handles all modules in the application; runs object
	 *
	 * @class $modules
	 */
	var $modules = {
		/**
		 * All modules array
		 *
		 * @private
		 * @member $modules
		 * @type {Array}
		 */
		_modules: [],

		/**
		 * All modules object - quick access
		 *
		 * @private
		 * @member $modules
		 * @type {Object}
		 */
		_modulesObj: {},

		/**
		 * Modules constants
		 *
		 * @private
		 * @member $modules
		 * @type {Ojbect}
		 */
		_CONST: {
			MODULE_SEPARATOR: "::",
		},

		/**
		 * Function which does nothing
		 *
		 * @private
		 * @property {Function}
		 * @member $modules
		 */
		_noop: function() {

		},

		/**
		 * Event - Dom LOAD
		 *
		 * @property {Function}
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

			// promise -> runs
			configs.forEach(function(config) {
				this._run(config, true);
			}, this);

			runs.forEach(function(run) {
				this._run(run);
			}, this);
		},

		/**
		 * Get object by his name
		 *
		 * @property {Function}
		 * @param {String} name Object name
		 * @member $modules
		 * @return {Object} Object data
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
		 * Run object configuration; returns his cache (data)
		 *
		 * @property {Function}
		 * @param  {Object}  obj Object configuration
		 * @param  {Boolean} [isConfig] Is config phase?
		 * @param  {Array} [parent] Parent objects
		 * @return {Object}
		 * @member $modules
		 * @private
		 */
		_run: function(obj, isConfig, parent) {
			parent = parent || [];

			if (parent.indexOf(obj.name) != -1) {
				console.error("Circular dependency error! Object name: " + obj.name + ", parents: " + parent.join("|"));
				return null;
			}

			var inject = [];

			if (obj.provider) {
				//var providerObj = this._objects[obj.provider];
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
					//var injObj = this._objects[objName];
					var injObj = this._getObject(objName);

					inject.push(this._run(injObj, isConfig, obj.name ? parent.concat(obj.name) : parent));
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
						obj.cache = fn.apply(fn, inject);
						break;

					default:
						return null;
				}
			}
			// run phase
			else {
				switch (obj.type) {
					case $module.CONST.TYPE.FACTORY:
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
						obj.cache = fn.apply(fn, inject);
						break;

					default:
						return null;
				}
			}
		},

		/**
		 * Add a new module to the application
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
	 * Module has addtional functions
	 * 
	 * @class onix
	 */
	var onix = $modules.addModule("onix");

	/**
	 * Add a new module to the application
	 * 
	 * @param {String} name Module name
	 * @param {Array} [dependencies] Module dependencies
	 * @return {Object} Created module
	 * @member onix
	 */
	onix.module = function(name, dependencies) {
		return $modules.addModule(name, dependencies);
	};

	/**
	 * Empty function
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
			"2.3.0/28. 4. 2016\n" +
			"source: https://gitlab.com/LorDOniX/onix\n" +
			"documentation: https://gitlab.com/LorDOniX/onix/tree/master/docs"
		);
	};

	return onix;
})();