/**
 * @namespace $notify
 * @description DI: $$notify;
 */
onix.service("$notify", [
	"$$notify",
function(
	$$notify
) {
	/**
	 * Main public access to the notify obj.
	 *
	 * @public
	 * @param  {NodeElement} el
	 * @return {$$notify}
	 * @memberof $notify
	 */
	this.get = function(el) {
		return new $$notify(el);
	};
}]);
