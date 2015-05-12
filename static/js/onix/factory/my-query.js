onix.factory("$myQuery", [
	"$$myQuery",
function(
	$$myQuery
) {
	/**
 	 * @namespace $myQuery
 	 */
	return {
		 /**
		 * Main cover function.
		 * 
		 * @public
		 * @param  {String|NodeElement|Array} value
		 * @param {NodeElement} [parent]
		 * @return {$$myQuery}
		 * @memberof $myQuery
		 */
		get: function(value, parent) {
			return new $$myQuery(value, parent);
		}
	};
}]);
