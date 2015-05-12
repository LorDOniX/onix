/**
 * @namespace onix
 */
onix = (function() {
	var TYPES = {
		SERVICE: 1,
		FACTORY: 2,
		CONSTANT: 3,
		RUN: 4,
		CONFIG: 5
	};

	var Module = function() {
		this._allObj = [];
	};

	/**
	 * Add a new service
	 * 
	 * @param  {String} name
	 * @param  {Array|Function} param With DI
	 */
	Module.prototype.service = function(name, param) {
		this._allObj.push({
			name: name,
			param: param,
			type: TYPES.SERVICE
		});
	};

	/**
	 * Add a new factory
	 * 
	 * @param  {String} name
	 * @param  {Array|Function} param With DI
	 */
	Module.prototype.factory = function(name, param) {
		this._allObj.push({
			name: name,
			param: param,
			type: TYPES.FACTORY
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
	Module.prototype.constant = function(name, obj) {
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
	 * @memberof onix
	 */
	Module.prototype.run = function(param) {
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
	 * @memberof onix
	 */
	Module.prototype.config = function(param) {
		this._allObj.push({
			param: param,
			type: TYPES.CONFIG
		});
	};

	var onix = {
		// vsechny objekty
		_allObj: [],

		// zpracovane objekty
		_objects: {},

		// vsechny moduly
		_modules: {},

		_CONFIG_NAME: "CONFIG",

		_init: function() {
			// pred DOM loadem
			this._objects[this._CONFIG_NAME] = {};

			document.addEventListener("DOMContentLoaded", this._domLoad.bind(this));
		},

		_DI: function(param) {
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

		_domLoad: function() {
			// zpracujeme nejdrive interni objekty
			this._allObj.forEach(function(item) {
				var di = this._DI(item.param);

				// pro framework pouze 2 typy
				switch (item.type) {
					case TYPES.SERVICE:
						this._objects[item.name] = new (Function.prototype.bind.apply(di.fn, [null].concat(di.args)));
						break;

					case TYPES.FACTORY:
						this._objects[item.name] = di.fn.apply(di.fn, di.args);
						break;
				}
			}, this);

			// smazeme jej
			this._allObj.length = 0;

			var configs = [];
			var runs = [];

			// zpracujeme moduly
			Object.keys(this._modules).forEach(function(moduleName) {
				var module = this._modules[moduleName].module;

				module._allObj.forEach(function(moduleItem) {
					var di = this._DI(moduleItem.param);

					// pro framework pouze 2 typy
					switch (moduleItem.type) {
						case TYPES.SERVICE:
							this._objects[moduleItem.name] = new (Function.prototype.bind.apply(di.fn, [null].concat(di.args)));
							break;

						case TYPES.FACTORY:
							this._objects[moduleItem.name] = di.fn.apply(di.fn, di.args);
							break;

						case TYPES.CONSTANT:
							this._objects[moduleItem.name] = di.fn; // di.fn contains obj
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

			// init
			var di = this._DI(this._run);
			di.fn.apply(this, di.args);

			// spustime vsechny configy
			configs.forEach(function(config) {
				var di = this._DI(config.param);

				di.fn.apply(di.fn, di.args);
			}, this);

			// spustime vsechny runy
			runs.forEach(function(run) {
				var di = this._DI(run.param);

				di.fn.apply(di.fn, di.args);
			}, this);
		},

		_run: [
			"i18n",
			"Templates",
			"Loader",
			"Router",
			"MyQuery",
			"Common",
		function(
			i18n,
			Templates,
			Loader,
			Router,
			MyQuery,
			Common
		) {
			// binds
			this.element = function(value, parent) {
				return new MyQuery.get(value, parent);
			};

			// inits
			Loader.init();
			Router.init();

			// language
			window._ = i18n._.bind(i18n);

			Common.ift(this._objects[this._CONFIG_NAME].LOCALIZATION.LANG, function(langKey) {
				i18n.setLanguage(langKey);
			});
		}],

		config: function(obj) {
			Object.keys(obj).forEach(function(key) {
				this._objects[this._CONFIG_NAME][key] = obj[key];
			}.bind(this));
		},

		service: function(name, param) {
			this._allObj.push({
				name: name,
				param: param,
				type: TYPES.SERVICE
			});
		},

		factory: function(name, param) {
			this._allObj.push({
				name: name,
				param: param,
				type: TYPES.FACTORY
			});
		},

		module: function(name, dependencies) {
			var module = new Module();

			this._modules[name] = {
				module: module,
				dependencies: dependencies
			};

			return module;
		},

		getObject: function(name) {
			name = name || "";

			return this._objects[name];
		}
	};

	// init app
	onix._init();

	return onix;
})();
