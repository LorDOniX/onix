onix.factory("$job", [
	"$q",
function(
	$q
) {
	/**
	 * Factory for manage multiple tasks.
	 * 
 	 * @class $job
 	 */
	var $job = function() {
		this._donePromise = $q.defer();
		this._tasks = [];
		this._taskDone = {
			cb: null,
			scope: null
		};
	};

	/**
	 * Add task to job.
	 * 
	 * @param {Function} task 
	 * @param {Function|Object} [scope]
	 * @param {Object} [args] Add params
	 * @member $job
	 */
	$job.prototype.add = function(task, scope, args) {
		args = args || [];

		if (!Array.isArray(args)) {
			args = [args];
		}

		this._tasks.push({
			task: task,
			scope: scope,
			args: args
		});
	};

	/**
	 * Start job.
	 *
	 * @member $job
	 */
	$job.prototype.start = function() {
		if (!this._tasks.length) return;

		// kvuli pop
		this._tasks.reverse();

		this._doJob();

		return this._donePromise;
	};

	/**
	 * Clear all job taks.
	 *
	 * @member $job
	 */
	$job.prototype.clear = function() {
		this._tasks = [];
	};

	/**
	 * Set progress function, which will be called after each task will be done.
	 * 
	 * @param {Function} cb
	 * @param {Function|Object} [scope]
	 * @member $job
	 */
	$job.prototype.setTaskDone = function(cb, scope) {
		this._taskDone.cb = cb;
		this._taskDone.scope = scope;
	};

	/**
	 * Internal function for running job queue.
	 *
	 * @member $job
	 */
	$job.prototype._doJob = function() {
		var rest = this._tasks.length;

		if (rest == 0) {
			this._donePromise.resolve();
		}
		else {
			var job = this._tasks.pop();

			var doneFn = function() {
				if (this._taskDone.cb) {
					var doneFnArgs = Array.prototype.slice.call(arguments, 0);

					this._taskDone.cb.apply(this._taskDone.scope || this._taskDone.cb, doneFnArgs);
				}

				this._doJob();
			}.bind(this);

			job.task.apply(job.scope || job.task, job.args.concat(doneFn));
		}
	};

	return {
		/**
		 * Factory for creating new job.
		 *
		 * @member $job
		 */
		create: function() {
			return new $job();
		}
	};
}]);
