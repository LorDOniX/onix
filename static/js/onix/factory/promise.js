Onix.factory("Promise", function() {
	/**
	 * @class _Promise
	 * @description Parent: Promise;
	 */
	var _Promise = function() {
		/**
		 * Promise states
		 * @const
		 * @memberof _Promise
		 */
		this._E_STATES = {
			IDLE: 0,
			RESOLVED: 1,
			REJECTED: 2
		};

		// current state
		this._state = this._E_STATES.IDLE;

		// all funcs
		this._funcs = [];

		// done data
		this._finishData = null;
	};

	/**
	 * Resolve all functions
	 *
	 * @private
	 * @param  {Boolean} isError
	 * @memberof _Promise
	 */
	_Promise.prototype._resolveFuncs = function(isError) {
		this._funcs.forEach(function(fnItem) {
			if (fnItem["finally"] || (fnItem.isError && isError) || (!fnItem.isError && !isError)) {
				(fnItem.fn)(this._finishData);
			}
		}, this);
		
		// clear array
		this._funcs.length = 0;
		this._state = isError ? this._E_STATES.REJECTED : this._E_STATES.RESOLVED;
	};

	/**
	 * Is promise already finished?
	 *
	 * @private
	 * @return {Boolean}
	 * @memberof _Promise
	 */
	_Promise.prototype._isAlreadyFinished = function() {
		if (this._state != this._E_STATES.IDLE) {
			this._resolveFuncs(this._state == this._E_STATES.REJECTED);
		}
	};

	/**
	 * Resolve promise using obj.
	 *
	 * @public
	 * @param  {Object} obj
	 * @memberof _Promise
	 */
	_Promise.prototype.resolve = function(obj) {
		this._finishData = obj;
		this._resolveFuncs(false);
	};

	/**
	 * Reject promise using obj.
	 *
	 * @public
	 * @param  {Object} obj
	 * @memberof _Promise
	 */
	_Promise.prototype.reject = function(obj) {
		this._finishData = obj;
		this._resolveFuncs(true);
	};

	/**
	 * After promise resolve/reject call then (okFn, errorFn)
	 *
	 * @public
	 * @param {Function} [cbOk]
	 * @param {Function} [cbError]
	 * @return {_Promise}
	 * @memberof _Promise
	 */
	_Promise.prototype.then = function(cbOk, cbError) {
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
	 * After promise resolve call then cbOk
	 *
	 * @public
	 * @param  {Function}   cbOk
	 * @return {_Promise}
	 * @memberof _Promise
	 */
	_Promise.prototype.done = function(cbOk) {
		this._funcs.push({
			fn: cbOk,
			isError: false
		});

		this._isAlreadyFinished();

		return this;
	};

	/**
	 * After promise reject call then cbError
	 *
	 * @public
	 * @param  {Function}   cbError
	 * @return {_Promise}
	 * @memberof _Promise
	 */
	_Promise.prototype.error = function(cbError) {
		this._funcs.push({
			fn: cbError,
			isError: true
		});

		this._isAlreadyFinished();

		return this;
	};

	/**
	 * Finally for promise
	 *
	 * @function finally
	 * @public
	 * @param  {Function}   cb
	 * @return {_Promise}
	 * @memberof _Promise
	 */
	_Promise.prototype["finally"] = function(cb) {
		this._funcs.push({
			fn: cb,
			"finally": true
		});

		this._isAlreadyFinished();

		return this;
	};

	/**
 	 * @namespace Promise
 	 */
	return {
		/**
		 * Resolve all promises in the array
		 *
		 * @public
		 * @param {Array} promises
		 * @return {_Promise}
		 * @memberof Promise
		 */
		all: function(promises) {
			var promise = new _Promise();

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
		 * @return {_Promise}
		 * @memberof Promise
		 */
		defer: function() {
			return new _Promise();
		}
	}
});
