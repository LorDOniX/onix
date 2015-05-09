Onix.factory("MyQuery", function() {
	// ------------------------ private ---------------------------------------
	
	/**
	 * Cover function
	 * @param {String|NodeElement|Array} value
	 * @param {NodeElement} [parent]
	 * @return {Himself}
	 */
	var MyQuery = function(value, parent) {
		this._els = [];
		parent = parent || document;

		if (typeof value === "string") {
			this._els = parent.querySelectorAll(value);
		}
		else if (Array.isArray(value)) {
			this._els = value;
		}
		else {
			// node element todo
			this._els.push(value);
		}

		return this;
	};

	/**
	 * Operation on elements
	 * @param  {Function} cb
	 * @param  {Function} scope
	 */
	MyQuery.prototype._operation = function(cb, scope) {
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
	 * @param  {String} newValue
	 * @param  {String} attr
	 */
	MyQuery.prototype._setGetAll = function(newValue, attr) {
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
	 * @param  {Number} [ind]
	 * @return {NodeElement|Null}
	 */
	MyQuery.prototype.getEl = function(ind) {
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
	 * @param  {String} name 
	 * @param  {String} [newValue]
	 * @return {Himself|String|Array}
	 */
	MyQuery.prototype.attr = function(name, newValue) {
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
	 * @param  {String} [newValue]
	 * @return {Himself|String}
	 */
	MyQuery.prototype.src = function(newValue) {
		return this._setGetAll(newValue, "src");
	};

	/**
	 * Hide element
	 * @return {Himself}
	 */
	MyQuery.prototype.hide = function() {
		this._operation(function(item) {
			item.style.display = "none";
		});

		return this;
	};

	/**
	 * Show element
	 * @param  {String} [displayStyle]
	 * @return {Himself}
	 */
	MyQuery.prototype.show = function(displayStyle) {
		this._operation(function(item) {
			item.style.display = displayStyle || "block";
		});

		return this;
	};

	/**
	 * Get or set value
	 * @param  {String} [newValue]
	 * @return {Himself|String}
	 */
	MyQuery.prototype.val = function(newValue) {
		return this._setGetAll(newValue, "value");
	};

	/**
	 * Get or set HTML
	 * @param  {String} [newValue]
	 * @return {Himself|String}
	 */
	MyQuery.prototype.html = function(newValue) {
		return this._setGetAll(newValue, "innerHTML");
	};

	/**
	 * Append another element to this one
	 * TODO: cannot use on n elements
	 * @param  {NodeElement} child
	 * @return {Himself}
	 */
	MyQuery.prototype.append = function(child) {
		this._operation(function(item) {
			item.appendChild(child);
		});

		return this;
	};

	/**
	 * Add css class
	 * @param  {String} className
	 * @return {Himself}
	 */
	MyQuery.prototype.addClass = function(className) {
		this._operation(function(item) {
			item.classList.add(className);
		});

		return this;
	};

	/**
	 * Remove css class
	 * @param  {String} className
	 * @return {Himself}
	 */
	MyQuery.prototype.removeClass = function(className) {
		this._operation(function(item) {
			item.classList.remove(className);
		});

		return this;
	};

	/**
	 * Toggle css class
	 * @param  {String} className
	 * @return {Himself}
	 */
	MyQuery.prototype.toggleClass = function(className) {
		this._operation(function(item) {
			item.classList.toggle(className);
		});

		return this;
	};

	/**
	 * Get width
	 * @return {Number}
	 */
	MyQuery.prototype.width = function() {
		var width = 0;

		this._operation(function(item) {
			width += item.offsetWidth;
		});

		return width;
	};

	/**
	 * Get height
	 * @return {Number}
	 */
	MyQuery.prototype.height = function() {
		var height = 0;

		this._operation(function(item) {
			height += item.offsetHeight;
		});

		return height;
	};

	/**
	 * Click event
	 * @param  {Function} cb
	 * @param  {Function} scope
	 * @return {Himself}
	 */
	MyQuery.prototype.click = function(cb, scope) {
		this._operation(function(item) {
			item.addEventListener("click", function(event) {
				cb.apply(scope || cb, [event, item]);
			});
		});

		return this;
	};

	/**
	 * Change event
	 * @param  {Function} cb
	 * @param  {Function} scope
	 * @return {Himself}
	 */
	MyQuery.prototype.change = function(cb, scope) {
		this._operation(function(item) {
			item.addEventListener("change", function(event) {
				cb.apply(scope || cb, [event, item]);
			});
		});

		return this;
	};

	/**
	 * Foreach
	 * @param  {Function} cb
	 * @param  {Function} scope
	 * @return {Himself}
	 */
	MyQuery.prototype.forEach = function(cb, scope) {
		this._operation(function(item, ind) {
			cb.apply(scope || cb, [item, ind]);
		});

		return this;
	};

	/**
	 * Remove element
	 * @return {Himself}
	 */
	MyQuery.prototype.remove = function() {
		this._operation(function(item) {
			item.parentNode.removeChild(item);
		});

		return this;
	};

	/**
	 * Prepend element
	 * @param  {NodeElement} child
	 * @return {Himself}
	 */
	MyQuery.prototype.prepend = function(child) {
		this._operation(function(item) {
			item.parentNode.insertBefore(child, item);
		});

		return this;
	};

	/**
	 * Get all elements length
	 * @return {Number}
	 */
	MyQuery.prototype.len = function() {
		return this._els.length;
	};

	// ------------------------ public ---------------------------------------

	return {
		 /**
		 * Main cover function.
		 * @param  {String|NodeElement|Array} value
		 * @param {NodeElement} [parent]
		 * @return {MyQuery}
		 */
		get: function(value, parent) {
			return new MyQuery(value, parent);
		}
	};
});
