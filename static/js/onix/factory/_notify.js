onix.factory("$$notify", [
	"$q",
	"$common",
function(
	$q,
	$common
) {
	/**
	 * Notification object
	 * DI: $q; $common;
	 *
	 * @class $$notify
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
	 * Set value to the notify element
	 *
	 * @private
	 * @param  {String|NodeElement} txt
	 * @memberof $$notify
	 */
	$$notify.prototype._setValue = function(txt) {
		if ($common.isElement(txt)) {
			onix.element(this._el).empty().append(txt);
		}
		else if (typeof txt === "string") {
			this._el.innerHTML = txt;
		}
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
	 * @param  {String|NodeElement} txt
	 * @memberof $$notify
	 */
	$$notify.prototype.ok = function(txt) {
		this._el.classList.add(this._options["ok"]);
		
		this._setValue(txt);

		return this;
	};

	/**
	 * Show ERROR state
	 * 
	 * @public
	 * @param  {String|NodeElement} txt
	 * @memberof $$notify
	 */
	$$notify.prototype.error = function(txt) {
		this._el.classList.add(this._options["error"]);
		
		this._setValue(txt);

		return this;
	};

	/**
	 * Show INFO state
	 *
	 * @public
	 * @param  {String|NodeElement} txt
	 * @memberof $$notify
	 */
	$$notify.prototype.info = function(txt) {
		this._el.classList.add(this._options["info"]);
		
		this._setValue(txt);

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
