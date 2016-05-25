/**
 * Commom functions used in whole application.
 *
 * @class $common
 */
onix.service("$common", [
	"$q",
function(
	$q
) {
	/**
	 * Object copy, from source to dest.
	 *
	 * @param  {Object} dest
	 * @param  {Object} source
	 * @member $common
	 * @private
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

	/**
	 * Confirm window, returns promise.
	 *
	 * @param  {String} txt
	 * @return {$q}
	 * @member $common
	 */
	this.confirm = function(txt) {
		var promise = $q.defer();

		if (confirm(txt)) {
			promise.resolve();
		}
		else {
			promise.reject();
		}

		return promise;
	};

	/**
	 * Merge multiple objects into the single one.
	 *
	 * @return {Object}
	 * @member $common
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
	 *
	 * @param  {Object} dest
	 * @param  {Object} source
	 * @member $common
	 */
	this.extend = function(dest, source) {
		dest = dest || {};
		source = source || {};

		this._objCopy(dest, source);
	};

	/**
	 * Bind function arguments without scope.
	 *
	 * @param  {Function} cb
	 * @return {Function}
	 * @member $common
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
	 *
	 * @param  {Object[]} nodes
	 * @param  {Function} cb
	 * @param  {Object|Function} scope
	 * @member $common
	 */
	this.nodesForEach = function(nodes, cb, scope) {
		cb = cb || function() {};
		
		if (nodes) {
			Array.prototype.slice.call(nodes).forEach(function(item, ind) {
				cb.apply(scope || cb, [item, ind]);
			});
		}
	};

	/**
	 * Reverse for each.
	 *
	 * @param  {Array} arr
	 * @param {Function} cb
	 * @param {Function} scope
	 * @member $common
	 */
	this.reverseForEach = function (arr, cb, scope) {
		arr = arr || [];
		cb = cb || function() {};

		for (var i = arr.length - 1; i >= 0; i--) {
			cb.apply(scope || this, [arr[i], i]);
		}
	};

	/**
	 * HEX value to DEC.
	 *
	 * @param  {String} hex
	 * @return {Number}
	 * @member $common
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
	 * HEX value to RGB.
	 *
	 * @param  {String} hexColor
	 * @return {Object}
	 * @member $common
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

	/**
	 * Is value element?
	 *
	 * @param  {Object} val
	 * @return {Boolean}
	 * @member $common
	 */
	this.isElement = function(val) {
		return (val instanceof HTMLElement);
	};

	/**
	 * Is item object?
	 * 
	 * @param  {Object} item
	 * @return {Boolean}
	 * @member $common
	 */
	this.isObject = function(item) {
		return (typeof item === "object" && !Array.isArray(item) && item !== null);
	};


	/**
	 * Cover function for console.log, which allows to replace {0..n} occurences inside string.
	 * First argument is string, other arguments are for replace objects by key.
	 * 
	 * @member $common
	 */
	this.col = function() {
		var args = Array.prototype.slice.call(arguments);
		var output = "";
		var params = {};

		args.forEach(function(arg, ind) {
			if (ind == 0) {
				output = arg;
			}
			else {
				params["[{]" + (ind - 1) + "[}]"] = arg;
			}
		});

		Object.keys(params).forEach(function(param) {
			output = output.replace(new RegExp(param, "g"), params[param]);
		});

		if (output) {
			console.log(output);
		}
	};

	/**
	 * Format size in bytes.
	 * 
	 * @param  {Number} size
	 * @return {String}
	 * @member $common
	 */
	this.formatSize = function(size) {
		if (typeof size !== "number") {
			return "null";
		}

		var lv = size > 0 ? Math.floor(Math.log(size) / Math.log(1000)) : 0;
		var sizes = ["", "K", "M", "G", "T"];

		lv = Math.min(sizes.length, lv);
		
		var value = lv > 0 ? (size / Math.pow(1000, lv)).toFixed(2) : size;

		return value + " " + sizes[lv] + "B";
	};
}]);
