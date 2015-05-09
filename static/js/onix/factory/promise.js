Onix.factory("Promise", function() {
	// ------------------------ private ---------------------------------------
	
	var Promise = function() {
		/**
		 * Promise states
		 * @type {Object}
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
	 * @param  {Boolean} isError
	 */
	Promise.prototype._resolveFuncs = function(isError) {
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
	 * @return {Boolean}
	 */
	Promise.prototype._isAlreadyFinished = function() {
		if (this._state != this._E_STATES.IDLE) {
			this._resolveFuncs(this._state == this._E_STATES.REJECTED);
		}
	};

	// ------------------------ public ----------------------------------------

	/**
	 * Resolve promise using obj.
	 * @param  {Object} obj
	 */
	Promise.prototype.resolve = function(obj) {
		this._finishData = obj;
		this._resolveFuncs(false);
	};

	/**
	 * Reject promise using obj.
	 * @param  {Object} obj
	 */
	Promise.prototype.reject = function(obj) {
		this._finishData = obj;
		this._resolveFuncs(true);
	};

	/**
	 * After promise resolve/reject call then (okFn, errorFn)
	 * @param {Function} [cbOk]
	 * @param {Function} [cbError]
	 * @return {Promise}
	 */
	Promise.prototype.then = function(cbOk, cbError) {
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
	 * @param  {Function}   cbOk
	 * @return {Promise}
	 */
	Promise.prototype.done = function(cbOk) {
		this._funcs.push({
			fn: cbOk,
			isError: false
		});

		this._isAlreadyFinished();

		return this;
	};

	/**
	 * After promise reject call then cbError
	 * @param  {Function}   cbError
	 * @return {Promise}
	 */
	Promise.prototype.error = function(cbError) {
		this._funcs.push({
			fn: cbError,
			isError: true
		});

		this._isAlreadyFinished();

		return this;
	};

	/**
	 * Finally for promise
	 * @param  {Function}   cb
	 * @return {Promise}
	 */
	Promise.prototype["finally"] = function(cb) {
		this._funcs.push({
			fn: cb,
			"finally": true
		});

		this._isAlreadyFinished();

		return this;
	};

	// --- public ----

	return {
		/**
		 * Resolve all promises in the array
		 * @param {Array} promises
		 * @return {Promise}
		 */
		all: function(promises) {
			var promise = new Promise();

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
		 * @return {Promise}
		 */
		defer: function() {
			return new Promise();
		}
	}
});
