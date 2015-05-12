onix.factory("$q", [
	"$$promise",
function(
	$$promise
) {
	/**
 	 * @namespace $q
 	 * @description: DI $$promise;
 	 */
	return {
		/**
		 * Resolve all promises in the array
		 *
		 * @public
		 * @param {Array} promises
		 * @return {$$promise}
		 * @memberof $q
		 */
		all: function(promises) {
			var promise = new $$promise();

			if (Array.isArray(promises)) {
				var count = promises.length;
				var test = function() {
					count--;

					if (count == 0) {
						promise.resolve();
					}
				};

				promises.forEach(function(item) {
					item["finally"](test);
				});
			}
			else {
				promise.resolve();
			}

			return promise;
		},

		/**
		 * Deferable object of the promise.
		 *
		 * @public
		 * @return {$$promise}
		 * @memberof $q
		 */
		defer: function() {
			return new $$promise();
		}
	};
}]);
