onix.factory("$promise", function() {
	/**
	 * ES6 promise implementation.
	 * 
	 * @class $promise
	 */
	var $promise = function(cbFn) {
		/**
		 * Promise states.
		 *
		 * @member $promise
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

		// call promise cb function
		if (cbFn && typeof cbFn === "function") {
			cbFn.apply(cbFn, [
				this._resolve.bind(this),
				this._reject.bind(this)
			]);
		}
	};

	/**
	 * Resolve promise using obj.
	 *
	 * @param  {Object} obj
	 * @member $promise
	 */
	$promise.prototype._resolve = function(obj) {
		this._finishData = obj;
		this._resolveFuncs(false);
	};

	/**
	 * Reject promise using obj.
	 *
	 * @param  {Object} obj
	 * @member $promise
	 */
	$promise.prototype._reject = function(obj) {
		this._finishData = obj;
		this._resolveFuncs(true);
	};

	/**
	 * Resolve all functions.
	 *
	 * @param  {Boolean} isError
	 * @member $promise
	 * @private
	 */
	$promise.prototype._resolveFuncs = function(isError) {
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
	 * @member $promise
	 * @private
	 */
	$promise.prototype._isAlreadyFinished = function() {
		if (this._state != this._STATES.IDLE) {
			this._resolveFuncs(this._state == this._STATES.REJECTED);
		}
	};

	/**
	 * After promise resolve/reject call then (okFn, errorFn).
	 *
	 * @chainable
	 * @param {Function} [cbOk]
	 * @param {Function} [cbError]
	 * @member $promise
	 */
	$promise.prototype.then = function(cbOk, cbError) {
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
	 * @member $promise
	 */
	$promise.prototype.done = function(cbOk) {
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
	 * @member $promise
	 */
	$promise.prototype.error = function(cbError) {
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
	 * @member $promise
	 */
	$promise.prototype["finally"] = function(cb) {
		this._funcs.push({
			fn: cb,
			"finally": true
		});

		this._isAlreadyFinished();

		return this;
	};

	// static methods

	/**
	 * Resolve all promises in the array.
	 *
	 * @param {$promise[]} promises
	 * @return {$promise}
	 * @member $promise
	 */
	$promise.all = function(promises) {
		return new $promise(function(resolve) {
			if (Array.isArray(promises)) {
				var count = promises.length;
				var test = function() {
					count--;

					if (count == 0) {
						resolve();
					}
				};

				promises.forEach(function(item) {
					item["finally"](test);
				});
			}
			else {
				resolve();
			}
		});
	};

	/**
	 * Resolve promise with variable object.
	 *
	 * @param {Object} [obj] Resolved object
	 * @return {$promise}
	 * @member $promise
	 */
	$promise.resolve = function(obj) {
		return new $promise(function(resolve) {
			resolve(obj);
		});
	};

	/**
	 * Reject promise with variable object.
	 *
	 * @param {Object} [obj] Rejected object
	 * @return {$promise}
	 * @member $promise
	 */
	$promise.reject = function(obj) {
		return new $promise(function(resolve, reject) {
			reject(obj);
		});
	};

	return $promise;
});
