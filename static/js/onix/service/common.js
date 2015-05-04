Onix.service("Common", [
	"Promise",
function(
	Promise
) {
	// ------------------------ private ---------------------------------------
	
	/**
	 * Object copy, from source to dest
	 * @param  {Object} dest
	 * @param  {Object} source
	 */
	this._objCopy = function(dest, source) {
		Object.keys(source).forEach(function(prop) {
			if (source.hasOwnProperty(prop)) {
				var sourceVal = source[prop];
				var sourceType = typeof sourceVal;

				// array
				if (Array.isArray(sourceVal)) {
					// array - copy object to another array - keep referencings on array, objects
					var newArray = [];

					sourceVal.forEach(function(item) {
						newArray.push(item);
					});

					dest[prop] = newArray;
				}
				// not null and object
				else if (sourceVal && sourceType === "object") {
					// recursive copy
					if (!(prop in dest)) {
						dest[prop] = {};
 					}

					this._objCopy(dest[prop], sourceVal);
				}
				else {
					// string, numbers, functions
					dest[prop] = sourceVal;
				}
			}
		}.bind(this));
	};

	// ------------------------ public ----------------------------------------
	
	/**
	 * Get cookie by her name
	 * @param  {String} name
	 * @return {String}     
	 */
	this.getCookie = function(name) {
		var cookieValue = null;

		if (document.cookie && document.cookie != '') {
			var cookies = document.cookie.split(';');

			cookies.every(function(cookie) {
				cookie = cookie.trim();

				if (cookie.substring(0, name.length + 1) == (name + '=')) {
					cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
					return false;
				}
				else return true;
			});
		}

		return cookieValue;
	};

	/**
	 * Confirm window.
	 * @param  {String} txt
	 * @return {Promise}
	 */
	this.confirm = function(txt) {
		var promise = new Promise();

		if (confirm(txt)) {
			promise.resolve();
		}
		else {
			promise.reject();
		}

		return promise;
	};

	/**
	 * Create one object from arguments
	 * @param  {Object|Function} mainObj
	 * @param  {Object|Function|Array} a data | dependicies
	 * @param  {Object|Function} [b] data | dependicies
	 * @return {Object}
	 */
	this.create = function(mainObj, a, b) {
		var args = [];

		if (a && b && Array.isArray(a)) {
			// a == dependicies
			// b == data

			// arguments
			a.forEach(function(item) {
				args.push(Onix.getObject(item));
			});
		}

		// data
		args.push(mainObj);

		// data override
		args.push(b || a);

		return this.merge.apply(this, args);
	};

	/**
	 * Merge X objects into the single one.
	 * @return {Object}
	 */
	this.merge = function() {
		var count = arguments.length;
		var dest = {};
		
		if (count > 0) {
			for (var i = 0; i < count; i++) {
				var source = arguments[i];

				this._objCopy(dest, source);
			}
		}

		return dest;
	};

	/**
	 * Extend one object by other; from source to dest.
	 * @param  {Object} dest
	 * @param  {Object} source
	 */
	this.extend = function(dest, source) {
		dest = dest || {};
		source = source || {};

		this._objCopy(dest, source);
	};

	/**
	 * Bind function arguments without scope
	 * @param  {Function} cb
	 * @return {Function}
	 */
	this.bindWithoutScope = function(cb) {
		var bindArgs = Array.prototype.slice.call(arguments, 1);

		return function () {
			var internalArgs = Array.prototype.slice.call(arguments, 0);
			var args = Array.prototype.concat(internalArgs, bindArgs);
			return cb.apply(this, args);
		};
	};
	
	/**
	 * Missing for each for Node array.
	 * @param  {NodeArray} nodes
	 * @param  {Function} cb
	 * @param  {Object|Function}   scope
	 */
	this.nodesForEach = function(nodes, cb, scope) {
		cb = cb || function() {};
		
		if (nodes) {
			for (var i = 0; i < nodes.length; i++) {
				cb.apply(scope || cb, [nodes[i], i]);
			}
		}
	};

	/**
	 * HEX value to DEC
	 * @param  {String} hex
	 * @return {Number}    
	 */
	this.hxToDe = function(hex) {
		hex = hex.toLowerCase();

		switch (hex) {
			case "a":
				return 10;
			case "b":
				return 11;
			case "c":
				return 12;
			case "d":
				return 13;
			case "e":
				return 14;
			case "f":
				return 15;
			default:
				return parseInt(hex, 10);
		}
	};

	/**
	 * HEX value to RGB
	 * @param  {String} hexColor
	 * @return {Object}         
	 */
	this.hexToRGB = function(hexColor) {
		if (hexColor[0] == "#") {
			hexColor = hexColor.replace("#", "");

			if (hexColor.length == 3) {
				return {
					r: this.hxToDe(hexColor[0]) * 16 + this.hxToDe(hexColor[0]),
					g: this.hxToDe(hexColor[1]) * 16 + this.hxToDe(hexColor[1]),
					b: this.hxToDe(hexColor[2]) * 16 + this.hxToDe(hexColor[2])
				};
			}
			else {
				return {
					r: this.hxToDe(hexColor[0]) * 16 + this.hxToDe(hexColor[1]),
					g: this.hxToDe(hexColor[2]) * 16 + this.hxToDe(hexColor[3]),
					b: this.hxToDe(hexColor[4]) * 16 + this.hxToDe(hexColor[5])
				};
			}
		}
		else {
			return hexColor;
		}
	};
}]);
