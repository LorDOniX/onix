#!/usr/bin/env node
"use strict";

var chokidar = require('chokidar');
var exec = require('child_process').exec;
var fs = require("fs");
var Less = require('less');
var UglifyJS = require("uglify-js");
var filesJson = require("./src/files");
var crypto = require('crypto');
var babelCore = require("babel-core");

const EOL = require("os").EOL;
const PATH_SEP = require("path").sep;

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
	CSS_TEST_FILE: "test/css/main.css",
	CACHE_FILE: "./cache.json",
	ES6_ENABLE: false,
	ES6_PRESETS: [
		"babel-preset-es2015"
	]
};

const _JS_MINIMAL_FILES = filesJson.minimal.map((item) => {
	return _CONST.JS_SRC_PATH + item;
});

const _JS_FILES = filesJson.onix.map((item) => {
	return _CONST.JS_SRC_PATH + item;
});

const _ES6_SKIP = filesJson.es6_skip.map((item) => {
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
	 * Remove file.
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

class TimeStop {
	constructor() {
		this._cache = {};
	}

	start(label) {
		let ct = Date.now();
		label = label || ct;
		this._cache[label] = ct;
	}

	end(label) {
		label = label || "";
		let ct = Date.now();
		let cacheItem = this._cache[label];

		if (cacheItem) {
			let diff = ct - cacheItem;

			if (diff < 1000) {
				return diff + " ms";
			}
			else {
				return (diff / 1000).toFixed(2) + " s";
			}
		}
		else return "0 ms";
	}
};

class ES6 {
	constructor() {
		this._fileName = _CONST.CACHE_FILE;
		this._hash = {};
		this._cache = fs.existsSync(this._fileName) ? require(this._fileName) : {};
	}

	/**
	 * Transpile data
	 * 
	 * @param  {String} path
	 * @param  {String} data
	 * @return {Object} { code: "", cache: ... }
	 */
	transpile(path, data) {
		let output = {
			code: "",
			cache: false
		};

		let md5hash = this.md5hash(data);

		// cache record
		this._hash[md5hash] = true;

		// cache?
		if (!(md5hash in this._cache)) {
			let presets = _CONST.ES6_PRESETS;

			let es6config = {
				presets: presets.map((preset) => {
					return require.resolve(preset)
				})
			};

			try {
				let transform = babelCore.transform(data, es6config);

				this._cache[md5hash] = transform.code;
			}
			catch (err) {
				this.parseES6error(path, data, err);
			}
		}
		else {
			output.cache = true;
		}

		output.code = this._cache[md5hash] || "";

		return output;
	}

	md5hash(data) {
		return crypto.createHash('md5').update(data).digest('hex');
	}

	/**
	 * Parse ES6 transform error. Show path and lineNumber + line content.
	 * Output is shown in console.
	 * @param  {String} path
	 * @param  {String} data
	 * @param  {Object} err 
	 */
	parseES6error(path, data, err) {
		Common.col("ES6 transform error {0} {1}", path, err.message);

		let matchLine = err.message.match(/\([0-9]+:[0-9]\)/);

		if (matchLine) {
			let lineNumber = matchLine[0].replace(/\(|\)/g, "");
			lineNumber = parseInt(lineNumber.split(":")[0], 10);

			let lines = data.split("\n");

			if (lineNumber >= 0 && lineNumber < lines.length) {
				Common.col("Line {1}: {0}", lines[lineNumber].trim(), lineNumber);
			}
		}
	}

	saveCache() {
		return new Promise((resolve, reject) => {
			var hashKeys = Object.keys(this._hash);

			if (!hashKeys.length) {
				resolve();
			}
			else {
				// remove unused keys
				Object.keys(this._cache).forEach((key) => {
					if (hashKeys.indexOf(key) == -1) {
						delete this._cache[key];
					}
				}, this);

				// write cache
				let data = JSON.stringify(this._cache, null, 4);

				Common.writeFile(this._fileName, data).then(() => {
					Common.col("Cache file {0} {1} was written!", this._fileName, Common.formatSize(data.length));
					resolve();
				}, () => {
					Common.col("Cache file {0} write file error!", this._fileName);
					reject();
				});
			}
		});
	}

	clearCache() {
		return new Promise((resolve, reject) => {
			Common.removeFile(this._fileName).then(() => {
				Common.col("Cache file {0} was removed!", this._fileName);
				resolve();
			}, (err) => {
				Common.col("Cache file {0} remove file error: {1}!", this._fileName, err.message);
				reject();
			});
		});
	}
}

class Bundler {
	constructor() {
		this._arg = this._getArg();

		this._es6 = new ES6();

		this._setupWatcher();

		this._timeStop = new TimeStop();

		this._filesCache = {};

		Common.col("Bundler help");
		Common.col("------------");
		Common.col("./bundler.js watch - watch and compile js & less files");
		Common.col("./bundler.js dev - compile for dev");
		Common.col("./bundler.js dist - compile for dist");
		Common.col("./bundler.js doc - documentation");
		Common.col("./bundler.js clear - clear ES6 cache");
		Common.col("./bundler.js - default is watch option");

		// pre files operations
		switch (this._arg) {
			case "doc":
				this._jsduck();
				return;

			case "clear":
				this._clear();
				return;
		}

		// post files operations
		this._loadFiles().then(() => {
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
			let es6File = 0;
			let es6FileCache = 0;

			if (_CONST.ES6_ENABLE) {
				Common.col("Starting ES6 transpile...");

				this._timeStop.start("ES6");
			}

			Common.readFiles(allFiles).then((all) => {
				all.forEach((file) => {
					let o = this._setFileCache(file.path, file.data);

					es6File += o.es6File ? 1 : 0;
					es6FileCache += o.es6FileCache ? 1 : 0;
				});

				if (_CONST.ES6_ENABLE) {
					Common.col("ES6 transpilation: {0} files, {1} cached, takes {2}",
								es6File, es6FileCache, this._timeStop.end("ES6"));
				}

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
				// path parts
				let parts = path.split(PATH_SEP);

				// set unix format
				path = parts.join("/");

				if (_JS_FILES.indexOf(path) != -1) {
					Common.readFile(path).then((data) => {
						this._setFileCache(path, data);

						this._makeJS(_JS_FILES, _CONST.JS_OUTPUT).then(() => {
							this._makeCache();
						});
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

	/**
	 * Set file cache.
	 * 
	 * @param {String} path
	 * @param {String} data
	 * @return {Object} ES6 info
	 */
	_setFileCache(path, data) {
		let output = {
			es6File: false,
			es6FileCache: false
		};

		let outputData = data;

		// es6
		if (_CONST.ES6_ENABLE) {
			if (path.indexOf(".js") == -1 || _ES6_SKIP.indexOf(path) != -1) {
				Common.col("ES6 skip path {0}", path);
			}
			else {
				let transpile = this._es6.transpile(path, data);

				output.es6File = true;
				output.es6FileCache = transpile.cache;

				outputData = transpile.code;
			}
		}

		this._filesCache[path] = outputData;

		return output;
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

			// output
			let outputStr = output.join(EOL);

			if (_CONST.ES6_ENABLE) {
				outputStr = outputStr.replace(/"use strict";/g, "");
			}
			
			// clear blank lines
			outputStr = outputStr.replace(/(^[ \t]*\n)/gm, "");

			Common.writeFile(outputFile, outputStr).then(() => {
				Common.col("Write JS {0} {1}", outputFile, Common.formatSize(outputStr.length));
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
							Common.col("Write CSS {0} {1}", outputFile, Common.formatSize(output.css.length));
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

	_makeCache() {
		return this._es6.saveCache();
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
				Common.col("Write JS {0} {1}", outputFile, Common.formatSize(result.code.length));
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
		let lines = data.split(EOL);
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
		
		let lines = headerData.split(EOL);
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
			Common.col("JSDuck output:");

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
		}, {
			method: "_makeCache",
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

	// clear es6 cache
	_clear() {
		this._es6.clearCache();
	}
}

let bundler = new Bundler();
