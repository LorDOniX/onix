onix.factory("$myQuery", function() {
	/**
	 * DOM manipulation in the style of jquery.
	 * 
	 * @class $myQuery
	 * @chainable
	 * @param {String|HTMLElement|Array} value
	 * @param {HTMLElement} [parent]
	 * @member $myQuery
	 */
	class $myQuery {
		constructor(value, parent) {
			parent = parent || document;

			this._els = [];

			if (typeof value === "string") {
				if (parent instanceof $myQuery) {
					parent = parent.getEl();
				}

				this._els = parent.querySelectorAll(value);
			}
			else if (Array.isArray(value)) {
				this._els = value;
			}
			else {
				this._els.push(value);
			}

			return this;
		}

		/**
		 * Operation on elements.
		 * 
		 * @param  {Function} cb
		 * @param  {Function} [scope]
		 * @member $myQuery
		 * @private
		 * @method _operation
		 */
		_operation(cb, scope) {
			// NodeList -> Array
			if (!Array.isArray(this._els)) {
				this._els = Array.prototype.slice.call(this._els);
			}

			this._els.forEach((item, ind) => {
				cb.apply(scope || cb, [item, ind]);
			});
		}

		/**
		 * Set or get all - cover function.
		 * 
		 * @chainable
		 * @param  {String} newValue
		 * @param  {String} attr
		 * @member $myQuery
		 * @private
		 * @method _setGetAll
		 */
		_setGetAll(newValue, attr) {
			if (newValue) {
				this._operation(item => {
					item[attr] = newValue;
				});

				return this;
			}
			else {
				let values = [];

				this._operation(item => {
					values.push(item[attr]);
				});

				if (!values.length) {
					return null;
				}
				else if (values.length == 1) {
					return values[0];
				}
				else {
					return values;
				}
			}
		}

		/**
		 * Get original element.
		 *
		 * @param  {Number} [ind]
		 * @return {HTMLElement}
		 * @member $myQuery
		 * @method getEl
		 */
		getEl(ind) {
			ind = ind || 0;

			if (ind > this._els.length) {
				return null;
			}
			else {
				return this._els[ind];
			}
		}

		/**
		 * Get or set attribute.
		 *
		 * @chainable
		 * @param  {String} name
		 * @param  {String} [newValue]
		 * @return {String|Array}
		 * @member $myQuery
		 * @method attr
		 */
		attr(name, newValue) {
			if (newValue) {
				this._operation(item => {
					item.setAttribute(name, newValue);
				});

				return this;
			}
			else {
				let values = [];

				this._operation(item => {
					values.push(item.getAttribute(name));
				});

				if (!values.length) {
					return null;
				}
				else if (values.length == 1) {
					return values[0];
				}
				else {
					return values;
				}
			}
		}

		/**
		 * Get or set src.
		 * 
		 * @param  {String} [newValue]
		 * @return {String}
		 * @member $myQuery
		 * @method src
		 */
		src(newValue) {
			return this._setGetAll(newValue, "src");
		}

		/**
		 * Hide element.
		 * 
		 * @chainable
		 * @member $myQuery
		 * @method hide
		 */
		hide() {
			this._operation(item => {
				item.style.display = "none";
			});

			return this;
		}

		/**
		 * Show element.
		 *
		 * @chainable
		 * @param  {String} [displayStyle]
		 * @member $myQuery
		 * @method show
		 */
		show(displayStyle) {
			this._operation(item => {
				item.style.display = displayStyle || "";
			});

			return this;
		}

		/**
		 * Get or set value.
		 *
		 * @chainable
		 * @param  {String} [newValue]
		 * @return {String}
		 * @member $myQuery
		 * @method val
		 */
		val(newValue) {
			return this._setGetAll(newValue, "value");
		}

		/**
		 * Get or set HTML.
		 * 
		 * @param  {String} [newValue]
		 * @return {String}
		 * @member $myQuery
		 * @method html
		 */
		html(newValue) {
			return this._setGetAll(newValue, "innerHTML");
		}

		/**
		 * Append another element to this one.
		 *
		 * @chainable
		 * @param  {HTMLElement} child
		 * @member $myQuery
		 * @method  append
		 */
		append(child) {
			this._operation(item => {
				item.appendChild(child);
			});

			return this;
		}

		/**
		 * Add CSS class.
		 *
		 * @chainable
		 * @param  {String} className
		 * @member $myQuery
		 * @method addClass
		 */
		addClass(className) {
			this._operation(item => {
				item.classList.add(className);
			});

			return this;
		}

		/**
		 * Remove CSS class.
		 *
		 * @chainable
		 * @param  {String} className
		 * @member $myQuery
		 * @method removeClass
		 */
		removeClass(className) {
			this._operation(item => {
				item.classList.remove(className);
			});

			return this;
		}

		/**
		 * Toggle CSS class.
		 *
		 * @chainable
		 * @param  {String} className
		 * @member $myQuery
		 * @method toggleClass
		 */
		toggleClass(className) {
			this._operation(item => {
				item.classList.toggle(className);
			});

			return this;
		}

		/**
		 * Get width.
		 * 
		 * @return {Number}
		 * @member $myQuery
		 * @method width
		 */
		width() {
			let width = 0;

			this._operation(item => {
				width += item.offsetWidth;
			});

			return width;
		}

		/**
		 * Get height.
		 * 
		 * @return {Number}
		 * @member $myQuery
		 * @method height
		 */
		height() {
			let height = 0;

			this._operation(item => {
				height += item.offsetHeight;
			});

			return height;
		}

		/**
		 * Click event.
		 *
		 * @chainable
		 * @param  {Function} cb
		 * @param  {Function} [scope]
		 * @member $myQuery
		 * @method click
		 */
		click(cb, scope) {
			this._operation(item => {
				item.addEventListener("click", event => {
					cb.apply(scope || cb, [event, item]);
				});
			});

			return this;
		}

		/**
		 * Change event.
		 *
		 * @chainable
		 * @param  {Function} cb
		 * @param  {Function} [scope]
		 * @member $myQuery
		 * @method change
		 */
		change(cb, scope) {
			this._operation(item => {
				item.addEventListener("change", event => {
					cb.apply(scope || cb, [event, item]);
				});
			});

			return this;
		}

		/**
		 * Foreach.
		 *
		 * @chainable
		 * @param  {Function} cb
		 * @param  {Function} [scope]
		 * @member $myQuery
		 * @method forEach
		 */
		forEach(cb, scope) {
			this._operation((item, ind) => {
				cb.apply(scope || cb, [item, ind]);
			});

			return this;
		}

		/**
		 * Remove element.
		 *
		 * @chainable
		 * @member $myQuery
		 * @method remove
		 */
		remove() {
			this._operation(item => {
				item.parentNode.removeChild(item);
			});

			return this;
		}

		/**
		 * Prepend element.
		 *
		 * @chainable
		 * @param  {HTMLElement} child
		 * @member $myQuery
		 * @method prepend
		 */
		prepend(child) {
			this._operation(item => {
				item.parentNode.insertBefore(child, item);
			});

			return this;
		}

		/**
		 * Empty element - clear all its children.
		 * Much faster than innerHTML = "".
		 * 
		 * @chainable
		 * @member $myQuery
		 * @method empty
		 */
		empty() {
			this._operation(item => {
				while (item.firstChild) {
					item.removeChild(item.firstChild);
				}
			});

			return this;
		}

		/**
		 * Get all elements length.
		 * 
		 * @return {Number}
		 * @member $myQuery
		 * @method len
		 */
		len() {
			return this._els.length;
		}
	};

	/**
	 * Quick acces to myQuery and DOM manipulation.
	 *
	 * @param  {String|HTMLElement|Array} value
	 * @param {HTMLElement} [parent]
	 * @return {$myQuery}
	 * @member onix
	 * @property {Function}
	 */
	onix.element = function(value, parent) {
		return new $myQuery(value, parent);
	};

	return {
		 /**
		 * Main cover function.
		 * 
		 * @param  {String|HTMLElement|Array} value
		 * @param {HTMLElement} [parent]
		 * @return {$myQuery}
		 * @member $myQuery
		 */
		get: function(value, parent) {
			return new $myQuery(value, parent);
		}
	};
});

/**
 * Run for cache $myQuery object.
 */
onix.run(["$myQuery", function() {
	// empty
}]);
