Onix = (function() {
	var Onix = {
		// ------------------------ private ---------------------------------------
		
		/**
		 * All factories, constants...
		 * @type {Object}
		 */
		_objects: {},

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
				this._run();
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
		_run: function() {
			var config = this.getObject("CONFIG");

			var i18n = this.getObject("i18n");
			window._ = i18n._.bind(i18n);

			var templates = this.getObject("Templates");
			templates.init();

			var loader = this.getObject("Loader");
			loader.init();

			var router = this.getObject("Router");
			router.init();
			
			i18n.setLanguage(config.LOCALIZATION.LANG);
			i18n.loadLanguage(config.LOCALIZATION.LANG, config.LOCALIZATION.PATH).done(function() {
				// run runs array
				this._runs.forEach(function(item) {
					var di = this._di(item);

					new (Function.prototype.bind.apply(di.fn, [null].concat(di.args)));
				}.bind(this));
				
				// router go
				router.go();
			}.bind(this));
		},

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
