onix.factory("$q", function() {
	/**
	 * Promise implementation which is similar to angular $q.
	 * 
	 * @class $q
	 */
	var $q = function() {
		/**
		 * Promise states.
		 *
		 * @member $q
		 * @private
		 */
		this._STATES = {
			IDLE: 0,
			RESOLVED: 1,
			REJECTED: 2
		};

		// current state
		this._state = this._STATES.IDLE;

		// all funcs
		this._funcs = [];

		// done data
		this._finishData = null;
	};

	/**
	 * Resolve all functions.
	 *
	 * @param  {Boolean} isError
	 * @member $q
	 * @private
	 */
	$q.prototype._resolveFuncs = function(isError) {
		this._funcs.forEach(function(fnItem) {
			if (fnItem["finally"] || (fnItem.isError && isError) || (!fnItem.isError && !isError)) {
				(fnItem.fn)(this._finishData);
			}
		}, this);
		
		// clear array
		this._funcs.length = 0;
		this._state = isError ? this._STATES.REJECTED : this._STATES.RESOLVED;
	};

	/**
	 * Is promise already finished?
	 *
	 * @return {Boolean}
	 * @member $q
	 * @private
	 */
	$q.prototype._isAlreadyFinished = function() {
		if (this._state != this._STATES.IDLE) {
			this._resolveFuncs(this._state == this._STATES.REJECTED);
		}
	};

	/**
	 * Resolve promise using obj.
	 *
	 * @param  {Object} obj
	 * @member $q
	 */
	$q.prototype.resolve = function(obj) {
		this._finishData = obj;
		this._resolveFuncs(false);
	};

	/**
	 * Reject promise using obj.
	 *
	 * @param  {Object} obj
	 * @member $q
	 */
	$q.prototype.reject = function(obj) {
		this._finishData = obj;
		this._resolveFuncs(true);
	};

	/**
	 * After promise resolve/reject call then (okFn, errorFn).
	 *
	 * @chainable
	 * @param {Function} [cbOk]
	 * @param {Function} [cbError]
	 * @member $q
	 */
	$q.prototype.then = function(cbOk, cbError) {
		if (cbOk && typeof cbOk === "function") {
			this._funcs.push({
				fn: cbOk,
				isError: false
			});
		}

		if (cbError && typeof cbError === "function") {
			this._funcs.push({
				fn: cbError,
				isError: true
			});
		}

		this._isAlreadyFinished();
		
		return this;
	};

	/**
	 * After promise resolve call then cbOk.
	 *
	 * @chainable
	 * @param  {Function} cbOk
	 * @member $q
	 */
	$q.prototype.done = function(cbOk) {
		this._funcs.push({
			fn: cbOk,
			isError: false
		});

		this._isAlreadyFinished();

		return this;
	};

	/**
	 * After promise reject call then cbError.
	 *
	 * @chainable
	 * @param  {Function} cbError
	 * @member $q
	 */
	$q.prototype.error = function(cbError) {
		this._funcs.push({
			fn: cbError,
			isError: true
		});

		this._isAlreadyFinished();

		return this;
	};

	/**
	 * Finally for promise.
	 *
	 * @chainable
	 * @param  {Function} cb
	 * @member $q
	 */
	$q.prototype["finally"] = function(cb) {
		this._funcs.push({
			fn: cb,
			"finally": true
		});

		this._isAlreadyFinished();

		return this;
	};
	
	return {
		/**
		 * Resolve all promises in the array.
		 *
		 * @param {$q[]} promises
		 * @return {$q}
		 * @member $q
		 */
		all: function(promises) {
			var promise = new $q();

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
		 * @return {$q}
		 * @member $q
		 */
		defer: function() {
			return new $q();
		},

		/**
		 * Is object promise?
		 * 
		 * @param  {Object}  obj Tested object
		 * @return {Boolean}
		 * @member $q
		 */
		isPromise: function(obj) {
			return obj instanceof $q;
		}
	};
});
