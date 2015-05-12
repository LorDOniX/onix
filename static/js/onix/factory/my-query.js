onix.factory("MyQuery", function() {
	/**
	 * Parent: MyQuery; Cover function
	 * 
	 * @class _MyQuery
	 * @param {String|NodeElement|Array} value
	 * @param {NodeElement} [parent]
	 * @return {Himself}
	 */
	var _MyQuery = function(value, parent) {
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
	 * 
	 * @private
	 * @param  {Function} cb
	 * @param  {Function} scope
	 * @memberof _MyQuery
	 */
	_MyQuery.prototype._operation = function(cb, scope) {
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
	 * @private
	 * @param  {String} newValue
	 * @param  {String} attr
	 * @memberof _MyQuery
	 */
	_MyQuery.prototype._setGetAll = function(newValue, attr) {
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
	 * @public
	 * @param  {Number} [ind]
	 * @return {NodeElement|Null}
	 * @memberof _MyQuery
	 */
	_MyQuery.prototype.getEl = function(ind) {
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
	 * @public
	 * @param  {String} name 
	 * @param  {String} [newValue]
	 * @return {Himself|String|Array}
	 * @memberof _MyQuery
	 */
	_MyQuery.prototype.attr = function(name, newValue) {
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
	 * @public
	 * @param  {String} [newValue]
	 * @return {Himself|String}
	 * @memberof _MyQuery
	 */
	_MyQuery.prototype.src = function(newValue) {
		return this._setGetAll(newValue, "src");
	};

	/**
	 * Hide element
	 * 
	 * @public
	 * @return {Himself}
	 * @memberof _MyQuery
	 */
	_MyQuery.prototype.hide = function() {
		this._operation(function(item) {
			item.style.display = "none";
		});

		return this;
	};

	/**
	 * Show element
	 * 
	 * @public
	 * @param  {String} [displayStyle]
	 * @return {Himself}
	 * @memberof _MyQuery
	 */
	_MyQuery.prototype.show = function(displayStyle) {
		this._operation(function(item) {
			item.style.display = displayStyle || "block";
		});

		return this;
	};

	/**
	 * Get or set value
	 * 
	 * @public
	 * @param  {String} [newValue]
	 * @return {Himself|String}
	 * @memberof _MyQuery
	 */
	_MyQuery.prototype.val = function(newValue) {
		return this._setGetAll(newValue, "value");
	};

	/**
	 * Get or set HTML
	 * 
	 * @public
	 * @param  {String} [newValue]
	 * @return {Himself|String}
	 * @memberof _MyQuery
	 */
	_MyQuery.prototype.html = function(newValue) {
		return this._setGetAll(newValue, "innerHTML");
	};

	/**
	 * Append another element to this one
	 * TODO: cannot use on n elements
	 * 
	 * @public
	 * @param  {NodeElement} child
	 * @return {Himself}
	 * @memberof _MyQuery
	 */
	_MyQuery.prototype.append = function(child) {
		this._operation(function(item) {
			item.appendChild(child);
		});

		return this;
	};

	/**
	 * Add css class
	 * 
	 * @public
	 * @param  {String} className
	 * @return {Himself}
	 * @memberof _MyQuery
	 */
	_MyQuery.prototype.addClass = function(className) {
		this._operation(function(item) {
			item.classList.add(className);
		});

		return this;
	};

	/**
	 * Remove css class
	 * 
	 * @public
	 * @param  {String} className
	 * @return {Himself}
	 * @memberof _MyQuery
	 */
	_MyQuery.prototype.removeClass = function(className) {
		this._operation(function(item) {
			item.classList.remove(className);
		});

		return this;
	};

	/**
	 * Toggle css class
	 * 
	 * @public
	 * @param  {String} className
	 * @return {Himself}
	 * @memberof _MyQuery
	 */
	_MyQuery.prototype.toggleClass = function(className) {
		this._operation(function(item) {
			item.classList.toggle(className);
		});

		return this;
	};

	/**
	 * Get width
	 * 
	 * @public
	 * @return {Number}
	 * @memberof _MyQuery
	 */
	_MyQuery.prototype.width = function() {
		var width = 0;

		this._operation(function(item) {
			width += item.offsetWidth;
		});

		return width;
	};

	/**
	 * Get height
	 * 
	 * @public
	 * @return {Number}
	 * @memberof _MyQuery
	 */
	_MyQuery.prototype.height = function() {
		var height = 0;

		this._operation(function(item) {
			height += item.offsetHeight;
		});

		return height;
	};

	/**
	 * Click event
	 * 
	 * @public
	 * @param  {Function} cb
	 * @param  {Function} scope
	 * @return {Himself}
	 * @memberof _MyQuery
	 */
	_MyQuery.prototype.click = function(cb, scope) {
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
	 * @public
	 * @param  {Function} cb
	 * @param  {Function} scope
	 * @return {Himself}
	 * @memberof _MyQuery
	 */
	_MyQuery.prototype.change = function(cb, scope) {
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
	 * @public
	 * @param  {Function} cb
	 * @param  {Function} scope
	 * @return {Himself}
	 * @memberof _MyQuery
	 */
	_MyQuery.prototype.forEach = function(cb, scope) {
		this._operation(function(item, ind) {
			cb.apply(scope || cb, [item, ind]);
		});

		return this;
	};

	/**
	 * Remove element
	 * 
	 * @public
	 * @return {Himself}
	 * @memberof _MyQuery
	 */
	_MyQuery.prototype.remove = function() {
		this._operation(function(item) {
			item.parentNode.removeChild(item);
		});

		return this;
	};

	/**
	 * Prepend element
	 * 
	 * @public
	 * @param  {NodeElement} child
	 * @return {Himself}
	 * @memberof _MyQuery
	 */
	_MyQuery.prototype.prepend = function(child) {
		this._operation(function(item) {
			item.parentNode.insertBefore(child, item);
		});

		return this;
	};

	/**
	 * Get all elements length
	 * 
	 * @public
	 * @return {Number}
	 * @memberof _MyQuery
	 */
	_MyQuery.prototype.len = function() {
		return this._els.length;
	};

	/**
 	 * @namespace MyQuery
 	 */
	return {
		 /**
		 * Main cover function.
		 * 
		 * @public
		 * @param  {String|NodeElement|Array} value
		 * @param {NodeElement} [parent]
		 * @return {_MyQuery}
		 * @memberof MyQuery
		 */
		get: function(value, parent) {
			return new _MyQuery(value, parent);
		}
	};
});
