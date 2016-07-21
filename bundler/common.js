"use strict";

var fs = require("fs");

class Common {
	/**
	 * Own console log
	 * 
	 * 1. argument string, other replace objects by key {0..n}
	 */
	static col() {
		let args = Array.prototype.slice.call(arguments);
		let output = "";
		let params = {};

		args.forEach((arg, ind) => {
			if (ind == 0) {
				output = arg;
			}
			else {
				params["[{]" + (ind - 1) + "[}]"] = arg;
			}
		});

		Object.keys(params).forEach((param) => {
			output = output.replace(new RegExp(param, "g"), params[param]);
		});

		if (output) {
			console.log(output);
		}
	}

	/**
	 * Size to KB/MB.
	 * 
	 * @param  {Number} size
	 * @return {String}
	 */
	static formatSize(size) {
		size = size || 0;

		let sizeKB = size / 1024;
		let sizeMB = size / (1024 * 1024);

		if (sizeKB < 1024) {
			return sizeKB.toFixed(2) + " KB";
		}
		else {
			return sizeMB.toFixed(2) + " MB";
		}
	}

	/**
	 * Read file.
	 * 
	 * @param  {String} name
	 * @return {Promise}
	 */
	static readFile(name) {
		return new Promise((resolve, reject) => {
			fs.readFile(name, 'utf8', (err, data) => {
				if (err) {
					reject(err);
				} 
				else {
					resolve(data);
				}
			});
		});
	}

	/**
	 * Get json from file.
	 * 
	 * @param  {String} file
	 * @return {Object}
	 */
	static getJSON(file) {
		let obj = {};

		try {
			let data = fs.readFileSync(file);

			obj = JSON.parse(data.toString());
		}
		catch (err) {
		}

		return obj;
	}

	/**
	 * Remove file.
	 * 
	 * @param  {String} name
	 * @return {Promise}
	 */
	static removeFile(name) {
		return new Promise((resolve, reject) => {
			name = name || "";

			fs.stat(name, (err, stats) => {
				if (stats) {
					fs.unlink(name, (err) => {
						if (err) {
							reject(err);
						} 
						else {
							resolve();
						}
					});
				}
				else {
					resolve();
				}
			});
		});
	}

	/**
	 * Write file.
	 * 
	 * @param  {String} name
	 * @param  {String} data
	 * @return {Promise}
	 */
	static writeFile(name, data) {
		return new Promise((resolve, reject) => {
			name = name || "";

			fs.writeFile(name, data, 'utf8', (err) => {
				if (err) {
					reject(err);
				} 
				else {
					resolve();
				}
			});
		});
	}

	/**
	 * Read files
	 * 
	 * @param  {Array} files List of all files
	 * @return {Promise}
	 */
	static readFiles(files) {
		files = files || [];

		let readedFiles = [];
		let all = [];

		return new Promise((resolve, reject) => {
			files.forEach((file) => {
				let readPromise = this.readFile(file);

				all.push(readPromise);

				readPromise.then((data) => {
					readedFiles.push({
						path: file,
						data: data || ""
					});
				}, (err) => {
					console.log(err.message);
				});
			});

			Promise.all(all).then(() => {
				resolve(readedFiles);
			});
		});
	}

	static fileExists(name) {
		return fs.existsSync(name);
	}

	/**
	 * Chaining multiple methods with promises.
	 * 
	 * @param  {Array} opts
	 * @return {Promise}
	 */
	static chainPromises(opts) {
		return new Promise((resolve) => {
			this._chainPromisesInner(opts, resolve, [], 0);
		});
	}

	/**
	 * Inner method for chaining promises.
	 * 
	 * @param  {Array} opts { method: {string|function}, args: [], scope: {object} }
	 * @param  {Promise} [resolve]
	 * @param  {Array} outArray
	 * @param  {Number} rejected
	 * @private
	 */
	static _chainPromisesInner(opts, resolve, outArray, rejected) {
		let firstItem = opts.shift();

		if (firstItem) {
			// string or function itself
			let fn;
			let error = false;

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
				fn.apply(firstItem.scope || fn, firstItem.args || []).then(data => {
					outArray.push(data);

					this._chainPromisesInner(opts, resolve, outArray, rejected);
				}, err => {
					outArray.push(err);

					this._chainPromisesInner(opts, resolve, outArray, rejected + 1);
				});
			}
			else {
				this.col("No callable {0} function found!", firstItem.method);

				resolve({
					output: outArray,
					rejected: rejected
				});
			}
		}
		else {
			resolve({
				output: outArray,
				rejected: rejected
			});
		}
	}
};

module.exports = Common;
