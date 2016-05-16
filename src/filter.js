/**
 * Filter process input data and output can be used in template or in the code.
 *
 * @class $filter
 */
onix.factory("$filter", [
	"$di",
function(
	$di
) {
	var emptyFilter = function(value) {
		return value || "";
	};

	/**
	 * Return filter by his name or returns empty filter. Filter name is concatenation of $filter + Filter name.
	 *
	 * @method filter
	 * @param  {String} filterName 
	 * @return {Object}
	 * @member $filter
	 */
	return function(filterName) {
		if (!filterName) {
			return emptyFilter;
		}

		// get filter name
		filterName = $di.getFilterName(filterName);

		return $di.run({
			fn: function(moduleObj) {
				return moduleObj || emptyFilter;
			},
			inject: [filterName]
		});
	};
}]);
