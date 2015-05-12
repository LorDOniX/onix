onix.factory("$$promise", function() {
	/**
	 * @class $$promise
	 */
	var $$promise = function() {
		/**
		 * Promise states
		 * @const
		 * @memberof $$promise
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
	 * @memberof $$promise
	 */
	$$promise.prototype._resolveFuncs = function(isError) {
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
	 * @memberof $$promise
	 */
	$$promise.prototype._isAlreadyFinished = function() {
		if (this._state != this._E_STATES.IDLE) {
			this._resolveFuncs(this._state == this._E_STATES.REJECTED);
		}
	};

	/**
	 * Resolve promise using obj.
	 *
	 * @public
	 * @param  {Object} obj
	 * @memberof $$promise
	 */
	$$promise.prototype.resolve = function(obj) {
		this._finishData = obj;
		this._resolveFuncs(false);
	};

	/**
	 * Reject promise using obj.
	 *
	 * @public
	 * @param  {Object} obj
	 * @memberof $$promise
	 */
	$$promise.prototype.reject = function(obj) {
		this._finishData = obj;
		this._resolveFuncs(true);
	};

	/**
	 * After promise resolve/reject call then (okFn, errorFn)
	 *
	 * @public
	 * @param {Function} [cbOk]
	 * @param {Function} [cbError]
	 * @return {$$promise}
	 * @memberof $$promise
	 */
	$$promise.prototype.then = function(cbOk, cbError) {
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
	 * @return {$$promise}
	 * @memberof $$promise
	 */
	$$promise.prototype.done = function(cbOk) {
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
	 * @return {$$promise}
	 * @memberof $$promise
	 */
	$$promise.prototype.error = function(cbError) {
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
	 * @return {$$promise}
	 * @memberof $$promise
	 */
	$$promise.prototype["finally"] = function(cb) {
		this._funcs.push({
			fn: cb,
			"finally": true
		});

		this._isAlreadyFinished();

		return this;
	};

	return $$promise;
});
