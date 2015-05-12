onix.factory("$snippet", [
	"$$snippet",
	"$common",
function(
	$$snippet,
	$common
) {
	/**
 	 * @namespace $snippet
 	 * @description DI: $$snippet, $common;
 	 */
	return {
		/**
		 * Create a new snippet
		 *
		 * @public
		 * @param  {Object|Function} a snippet data | dependicies
		 * @param  {Object|Function} [b] snippet data | dependicies
		 * @return {$$snippet}
		 * @memberof $snippet
		 */
		create: function(a, b) {
			return $common.create($$snippet, a, b);
		}
	};
}]);
