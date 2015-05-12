onix.factory("$$notify", [
	"$q",
function(
	$q
) {
	/**
	 * Notification object
	 *
	 * @class $$notify
	 * @description Parent: Notify;
	 * @param {NodeElement} el
	 */
	var $$notify = function(el) {
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
	 * @memberof $$notify
	 */
	$$notify.prototype.reset = function() {
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
	 * @memberof $$notify
	 */
	$$notify.prototype.ok = function(txt) {
		this._el.classList.add(this._options["ok"]);
		this._el.innerHTML = txt;

		return this;
	};

	/**
	 * Show ERROR state
	 * 
	 * @public
	 * @param  {String} txt      
	 * @memberof $$notify
	 */
	$$notify.prototype.error = function(txt) {
		this._el.classList.add(this._options["error"]);
		this._el.innerHTML = txt;

		return this;
	};

	/**
	 * Show INFO state
	 *
	 * @public
	 * @param  {String} txt      
	 * @memberof $$notify
	 */
	$$notify.prototype.info = function(txt) {
		this._el.classList.add(this._options["info"]);
		this._el.innerHTML = txt;

		return this;
	};

	/**
	 * Timeout hide.
	 *
	 * @public
	 * @return {$q}
	 * @memberof $$notify
	 */
	$$notify.prototype.hide = function() {
		var promise = $q.defer();

		setTimeout(function() {
			this.reset();
			
			promise.resolve();
		}.bind(this), this._HIDE_TIMEOUT);

		return promise;
	};

	return $$notify;
}]);
