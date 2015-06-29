/**
 * @class $provide
 */
onix.service("$provide", function() {
	/**
	 * Decorate existing object.
	 *
	 * @public
	 * @param  {String} name Object name
	 * @param  {Function} cb Callback function
	 * @memberof $provide
	 */
	this.decorator = function(name, cb) {
		var obj = onix.getObject(name);

		if (obj) {
			// todo - maybe public function?
			onix._objects[name] = cb(obj);
		}
	};
});
