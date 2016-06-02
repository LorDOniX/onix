#!/usr/bin/env node
"use strict";

var chokidar = require('chokidar');
var exec = require('child_process').exec;
var fs = require("fs");
var Less = require('less');
var UglifyJS = require("uglify-js");
var filesJson = require("./src/files");

// dont change watch paths order! - see watcher
const _CONST = {
	WATCH_PATHS: [
		"src/",
		"less/",
		"test/less/"
	],
	JS_ONIX: "onix.js",
	JS_SRC_PATH: "src/",
	JS_OUTPUT: "dist/onix-js-framework.js",
	JS_MINIMAL_OUTPUT: "dist/onix-js-minimal-framework.js",
	JS_OUTPUT_MIN: "dist/onix-js-framework.min.js",
	JS_MINIMAL_OUTPUT_MIN: "dist/onix-js-minimal-framework.min.js",
	HEADER_FILE: "HEADER",
	LESS_FILE: "less/onix.less",
	CSS_FILE: "dist/onix.css",
	LESS_TEST_FILE: "test/less/main.less",
	CSS_TEST_FILE: "test/css/main.css"
};

const _JS_MINIMAL_FILES = filesJson.minimal.map((item) => {
	return _CONST.JS_SRC_PATH + item;
});

const _JS_FILES = filesJson.onix.map((item) => {
	return _CONST.JS_SRC_PATH + item;
});

const _HEADER = {
	VERSION_PH: "{VERSION}",
	DATE_PH: "{DATE}",
	MINIMAL_PH: "{MINIMAL}",
	ONIX_JS_PH: '"{ONIX_INFO}"',
	ONIX_JS_VERSION: "version: ",
	ONIX_JS_DATE: "date: "
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
			let allFiles = [c.HEADER_FILE].concat(_JS_FILES);

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

				if (_JS_FILES.indexOf(path) != -1) {
					Common.readFile(path).then((data) => {
						// todo update onix.js
						this._filesCache[path] = data;

						this._makeJS(_JS_FILES, _CONST.JS_OUTPUT);
					});
				}
				else if (path.indexOf(_CONST.WATCH_PATHS[2]) != -1) {
					// less main
					this._makeLess(_CONST.LESS_TEST_FILE, _CONST.CSS_TEST_FILE, false);
				}
				else if (path.indexOf(_CONST.WATCH_PATHS[1]) != -1) {
					// less onix
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

	_getJSfromCache(path) {
		let data = this._filesCache[path] || "";
		let onixPath = this._getOnixJSPath();

		if (path == onixPath) {
			data = data.replace(_HEADER.ONIX_JS_PH, this._getHeader());
		}
		
		return data;
	}

	_makeJS(inputFiles, outputFile) {
		return new Promise((resolve, reject) => {
			let output = [];

			inputFiles.forEach((file) => {
				output.push(this._getJSfromCache(file));
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
	 * @param  {String} headerFileData
	 * @param  {String} outputFile
	 * @return {Promise}
	 */
	_uglify(inputFiles, headerFileData, outputFile) {
		return new Promise((resolve, reject) => {
			let result = UglifyJS.minify(inputFiles);
			let data = headerFileData + result.code;

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

	_getOnixJSPath() {
		let path = "";

		_JS_FILES.every((filePath) => {
			if (filePath.indexOf(_CONST.JS_ONIX) != -1) {
				path = filePath;
				return false;
			}
			else return true;
		});

		return path;
	}

	_parseOnixJSFile() {
		let path = this._getOnixJSPath();
		let data = this._filesCache[path] || "";
		let lines = data.split("\n");
		let output = {
			version: "",
			date: ""
		};

		lines.forEach((line) => {
			line = line.trim();

			let ind = line.indexOf(_HEADER.ONIX_JS_VERSION);
			let ind2 = line.indexOf(_HEADER.ONIX_JS_DATE);

			if (ind != -1) {
				output.version = line.substr(ind + _HEADER.ONIX_JS_VERSION.length);
			}
			else if (ind2 != -1) {
				output.date = line.substr(ind2 + _HEADER.ONIX_JS_DATE.length);
			}
		});

		return output;
	}

	/**
	 * Get header data
	 * 
	 * @param  {Boolean} addComment Add comment around header?
	 * @param  {Boolean} addMinimal Add minimal header line? 
	 * @return {String}
	 */
	_getHeader(addComment, addMinimal) {
		let parsedData = this._parseOnixJSFile();
		let headerData = this._filesCache[_CONST.HEADER_FILE];
		let output = [];
		let joiner = addComment ? "\n" : "";

		if (addComment) {
			output.push("/**");
		}
		
		let lines = headerData.split("\n");
		let minPh = addMinimal ? " * minimal version: contains [" + filesJson.minimal.join(", ") + "]" : "";

		lines.forEach((line, ind) => {
			if (!line.trim().length) return;

			// minimal version replace
			if (line.match(new RegExp(_HEADER.MINIMAL_PH))) {
				output.push(minPh);
			}
			else {
				// replace version, date
				line = line.replace(_HEADER.VERSION_PH, parsedData.version).replace(_HEADER.DATE_PH, parsedData.date);

				// add comment, update onix.js info() method; lines - 2 (eof, last)
				output.push((addComment ? " * " : "'") + line + (addComment ? "" : "\\n'" + (ind < lines.length - 2 ? "+\n" : "")));
			}
		});

		if (addComment) {
			output.push(" */");
			// for last \n
			output.push("");
		}

		return output.join(joiner);
	}

	/**
	 * Run documentation for JS duck
	 * 
	 * @return {Promise}
	 */
	_jsduck() {
		return new Promise((resolve, reject) => {
			exec("jsduck src/core/*.js src/onix/*.js src/utils/*.js --output docs --warnings=-nodoc,-dup_member,-link_ambiguous --external=XMLHttpRequest,$q", (error, stdout, stderr) => {
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
			args: [_JS_FILES, c.JS_OUTPUT],
			scope: this
		}, {
			method: "_makeJS",
			args: [_JS_MINIMAL_FILES, c.JS_MINIMAL_OUTPUT],
			scope: this
		}, {
			method: "_makeLess",
			args: [c.LESS_FILE, c.CSS_FILE, false],
			scope: this
		}, {
			method: "_makeLess",
			args: [c.LESS_TEST_FILE, c.CSS_TEST_FILE, false],
			scope: this
		}]).then(() => {
			let pd = this._parseOnixJSFile();

			Common.col("Onix version {0} date {1}", pd.version, pd.date);
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
			args: [_JS_FILES, c.JS_OUTPUT],
			scope: this
		}, {
			method: "_makeJS",
			args: [_JS_MINIMAL_FILES, c.JS_MINIMAL_OUTPUT],
			scope: this
		}, {
			method: "_makeLess",
			args: [c.LESS_FILE, c.CSS_FILE, true],
			scope: this
		}, {
			method: "_makeLess",
			args: [c.LESS_TEST_FILE, c.CSS_TEST_FILE, true],
			scope: this
		}, {
			method: "_uglify",
			args: [[c.JS_OUTPUT], this._getHeader(true), c.JS_OUTPUT_MIN],
			scope: this
		}, {
			method: "_uglify",
			args: [[c.JS_MINIMAL_OUTPUT], this._getHeader(true, true), c.JS_MINIMAL_OUTPUT_MIN],
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
