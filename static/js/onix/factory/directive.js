onix.factory("$directive", [
	"$$directive",
	"$common",
function(
	$$directive,
	$common
) {
	/**
 	 * @class $directive
 	 * @description DI: $$directive, $common;
 	 */
	return {
		/**
		 * Create a new directive
		 *
		 * @public
		 * @param  {Object|Function} a directive data | dependicies
		 * @param  {Object|Function} [b] directive data | dependicies
		 * @return {$$directive}
		 * @memberof $directive
		 */
		create: function(a, b) {
			return $common.create($$directive, a, b);
		}
	};
}]);
