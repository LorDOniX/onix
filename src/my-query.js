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
	var $myQuery = function(value, parent) {
		this._els = [];
		parent = parent || document;

		if (typeof value === "string") {
			this._els = parent.querySelectorAll(value);
		}
		else if (Array.isArray(value)) {
			this._els = value;
		}
		else {
			this._els.push(value);
		}

		return this;
	};

	/**
	 * Operation on elements
	 * 
	 * @param  {Function} cb
	 * @param  {Function} [scope]
	 * @member $myQuery
	 * @private
	 */
	$myQuery.prototype._operation = function(cb, scope) {
		// NodeList -> Array
		if (!Array.isArray(this._els)) {
			this._els = Array.prototype.slice.call(this._els);
		}

		this._els.forEach(function(item, ind) {
			cb.apply(scope || cb, [item, ind]);
		});
	};

	/**
	 * Set or get all - cover function.
	 * 
	 * @chainable
	 * @param  {String} [newValue]
	 * @param  {String} attr
	 * @member $myQuery
	 * @private
	 */
	$myQuery.prototype._setGetAll = function(newValue, attr) {
		if (newValue) {
			this._operation(function(item) {
				item[attr] = newValue;
			});

			return this;
		}
		else {
			var values = [];

			this._operation(function(item) {
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
	};

	/**
	 * Get original element.
	 *
	 * @param  {Number} [ind]
	 * @return {HTMLElement}
	 * @member $myQuery
	 */
	$myQuery.prototype.getEl = function(ind) {
		ind = ind || 0;

		if (ind > this._els.length) {
			return null;
		}
		else {
			return this._els[ind];
		}
	};

	/**
	 * Get or set attribute
	 *
	 * @chainable
	 * @param  {String} name
	 * @param  {String} [newValue]
	 * @return {String|Array}
	 * @member $myQuery
	 */
	$myQuery.prototype.attr = function(name, newValue) {
		if (newValue) {
			this._operation(function(item) {
				item.setAttribute(name, newValue);
			});

			return this;
		}
		else {
			var values = [];

			this._operation(function(item) {
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
	};

	/**
	 * Get or set src
	 * 
	 * @param  {String} [newValue]
	 * @return {String}
	 * @member $myQuery
	 */
	$myQuery.prototype.src = function(newValue) {
		return this._setGetAll(newValue, "src");
	};

	/**
	 * Hide element
	 * 
	 * @chainable
	 * @member $myQuery
	 */
	$myQuery.prototype.hide = function() {
		this._operation(function(item) {
			item.style.display = "none";
		});

		return this;
	};

	/**
	 * Show element
	 *
	 * @chainable
	 * @param  {String} [displayStyle]
	 * @member $myQuery
	 */
	$myQuery.prototype.show = function(displayStyle) {
		this._operation(function(item) {
			item.style.display = displayStyle || "";
		});

		return this;
	};

	/**
	 * Get or set value
	 *
	 * @chainable
	 * @param  {String} [newValue]
	 * @return {String}
	 * @member $myQuery
	 */
	$myQuery.prototype.val = function(newValue) {
		return this._setGetAll(newValue, "value");
	};

	/**
	 * Get or set HTML
	 * 
	 * @param  {String} [newValue]
	 * @return {String}
	 * @member $myQuery
	 */
	$myQuery.prototype.html = function(newValue) {
		return this._setGetAll(newValue, "innerHTML");
	};

	/**
	 * Append another element to this one
	 *
	 * @chainable
	 * @param  {HTMLElement} child
	 * @member $myQuery
	 */
	$myQuery.prototype.append = function(child) {
		this._operation(function(item) {
			item.appendChild(child);
		});

		return this;
	};

	/**
	 * Add CSS class
	 *
	 * @chainable
	 * @param  {String} className
	 * @member $myQuery
	 */
	$myQuery.prototype.addClass = function(className) {
		this._operation(function(item) {
			item.classList.add(className);
		});

		return this;
	};

	/**
	 * Remove CSS class
	 *
	 * @chainable
	 * @param  {String} className
	 * @member $myQuery
	 */
	$myQuery.prototype.removeClass = function(className) {
		this._operation(function(item) {
			item.classList.remove(className);
		});

		return this;
	};

	/**
	 * Toggle CSS class
	 *
	 * @chainable
	 * @param  {String} className
	 * @member $myQuery
	 */
	$myQuery.prototype.toggleClass = function(className) {
		this._operation(function(item) {
			item.classList.toggle(className);
		});

		return this;
	};

	/**
	 * Get width
	 * 
	 * @return {Number}
	 * @member $myQuery
	 */
	$myQuery.prototype.width = function() {
		var width = 0;

		this._operation(function(item) {
			width += item.offsetWidth;
		});

		return width;
	};

	/**
	 * Get height
	 * 
	 * @return {Number}
	 * @member $myQuery
	 */
	$myQuery.prototype.height = function() {
		var height = 0;

		this._operation(function(item) {
			height += item.offsetHeight;
		});

		return height;
	};

	/**
	 * Click event
	 *
	 * @chainable
	 * @param  {Function} cb
	 * @param  {Function} [scope]
	 * @member $myQuery
	 */
	$myQuery.prototype.click = function(cb, scope) {
		this._operation(function(item) {
			item.addEventListener("click", function(event) {
				cb.apply(scope || cb, [event, item]);
			});
		});

		return this;
	};

	/**
	 * Change event
	 *
	 * @chainable
	 * @param  {Function} cb
	 * @param  {Function} [scope]
	 * @member $myQuery
	 */
	$myQuery.prototype.change = function(cb, scope) {
		this._operation(function(item) {
			item.addEventListener("change", function(event) {
				cb.apply(scope || cb, [event, item]);
			});
		});

		return this;
	};

	/**
	 * Foreach
	 *
	 * @chainable
	 * @param  {Function} cb
	 * @param  {Function} [scope]
	 * @member $myQuery
	 */
	$myQuery.prototype.forEach = function(cb, scope) {
		this._operation(function(item, ind) {
			cb.apply(scope || cb, [item, ind]);
		});

		return this;
	};

	/**
	 * Remove element
	 *
	 * @chainable
	 * @member $myQuery
	 */
	$myQuery.prototype.remove = function() {
		this._operation(function(item) {
			item.parentNode.removeChild(item);
		});

		return this;
	};

	/**
	 * Prepend element
	 *
	 * @chainable
	 * @param  {HTMLElement} child
	 * @member $myQuery
	 */
	$myQuery.prototype.prepend = function(child) {
		this._operation(function(item) {
			item.parentNode.insertBefore(child, item);
		});

		return this;
	};

	/**
	 * Empty element - clear all its children.
	 * Much faster than innerHTML = "".
	 * 
	 * @chainable
	 * @member $myQuery
	 */
	$myQuery.prototype.empty = function() {
		this._operation(function(item) {
			while (item.firstChild) {
				item.removeChild(item.firstChild);
			}
		});

		return this;
	};

	/**
	 * Get all elements length
	 * 
	 * @return {Number}
	 * @member $myQuery
	 */
	$myQuery.prototype.len = function() {
		return this._els.length;
	};

	/**
	 * Quick acces to myQuery and DOM manipulation
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
		 * Main cover function
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

// needs to be cached
onix.run(["$myQuery", function($myQuery) {}]);
