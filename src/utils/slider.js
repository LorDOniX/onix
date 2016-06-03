onix.factory("$slider", [
	"$dom",
	"$event",
	"$common",
function(
	$dom,
	$event,
	$common
) {
	/**
	 * Slider - slider with input for selecting numbers from the range.
	 * 
	 * @param {HTMLElement} parent Where is canvas appended
	 * @param {Object} [optsArg] Configuration
	 * @param {Number} [optsArg.min] Min value
	 * @param {Number} [optsArg.max] Max value
	 * @param {Number} [optsArg.timeout] Timeout for signal fire (keydown, move)
	 * @class $slider
	 */
	var $slider = function(parent, optsArg) {
		this._parent = parent;
		this._root = this._create();

		this._opts = {
			min: 0,
			max: 100,
			timeout: 333
		};

		for (var key in optsArg) {
			this._opts[key] = optsArg[key];
		}

		// selected value
		this._value = null;

		// signal change - helper
		this._signalObj = {
			id: null,
			lastValue: null
		};

		// is key down?
		this._isKeydown = false;

		parent.appendChild(this._root);

		this._binds = {
			keyUp: this._keyUp.bind(this),
			click: this._click.bind(this),
			mouseDownCaret: this._mouseDownCaret.bind(this),
			mouseMoveLineHolder: this._mouseMoveLineHolder.bind(this),
			mouseUpDocument: this._mouseUpDocument.bind(this),
			sendSignalInner: this._sendSignalInner.bind(this),
			mouseWheel: this._mouseWheel.bind(this)
		};

		this._els.input.addEventListener("keyup", this._binds.keyUp);
		this._els.tube.addEventListener("click", this._binds.click);
		this._els.caret.addEventListener("mousedown", this._binds.mouseDownCaret);
		this._els.lineHolder.addEventListener("mousemove", this._binds.mouseMoveLineHolder);
		// firefox
		this._els.lineHolder.addEventListener("DOMMouseScroll", this._binds.mouseWheel);
		// others
		this._els.lineHolder.addEventListener("mousewheel", this._binds.mouseWheel);
		
		// def. max value
		this.setValue(this._opts.max);
	};

	/**
	 * Extend $slider with events functionality.
	 */
	$common.inherit($slider, $event);

	/**
	 * Create slider and his children.
	 *
	 * @member $slider
	 * @private
	 */
	$slider.prototype._create = function() {
		this._els = {};

		return $dom.create({
			el: "div",
			"class": "slider",
			child: [{
				el: "input",
				type: "text",
				value: "",
				_exported: "input"
			}, {
				el: "span",
				"class": "line-holder",
				_exported: "lineHolder",
				child: [{
					el: "span",
					"class": "lh-tube",
					_exported: "tube"
				}, {
					el: "span",
					"class": "lh-caret",
					_exported: "caret"
				}]
			}]
		}, this._els);
	};

	/**
	 * Set caret position.
	 * 
	 * @param {Number} posX Value [px] caret offset accord to the start
	 * @member $slider
	 * @private
	 */
	$slider.prototype._setCaret = function(posX) {
		var width = this._els.lineHolder.offsetWidth;

		if (posX < 0) {
			posX = 0;
		}
		else if (posX > width) {
			posX = width;
		}

		this._els.caret.style.left = posX.toFixed(2) + "px";
	};

	/**
	 * Key up event from the input.
	 *
	 * @member $slider
	 * @private
	 */
	$slider.prototype._keyUp = function() {
		var inputEl = this._els.input;
		var value = parseFloat(inputEl.value);
		var errors = 0;

		if (isNaN(value)) {
			errors++;
		}
		else if (!this.setValue(value)) {
			errors++;
		}
		else {
			this._sendSignal(true);
		}

		inputEl.classList[errors ? "add" : "remove"]("error");
	};

	/**
	 * Click on tube event.
	 *
	 * @param {Event} e
	 * @member $slider
	 * @private
	 */
	$slider.prototype._click = function(e) {
		e.stopPropagation();
		e.preventDefault();

		var width = this._els.lineHolder.offsetWidth;
		var value = e.offsetX;
		var ratio = value / width;

		// increate click range
		if (ratio <= 0.05) {
			value = 0;
		}
		else if (ratio >= 0.95) {
			value = width;
		}

		this._isKeydown = false;
		this._setCaret(value);
		this._setValue(value, true);
	};

	/**
	 * Click on the caret event, binds mouse up over the document.
	 *
	 * @param {Event} e
	 * @member $slider
	 * @private
	 */
	$slider.prototype._mouseDownCaret = function(e) {
		e.stopPropagation();
		e.preventDefault();

		this._isKeydown = true;

		document.addEventListener("mouseup", this._binds.mouseUpDocument);
	};

	/**
	 * Mouse up event over the document.
	 * 
	 * @member $slider
	 * @private
	 */
	$slider.prototype._mouseUpDocument = function() {
		this._isKeydown = false;

		document.removeEventListener("mouseup", this._binds.mouseUpDocument);
	};

	/**
	 * Mouse move event over line holder - only if was clicked on the caret.
	 *
	 * @param {Event} e
	 * @member $slider
	 * @private
	 */
	$slider.prototype._mouseMoveLineHolder = function(e) {
		if (!this._isKeydown) return;

		var posX = e.offsetX;
		var caretEl = this._els.caret;

		if (e.target == caretEl) {
			posX += parseFloat(caretEl.style.left) - caretEl.offsetWidth / 2;
		}

		this._setCaret(posX);
		this._setValue(posX);
	};

	/**
	 * Get value -> position convert.
	 *
	 * @param {Number} value Value in the range --> [px] position for the caret.
	 * @return {Number}
	 * @member $slider
	 * @private
	 */
	$slider.prototype._getPosFromValue = function(value) {
		value = value || this._value;

		var width = this._els.lineHolder.offsetWidth;
		var range = this._opts.max - this._opts.min;
		var posX = (value - this._opts.min) / range * width;

		return posX;
	};

	/**
	 * Set value using caret position. Fires signal "change".
	 *
	 * @param {Number} posX Value on the axe x
	 * @param {Boolean} [fromClick] It was called from click method?
	 * @member $slider
	 * @private
	 */
	$slider.prototype._setValue = function(posX, fromClick) {
		posX = posX || 0;

		var width = this._els.lineHolder.offsetWidth;
		var range = this._opts.max - this._opts.min;

		if (posX < 0) {
			posX = 0;
		}
		else if (posX > width) {
			posX = width;
		}

		var value = Math.round(posX / width * range + this._opts.min);

		this._value = value;
		this._els.input.value = value;

		this._sendSignal(!fromClick);
	};

	/**
	 * Delayed sending of signal.
	 *
	 * @param {Boolean} [withTimeout] Send with timeout?
	 * @member $slider
	 * @private
	 */
	$slider.prototype._sendSignal = function(withTimeout) {
		if (this._signalObj.id) {
			clearTimeout(this._signalObj.id);
			this._signalObj.id = null;
		}

		if (withTimeout) {
			this._signalObj.id = setTimeout(this._binds.sendSignalInner, this._opts.timeout);
		}
		else {
			this._sendSignalInner();
		}
	};

	/**
	 * Mouse wheel event.
	 *
	 * @param {Event} e Mouse event
	 * @private
	 * @member $slider
	 */
	$slider.prototype._mouseWheel = function(e) {
		var delta = e.wheelDelta || -e.detail;
		if (!delta) { return; }

		e.stopPropagation();
		e.preventDefault();

		if (delta > 0) {
			this.setValue(this._value + 1);
			this._sendSignal();
		}
		else {
			this.setValue(this._value - 1);
			this._sendSignal();
		}
	};

	/**
	 * Delayed sending of signal - inner method.
	 *
	 * @member $slider
	 * @private
	 */
	$slider.prototype._sendSignalInner = function() {
		if (this._value == this._signalObj.lastValue) return;

		this._signalObj.lastValue = this._value;
		this.trigger("change", this._value);
	};

	/**
	 * Set slider value.
	 * 
	 * @param {Number} value New value
	 * @return {Boolean} If there was error, it returns false
	 * @member $slider
	 */
	$slider.prototype.setValue = function(value) {
		if (typeof value === "number" && value >= this._opts.min && value <= this._opts.max) {
			this._value = value;
			this._els.input.value = value;
			this._setCaret(this._getPosFromValue(value));
			return true;
		}
		else {
			return false;
		}
	};

	/**
	 * Get slider value.
	 * 
	 * @return {Number}
	 * @member $slider
	 */
	$slider.prototype.getValue = function() {
		return this._value;
	};

	/**
	 * Overwrite configuration object.
	 *
	 * @param {Object} optsArg See constructor.
	 * @member $slider
	 */
	$slider.prototype.rewriteOpts = function(optsArg) {
		for (var key in optsArg) {
			this._opts[key] = optsArg[key];
		}

		if (this._value < this._opts.min || this._value > this._opts.max) {
			this._value = this._opts.max;
		}

		this.setValue(this._value);
	};

	return $slider;
}]);
