Onix.service("Notify", ["Promise", function(Promise) {
	// ------------------------ private ----------------------------------------
	
	/**
	 * Notification object
	 * @param {NodeElement} el
	 */
	var Notify = function(el) {
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
	 */
	Notify.prototype.reset = function() {
		Object.keys(this._options).forEach(function(key) {
			this._el.classList.remove(this._options[key]);
		}.bind(this));

		return this;
	};

	/**
	 * Show OK state
	 * @param  {String} txt
	 */
	Notify.prototype.ok = function(txt) {
		this._el.classList.add(this._options["ok"]);
		this._el.innerHTML = txt;

		return this;
	};

	/**
	 * Show ERROR state
	 * @param  {String} txt      
	 */
	Notify.prototype.error = function(txt) {
		this._el.classList.add(this._options["error"]);
		this._el.innerHTML = txt;

		return this;
	};

	/**
	 * Show INFO state
	 * @param  {String} txt      
	 */
	Notify.prototype.info = function(txt) {
		this._el.classList.add(this._options["info"]);
		this._el.innerHTML = txt;

		return this;
	};

	/**
	 * Timeout hide.
	 * @return {Promise}
	 */
	Notify.prototype.hide = function() {
		var promise = new Promise();

		setTimeout(function() {
			this.reset();
			
			promise.resolve();
		}.bind(this), this._HIDE_TIMEOUT);

		return promise;
	};

	// ------------------------ public ----------------------------------------
	
	/**
	 * Main public access to the notify obj.
	 * @param  {NodeElement} el
	 * @return {Notify}
	 */
	this.get = function(el) {
		return new Notify(el);
	};
}]);
