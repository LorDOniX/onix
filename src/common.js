/**
 * Commom functions used in whole application.
 *
 * @class $common
 */
onix.service("$common", [
	"$q",
	"$job",
function(
	$q,
	$job
) {
	/**
	 * Object copy, from source to dest.
	 *
	 * @param  {Object} dest
	 * @param  {Object} source
	 * @member $common
	 * @private
	 */
	this._objCopy = function(dest, source) {
		Object.keys(source).forEach(function(prop) {
			if (source.hasOwnProperty(prop)) {
				var sourceVal = source[prop];
				var sourceType = typeof sourceVal;

				// array
				if (Array.isArray(sourceVal)) {
					// array - copy object to another array - keep referencings on array, objects
					var newArray = [];

					sourceVal.forEach(function(item) {
						newArray.push(item);
					});

					dest[prop] = newArray;
				}
				// not null and object
				else if (sourceVal && sourceType === "object") {
					// recursive copy
					if (!(prop in dest)) {
						dest[prop] = {};
 					}

					this._objCopy(dest[prop], sourceVal);
				}
				else {
					// string, numbers, functions
					dest[prop] = sourceVal;
				}
			}
		}.bind(this));
	};

	/**
	 * Get cookie by her name.
	 *
	 * @param  {String} name
	 * @return {String}
	 * @member $common
	 * @private
	 */
	this.getCookie = function(name) {
		var cookieValue = null;

		if (document.cookie && document.cookie != '') {
			var cookies = document.cookie.split(';');

			cookies.every(function(cookie) {
				cookie = cookie.trim();

				if (cookie.substring(0, name.length + 1) == (name + '=')) {
					cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
					return false;
				}
				else return true;
			});
		}

		return cookieValue;
	};

	/**
	 * Confirm window, returns promise.
	 *
	 * @param  {String} txt
	 * @return {$q}
	 * @member $common
	 */
	this.confirm = function(txt) {
		var promise = $q.defer();

		if (confirm(txt)) {
			promise.resolve();
		}
		else {
			promise.reject();
		}

		return promise;
	};

	/**
	 * Merge multiple objects into the single one.
	 *
	 * @return {Object}
	 * @member $common
	 */
	this.merge = function() {
		var count = arguments.length;
		var dest = {};
		
		if (count > 0) {
			for (var i = 0; i < count; i++) {
				var source = arguments[i];

				this._objCopy(dest, source);
			}
		}

		return dest;
	};

	/**
	 * Extend one object by other; from source to dest.
	 *
	 * @param  {Object} dest
	 * @param  {Object} source
	 * @member $common
	 */
	this.extend = function(dest, source) {
		dest = dest || {};
		source = source || {};

		this._objCopy(dest, source);
	};

	/**
	 * Bind function arguments without scope.
	 *
	 * @param  {Function} cb
	 * @return {Function}
	 * @member $common
	 */
	this.bindWithoutScope = function(cb) {
		var bindArgs = Array.prototype.slice.call(arguments, 1);

		return function () {
			var internalArgs = Array.prototype.slice.call(arguments, 0);
			var args = Array.prototype.concat(internalArgs, bindArgs);
			return cb.apply(this, args);
		};
	};
	
	/**
	 * Missing for each for Node array.
	 *
	 * @param  {Object[]} nodes
	 * @param  {Function} cb
	 * @param  {Object|Function} scope
	 * @member $common
	 */
	this.nodesForEach = function(nodes, cb, scope) {
		cb = cb || function() {};
		
		if (nodes) {
			Array.prototype.slice.call(nodes).forEach(function(item, ind) {
				cb.apply(scope || cb, [item, ind]);
			});
		}
	};

	/**
	 * Reverse for each.
	 *
	 * @param  {Array} arr
	 * @param {Function} cb
	 * @param {Function} scope
	 * @member $common
	 */
	this.reverseForEach = function (arr, cb, scope) {
		arr = arr || [];
		cb = cb || function() {};

		for (var i = arr.length - 1; i >= 0; i--) {
			cb.apply(scope || this, [arr[i], i]);
		}
	};

	/**
	 * HEX value to DEC.
	 *
	 * @param  {String} hex
	 * @return {Number}
	 * @member $common
	 */
	this.hxToDe = function(hex) {
		hex = hex.toLowerCase();

		switch (hex) {
			case "a":
				return 10;
			case "b":
				return 11;
			case "c":
				return 12;
			case "d":
				return 13;
			case "e":
				return 14;
			case "f":
				return 15;
			default:
				return parseInt(hex, 10);
		}
	};

	/**
	 * HEX value to RGB.
	 *
	 * @param  {String} hexColor
	 * @return {Object}
	 * @member $common
	 */
	this.hexToRGB = function(hexColor) {
		if (hexColor[0] == "#") {
			hexColor = hexColor.replace("#", "");

			if (hexColor.length == 3) {
				return {
					r: this.hxToDe(hexColor[0]) * 16 + this.hxToDe(hexColor[0]),
					g: this.hxToDe(hexColor[1]) * 16 + this.hxToDe(hexColor[1]),
					b: this.hxToDe(hexColor[2]) * 16 + this.hxToDe(hexColor[2])
				};
			}
			else {
				return {
					r: this.hxToDe(hexColor[0]) * 16 + this.hxToDe(hexColor[1]),
					g: this.hxToDe(hexColor[2]) * 16 + this.hxToDe(hexColor[3]),
					b: this.hxToDe(hexColor[4]) * 16 + this.hxToDe(hexColor[5])
				};
			}
		}
		else {
			return hexColor;
		}
	};

	/**
	 * Is value element?
	 *
	 * @param  {Object} val
	 * @return {Boolean}
	 * @member $common
	 */
	this.isElement = function(val) {
		return (val instanceof HTMLElement);
	};

	/**
	 * Is item object?
	 * 
	 * @param  {Object} item
	 * @return {Boolean}
	 * @member $common
	 */
	this.isObject = function(item) {
		return (typeof item === "object" && !Array.isArray(item) && item !== null);
	};


	/**
	 * Cover function for console.log, which allows to replace {0..n} occurences inside string.
	 * First argument is string, other arguments are for replace objects by key.
	 * 
	 * @member $common
	 */
	this.col = function() {
		var args = Array.prototype.slice.call(arguments);
		var output = "";
		var params = {};

		args.forEach(function(arg, ind) {
			if (ind == 0) {
				output = arg;
			}
			else {
				params["[{]" + (ind - 1) + "[}]"] = arg;
			}
		});

		Object.keys(params).forEach(function(param) {
			output = output.replace(new RegExp(param, "g"), params[param]);
		});

		if (output) {
			console.log(output);
		}
	};

	/**
	 * Size to KB/MB.
	 * 
	 * @param  {Number} size
	 * @return {String}
	 * @member $common
	 */
	this.humanLength = function(size) {
		size = size || 0;

		var sizeKB = size / 1024;
		var sizeMB = size / (1024 * 1024);

		if (sizeKB < 1024) {
			return sizeKB.toFixed(2) + " KB";
		}
		else {
			return sizeMB.toFixed(2) + " MB";
		}
	};


	/**
	 * Chaining multiple methods with promises, returns promise.
	 * 
	 * @param  {Object[]} opts
	 * @param  {String|Function} opts.method Function or method name inside scope
	 * @param  {Object} opts.scope Scope for method function
	 * @param  {Array} opts.args Additional arguments for function
	 * @return {$q}
	 * @member $common
	 */
	this.chainPromises = function(opts) {
		var promise = $q.defer();

		this._chainPromisesInner(opts, promise, []);

		return promise;
	};

	/**
	 * Inner method for chaining promises.
	 * 
	 * @param  {Object[]} opts
	 * @param  {String|Function} opts.method Function or method name inside scope
	 * @param  {Object} opts.scope Scope for method function
	 * @param  {Array} opts.args Additional arguments for function
	 * @param  {promise} promise Done promise $q
	 * @param  {Array} outArray Array for output from all executed promises
	 * @member $common
	 */
	this._chainPromisesInner = function(opts, promise, outArray) {
		var firstItem = opts.shift();

		if (firstItem) {
			// string or function itself
			var fn;
			var error = false;

			switch (typeof firstItem.method) {
				case "string":
					if (!firstItem.scope || !(firstItem.method in firstItem.scope)) {
						error = true;
					}
					else {
						fn = firstItem.scope[firstItem.method];

						if (typeof fn !== "function") {
							error = true;
						}
					}
					break;
				case "function":
					fn = firstItem.method;
					break;
				default:
					error = true;
			}

			if (!error) {
				fn.apply(firstItem.scope || fn, firstItem.args || []).then(function(data) {
					outArray.push(data);
					this._chainPromisesInner(opts, promise, outArray);
				}.bind(this), function(err) {
					outArray.push(err);
					this._chainPromisesInner(opts, promise, outArray);
				}.bind(this));
			}
			else {
				promise.resolve(outArray);
			}
		}
		else {
			promise.resolve(outArray);
		}
	};

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
	 * @return {$q} Callback after all jobs are done
	 * @member $common
	 */
	this.doJobs = function(jobsArray, count, taskDoneObj) {
		var len = jobsArray.length;
		var jobs = [];

		for (var i = 0; i < len; i++) {
			var jp = count > 0 ? i % count : i;
			var jobItem = jobsArray[i];

			if (!jobs[jp]) {
				jobs[jp] = $job.create();

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

		return $q.all(jobPromises);
	};
}]);
