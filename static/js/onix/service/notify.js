/**
 * @namespace Notify
 * @description DI: Promise;
 */
Onix.service("Notify", [
	"Promise",
function(
	Promise
) {
	/**
	 * Notification object
	 *
	 * @class _Notify
	 * @description Parent: Notify;
	 * @param {NodeElement} el
	 */
	var _Notify = function(el) {
		this._el = el;

		this._HIDE_TIMEOUT = 1500; // [ms]

		this._options = {
			"ok": "alert-success",
			"error": "alert-danger",
			"info": "alert-info"
		};

		return this;
	};

	/**
	 * Reset classess
	 *
	 * @public
	 * @memberof _Notify
	 */
	_Notify.prototype.reset = function() {
		Object.keys(this._options).forEach(function(key) {
			this._el.classList.remove(this._options[key]);
		}.bind(this));

		return this;
	};

	/**
	 * Show OK state
	 * 
	 * @public
	 * @param  {String} txt
	 * @memberof _Notify
	 */
	_Notify.prototype.ok = function(txt) {
		this._el.classList.add(this._options["ok"]);
		this._el.innerHTML = txt;

		return this;
	};

	/**
	 * Show ERROR state
	 * 
	 * @public
	 * @param  {String} txt      
	 * @memberof _Notify
	 */
	_Notify.prototype.error = function(txt) {
		this._el.classList.add(this._options["error"]);
		this._el.innerHTML = txt;

		return this;
	};

	/**
	 * Show INFO state
	 *
	 * @public
	 * @param  {String} txt      
	 * @memberof _Notify
	 */
	_Notify.prototype.info = function(txt) {
		this._el.classList.add(this._options["info"]);
		this._el.innerHTML = txt;

		return this;
	};

	/**
	 * Timeout hide.
	 *
	 * @public
	 * @return {Promise}
	 * @memberof _Notify
	 */
	_Notify.prototype.hide = function() {
		var promise = Promise.defer();

		setTimeout(function() {
			this.reset();
			
			promise.resolve();
		}.bind(this), this._HIDE_TIMEOUT);

		return promise;
	};

	/**
	 * Main public access to the notify obj.
	 *
	 * @public
	 * @param  {NodeElement} el
	 * @return {_Notify}
	 * @memberof Notify
	 */
	this.get = function(el) {
		return new _Notify(el);
	};
}]);
