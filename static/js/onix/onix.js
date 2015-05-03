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
		 * Add new object to the database.
		 * @param {String} name
		 * @param {Enum} type
		 * @param {Array|Function} param
		 */
		_addObject: function(name, type, param) {
			try {
				if (Array.isArray(param)) {
					var newArgs = [];
					
					param.every(function(item) {
						if (typeof item === "function") {
							// priradime vystup funkce
							var output;

							if (type == this._TYPES.SERVICE) {
								output = new (Function.prototype.bind.apply(item, [null].concat(newArgs)));
							}
							// factory
							else {
								output = item.apply(item, newArgs);
							}

							this._objects[name] = output;
							return false;
						}
						else {
							newArgs.push(this._objects[item]);
						}

						return true;
					}, this);
				}
				else {
					// priradime vystup funkce
					this._objects[name] = type == this._TYPES.SERVICE ? new param() : param();
				}
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
			
			i18n.setLanguage(config.LOCALIZATION.LANG);
			i18n.loadLanguage(config.LOCALIZATION.LANG, config.LOCALIZATION.PATH).done(function() {
			}.bind(this));

			// router todo
			
			// run runs array
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
		 * @param  {String} name
		 * @param  {Array|Function} param With DI
		 */
		run: function(name, param) {
			this._runs.push({
				name: name,
				param: param
			});
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
