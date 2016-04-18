/**
 * @class $localStorage
 *
 * Cover class for localStorage
 */
onix.service("$localStorage", function() {
	this._disable = !("localStorage" in window);

	/**
	 * Set value to localStorage
	 *
	 * @param {String} key
	 * @param {String} [value]
	 * @member $localStorage
	 */
	this.set = function(key, value) {
		if (this._disable || !key) return;

		localStorage.setItem(key, value);
	};

	/**
	 * Get value from localStorage
	 *
	 * @param {String} key
	 * @return {String}
	 * @member $localStorage
	 */
	this.get = function(key) {
		if (this._disable || !key) return null;

		return localStorage.getItem(key);
	};

	/**
	 * Remove key from localStorage
	 *
	 * @param {String} key
	 * @return {Boolean}
	 * @member $localStorage
	 */
	this.remove = function(key) {
		if (this._disable || !key) return null;

		return localStorage.removeItem(key);
	};
});
