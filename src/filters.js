/**
 * Filter - lowercase functionality.
 *
 * @class $filterLowercase
 */
onix.filter("lowercase", function() {
	/**
	 * Input is transformatted to lowercase.
	 * 
	 * @param  {String} input
	 * @return {String|Object}
	 * @member $filterLowercase
	 */
	return function(input) {
		if (typeof input === "string") {
			return input.toLowerCase();
		}
		else return input;
	};
});

/**
 * Filter - uppercase functionality.
 *
 * @class $filterUppercase
 */
onix.filter("uppercase", function() {
	/**
	 * Input is transformatted to uppercase.
	 * 
	 * @param  {String} input
	 * @return {String|Object}
	 * @member $filterUppercase
	 */
	return function(input) {
		if (typeof input === "string") {
			return input.toUpperCase();
		}
		else return input;
	};
});

/**
 * Filter - json stringify functionality.
 *
 * @class $filterJson
 */
onix.filter("json", function() {
	/**
	 * Input object is stringfied.
	 * 
	 * @param {Object} obj Input object
	 * @param {Number} [spacing] Number of spaces per indetation
	 * @return {String}
	 * @member $filterJson
	 */
	return function(obj, spacing) {
		if (typeof obj === "object") {
			var space = null;

			if (spacing) {
				spacing = parseInt(spacing, 10);
				space = isNaN(spacing) ? null : spacing;
			}

			return JSON.stringify(obj, null, space);
		}
		else return obj;
	};
});
