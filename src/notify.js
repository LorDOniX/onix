/**
 * @class $notify
 *
 * $notify uses bootstrap alerts and provides additional functionality
 */
onix.service("$notify", function() {
	/**
	 * Create notification object from the element
	 * 
	 * @param {HTMLElement} el
	 * @member $notify
	 */
	var $notify = function(el) {
		this._el = el;

		this._HIDE_TIMEOUT = 1500; // [ms]

		this._options = {
			"ok": "alert-success",
			"error": "alert-danger",
			"info": "alert-info",
			"warn": "alert-warning"
		};

		return this;
	};

	/**
	 * Set value to the notify element
	 *
	 * @param  {String|HTMLElement} txt
	 * @member $notify
	 * @private
	 */
	$notify.prototype._setValue = function(txt) {
		if ($common.isElement(txt)) {
			onix.element(this._el).empty().append(txt);
		}
		else if (typeof txt === "string") {
			this._el.innerHTML = txt;
		}
	};

	/**
	 * Reset CSS classes
	 *
	 * @member $notify
	 */
	$notify.prototype.reset = function() {
		Object.keys(this._options).forEach(function(key) {
			this._el.classList.remove(this._options[key]);
		}.bind(this));

		return this;
	};

	/**
	 * Show OK state
	 * 
	 * @param  {String|HTMLElement} txt
	 * @member $notify
	 */
	$notify.prototype.ok = function(txt) {
		this._el.classList.add(this._options["ok"]);
		
		this._setValue(txt);

		return this;
	};

	/**
	 * Show ERROR state
	 * 
	 * @param  {String|HTMLElement} txt
	 * @member $notify
	 */
	$notify.prototype.error = function(txt) {
		this._el.classList.add(this._options["error"]);
		
		this._setValue(txt);

		return this;
	};

	/**
	 * Show INFO state
	 *
	 * @param  {String|HTMLElement} txt
	 * @member $notify
	 */
	$notify.prototype.info = function(txt) {
		this._el.classList.add(this._options["info"]);
		
		this._setValue(txt);

		return this;
	};

	/**
	 * Show WARNING state
	 *
	 * @param  {String|HTMLElement} txt
	 * @member $notify
	 */
	$notify.prototype.warn = function(txt) {
		this._el.classList.add(this._options["warn"]);
		
		this._setValue(txt);

		return this;
	};

	/**
	 * Hide alert after timeout and returns promise at the end of operation
	 *
	 * @return {$q}
	 * @member $notify
	 */
	$notify.prototype.hide = function() {
		var promise = $q.defer();

		setTimeout(function() {
			this.reset();
			
			promise.resolve();
		}.bind(this), this._HIDE_TIMEOUT);

		return promise;
	};

	/**
	 * Main public access to the notify obj
	 *
	 * @param  {HTMLElement} el
	 * @return {$notify}
	 * @member $notify
	 */
	this.get = function(el) {
		return new $notify(el);
	};
});
