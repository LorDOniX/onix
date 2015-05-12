onix.factory("$page", [
	"$$page",
	"$common",
function(
	$$page,
	$common
) {
	/**
 	 * @namespace $page
 	 * @description DI: $$page, $common;
 	 */
	return {
		/**
		 * Create a new page
		 *
		 * @public
		 * @param  {Object|Function} a page data | dependicies
		 * @param  {Object|Function} [b] page data | dependicies
		 * @return {$$page}
		 * @memberof $page
		 */
		create: function(a, b) {
			return $common.create($$page, a, b);
		}
	};
}]);
