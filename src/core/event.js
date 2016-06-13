onix.factory("$event", function() {
	/**
	 * This class is used for extending existing objects and brings signal functionality.
	 * 
 	 * @class $event
 	 */
	var $event = function() {
	};

	/**
	 * Init event functionality.
	 * 
	 * @member $event
	 * @private
	 */
	$event.prototype._eventInit = function() {
		/**
		 * All events. { name: name, event: function, scope, [once] }
		 * 
		 * @type {Array}
		 * @member $event
		 * @private
		 */
		this._allEvents = [];
	};

	/**
	 * Add new event to the stack.
	 * 
	 * @param  {String} name 
	 * @param  {Function} fn
	 * @param  {Object|Function} [scope]
	 * @member $event
	 */
	$event.prototype.on = function (name, fn, scope) {
		if (arguments.length < 2) return;

		this._allEvents.push({ 
			name: name,
			fn: fn,
			scope: scope
		});
	};

	/**
	 * Remove event from the stack.
	 * 
	 * @param  {String} name 
	 * @param  {Function} [fn]
	 * @member $event
	 */
	$event.prototype.off = function (name, fn) {
		if (!name) return;

		var len = this._allEvents.length - 1;

		for (var i = len; i >= 0; i--) {
			var item = this._allEvents[i];

			if (item.name != name) continue;

			if (!fn || (fn && item.fn == fn)) {
				this._allEvents.splice(i, 1);
			}
		}
	};

	/**
	 * Add one time event to the stack.
	 * 
	 * @param  {String} name
	 * @param  {Function} [fn]
	 * @param  {Object|Function} [scope]
	 * @member $event
	 */
	$event.prototype.once = function (name, fn, scope) {
		if (arguments.length < 2) return;

		this._allEvents.push({ 
			name: name,
			fn: fn,
			scope: scope,
			once: true
		});
	};

	/**
	 * Trigger event with arguments 0..n.
	 * 
	 * @param  {String} name
	 * @member $event
	 */
	$event.prototype.trigger = function (name) {
		if (!name) return;
		
		var args = Array.prototype.slice.call(arguments, 1);
		var len = this._allEvents.length - 1;

		for (var i = len; i >= 0; i--) {
			var item = this._allEvents[i];

			if (item.name != name) continue;

			// call fn
			item.fn.apply(item.scope || this, args);

			// once event
			if (item.once) {
				this._allEvents.splice(i, 1);
			}
		}
	};

	return $event;
});
