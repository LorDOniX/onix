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

		// fulfill data
		this._fulfillData = null;

		// call promise cb function
		if (cbFn && typeof cbFn === "function") {
			try {
				cbFn.apply(cbFn, [
					this._resolve.bind(this),
					this._reject.bind(this)
				]);
			}
			catch (err) {
				console.error("$promise exception " + err);
			}
		}
	};

	/**
	 * Resolve promise using obj.
	 *
	 * @private
	 * @param  {Object} obj
	 * @member $promise
	 */
	$promise.prototype._resolve = function(obj) {
		this._fulfillData = obj;

		this._resolveFuncs(false);
	};

	/**
	 * Reject promise using obj.
	 *
	 * @private
	 * @param  {Object} obj
	 * @member $promise
	 */
	$promise.prototype._reject = function(obj) {
		this._fulfillData = obj;

		this._resolveFuncs(true);
	};

	/**
	 * Resolve all functions.
	 *
	 * @param  {Boolean} isCatch
	 * @member $promise
	 * @private
	 */
	$promise.prototype._resolveFuncs = function(isCatch) {
		this._funcs.forEach(function(fnItem) {
			if ((fnItem.isCatch && isCatch) || (!fnItem.isCatch && !isCatch)) {
				(fnItem.fn)(this._fulfillData);
			}
		}, this);
		
		// clear array
		this._funcs.length = 0;

		this._state = isCatch ? this._STATES.REJECTED : this._STATES.RESOLVED;
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
	 * @param {Function} [resolveCb] Resolve function
	 * @param {Function} [rejectCb] Reject function
	 * @member $promise
	 */
	$promise.prototype.then = function(resolveCb, rejectCb) {
		if (resolveCb && typeof resolveCb === "function") {
			this._funcs.push({
				fn: resolveCb,
				isCatch: false
			});
		}

		if (rejectCb && typeof rejectCb === "function") {
			this._funcs.push({
				fn: rejectCb,
				isCatch: true
			});
		}

		this._isAlreadyFinished();
		
		return this;
	};

	/**
	 * After promise reject call then rejectCb.
	 *
	 * @chainable
	 * @param  {Function} rejectCb Reject function
	 * @member $promise
	 */
	$promise.prototype["catch"] = function(rejectCb) {
		this._funcs.push({
			fn: rejectCb,
			isCatch: true
		});

		this._isAlreadyFinished();

		return this;
	};

	/**
	 * Resolve multiple promises.
	 * 
	 * @param {$promise[]} promises
	 * @param  {Boolean} isRace Is race?
	 * @return {Boolean}
	 * @member $promise
	 * @private
	 * @static
	 */
	$promise._multiplePromises = function(promises, isRace) {
		return new $promise(function(resolve) {
			if (Array.isArray(promises) && promises.length) {
				var count = isRace ? 1 : promises.length;

				var test = function(data) {
					count--;

					if (count == 0) {
						resolve(isRace ? data : null);
					}
				};

				promises.forEach(function(item) {
					item.then(function(data) {
						test(data);
					}, function(data) {
						test(data);
					});
				});
			}
			else {
				resolve();
			}
		});
	};

	/**
	 * Resolve all promises in the array.
	 *
	 * @param {$promise[]} promises
	 * @return {$promise}
	 * @member $promise
	 * @static
	 */
	$promise.all = function(promises) {
		return $promise._multiplePromises(promises);
	};

	/**
	 * Race all promises in the array - first one resolves promise.
	 *
	 * @param {$promise[]} promises
	 * @return {$promise} With the value from the first resolved promise.
	 * @member $promise
	 * @static
	 */
	$promise.race = function(promises) {
		return $promise._multiplePromises(promises, true);
	};

	/**
	 * Resolve promise with variable object.
	 *
	 * @param {Object} [obj] Resolved object
	 * @return {$promise}
	 * @member $promise
	 * @static
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
	 * @static
	 */
	$promise.reject = function(obj) {
		return new $promise(function(resolve, reject) {
			reject(obj);
		});
	};

	return $promise;
});
