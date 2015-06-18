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
		_VERSION: "1.1.3",

		/**
		 * Framework date.
		 * 
		 * @private
		 * @type {String}
		 * @memberof Onix
		 */
		_DATE: "18. 6. 2015",

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
