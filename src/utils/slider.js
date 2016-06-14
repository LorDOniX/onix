onix.factory("$slider", [
	"$dom",
	"$event",
	"$common",
	"$math",
function(
	$dom,
	$event,
	$common,
	$math
) {
	/**
	 * Slider - slider with input for selecting numbers from the range.
	 * 
	 * @param {HTMLElement} parent Where is canvas appended
	 * @param {Object} [optsArg] Configuration
	 * @param {Number} [optsArg.min=0] Min value
	 * @param {Number} [optsArg.max=100] Max value
	 * @param {Number} [optsArg.wheelStep=1] Mouse wheel step value
	 * @param {Number} [optsArg.timeout=333] Timeout for signal fire (keydown, move)
	 * @class $slider
	 */
	var $slider = function(parent, optsArg) {
		// event init
		this._eventInit();
		
		this._parent = parent;
		this._root = this._create();

		this._opts = {
			min: 0,
			max: 100,
			wheelStep: 1,
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

		parent.appendChild(this._root);

		this._binds = {
			keyUp: this._keyUp.bind(this),
			click: this._click.bind(this),
			mouseDownCaret: this._mouseDownCaret.bind(this),
			mouseMove: this._mouseMove.bind(this),
			mouseWheel: this._mouseWheel.bind(this),
			mouseUp: this._mouseUp.bind(this),
			sendSignalInner: this._sendSignalInner.bind(this)
		};

		this._mouse = {
			bcr: null
		};

		this._els.input.addEventListener("keyup", this._binds.keyUp);
		this._els.tube.addEventListener("click", this._binds.click);
		this._els.caret.addEventListener("mousedown", this._binds.mouseDownCaret);
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
	 * Get mouse coordinates.
	 * 
	 * @param  {Event} e
	 * @return {Object}
	 * @private
	 * @member $slider
	 */
	$slider.prototype._getMouseXY = function(e) {
		return {
			x: e.clientX - this._mouse.bcr.left,
			y: e.clientY - this._mouse.bcr.top
		}
	};

	/**
	 * Set mouse bounding client rect from canvas el.
	 * 
	 * @private
	 * @member $slider
	 */
	$slider.prototype._setBCR = function() {
		this._mouse.bcr = this._els.lineHolder.getBoundingClientRect();
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
		var errors = false;

		if (isNaN(value) || value < this._opts.min || value > this._opts.max) {
			errors = true;
		}
		else {
			// set new value
			this.setValue(value);
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

		this._setBCR();

		var width = this._els.lineHolder.offsetWidth;
		var value = this._getMouseXY(e).x;
		var ratio = value / width;

		// increate click range
		if (ratio <= 0.05) {
			value = 0;
		}
		else if (ratio >= 0.95) {
			value = width;
		}

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

		this._setBCR();

		document.addEventListener("mousemove", this._binds.mouseMove);
		document.addEventListener("mouseup", this._binds.mouseUp);
	};

	/**
	 * Mouse move event over line holder - only if was clicked on the caret.
	 *
	 * @param {Event} e
	 * @member $slider
	 * @private
	 */
	$slider.prototype._mouseMove = function(e) {
		var caretEl = this._els.caret;
		var posX = this._getMouseXY(e).x;

		this._setCaret(posX);
		this._setValue(posX);
	};

	/**
	 * Mouse up event over the document.
	 * 
	 * @member $slider
	 * @private
	 */
	$slider.prototype._mouseUp = function() {
		document.removeEventListener("mousemove", this._binds.mouseMove);
		document.removeEventListener("mouseup", this._binds.mouseUp);
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
			this.setValue(this._value + this._opts.wheelStep);
			this._sendSignal();
		}
		else {
			this.setValue(this._value - this._opts.wheelStep);
			this._sendSignal();
		}
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
		this._els.input.classList.remove("error");

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
		if (typeof value === "number") {
			value = $math.setRange(value, this._opts.min, this._opts.max);

			this._value = value;
			this._els.input.value = value;
			this._els.input.classList.remove("error");
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

		this._value = $math.setRange(this._value, this._opts.min, this._opts.max);

		this.setValue(this._value);
	};

	return $slider;
}]);
