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
			this._objects[this._CONFIG_NAME] = {};

			document.addEventListener("DOMContentLoaded", function() {
				console.log("dom load");
				console.log(this);
			}.bind(this));
		},

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
		}
	};

	// init app
	onix._init();

	return onix;
})();
