Onix.factory("Events", function() {
	return {
		// ------------------------ private ---------------------------------------
		
		/**
		 * All events. { name: name, event: function }
		 * @type {Array}
		 */
		_allEvents: [],

		/**
		 * Get all events by his name.
		 * @param  {String} name 
		 * @return {Array}      
		 */
		_getEvents: function (name) {
			var events = [];

			this._allEvents.forEach(function(item, ind) {
				if (name == item.name) {
					events.push({
						pos: ind,
						fn: item.fn,
						scope: item.scope
					});
				}
			});

			return events;
		},

		// ------------------------ public ----------------------------------------
		
		/**
		 * Add new event to the stack.
		 * @param  {String}   name 
		 * @param  {Function} fn   
		 * @param  {Object|Function}   scope
		 */
		on: function (name, fn, scope) {
			this._allEvents.push({ 
				name: name,
				fn: fn,
				scope: scope
			});
		},

		/**
		 * Remove event from the stack.
		 * @param  {String}   name 
		 * @param  {Function} [fn]  
		 */
		off: function (name, fn) {
			var events = this._getEvents(name);

			for (var i = events.length - 1; i >= 0; i--) {
				if (!fn || fn && events[i].fn == fn) {
					this._allEvents.splice(events[i].pos, 1);
				}
			}
		},

		/**
		 * Trigger event with arguments 0..n
		 * @param  {String} name
		 */
		trigger: function (name) {
			var events = this._getEvents(name);
			var args = arguments;

			events.forEach(function(event) {
				var newArgs = Array.prototype.slice.call(args, 0);
				newArgs.shift();

				event.fn.apply(event.scope || this, newArgs);
			}, this);
		}
	};
});
