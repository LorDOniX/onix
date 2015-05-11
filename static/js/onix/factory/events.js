/**
 * @namespace Events
 * @description DI: Common; Returns interface _Events;
 */
Onix.factory("Events", [
	"Common",
function(
	Common
) {
	/**
 	 * @interface _Events
 	 * @description Parent: Events;
 	 */
	return {
		/**
		 * All events. { name: name, event: function, scope, [once] }
		 * 
		 * @private
		 * @type {Array}
		 * @memberof _Events
		 */
		_allEvents: [],

		/**
		 * Get all events by his name.
		 * 
		 * @private
		 * @param  {String} name 
		 * @return {Array}
		 * @memberof _Events
		 */
		_getEvents: function (name) {
			var events = [];

			this._allEvents.forEach(function(item, ind) {
				if (name == item.name) {
					events.push({
						item: item,
						pos: ind
					});
				}
			});

			return events;
		},

		/**
		 * Add new event to the stack.
		 * 
		 * @public
		 * @param  {String}   name 
		 * @param  {Function} fn   
		 * @param  {Object|Function}   scope
		 * @memberof _Events
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
		 * 
		 * @public
		 * @param  {String}   name 
		 * @param  {Function} [fn]
		 * @memberof _Events
		 */
		off: function (name, fn) {
			var events = this._getEvents(name);

			Common.reverseForEach(events, function(item) {
				if (!fn || fn && item.fn == fn) {
					this._allEvents.splice(item.pos, 1);
				}
			}, this);
		},

		/**
		 * Add one time event to the stack.
		 * 
		 * @public
		 * @param  {String}   name 
		 * @param  {Function} [fn]
		 * @param  {Object|Function}   scope
		 * @memberof _Events
		 */
		once: function (name, fn, scope) {
			this._allEvents.push({ 
				name: name,
				fn: fn,
				scope: scope,
				once: true
			});
		},

		/**
		 * Trigger event with arguments 0..n
		 * 
		 * @public
		 * @param  {String} name
		 * @memberof _Events
		 */
		trigger: function (name) {
			var events = this._getEvents(name);
			var args = arguments;
			var onceArray = [];

			events.forEach(function(event) {
				var newArgs = Array.prototype.slice.call(args, 0);
				newArgs.shift();

				var item = event.item;

				item.fn.apply(item.scope || this, newArgs);
				if (item.once) {
					onceArray.push(event.pos);
				}
			}, this);

			Common.reverseForEach(onceArray, function(pos) {
				this._allEvents.splice(pos, 1);
			}, this);
		}
	};
}]);
