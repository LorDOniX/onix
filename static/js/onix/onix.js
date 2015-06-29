onix = (function() {
	/**
	 * Module/app types
	 * @const
	 */
	var TYPES = {
		SERVICE: 1,
		FACTORY: 2,
		CONSTANT: 3,
		RUN: 4,
		CONFIG: 5,
		CONTROLLER: 6
	};

	/**
	 * $$module item
	 * @class
	 * 
	 */
	var $$module = function() {
		this._allObj = [];
	};

	/**
	 * Add a new service
	 *
	 * @public
	 * @param  {String} name
	 * @param  {Array|Function} param With DI
	 * @memberof $$module
	 */
	$$module.prototype.service = function(name, param) {
		this._allObj.push({
			name: name,
			param: param,
			type: TYPES.SERVICE
		});
	};

	/**
	 * Add a new factory
	 *
	 * @public
	 * @param  {String} name
	 * @param  {Array|Function} param With DI
	 * @memberof $$module
	 */
	$$module.prototype.factory = function(name, param) {
		this._allObj.push({
			name: name,
			param: param,
			type: TYPES.FACTORY
		});
	};

	/**
	 * Add a new controller
	 *
	 * @public
	 * @param  {String} name
	 * @param  {Array|Function} param With DI
	 * @memberof $$module
	 */
	$$module.prototype.controller = function(name, param) {
		this._allObj.push({
			name: name,
			param: param,
			type: TYPES.CONTROLLER
		});
	};

	/**
	 * Add new constant
	 * 
	 * @public
	 * @param  {String} name
	 * @param  {Object} param
	 * @memberof onix
	 */
	$$module.prototype.constant = function(name, obj) {
		this._allObj.push({
			name: name,
			param: obj,
			type: TYPES.CONSTANT
		});
	};

	/**
	 * Add a new run
	 * 
	 * @public
	 * @param  {Array|Function} param With DI
	 * @memberof $$module
	 */
	$$module.prototype.run = function(param) {
		this._allObj.push({
			param: param,
			type: TYPES.RUN
		});
	};

	/**
	 * Add a new run
	 * 
	 * @public
	 * @param  {Array|Function} param With DI
	 * @memberof $$module
	 */
	$$module.prototype.config = function(param) {
		this._allObj.push({
			param: param,
			type: TYPES.CONFIG
		});
	};

	/**
	 * @namespace onix
	 */
	var onix = {
		/**
		 * All objects
		 *
		 * @private
		 * @type {Array}
		 * @memberof onix
		 */
		_allObj: [],

		/**
		 * All processed objects
		 *
		 * @private
		 * @type {Object}
		 * @memberof onix
		 */
		_objects: {},

		/**
		 * All modules
		 *
		 * @private
		 * @type {Object}
		 * @memberof onix
		 */
		_modules: {},

		/**
		 * Config name
		 *
		 * @private
		 * @const
		 * @memberof onix
		 */
		_CONFIG_NAME: "$config",

		/**
		 * Init function
		 *
		 * @private
		 * @memberof onix
		 */
		_init: function() {
			// pred DOM loadem
			this._objects[this._CONFIG_NAME] = {};

			document.addEventListener("DOMContentLoaded", this._domLoad.bind(this));
		},

		/**
		 * Event - Dom LOAD
		 *
		 * @private
		 * @memberof onix
		 */
		_domLoad: function() {
			// process all inner items
			this._allObj.forEach(function(item) {
				// only 2 types
				switch (item.type) {
					case TYPES.SERVICE:
						this._objects[item.name] = this._DI(item.param).newRun();
						break;

					case TYPES.FACTORY:
						this._objects[item.name] = this._DI(item.param).run();
						break;
				}
			}, this);

			// delete them
			this._allObj.length = 0;

			var configs = [];
			var runs = [];

			// process all modules
			Object.keys(this._modules).forEach(function(moduleName) {
				var module = this._modules[moduleName].module;

				module._allObj.forEach(function(moduleItem) {
					// modules have more types
					switch (moduleItem.type) {
						case TYPES.SERVICE:
							this._objects[moduleItem.name] = this._DI(moduleItem.param).newRun();
							break;

						case TYPES.FACTORY:
							this._objects[moduleItem.name] = this._DI(moduleItem.param).run();
							break;

						case TYPES.CONSTANT:
						case TYPES.CONTROLLER:
							this._objects[moduleItem.name] = moduleItem.param;
							break;

						case TYPES.RUN:
							runs.push(moduleItem);
							break;

						case TYPES.CONFIG:
							configs.push(moduleItem);
							break;
					}
				}, this);
			}, this);

			// onix main run
			this._DI(this._run).run(this);

			// run all configs
			configs.forEach(function(config) {
				this._DI(config.param).run();
			}, this);

			// run all runs
			runs.forEach(function(run) {
				this._DI(run.param).run();
			}, this);
		},

		/**
		 * Main access point in the framework
		 *
		 * @private
		 * @memberof onix
		 */
		_run: [
			"$i18n",
			"$template",
			"$loader",
			"$route",
			"$myQuery",
			"$common",
		function(
			$i18n,
			$template,
			$loader,
			$route,
			$myQuery,
			$common
		) {
			// binds
			this.element = function(value, parent) {
				return new $myQuery.get(value, parent);
			};

			// inits
			$loader.init();
			$route.init();
			$template.init();

			// language
			window._ = $i18n._.bind($i18n);

			$common.ift(this._objects[this._CONFIG_NAME].LOCALIZATION.LANG, function(langKey) {
				$i18n.setLanguage(langKey);
			});
		}],

		/**
		 * Dependency injection
		 *
		 * @private
		 * @param  {Function|Array} param
		 * @param  {Object} [replace]
		 * @return {Object}
		 * @memberof onix
		 */
		_DI: function(param, replace) {
			var fn;
			var args = [];

			replace = replace || {};

			if (Array.isArray(param)) {
				param.every(function(item) {
					if (typeof item === "function") {
						fn = item;
						return false;
					}
					else {
						args.push(item in replace ? replace[item] : this._objects[item]);
					}

					return true;
				}, this);
			}
			else {
				fn = param;
			}

			return {
				/**
				 * Run new binded function
				 * @param  {Function|Object} [scope] 
				 * @return {Object}
				 */
				run: function(scope) {
					return fn.apply(scope || fn, args);
				},

				/**
				 * Run new binded function - with the new
				 * @param  {Function|Object} [scope] 
				 * @return {Object}
				 */
				newRun: function(scope) {
					return new (Function.prototype.bind.apply(scope || fn, [null].concat(args)))
				}
			};
		},

		/**
		 * Add config to the onix application.
		 *
		 * @public
		 * @param  {Object} obj
		 * @memberof onix
		 */
		config: function(obj) {
			Object.keys(obj).forEach(function(key) {
				this._objects[this._CONFIG_NAME][key] = obj[key];
			}.bind(this));
		},

		/**
		 * Add service to the application.
		 *
		 * @public
		 * @param  {String} name 
		 * @param  {Function|Array} param
		 * @memberof onix
		 */
		service: function(name, param) {
			this._allObj.push({
				name: name,
				param: param,
				type: TYPES.SERVICE
			});
		},

		/**
		 * Add factory to the application.
		 *
		 * @public
		 * @param  {String} name 
		 * @param  {Function|Array} param
		 * @memberof onix
		 */
		factory: function(name, param) {
			this._allObj.push({
				name: name,
				param: param,
				type: TYPES.FACTORY
			});
		},

		/**
		 * Add module to the application.
		 *
		 * @public
		 * @param  {String} name 
		 * @param  {Array} [dependencies] todo
		 * @return {$$module}
		 * @memberof onix
		 */
		module: function(name, dependencies) {
			var module = new $$module();

			this._modules[name] = {
				module: module,
				dependencies: dependencies
			};

			return module;
		},

		/**
		 * Get object
		 *
		 * @public
		 * @param  {String} name
		 * @return {Function|Object} 
		 * @memberof onix
		 */
		getObject: function(name) {
			name = name || "";

			return this._objects[name];
		},

		/**
		 * Empty function
		 */
		noop: function() {

		},

		/**
		 * Run controller
		 * @param  {String|Array|Function} controller 
		 */
		runController: function(controller) {
			if (typeof controller === "string") {
				var param = this.getObject(controller);
				var $page = this.getObject("$page");
				var $scope = $page.create(["$event"], {});

				this._DI(param, {
					$scope: $scope
				}).run();

				$scope._init();
			}
			else if (Array.isArray(controller)) {
				this._DI(controller).run();
			}
			else if (typeof controller === "function") {
				controller.apply(config.controller, []);
			}
		}
	};

	// init app
	onix._init();

	return onix;
})();
