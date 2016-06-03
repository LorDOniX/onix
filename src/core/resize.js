/**
 * Handle window resize event, triggers signal "resize".
 *
 * @class $resize
 */
onix.service("$resize", [
	"$common",
	"$event",
function(
	$common,
	$event
) {
	// ------------------------ private ----------------------------------------
	
	/**
	 * Is active?
	 *
	 * @member $resize
	 * @private
	 */
	this._active = false;
	
	/**
	 * Resize object.
	 *
	 * @member $resize
	 * @private
	 */
	this._resizeObj = {
		id: null,
		timeout: 333
	};

	/**
	 * Window resize event.
	 *
	 * @member $resize
	 * @private
	 */
	this._resize = function() {
		if (this._resizeObj.id) {
			clearTimeout(this._resizeObj.id);
			this._resizeObj.id = null;
		}

		this._resizeObj.id = setTimeout(this._binds.resizeInner, this._resizeObj.timeout);
	};

	/**
	 * Window resize event - trigger signal "resize".
	 *
	 * @member $resize
	 * @private
	 */
	this._resizeInner = function() {
		this.trigger("resize");
	};

	/**
	 * Binds for functions.
	 *
	 * @member $resize
	 * @private
	 */
	this._binds = {
		resize: this._resize.bind(this),
		resizeInner: this._resizeInner.bind(this)
	};
	
	// ------------------------ public ----------------------------------------
	
	// add events
	$common.extend(this, new $event());

	/**
	 * Bind resize event to window object.
	 *
	 * @member $resize
	 */
	this.start = function() {
		if (this._active) return;

		window.addEventListener("resize", this._binds.resize);
		this._active = true;
	};

	/**
	 * Unbind resize event from window object.
	 *
	 * @member $resize
	 */
	this.end = function() {
		if (!this._active) return;

		window.removeEventListener("resize", this._binds.resize);
		this._active = false;
	};
}]);
