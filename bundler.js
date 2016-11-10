#!/usr/bin/env node
"use strict";

/**
 * Bundler version 1.0.2
 * Date: 10. 11. 2016
 *
 * event signals, on(arg):
 *
 * arg: {
 * 	{String} name - event name
 * 	{Object} bundlerScope - bundler.js scope
 * 	{Object} args - additional parameters
 * }
 *
 * before-save-js - before js is saved to the file; @return {String} you must return processed output
 * arg.args: {
 * 	{Object} bundleConf - current runtype conf
 * 	{Object} bundle - all bundle config
 * 	{String} writeData - data to write
 * 	{Object} data - ES6 process object
 * }
 *
 * bundles-done - all bundles are done
 * 
 * watch-bundle-update - watch event and bundle update
 * arg.args: {
 *  {Object} file - changed file
 *  {Object} bundleConf - current runtype conf
 *  {Object} bundle - all bundle config
 * }
 */
var fs = require("fs");
var exec = require('child_process').exec;
var crypto = require('crypto');
var babelCore = require("babel-core");
var UglifyJS = require("uglify-js");
var LessLibrary = require('less');
var chokidar = require('chokidar');
var webSocketServer = require('ws').Server;

const EOL = require("os").EOL;
const CONF_FILE = "conf.json";

class Common {
	static str() {
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

		return output;
	}

	static col() {
		let args = Array.prototype.slice.call(arguments);

		console.log(this.str.apply(this, args));
	}
	
	static formatSize(size) {
		if (typeof size !== "number") {
			return "null";
		}

		let lv = size > 0 ? Math.floor(Math.log(size) / Math.log(1024)) : 0;
		let sizes = ["", "K", "M", "G", "T"];
		lv = Math.min(sizes.length, lv);
		let value = lv > 0 ? (size / Math.pow(1024, lv)).toFixed(2) : size;

		return value + " " + sizes[lv] + "B";
	}

	static formatTime(time) {
		time = time || 0;

		if (time < 1000) {
			return time + " ms";
		}
		else {
			let num = time / 1000;

			return num.toFixed(2) + " s";
		}
	}

	static getMD5hash(data) {
		return crypto.createHash('md5').update(data).digest('hex');
	}

	static readFile(path) {
		let output = {
			data: "",
			error: false,
			msg: ""
		};

		if (!path) {
			output.error = true;
			output.msg = "No path!";
			return output;
		}

		try {
			output.data = fs.readFileSync(path, "utf-8");
		}
		catch (err) {
			output.error = true;
			output.msg = err.message;
		}

		return output;
	}

	static getJSON(path) {
		let output = {
			json: {},
			error: true,
			msg: ""
		};

		if (!path) {
			output.msg = "No path!";
			return output;
		}

		let fileData = this.readFile(path);

		if (fileData.error) {
			output.msg = fileData.msg;
		}
		else {
			try {
				output.json = JSON.parse(fileData.data);
				output.error = false;
			}
			catch (err) {
				output.msg = fileData.msg;
			}
		}

		return output;
	}

	static writeFile(path, data, opts) {
		let output = {
			error: true,
			msg: ""
		};

		let options = {
			encoding: "utf-8"
		};

		for (let key in opts) {
			options[key] = opts[key];
		}

		if (!path) {
			output.msg = "No path!";
			return output;
		};

		try {
			fs.writeFileSync(path, data, options);
			output.error = false;
		}
		catch (err) {
			error.msg = err.message;
		}

		return output;
	}

	static removeFile(path) {
		let output = {
			error: true,
			msg: ""
		};

		if (!path) {
			output.msg = "No path!";
			return output;
		};

		try {
			fs.unlinkSync(path);
			output.error = false;
		}
		catch (err) {
			output.msg = err.message;
		}

		return output;
	}

	/**
	 * Chaining multiple methods with promises.
	 * 
	 * @param  {Array} opts
	 * @return {Promise}
	 */
	static chainPromises(opts) {
		return new Promise(resolve => {
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

	static isObject(item) {
		return (typeof item === "object" && !Array.isArray(item) && item !== null);
	}

	static valFromObj(obj, path, defValue) {
		if (arguments.length < 2) {
			return null;
		}

		let curObj = obj;
		let parts = path.split(".");

		parts.every(part => {
			part = part.trim();
			
			let arrayMatch = part.match(/\[\s*(\d+)\s*\]/);
			let isOk = false;

			if (arrayMatch) {
				let arrayObj = curObj[part.replace(arrayMatch[0], "")];
				let ind = parseFloat(arrayMatch[1]);

				if (Array.isArray(arrayObj) && ind >= 0 && ind < arrayObj.length) {
					curObj = arrayObj[ind];
					isOk = true;
				}
			}
			else if (this.isObject(curObj)) {
				curObj = curObj[part];
				isOk = true;
			}

			if (!isOk || typeof curObj === "undefined") {
				curObj = defValue || null;

				return false;
			}
			else {
				return true;
			}
		});

		return curObj;
	};

	static emptyPromise(prom) {
		prom.then(ok => {}, err => {});

		return prom;
	}

	static finallyPromise(prom, cb) {
		if (typeof cb !== "function") return;

		prom.then(ok => {
			cb(ok);
		}, err => {
			cb(err);
		});

		return prom;
	}
};

var CONF = (function() {
	let confData = Common.getJSON(CONF_FILE);

	if (confData.error) {
		throw "Read conf error!";
	}
	else {
		return confData.json;
	}
})();

var Cache = (function() {
	class Cache {
		constructor() {
			this._cache = {};
			this._usedPaths = [];
			this._cacheFile = CONF.cacheFile;
			this._cache = this._getCache();
		}

		_getCache() {
			let cache = {};

			if (this._cacheFile) {
				let cacheFile = Common.getJSON(this._cacheFile);

				if (!cacheFile.error) {
					cache = cacheFile.json;
				}
			}

			return cache;
		}

		getCacheItem(path) {
			if (path in this._cache) {
				return this._cache[path];
			}
			else {
				return null;
			}
		}

		saveCacheItem(path, data, transpiled) {
			if (!path) return;

			data = data || "";
			transpiled = transpiled || "";

			if (this._usedPaths.indexOf(path) == -1) {
				this._usedPaths.push(path);
			}

			this._cache[path] = {
				md5hash: Common.getMD5hash(data),
				data: data,
				transpiled: transpiled
			};
		}

		saveCache() {
			return new Promise((resolve, reject) => {
				if (!Object.keys(this._cache).length) {
					resolve();
				}
				else {
					// remove unused keys
					Object.keys(this._cache).forEach(path => {
						if (this._usedPaths.indexOf(path) == -1) {
							delete this._cache[path];
						}
					});

					// write cache
					let data = JSON.stringify(this._cache, null, 4);

					if (!Common.writeFile(this._cacheFile, data).error) {
						resolve(Common.str("Cache file {0} {1} was written!", this._cacheFile, Common.formatSize(data.length)));
					}
					else {
						reject(Common.str("Cache file {0} write file error!", this._cacheFile));
					}
				}
			});
		}

		clearCache() {
			return new Promise((resolve, reject) => {
				if (!this._cacheFile) {
					reject("No cache file!");
					return;
				}

				let oper = Common.removeFile(this._cacheFile);

				if (!oper.error) {
					resolve(Common.str("File {0} was succesfully removed!", this._cacheFile));
				}
				else {
					reject(Common.str("Error deleting cache {0}", oper.msg));
				}
			});
		}
	};

	return new Cache();
})();

class TimeStop {
	constructor() {
		this._timeRecords = {};
	}

	start(id) {
		if (!id) return;

		this._timeRecords[id] = Date.now();
	}

	end(id, getNumber) {
		if (!id) return null;

		let cacheItem = this._timeRecords[id];
		let time = 0;

		if (cacheItem) {
			time = Date.now() - cacheItem;
		}

		return (getNumber ? time : Common.formatTime(time));
	}
};

class ES6 {
	constructor(conf) {
		let presets = conf.presets || [];
		let plugins = conf.plugins || [];

		this._es6config = {
			compact: false,
			presets: presets.map(preset => {
				return require.resolve(preset)
			}),
			plugins: plugins.map(plugin => {
				return require.resolve(plugin)
			})
		};
	}

	make(bundle, optsArg) {
		return new Promise((resolve, reject) => {
			let opts = {
				dist: false,
				useCache: true,
				compress: false,
				clearUseStrict: false,
				clearBlankLines: false
			};

			for (let key in optsArg) {
				opts[key] = optsArg[key];
			}

			let errors = [];
			let allData = [];
			let output = {
				data: "",
				allFiles: 0,
				transpiled: 0,
				noTranspiled: 0,
				cached: 0,
				procFiles: []
			};

			(bundle.data || []).every(item => {
				let transpile = item.ES6 && !opts.dist;
				let everyCycle = true;
				let dataOutput = [];
				let allFiles = item.files || [];

				allFiles.every(path => {
					let readedFile = Common.readFile(path);

					output.allFiles++;
					output.procFiles.push(path);

					if (readedFile.error) {
						everyCycle = false;
						errors.push(Common.str("Error reading file {0}", path));
						return false;
					}

					// process one file
					let data = readedFile.data;
					let pf = this._processFile(path, data, transpile, opts);

					if (!pf.error) {
						output.transpiled += pf.wasTranspiled ? 1 : 0;
						output.cached += pf.cacheRead ? 1 : 0;
						output.noTranspiled += pf.useData ? 1 : 0;

						// add
						dataOutput.push(pf.useData ? data : pf.transpiled);

						// save cache
						if (opts.useCache && !opts.dist) {
							Cache.saveCacheItem(path, data, pf.transpiled);
						}

						return true;
					}
					else {
						everyCycle = false;
						errors.push(pf.msg);
						return false;
					}
				});

				// skip errors
				if (!everyCycle) {
					return everyCycle;
				}

				// save data
				let processedData = dataOutput.join(EOL);

				// skip for error
				if (opts.dist && item.ES6) {
					let path = allFiles.join(",");
					let md5hash = Common.getMD5hash(processedData);

					// process one file
					let pf = this._processFile(path, processedData, true, opts);

					if (!pf.error) {
						// add
						allData.push(pf.transpiled);

						// save cache
						if (opts.useCache) {
							Cache.saveCacheItem(path, processedData, pf.transpiled);
						}
					}
					else {
						return false;
					}
				}
				else {
					allData.push(processedData);
				}

				return everyCycle;
			});

			if (!errors.length) {
				let outputData = allData.join(EOL);

				if (opts.clearUseStrict) {
					outputData = outputData.replace(/"use strict";/g, "");
				}

				if (opts.clearBlankLines) {
					outputData = outputData.replace(/(^[ \t]*\n)/gm, "");
				}

				output.data = outputData;

				// compress
				if (opts.compress) {
					let compressData = this._compressData(outputData);

					if (!compressData.error) {
						output.data = compressData.compress;

						resolve(output);
					}
					else {
						errors.push(compressData.msg);
						reject(errors.join(EOL));
					}
				}
				else {
					resolve(output);
				}
			}
			else {
				reject(errors.join(EOL));
			}
		});
	}

	_processFile(path, data, transpile, opts) {
		let output = {
			transpiled: "",
			useData: false, // use data - not use transpiled
			wasTranspiled: false,
			cacheRead: false, // for transpilation
			error: false,
			msg: ""
		};

		if (transpile) {
			let cacheItem = opts.useCache ? Cache.getCacheItem(path) : null;
			let md5hash = opts.useCache ? Common.getMD5hash(data) : "";

			// cache
			if (cacheItem && md5hash == cacheItem.md5hash) {
				output.transpiled = cacheItem.transpiled;
				output.cacheRead = true;
			}
			else {
				// transpilation
				let transData = this._transpile(path, data);
				
				if (!transData.error) {
					output.transpiled = transData.code;
					output.wasTranspiled = true;
				}
				else {
					output.error = true;
					output.msg = transData.msg;
				}
			}
		}
		else {
			output.useData = true;
		}

		return output;
	}

	_transpile(path, data) {
		let output = {
			code: "",
			error: false,
			msg: ""
		};

		try {
			let transform = babelCore.transform(data, this._es6config);

			output.code = transform.code;
		}
		catch (err) {
			output.error = true;
			output.msg = this._parseES6error(path, data, err);
		}

		return output;
	}

	_compressData(data) {
		let output = {
			compress: "",
			msg: "",
			error: false
		};

		try {
			output.compress = UglifyJS.minify(data, {
				fromString: true
			}).code;
		}
		catch (err) {
			let errors = [
				err.message
			];

			if ("line" in err && "col" in err) {
				let lines = data.split(EOL);
				let around = 3;
				let start = err.line - around;
				let end = err.line + around;

				for (let i = start; i <= end; i++) {
					if (i >= 0 && i < lines.length) {
						errors.push("[" + i + "] " + (i == err.line ? "-->" : "") + lines[i]);
					}
				}
			}

			output.error = true;
			output.msg = errors.join(EOL);
		}

		return output;
	}

	/**
	 * Parse ES6 transform error. Show path and lineNumber + line content.
	 * Output is shown in console.
	 * @param  {String} path
	 * @param  {String} data
	 * @param  {Object} err 
	 */
	_parseES6error(path, data, err) {
		let errors = [
			Common.str("ES6 transpilation error on the file {0}", path)
		];

		if (err.loc && err.codeFrame) {
			errors.push(err.codeFrame);
		}
		else if (err.message) {
			let matchLine = err.message.match(/\([0-9]+:[0-9]\)/);

			if (matchLine) {
				let parts = matchLine[0].replace(/\(|\)/g, "").split(":");
				let line = parseFloat(parts[0]);
				let column = parseFloat(parts[1]);
				let lines = data.split(EOL);

				if (line >= 0 && line < lines.length) {
					errors.push(Common.str("ES6 file {0} error on line {1}|{2}: {3}", path, line, column, lines[line].trim()));
				}
			}
		}

		return errors.join(EOL);
	}
}

class Less {
	make(bundle, optsArg) {
		return new Promise((resolve, reject) => {
			let opts = {
				compress: false,
				filename: bundle.source
			};

			for (let key in optsArg) {
				opts[key] = optsArg[key];
			}

			let readedFile = Common.readFile(bundle.source);

			if (readedFile.error) {
				reject(Common.str("Less file {0} error!", readedFile.msg));
				return;
			}

			LessLibrary.render(readedFile.data, opts, (e, output) => {
				// render output
				if (e && e.message) {
					let errors = [
						Common.str("CSS error {0}: {1}", e.filename, e.message),
						Common.str("Line {0}: {1}", e.line, (e.extract[0] || "").trim())
					];

					reject(errors.join(EOL));
				}
				else {
					// write output
					resolve(output.css);
				}
			});
		});
	}
};

class Watcher {
	constructor(delay) {
		this._timeoutID = null;
		this._timeDelay = delay || 500;
		this._buffer = [];
	}

	/**
	 * Start watching files.
	 */
	start(paths, cb) {
		if (!paths.length || typeof cb !== "function") return false;

		chokidar.watch(paths).on('change', (path, stats) => {
			this._buffer.push(path);

			if (this._timeoutID) {
				clearTimeout(this._timeoutID);
				this._timeoutID = null;
			}

			this._timeoutID = setTimeout(() => {
				let file = this._buffer[0];

				cb(file, this._buffer);
				
				this._buffer = [];
			}, this._timeDelay);
		});

		return true;
	}
};

class Websocket {
	constructor(port) {
		this._wss = null;
		this._port = port || 8200;
	}

	/**
	 * Send obj to client.
	 * @param  {Object} obj
	 */
	send(obj) {
		if (!this._wss) return;

		this._wss.broadcast(JSON.stringify(obj || {}));
	}

	getPort() {
		return this._port;
	}

	/**
	 * Start server watching.
	 */
	start() {
		if (!this._port) return false;

		let wss = new webSocketServer({ 
			port: this._port
		});

		wss.broadcast = data => {
			wss.clients.forEach(client => {
				client.send(data);
			});
		};

		this._wss = wss;

		return true;
	}
};

class Bundler {
	constructor(opts) {
		this._args = this._getArgs();
		this._runTypes = {
			DEV: "dev",
			DIST: "dist"
		};
		this._runType = "";
		this._isDist = false;
		this._watchPaths = [];

		this._timeStop = new TimeStop();
		this._es6 = new ES6(CONF.ES6 || {});
		this._less = new Less();
		this._websocket = null;

		this._const = {
			separator: "* ",
			separatorOther: "- ",
			eventHandlerMethod: "on"
		};

		this._conf = {
			doc: "doc" in CONF ? CONF.doc : null,
			reload: "reload" in CONF ? CONF.reload : null,
			headerFile: CONF.headerFile
		};

		this._data = {
			reload: null,
			header: null,
			eventHandler: this._getEventHandler()
		};

		this._isWatch = false;
		this._isForce = this._args.indexOf("--force") != -1;
		this._isNoCache = this._args.indexOf("--no-cache") != -1;

		// run
		let firstArg = this._args.length ? this._args[0] : "";

		this._printHelp();

		if (this._data.eventHandler) {
			this._log(this._const.separator + "Event handler is used");
		}

		switch (firstArg) {
			case this._runTypes.DEV:
				this._runType = firstArg;

				this._runBundles();
				break;

			case this._runTypes.DIST:
				this._runType = firstArg;
				this._isDist = true;

				this._runBundles();
				break;

			case "doc":
				Common.emptyPromise(this._doc());
				break;

			case "clear":
				Cache.clearCache().then(ok => {
					this._log(ok);
				}, err => {
					this._log(err);
				});
				break;

			case "watch":
			default:
				this._runType = this._runTypes.DEV;
				this._isWatch = true;

				this._runBundles();
				break;
		}
	}

	/**
	 * Get argument from console/enviroment.
	 * @return {String} one optinal parameter
	 */
	_getArgs() {
		return Array.prototype.slice.call(process.argv, 2).map(arg => {
			return arg.trim();
		});
	}

	_getBundles() {
		let bundles = CONF.bundles || [];
		
		return bundles.filter(bundle => {
			return (this._runType in bundle);
		});
	}

	_printHelp() {
		[
			"Bundler help",
			"------------",
			"watch      - watch and compile js & less files; default option",
			"dev        - compile for dev",
			"dist       - compile for dist",
			"{0}",
			"clear      - remove ES6 cache file",
			"--force    - always rewrite output files",
			"--no-cache - disable cache file",
			""
		].forEach(item => {
			let val = item;

			if (val == "{0}") {
				if (this._conf.doc) {
					val = Common.str(val, "doc        - documentation");
				}
				else {
					return;
				}
			}

			// not using _log
			console.log(val);
		});
	}

	_runBundles() {
		let all = [];

		// header
		all.push({
			method: "_setHeader",
			scope: this
		});

		// reload server
		all.push({
			method: "_setReload",
			scope: this
		});

		let bundles = this._getBundles();
		bundles.forEach(bundle => {
			all.push({
				method: "_runBundle",
				scope: this,
				args: [bundle]
			});
		});

		// cache save - dev & dist
		all.push({
			method: "_saveCache",
			scope: this
		});

		Common.chainPromises(all).then(() => {
			this._log(this._const.separator + (this._isDist ? "Dist is done" : "Dev is done"));
			this._runEvent("bundles-done");

			if (!this._isDist && this._isWatch && this._watchPaths.length) {
				// sort - max len -> small len
				this._watchPaths.sort((a, b) => {
					return b.length - a.length;
				});

				// start websocket
				if (this._websocket) {
					let websocketState = this._websocket.start();

					if (websocketState) {
						this._log(this._const.separator + Common.str("Websocket on {0} is starting...", this._websocket.getPort()));
					}
				}

				let watcher = new Watcher();
				let watcherState = watcher.start(this._watchPaths, (file, buffer) => {
					let watchBundle = this._getWatchBundle(bundles, file);

					if (watchBundle) {
						this._runBundle(watchBundle).then(data => {
							if (!this._websocket) return;

							let sendObj = {
								id: watchBundle.id,
								operation: "",
								data: {}
							};
							
							switch (watchBundle.type) {
								case "js":
									sendObj.operation = "refresh-page";
									break;

								case "less":
									sendObj.operation = "refresh-css";
									sendObj.data.file = require("path").basename(watchBundle.output);
									break;

								case "watch":
									sendObj = null;
									break;
							}

							if (sendObj) {
								this._log(Common.str("Run websocket operation {0}", sendObj.operation));
								
								this._websocket.send(sendObj);
							}

							if (watchBundle.type == "js" && data.change) {
								// update cache
								this._saveCache();
							}

							this._runEvent("watch-bundle-update", {
								file: file,
								bundleConf: watchBundle[this._runType],
								watchBundle: watchBundle
							});
						});
					}
				});

				if (watcherState) {
					this._log(this._const.separator + "Watcher is starting...");
				}
			}
		});
	}

	_getWatchBundle(bundles, file) {
		let watchBundle = null;

		this._watchPaths.every(path => {
			let every = true;

			if (file.indexOf(path) != -1) {
				bundles.every(bundle => {
					let bundleConf = bundle[this._runType];

					if (bundleConf.watchPath && bundleConf.watchPath == path) {
						watchBundle = bundle;
						every = false;

						return false;
					}
					else {
						return true;
					}
				});
			}

			return every;
		});

		return watchBundle;
	}

	_runBundle(bundle) {
		this._log(this._const.separator + Common.str("Run bundle {0}", bundle.id));

		let bundleConf = bundle[this._runType] || {};

		// watch path
		if (!this._isDist && bundleConf.watchPath && this._watchPaths.indexOf(bundleConf.watchPath) == -1) {
			this._watchPaths.push(bundleConf.watchPath);
		}

		switch (bundle.type) {
			case "js":
				return this._makeJS(bundle);
				break;
				
			case "less":
				return this._makeLESS(bundle);
				break;

			case "watch":
				return Promise.resolve();
				break;

			default:
				this._log("Unknown type!");
				return Promise.resolve();
		}
	}

	_makeJS(bundle) {
		return new Promise((resolve, reject) => {
			let bundleConf = bundle[this._runType] || {};
			let file = bundleConf.output;

			if (!file) {
				reject("Missing output file!");
				return;
			}

			let start = this._timeStop.start(bundle.id);
			let opts = {
				dist: this._isDist,
				compress: bundleConf.compress,
				clearUseStrict: bundleConf.clearUseStrict,
				clearBlankLines: bundleConf.clearBlankLines
			};

			this._es6.make(bundle, opts).then(data => {
				let writeData = data.data;
				let end = this._timeStop.end(bundle.id);
				let isChange = data.transpiled > 0 || (data.cached + data.noTranspiled) != data.allFiles;
				let isForce = this._isDist || this._isForce;

				if (isForce || isChange) {
					// header
					if (bundleConf.header && this._data.header) {
						writeData = this.getHeader(true) + EOL + writeData;
					}

					// reload
					if (bundleConf.reload && this._data.reload) {
						writeData += EOL + this._data.reload;
					}

					// event
					let re = this._runEvent("before-save-js", {
						bundleConf: bundleConf,
						bundle: bundle,
						writeData: writeData,
						data: data
					});

					// skip undefined
					if (!re.error && typeof re.output === "string") {
						writeData = re.output;
					}

					let summaryInfo = [];
					let summary = "";

					if (bundleConf.compress) {
						summaryInfo.push("compressed");
					}

					if (opts.clearUseStrict) {
						summaryInfo.push("remove strict");
					}

					if (opts.clearBlankLines) {
						summaryInfo.push("clear blank lines");
					}

					summary = summaryInfo.join(", ");
					summary = summary.length ? ", " + summary : "";

					this._log(Common.str("Summary: files {0}, transpiled {1}, standard {2}, cached {3}{4}", data.allFiles, data.transpiled, data.noTranspiled, data.cached, summary));

					// js data
					if (!Common.writeFile(file, writeData).error) {
						this._log(Common.str("Write JS {0} {1}, time {2}", file, Common.formatSize(writeData.length), end));
						resolve({
							change: true
						});
					}
					else {
						this._log(Common.str("Write JS {0} write file error!", file));
						reject(Common.str("Write JS {0} write file error!", file));
					}
				}
				else {
					this._log("No change!");
					resolve({
						change: false
					});
				}
			}, err => {
				this._log(err);
				reject(err);
			});
		});
	}

	_makeLESS(bundle) {
		return new Promise((resolve, reject) => {
			let bundleConf = bundle[this._runType] || {};
			let file = bundleConf.output;

			if (!file) {
				reject("Missing output file!");
				return;
			}

			let start = this._timeStop.start(bundle.id);
			let opts = {
				compress: bundleConf.compress
			};

			this._less.make(bundle, opts).then(cssData => {
				let end = this._timeStop.end(bundle.id);

				if (!Common.writeFile(file, cssData).error) {
					this._log(Common.str("Write CSS {0} {1}, time {2}{3}", file, Common.formatSize(cssData.length), end, bundleConf.compress ? ", compressed" : ""));
					resolve();
				}
				else {
					this._log(Common.str("Write CSS {0} file error!", file));
					reject(Common.str("Write CSS {0} file error!", file));
				}
			}, err => {
				this._log(err);
				reject(err);
			});
		});
	}

	_saveCache() {
		return Cache.saveCache().then(ok => {
			this._log(this._const.separator + ok);
		}, err => {
			this._log(this._const.separator + err);
		});
	}

	_doc() {
		return new Promise((resolve, reject) => {
			if (!this._conf.doc) {
				reject(this._const.separator + "Missing doc confing!");
				return;
			}

			let conf = this._conf.doc;

			this._log(this._const.separator + "Run documentation...");

			exec(conf.args || "", (error, stdout, stderr) => {
				this._log("Documentation is done.");

				if (stdout) {
					this._log(stdout);
					resolve();
				}
				else if (stderr) {
					if (conf.log) {
						this._log(Common.str("Documentation log file {0} has been written!", conf.log));
						Common.writeFile(conf.log, stderr);
					}
					else {
						this._log(stderr);
					}

					reject();
				}
			});
		});
	}

	_setHeader() {
		return new Promise((resolve, reject) => {
			if (!this._conf.headerFile) {
				reject("No header file present!");
			}
			else if (this._data.header) {
				resolve();
			}
			else {
				let readedFile = Common.readFile(this._conf.headerFile);

				if (!readedFile.error) {
					this._data.header = readedFile.data;
					this._log(this._const.separator + "Header file was set!");
					resolve();
				}
				else {
					this._log(this._const.separator + "Error reading header file!");
					reject("Error reading header file!");
				}
			}
		});
	}

	_setReload() {
		return new Promise((resolve, reject) => {
			let conf = this._conf.reload;

			if (!conf || this._data.reload) {
				resolve();
				return;
			}

			if (!conf.file) {
				this._log(this._const.separator + "No reload file present!");
				reject("No reload file present!");
			}
			else {
				// update websocket port
				this._websocket = new Websocket(conf.port);

				let readedFile = Common.readFile(conf.file);

				if (!readedFile.error) {
					this._log(this._const.separator + "Reload file was set!");
					this._data.reload = readedFile.data.replace(conf.serverPH, conf.server || "").replace(conf.portPH, conf.port || "");
					resolve();
				}
				else {
					this._log(this._const.separator + "Error reading reload file!");
					reject("Error reading reload file!");
				}
			}
		});
	}

	_runEvent(name, args) {
		let outputData = {
			error: true,
			output: null
		};

		// post process
		if (name && this._data.eventHandler) {
			this._log(Common.str("Run event {0}", name));

			let eh = this._data.eventHandler;

			outputData.error = false;
			outputData.output = eh[this._const.eventHandlerMethod].apply(eh, [{
				name: name,
				bundlerScope: this,
				args: args || {}
			}]);
		}

		return outputData;
	}

	_getEventHandler() {
		let eventHandler = null;

		if ("eventHandler" in CONF) {
			try {
				let obj = require(CONF.eventHandler);

				if (typeof obj[this._const.eventHandlerMethod] === "function") {
					eventHandler = obj;
				}
				else {
					this._log(Common.str("Missing event handler \"{0}\" method!", this._const.eventHandlerMethod));
				}
			}
			catch (err) {
				this._log(Common.str("Error reading event handler file! {0}", err.message));
			}
		}

		return eventHandler;
	}

	_log(str, noNewLine) {
		str = str || "";

		if (noNewLine) {
			process.stdout.write(str);
		}
		else {
			if (str.indexOf(this._const.separator) == -1) {
				str = this._const.separatorOther + str;
			}

			console.log(str);
		}
	}

	getHeader(fileMode) {
		if (!this._data.header) return "";

		let output = [];

		if (fileMode) {
			output.push("/**");
		}
		
		let lines = this._data.header.split(EOL);
		lines.forEach((line, ind) => {
			if (!line.trim().length) return;
			output.push((fileMode ? " * " : "'") + line + (fileMode ? "" : "\\n'" + (ind < lines.length - 2 ? "+" : "")));
		});

		if (fileMode) {
			output.push(" */");
			// for last \n
			output.push("");
		}

		return output.join(fileMode ? "\n" : "");
	}
};

new Bundler();
