Onix.factory("MyQuery", function() {
	// ------------------------ private ---------------------------------------
	
	/**
	 * Cover function
	 * @param {String|NodeElement} value
	 */
	var MyQuery = function(value) {
		if (typeof value === "string") {
			// todo
		}
		else {
			// nodelement todo
			this._el = value;
		}
	};

	/**
	 * Get or set attribute
	 * @param  {String} name 
	 * @param  {String} [value]
	 * @return {Himself}
	 */
	MyQuery.prototype.attr = function(name, value) {
		if (value) {
			this._el.setAttribute(name, value);
		}
		else {
			this._el.getAttribute(name);
		}

		return this;
	};

	/**
	 * Get or set src
	 * @param  {String} [newValue]
	 * @return {Himself|String}
	 */
	MyQuery.prototype.src = function(newValue) {
		if (typeof newValue !== "undefined") {
			this._el.src = newValue;

			return this;
		}
		else {
			return this._el.src;
		}
	};

	/**
	 * Hide element
	 * @return {Himself}
	 */
	MyQuery.prototype.hide = function() {
		this._el.style.display = "none";

		return this;
	};

	/**
	 * Show element
	 * @param  {String} [displayStyle]
	 * @return {Himself}
	 */
	MyQuery.prototype.show = function(displayStyle) {
		this._el.style.display = displayStyle || "block";

		return this;
	};

	/**
	 * Get or set value
	 * @param  {String} [newValue]
	 * @return {Himself|String}
	 */
	MyQuery.prototype.val = function(newValue) {
		if (typeof newValue !== "undefined") {
			this._el.value = newValue;

			return this;
		}
		else {
			return this._el.value;
		}
	};

	/**
	 * Get or set HTML
	 * @param  {String} [newValue]
	 * @return {Himself|String}
	 */
	MyQuery.prototype.html = function(newValue) {
		if (typeof newValue !== "undefined") {
			this._el.innerHTML = newValue;

			return this;
		}
		else {
			return this._el.innerHTML;
		}
	};

	/**
	 * Append another element to this one
	 * @param  {NodeElement} child
	 * @return {Himself}
	 */
	MyQuery.prototype.append = function(child) {
		if (typeof child == "object") {
			this._el.appendChild(child);
		}

		return this;
	};

	// ------------------------ public ---------------------------------------

	return {
		 /**
		 * Main cover function.
		 * @param  {String|NodeElement} value
		 * @return {MyQuery}
		 */
		get: function(value) {
			return new MyQuery(value);
		}
	};
});
