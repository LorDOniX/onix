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
		CONTROLLER: 5,
		DIRECTIVE: 6
	};

	/**
	 * $$module item
	 * @class $$module
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
	 * Add a new directive
	 *
	 * @public
	 * @param  {String} name
	 * @param  {Array|Function} param With DI
	 * @memberof $$module
	 */
	$$module.prototype.directive = function(name, param) {
		this._allObj.push({
			name: name,
			param: param,
			type: TYPES.DIRECTIVE
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
	 * Add a new config
	 * 
	 * @public
	 * @param  {Object} obj
	 * @memberof $$module
	 */
	$$module.prototype.config = function(obj) {
		onix.config(obj);
	};

	/**
	 * Main framework object.
	 * 
	 * @class onix
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

			var runs = [];
			var $directive = this.getObject("$directive");

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

						case TYPES.DIRECTIVE:
							var $scope = $directive.create(["$event"], {});

							this._DI(moduleItem.param, {
								$scope: $scope
							}).run();

							this._objects[moduleItem.name] = $scope;
							break;

						case TYPES.RUN:
							runs.push(moduleItem);
							break;
					}
				}, this);
			}, this);

			// onix main run
			this._DI(this._run).run(this);

			var $q = this.getObject("$q");
			var all = [];

			// run all runs
			runs.forEach(function(run) {
				var runO = this._DI(run.param).run();

				// returns a promise
				if (runO && "_E_STATES" in runO) {
					all.push(runO);
				}
			}, this);

			var $route = this.getObject("$route");

			if (all.length) {
				$q.all(all)["finally"](function() {
					// route go
					$route.go();
				});
			}
			else {
				// route go
				$route.go();
			}
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
		 * Read/add config to the onix application.
		 *
		 * @public
		 * @param  {Object|String} obj
		 * @memberof onix
		 */
		config: function(obj) {
			if (typeof obj === "string") {
				// obj is key
				return this._objects[this._CONFIG_NAME][obj];
			}
			else if (typeof obj === "object") {
				Object.keys(obj).forEach(function(key) {
					this._objects[this._CONFIG_NAME][key] = obj[key];
				}.bind(this));
			}
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
		 *
		 * @public
		 * @memberof onix
		 */
		noop: function() {

		},

		/**
		 * Run controller
		 * 
		 * @param  {String|Array|Function} controller 
		 * @param  {Object} [controllerData] 
		 * @public
		 * @memberof onix
		 */
		runController: function(controller, controllerData) {
			var $controller = this.getObject("$controller");
			var $scope = $controller.create(["$event"], {});
			var replaceObj = {
				$scope: $scope
			};

			if (typeof controller === "string") {
				var param = this.getObject(controller);

				this._DI(param, replaceObj).run();
			}
			else if (Array.isArray(controller)) {
				this._DI(controller, replaceObj).run();
			}
			else if (typeof controller === "function") {
				controller.apply(config.controller, [$scope]);
			}

			if (controllerData) {
				$scope._setConfig(controllerData);
			}

			$scope._init();
		},

		/**
		 * Framework info.
		 *
		 * @public
		 * @memberof onix
		 */
		info: function() {
			console.log(
				"Onix JS Framework\n" +
				"Version: 2.0.0\n" +
				"Date: 29. 6. 2015"
			);
		}
	};

	// init app
	onix._init();

	return onix;
})();
