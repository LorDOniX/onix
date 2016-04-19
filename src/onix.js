onix = (function() {
	/**
	 * Main framework object.
	 * 
	 * @class onix
	 */
	var onix = function() {
		/**
		 * All objects
		 *
		 * @type {Array}
		 * @member onix
		 * @private
		 */
		this._allObj = [];

		/**
		 * All processed objects
		 *
		 * @type {Object}
		 * @member onix
		 * @private
		 */
		this._objects = {};

		/**
		 * Config name
		 *
		 * @member onix
		 * @private
		 */
		this._CONFIG_NAME = "$config";
	};

	/**
	 * App types
	 *
	 * @property {Object}
	 * @param {Number} SERVICE
	 * @param {Number} FACTORY
	 * @param {Number} CONSTANT
	 * @param {Number} RUN
	 * @member onix
	 */
	onix.TYPES = {
		SERVICE: 1,
		FACTORY: 2,
		CONSTANT: 3,
		RUN: 4
	};

	/**
	 * Init function
	 *
	 * @member onix
	 */
	onix.prototype.init = function() {
		// pred DOM loadem
		this._objects[this._CONFIG_NAME] = {};

		document.addEventListener("DOMContentLoaded", this._domLoad.bind(this));
	};


	/**
	 * Dependency injection bind
	 *
	 * @param  {Function|Array} param
	 * @param  {Object} [replace]
	 * @return {Object}
	 * @member onix
	 */
	onix.prototype.bindDI = function(param, replace) {
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

		/**
		 * Run new binded function - with the new
		 * 
		 * @param  {Function|Object} [scope] 
		 * @param  {Boolean} [callWithNew] 
		 * @return {Function}
		 */
		return function(scope, callWithNew) {
			if (callWithNew) {
				var obj = Object.create(fn.prototype);
				fn.apply(obj, args);
				return obj;
			}
			else {
				return fn.apply(scope || fn, args);
			}
		};
	};

	/**
	 * Event - Dom LOAD
	 *
	 * @member onix
	 * @private
	 */
	onix.prototype._domLoad = function() {
		var runs = [];

		// process all inner items
		this._allObj.forEach(function(item) {
			// only 2 types
			switch (item.type) {
				case onix.TYPES.SERVICE:
					this._objects[item.name] = this.bindDI(item.param)(null, true);
					break;

				case onix.TYPES.FACTORY:
					this._objects[item.name] = this.bindDI(item.param)();
					break;

				case onix.TYPES.CONSTANT:
					this._objects[item.name] = item.param;
					break;

				case onix.TYPES.RUN:
					runs.push(item.param);
					break;
			}
		}, this);

		// delete them
		this._allObj.length = 0;

		// onix main run
		this.bindDI(this._run)(this);

		// run all runs
		runs.forEach(function(run) {
			this.bindDI(run)();
		}, this);

		//testTempl
	};

	/**
	 * Main access point in the framework
	 *
	 * @member onix
	 * @private
	 */
	onix.prototype._run = [
		"$i18n",
		"$template",
		"$loader",
		"$route",
		"$myQuery",
	function(
		$i18n,
		$template,
		$loader,
		$route,
		$myQuery
	) {
		/**
		 * Quick acces to myQuery and DOM manipulation
		 *
		 * @param  {String|HTMLElement|Array} value
		 * @param {HTMLElement} [parent]
		 * @return {$myQuery}
		 * @member onix
		 * @property {Function}
		 */
		this.element = function(value, parent) {
			return new $myQuery.get(value, parent);
		};

		// inits
		$loader.init();
		$template.init();

		/**
		 * Get text function. Translate for the current language and the key.
		 *
		 * @param  {String} key
		 * @param  {Object} [replace] Replace all {} in the string
		 * @return {String}
		 * @member window
		 * @property {Function}
		 */
		window._ = $i18n._.bind($i18n);
	}];

	/**
	 * Read/add config to the onix application.
	 *
	 * @param  {Object|String} obj
	 * @member onix
	 */
	onix.prototype.config = function(obj) {
		if (typeof obj === "string") {
			// obj is key
			return this._objects[this._CONFIG_NAME][obj];
		}
		else if (typeof obj === "object") {
			Object.keys(obj).forEach(function(key) {
				this._objects[this._CONFIG_NAME][key] = obj[key];
			}.bind(this));
		}
	};

	/**
	 * Add service to the application.
	 *
	 * @param  {String} name 
	 * @param  {Function|Array} param
	 * @member onix
	 */
	onix.prototype.service = function(name, param) {
		this._allObj.push({
			name: name,
			param: param,
			type: onix.TYPES.SERVICE
		});
	};

	/**
	 * Add factory to the application.
	 *
	 * @param  {String} name 
	 * @param  {Function|Array} param
	 * @member onix
	 */
	onix.prototype.factory = function(name, param) {
		this._allObj.push({
			name: name,
			param: param,
			type: onix.TYPES.FACTORY
		});
	};

	/**
	 * Add new constant
	 * 
	 * @param  {String} name
	 * @param  {Object} param
	 * @member onix
	 */
	onix.prototype.constant = function(name, obj) {
		this._allObj.push({
			name: name,
			param: obj,
			type: onix.TYPES.CONSTANT
		});
	};

	/**
	 * Add a new run
	 * 
	 * @param  {Array|Function} param With DI
	 * @member onix
	 */
	onix.prototype.run = function(param) {
		this._allObj.push({
			param: param,
			type: onix.TYPES.RUN
		});
	};

	/**
	 * Get object
	 *
	 * @param  {String} name
	 * @return {Function|Object} 
	 * @member onix
	 */
	onix.prototype.getObject = function(name) {
		name = name || "";

		return this._objects[name];
	};

	/**
	 * Empty function
	 *
	 * @member onix
	 */
	onix.prototype.noop = function() {

	};

	/**
	 * Framework info.
	 *
	 * @member onix
	 */
	onix.prototype.info = function() {
		console.log(
			"Onix JS Framework\n" +
			"Version: 2.2.1\n" +
			"Date: 19. 4. 2016"
		);
	};

	var onixInst = new onix();

	// init app
	onixInst.init();

	return onixInst;
})();
