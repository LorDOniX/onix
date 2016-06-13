onix.factory("$resize", [
	"$common",
	"$event",
function(
	$common,
	$event
) {
	// ------------------------ private ----------------------------------------
	
	/**
	 * Handle window resize event, triggers signal "resize".
	 *
	 * @class $resize
	 */
	var $resize = function() {
		// event init
		this._eventInit();

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
		 * Binds for functions.
		 *
		 * @member $resize
		 * @private
		 */
		this._binds = {
			resize: this._resize.bind(this),
			resizeInner: this._resizeInner.bind(this)
		};
	};

	// add events
	$common.inherit($resize, $event);

	/**
	 * Window resize event.
	 *
	 * @member $resize
	 * @private
	 */
	$resize.prototype._resize = function() {
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
	$resize.prototype._resizeInner = function() {
		this.trigger("resize");
	};
	
	// ------------------------ public ----------------------------------------

	/**
	 * Bind resize event to window object.
	 *
	 * @member $resize
	 */
	$resize.prototype.start = function() {
		if (this._active) return;

		window.addEventListener("resize", this._binds.resize);
		this._active = true;
	};

	/**
	 * Unbind resize event from window object.
	 *
	 * @member $resize
	 */
	$resize.prototype.end = function() {
		if (!this._active) return;

		window.removeEventListener("resize", this._binds.resize);
		this._active = false;
	};

	return new $resize();
}]);
