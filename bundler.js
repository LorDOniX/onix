#!/usr/bin/env node
"use strict";

var chokidar = require('chokidar');
var exec = require('child_process').exec;
var fs = require("fs");
var Less = require('less');
var UglifyJS = require("uglify-js");

const _CONST = {
	WATCH_PATHS: [
		"src/",
		"less/"
	],
	JS_MINIMAL_FILES: [
		"src/polyfills.js",
		"src/onix.js",
		"src/filter.js",
		"src/q.js",
		"src/common.js"
	],
	JS_FILES: [
		"src/polyfills.js",
		"src/exif.js",
		"src/onix.js",
		"src/local-storage.js",
		"src/cookie.js",
		"src/routeParams.js",
		"src/math.js",
		"src/date.js",
		"src/filter.js",
		"src/filters.js",
		"src/q.js",
		"src/promise.js",
		"src/job.js",
		"src/my-query.js",
		"src/dom.js",
		"src/location.js",
		"src/common.js",
		"src/notify.js",
		"src/event.js",
		"src/loader.js",
		"src/http.js",
		"src/i18n.js",
		"src/template.js",
		"src/route.js",
		"src/select.js",
		"src/image.js",
		"src/preview-images.js",
		"src/slider.js",
		"src/anonymizer.js"
	],
	JS_OUTPUT: "dist/onix-js-framework.js",
	JS_MINIMAL_OUTPUT: "dist/onix-js-minimal-framework.js",
	JS_OUTPUT_MIN: "dist/onix-js-framework.min.js",
	JS_MINIMAL_OUTPUT_MIN: "dist/onix-js-minimal-framework.min.js",
	HEADER_FILE: "HEADER",
	HEADER_MINIMAL_FILE: "HEADER_MINIMAL",
	LESS_FILE: "less/onix.less",
	CSS_FILE: "dist/onix.css"
};

class Common {
	/**
	 * Own console log
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
	 * @param  {Number} size
	 * @return {String}
	 */
	static humanLength(size) {
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
	 * Write file.
	 * @param  {String} name
	 * @param  {String} data
	 * @return {Promise}
	 */
	static writeFile(name, data) {
		return new Promise((resolve, reject) => {
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

	/**
	 * Chaining multiple methods with promises.
	 * @param  {Array} opts
	 * @return {Promise}
	 */
	static chainPromises(opts) {
		return new Promise((resolve) => {
			this.chainPromisesInner(opts, resolve, []);
		});
	}

	/**
	 * Inner method for chaining promises.
	 * @param  {Array} opts { method: {string|function}, args: [], scope: {object} }
	 * @param  {Promise} [resolve]
	 * @param  {Array} outArray
	 */
	static chainPromisesInner(opts, resolve, outArray) {
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
				fn.apply(firstItem.scope || fn, firstItem.args || []).then((data) => {
					outArray.push(data);
					this.chainPromisesInner(opts, resolve, outArray);
				}, (err) => {
					outArray.push(err);
					this.chainPromisesInner(opts, resolve, outArray);
				});
			}
			else {
				this.col("No callable {0} function found!", firstItem.method);
				resolve(outArray);
			}
		}
		else {
			resolve(outArray);
		}
	}
};

class Watcher {
	constructor() {
		this._timeoutID = null;
		this._timeDelay = 500;
		this._handler = null;
		this._buffer = [];
	}

	/**
	 * Set paths for watcher object.
	 * @param {[type]} paths [description]
	 */
	setWatchPaths(paths) {
		this._paths = paths || [];
	}

	/**
	 * Callback, when the file is changed.
	 * @param {Function} cb
	 */
	setCallback(cb) {
		this._cb = cb || () => {};
	}

	/**
	 * Start watching files.
	 */
	start() {
		if (!this._paths.length) return;

		console.log("Watcher is starting...");

		this._handler = chokidar.watch(this._paths).on('change', (path, stats) => {
			this._buffer.push(path);

			if (this._timeoutID) {
				clearTimeout(this._timeoutID);
				this._timeoutID = null;
			}

			this._timeoutID = setTimeout(() => {
				if (this._cb) {
					this._cb("file-change", this._buffer);
					this._buffer = [];
				}
			}, this._timeDelay);
		});
	}
};

class Bundler {
	constructor() {
		this._arg = this._getArg();

		this._setupWatcher();

		this._filesCache = {};

		this._loadFiles().then(() => {
			Common.col("Bundler help");
			Common.col("------------");
			Common.col("./bundler.js watch - watch and compile js & less files");
			Common.col("./bundler.js dev - compile for dev");
			Common.col("./bundler.js dist - compile for dist");
			Common.col("./bundler.js doc - documentation");
			Common.col("./bundler.js - default is watch option");

			switch (this._arg) {
				case "watch":
					this._dev("watcher");
					break;

				case "dev":
					this._dev();
					break;

				case "dist":
					this._dist();
					break;

				case "doc":
					this._jsduck();
					break;

				default:
					// default is watch
					this._dev("watcher");
			}
		}, (err) => {
			Common.col("Load files error! {0}", err);
		});
	}

	_loadFiles() {
		return new Promise((resolve, reject) => {
			let c = _CONST;
			let allFiles = [c.HEADER_FILE, c.HEADER_MINIMAL_FILE].concat(c.JS_FILES);

			Common.readFiles(allFiles).then((all) => {
				all.forEach((file) => {
					this._filesCache[file.path] = file.data;
				});

				resolve();
			}, (err) => {
				reject(err);
			});
		});
	}

	_setupWatcher() {
		this._watcher = new Watcher();

		this._watcher.setWatchPaths(_CONST.WATCH_PATHS);

		this._watcher.setCallback((eventName, buffer) => {
			if (buffer.length == 1) {
				let path = buffer[0];

				if (_CONST.JS_FILES.indexOf(path) != -1) {
					Common.readFile(path).then((data) => {
						this._filesCache[path] = data;
						this._makeJS(_CONST.JS_FILES, _CONST.JS_OUTPUT);
						this._makeJS(_CONST.JS_MINIMAL_FILES, _CONST.JS_MINIMAL_OUTPUT);
					});
				}
				else {
					// less
					this._makeLess(_CONST.LESS_FILE, _CONST.CSS_FILE, false);
				}
			}
		});
	}

	/**
	 * Get argument from console/enviroment.
	 * @return {String} one optinal parameter
	 */
	_getArg() {
		let args = process.argv;

		if (args.length == 3) {
			return args[2];
		}
		else return "";
	}

	_makeJS(inputFiles, outputFile) {
		return new Promise((resolve, reject) => {
			let output = [];

			inputFiles.forEach((file) => {
				output.push(this._filesCache[file] || "");
			});

			// clear blank lines
			let outputStr = output.join("\n").replace(/(^[ \t]*\n)/gm, "");

			Common.writeFile(outputFile, outputStr).then(() => {
				Common.col("Write JS {0} {1}", outputFile, Common.humanLength(outputStr.length));
				resolve();
			}, () => {
				Common.col("Write JS {0} write file error!", e.filename);
				reject();
			});
		});
	}

	/**
	 * Make css from less
	 * @param  {String} inputFile  Less file
	 * @param  {String} outputFile Output css file
	 * @return {Promise}
	 */
	_makeLess(inputFile, outputFile, compress) {
		return new Promise((resolve, reject) => {
			Common.readFile(inputFile).then((data) => {
				// readed less files, prepare config
				let lessOpts = {
					filename: inputFile,
					compress: compress
				};

				Less.render(data, lessOpts, (e, output) => {
					// render output
					if (e && e.message) {
						Common.col("CSS error {0}: {1}", e.filename, e.message);
						Common.col("Line {0}: {1}", e.line, e.extract[0].trim());
						reject();
					}
					else {
						// write output
						Common.writeFile(outputFile, output.css).then(() => {
							Common.col("Write CSS {0} {1}", outputFile, Common.humanLength(output.css.length));
							resolve();
						}, () => {
							Common.col("Write {0} write file error!", e.filename);
							reject();
						});
					}
				});
			}, (err) => {
				Common.col(err.message);
				reject();
			});
		});
	}
	
	/**
	 * @param  {String[]} inputFiles
	 * @param  {String} headerFile
	 * @param  {String} outputFile
	 * @return {Promise}
	 */
	_uglify(inputFiles, headerFile, outputFile) {
		return new Promise((resolve, reject) => {
			let result = UglifyJS.minify(inputFiles);
			let data = this._filesCache[headerFile] + result.code;

			// write output
			Common.writeFile(outputFile, data).then(() => {
				Common.col("Write JS {0} {1}", outputFile, Common.humanLength(result.code.length));
				resolve();
			}, () => {
				Common.col("Write {0} write file error!", e.filename);
				reject();
			});
		});
	}

	/**
	 * Run documentation for JS duck
	 * 
	 * @return {Promise}
	 */
	_jsduck() {
		return new Promise((resolve, reject) => {
			exec("jsduck src/*.js --output docs --warnings=-nodoc,-dup_member,-link_ambiguous --external=XMLHttpRequest,$q", (error, stdout, stderr) => {
				if (stdout) {
					console.log(stdout);
					resolve();
				}
				if (stderr) {
					console.log(stderr);
					reject();
				}
			});
		});
	}

	_dev(runType) {
		let c = _CONST;

		Common.chainPromises([{
			method: "_makeJS",
			args: [c.JS_FILES, c.JS_OUTPUT],
			scope: this
		}, {
			method: "_makeJS",
			args: [c.JS_MINIMAL_FILES, c.JS_MINIMAL_OUTPUT],
			scope: this
		}, {
			method: "_makeLess",
			args: [c.LESS_FILE, c.CSS_FILE, false],
			scope: this
		}]).then(() => {
			Common.col("Dev is done");

			switch (runType) {
				case "watcher":
					this._watcher.start();
					break;
			}
		});
	}

	// dist js and compile css
	_dist() {
		let c = _CONST;

		Common.chainPromises([{
			method: "_makeJS",
			args: [c.JS_FILES, c.JS_OUTPUT],
			scope: this
		}, {
			method: "_makeJS",
			args: [c.JS_MINIMAL_FILES, c.JS_MINIMAL_OUTPUT],
			scope: this
		}, {
			method: "_makeLess",
			args: [c.LESS_FILE, c.CSS_FILE, true],
			scope: this
		}, {
			method: "_uglify",
			args: [[c.JS_OUTPUT], c.HEADER_FILE, c.JS_OUTPUT_MIN],
			scope: this
		}, {
			method: "_uglify",
			args: [[c.JS_MINIMAL_OUTPUT], c.HEADER_MINIMAL_FILE, c.JS_MINIMAL_OUTPUT_MIN],
			scope: this
		}, {
			method: "_jsduck",
			scope: this
		}]).then(() => {
			console.log("Dist is done");
		});
	}
}

let bundler = new Bundler();
