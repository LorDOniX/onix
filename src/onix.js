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
		 * @type {Object}
		 * @member onix
		 * @private
		 */
		this._objects = {};

		/**
		 * All run objects
		 *
		 * @type {Object}
		 * @member onix
		 * @private
		 */
		this._runs = [];

		/**
		 * All config objectss
		 *
		 * @type {Object}
		 * @member onix
		 * @private
		 */
		this._configs = [];

		/**
		 * Constants: provider name and types
		 *
		 * @property {Object}
		 * @type {Object}
		 * @member onix
		 * @private
		 */
		this._CONST = {
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

		// bind DOM ready
		document.addEventListener("DOMContentLoaded", this._domLoad.bind(this));
	};

	/**
	 * Parse param for injections and function
	 * 
	 * @param  {Array|Function} param
	 * @return {Object} Parsed object
	 */
	onix.prototype._parseParam = function(param) {
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
	 * Event - Dom LOAD
	 *
	 * @member onix
	 * @private
	 */
	onix.prototype._domLoad = function() {
		// promise -> runs
		this._configs.forEach(function(config) {
			this._run(config, true);
		}, this);

		this._runs.forEach(function(run) {
			this._run(run);
		}, this);
	};

	/**
	 * Run object configuration; returns his cache (data)
	 * 
	 * @param  {Object}  obj Object configuration
	 * @param  {Boolean} [isConfig] Is config phase?
	 * @param  {Array} [parent] Parent objects
	 * @return {Object}
	 */
	onix.prototype._run = function(obj, isConfig, parent) {
		parent = parent || [];

		if (parent.indexOf(obj.name) != -1) {
			console.error("Circular dependency error! Object name: " + obj.name + ", parents: " + parent.join("|"));
			return null;
		}

		var inject = [];

		if (obj.provider) {
			var providerObj = this._objects[obj.provider];

			if (!providerObj.cache) {
				var providerFn = providerObj.fn || this.noop;
				providerObj.cache = new providerFn();
			}

			var getFn = providerObj.cache["$get"] || this.noop;
			var pp = this._parseParam(getFn);

			obj.fn = pp.fn;
			obj.inject = pp.inject;

			delete obj.provider;
		}

		if (obj.inject && obj.inject.length) {
			obj.inject.forEach(function(objName) {
				var injObj = this._objects[objName];

				inject.push(this._run(injObj, isConfig, obj.name ? parent.concat(obj.name) : parent));
			}, this);
		}

		// config phase
		if (isConfig) {
			switch (obj.type) {
				case this._CONST.TYPE.PROVIDER:
					if (!obj.cache) {
						var fn = obj.fn || this.noop;
						obj.cache = new fn();
					}

					return obj.cache;
					break;

				case this._CONST.TYPE.CONSTANT:
					return obj.cache;
					break;

				case this._CONST.TYPE.CONFIG:
					var fn = obj.fn || this.noop;
					obj.cache = fn.apply(fn, inject);
					break;

				default:
					return null;
			}
		}
		// run phase
		else {
			switch (obj.type) {
				case this._CONST.TYPE.FACTORY:
					if (!obj.cache) {
						var fn = obj.fn || this.noop;
						obj.cache = fn.apply(fn, inject);
					}

					return obj.cache;
					break;

				case this._CONST.TYPE.SERVICE:
					if (!obj.cache) {
						var fn = obj.fn || this.noop;
						var serviceObj = Object.create(fn.prototype);
						fn.apply(serviceObj, inject);
						obj.cache = serviceObj;
					}
					
					return obj.cache;
					break;

				case this._CONST.TYPE.VALUE:
					return obj.cache;
					break;

				case this._CONST.TYPE.CONSTANT:
					return obj.cache;
					break;

				case this._CONST.TYPE.RUN:
					var fn = obj.fn || this.noop;
					obj.cache = fn.apply(fn, inject);
					break;

				default:
					return null;
			}
		}
	};

	/**
	 * Add service to the application.
	 *
	 * @param  {String} name 
	 * @param  {Function} param
	 * @member onix
	 */
	onix.prototype.provider = function(name, param) {
		var pp = this._parseParam(param);

		this._objects[name + this._CONST.PROVIDER_NAME] = {
			name: name + this._CONST.PROVIDER_NAME,
			inject: pp.inject,
			fn: pp.fn,
			cache: null,
			type: this._CONST.TYPE.PROVIDER
		};

		this._objects[name] = {
			name: name,
			inject: null,
			fn: null,
			cache: null,
			provider: name + this._CONST.PROVIDER_NAME,
			type: this._CONST.TYPE.FACTORY
		};
	};

	/**
	 * Add service to the application.
	 *
	 * @param  {String} name 
	 * @param  {Function|Array} param
	 * @member onix
	 */
	onix.prototype.service = function(name, param) {
		var pp = this._parseParam(param);

		this._objects[name] = {
			name: name,
			inject: pp.inject,
			fn: pp.fn,
			cache: null,
			type: this._CONST.TYPE.SERVICE
		};
	};

	/**
	 * Add factory to the application.
	 *
	 * @param  {String} name 
	 * @param  {Function|Array} param
	 * @member onix
	 */
	onix.prototype.factory = function(name, param) {
		var pp = this._parseParam(param);

		this._objects[name] = {
			name: name,
			inject: pp.inject,
			fn: pp.fn,
			cache: null,
			type: this._CONST.TYPE.FACTORY
		};
	};

	/**
	 * Add new constant
	 * 
	 * @param  {String} name
	 * @param  {Object} param
	 * @member onix
	 */
	onix.prototype.constant = function(name, obj) {
		this._objects[name] = {
			name: name,
			cache: obj,
			type: this._CONST.TYPE.CONSTANT
		};
	};

	/**
	 * Add new value
	 * 
	 * @param  {String} name
	 * @param  {Object} param
	 * @member onix
	 */
	onix.prototype.value = function(name, obj) {
		this._objects[name] = {
			name: name,
			cache: obj,
			type: this._CONST.TYPE.VALUE
		};
	};

	/**
	 * Add a new config
	 * 
	 * @param  {Array|Function} param With DI
	 * @member onix
	 */
	onix.prototype.config = function(param) {
		var pp = this._parseParam(param);

		this._configs.push({
			fn: pp.fn,
			inject: pp.inject,
			type: this._CONST.TYPE.CONFIG
		});
	};

	/**
	 * Add a new run
	 * 
	 * @param  {Array|Function} param With DI
	 * @member onix
	 */
	onix.prototype.run = function(param) {
		var pp = this._parseParam(param);

		this._runs.push({
			fn: pp.fn,
			inject: pp.inject,
			type: this._CONST.TYPE.RUN
		});
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
			"OnixJS framework\n" +
			"2.2.3/27. 4. 2016\n" +
			"source: https://gitlab.com/LorDOniX/onix\n" +
			"documentation: https://gitlab.com/LorDOniX/onix/tree/master/docs"
		);
	};

	return new onix()
})();
