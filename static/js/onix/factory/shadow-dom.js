onix.factory("$shadowDom", [
	"$$shadowDom",
function(
	$$shadowDom
) {
	/**
	 * TODO - not completed yet!
	 * 
 	 * @class $shadowDom
 	 */
	return {
		/**
		 * Create a new instance of shadowDom
		 *
		 * @public
		 * @param  {NodeElement} root Maping element
		 * @return {$$shadowDom}
		 * @memberof $shadowDom
		 */
		create: function(root) {
			return new $$shadowDom(root);
		}
	};
}]);
