onix.factory("$job", [
	"$promise",
function(
	$promise
) {
	/**
	 * Factory for manage multiple tasks.
	 * 
 	 * @class $job
 	 */
	var $job = function() {
		this._isRunning = false;
		this._tasks = [];
		this._taskDone = {
			cb: null,
			scope: null
		};
	};

	/**
	 * Add task to job. Every job task needs to call doneFn(), which is added to the last argument position.
	 * 
	 * @param {Function} task Job function
	 * @param {Function|Object} [scope] Variable function scope
	 * @param {Object} [args] Add params to the function
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
	 * @return {$promise} Returns promise for whole job
	 * @member $job
	 */
	$job.prototype.start = function() {
		return new $promise(function(resolve, reject) {
			if (this._isRunning || !this._tasks.length) {
				reject();
				return;
			}

			// job is running
			this._isRunning = true;

			// because of pop
			this._tasks.reverse();

			this._doJob(resolve);
		}.bind(this));
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
	 * @param {Function} resolve Promise object
	 * @member $job
	 */
	$job.prototype._doJob = function(resolve) {
		var rest = this._tasks.length;

		if (rest == 0) {
			this._isRunning = false;
			
			resolve();
		}
		else {
			var job = this._tasks.pop();

			var doneFn = function() {
				if (this._taskDone.cb) {
					var doneFnArgs = Array.prototype.slice.call(arguments, 0);

					this._taskDone.cb.apply(this._taskDone.scope || this._taskDone.cb, doneFnArgs);
				}

				this._doJob(resolve);
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
		},

		/**
		 * Run jobs array with count for how many functions will be processed simultinously.
		 *
		 * @param  {Object[]} jobsArray Array with jobs objects
		 * @param  {Function} jobsArray.task Job function
		 * @param  {Function} [jobsArray.scope] Variable function scope
		 * @param  {Function} [jobsArray.args] Add params to the function
		 * @param  {Number} count How many functions processed simultinously
		 * @param  {Object} taskDoneObj Callback after one task have been done
		 * @param  {Object} taskDoneObj.cb Function
		 * @param  {Object} [taskDoneObj.scope] Function scope
		 * @return {$promise} Callback after all jobs are done
		 * @member $job
		 */
		multipleJobs: function(jobsArray, count, taskDoneObj) {
			var len = jobsArray.length;
			var jobs = [];

			for (var i = 0; i < len; i++) {
				var jp = count > 0 ? i % count : i;
				var jobItem = jobsArray[i];

				if (!jobs[jp]) {
					jobs[jp] = this.create();

					if (taskDoneObj) {
						jobs[jp].setTaskDone(taskDoneObj.cb, taskDoneObj.scope);
					}
				}

				// add one job
				jobs[jp].add(jobItem.task, jobItem.scope, jobItem.args);
			}

			var jobPromises = [];

			jobs.forEach(function(job) {
				jobPromises.push(job.start());
			});

			return $promise.all(jobPromises);
		}
	};
}]);
