Onix.service("Provide", function() {
	/**
 	 * @namespace Provide
 	 */
	return {

		/**
		 * Decorate existing object.
		 *
		 * @public
		 * @param  {String} name Object name
		 * @param  {Function} cb Callback function
		 * @memberof Provide
		 */
		decorator: function(name, cb) {
			var obj = Onix.getObject(name);

			if (obj) {
				Onix._objects[name] = cb(obj);
			}
		}
	};
});
