onix.factory("$controller", [
	"$$controller",
	"$common",
function(
	$$controller,
	$common
) {
	/**
 	 * @class $controller
 	 * @description DI: $$controller, $common;
 	 */
	return {
		/**
		 * Create a new controller
		 *
		 * @public
		 * @param  {Object|Function} a controller data | dependicies
		 * @param  {Object|Function} [b] controller data | dependicies
		 * @return {$$controller}
		 * @memberof $controller
		 */
		create: function(a, b) {
			return $common.create($$controller, a, b);
		}
	};
}]);
