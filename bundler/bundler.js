"use strict";

var exec = require('child_process').exec;
var Common = require("./common");
var MyES6 = require("./my-es6");
var MyLess = require("./my-less");
var Watcher = require("./watcher");
var Websocket = require("./websocket");
var pathObj = require("path");

class Bundler {
	constructor(confFile) {
		this._conf = Common.getJSON(confFile || "");
		this._args = this._getArgs();
		this._watchBundles = [];
		this._runServerReq = 0;
		this._bundles = this._conf.bundles || [];

		this._myES6 = new MyES6(this._conf.ES6, this._conf.header, this._conf.reload);
		this._myLess = new MyLess();
		this._watcher = new Watcher();
		this._websocket = new Websocket();

		if (this._conf.reload) {
			this._websocket.setPort(this._conf.reload.port);
		}

		Common.col("Bundler help");
		Common.col("------------");
		Common.col("./bundler.js watch - watch and compile js & less files");
		Common.col("./bundler.js dev - compile for dev");
		Common.col("./bundler.js dist - compile for dist");
		Common.col("./bundler.js doc - documentation");
		Common.col("./bundler.js clear - clear ES6 cache");
		Common.col("./bundler.js - default is watch option");
		Common.col("./bundler.js --force - always rewrite output files (disable cache)");

		let firstArg = this._args.length ? this._args[0] : "";

		if (this._args.length == 2 && this._args[1] == "--force") {
			this._myES6.alwaysRewrite();
		}

		// pre files operations
		switch (firstArg) {
			case "watch":
				this._dev("watch");
				break;

			case "dev":
				this._dev();
				break;

			case "dist":
				this._dist();
				break;

			case "doc":
				this._doc();
				return;

			case "clear":
				this._clear();
				return;

			default:
				// default is watch
				this._dev("watch");
		}
	}

	/**
	 * Get argument from console/enviroment.
	 * @return {String} one optinal parameter
	 */
	_getArgs() {
		return Array.prototype.slice.call(process.argv, 2);
	}

	_getBundles(run) {
		let all = [];

		this._bundles.forEach(bundle => {
			// skip
			if (bundle.run.indexOf(run) == -1) return;

			all.push(this._runBundle(bundle, run));
		});

		return all;
	}

	_dev(runAfter) {
		Common.col("-");

		let all = this._getBundles("dev");

		// save cache after all bundles
		all.push({
			method: () => {
				return this._myES6.saveCache();
			}
		});

		Common.chainPromises(all).then(e => {
			Common.col("Dev is done");

			this._myES6.getOnixInfo();

			switch (runAfter) {
				case "watch":
					this._setWatcher();

					// run server?
					if (this._runServerReq) {
						this._websocket.start();
					}
					else {
						this._websocket.disable();
					}
					break;
			}
		});
	}

	_setWatcher() {
		if (!this._watchBundles.length) return;

		let paths = [];

		this._watchBundles.forEach(bundle => {
			if (paths.indexOf(bundle.watchPath) == -1) {
				paths.push(bundle.watchPath);
			}
		});

		this._watcher.setWatchPaths(paths.sort((a, b) => {
			// sort from longest to shortest
			return b.length - a.length;
		}));

		this._watcher.setCallback((eventName, buffer) => {
			if (eventName == "file-change" && buffer.length == 1) {
				let file = buffer[0].split(pathObj.sep).join("/");

				this._fileUpdate(file);
			}
		});

		this._watcher.start();
	}

	_fileUpdate(file) {
		let paths = this._watcher.getWatchPaths();

		paths.every(path => {
			if (file.indexOf(path) != -1) {
				this._watchBundles.every(bundle => {
					if (bundle.watchPath == path) {
						Common.col("-");
						Common.col("File change {0}:", file);
						Common.chainPromises([this._runBundle(bundle, "dev")]).then(ok => {
							let sendObj = {
								id: bundle.id,
								operation: "",
								data: {}
							};
							
							switch (bundle.type) {
								case "js":
									sendObj.operation = "refresh-page";
									break;

								case "less":
									sendObj.operation = "refresh-css";
									sendObj.data.file = pathObj.basename(bundle.output);
									break;
							}

							this._websocket.send(sendObj);
						});

						return false;
					}
					else {
						return true;
					}
				});

				return false;
			}
			else {
				return true;
			}
		});
	}

	_dist() {
		Common.col("-");

		let all = this._getBundles("dist");
		all.push(this._getJSduck());
		
		Common.chainPromises(all).then(e => {
			Common.col("Dist is done");

			this._myES6.getOnixInfo();
		});
	}

	_doc() {
		let all = [];

		// find bundle id = "onix" and run with dev
		this._bundles.forEach(bundle => {
			if (bundle.id == "onix") {
				all.push(this._runBundle(bundle, "dev"));
			}
		});

		// documentation
		all.push(this._getJSduck());

		Common.chainPromises(all);
	}

	_getJSduck() {
		return {
			method: () => {
				return new Promise((resolve, reject) => {
					Common.col("-");
					Common.col("JSDuck starts...");

					// es6 -> used transpiler version with comments
					exec("jsduck dist/onix-js-framework.js --output docs --warnings=-nodoc,-dup_member,-link_ambiguous --external=XMLHttpRequest,$q", (error, stdout, stderr) => {
						Common.col("JSDuck is done - please see jsduck.log for output information.");

						if (stdout) {
							console.log(stdout);

							resolve();
						}
						else if (stderr) {
							Common.writeFile("jsduck.log", stderr);

							reject();
						}
					});
				});
			}
		};
	}

	_clear() {
		this._myES6.clearCache();
	}

	_runBundle(bundle, run) {
		// add watch paths and reloads requests
		if (run == "dev") {
			if (bundle.watchPath) {
				this._watchBundles.push(bundle);
			}

			if (bundle.reload) {
				this._runServerReq++;
			}
		}

		return {
			method: () => {
				return new Promise(resolve => {
					switch (bundle.type) {
						case "js":
							this._myES6.makeJS(bundle, run).then(ok => {
								Common.col("Bundle is done");
								Common.col("-");

								resolve();
							}, err => {
								Common.col(err);

								resolve();
							});
							break;

						case "less":
							this._myLess.makeLess(bundle, run).then(ok => {
								Common.col("Bundle is done");
								Common.col("-");
								
								resolve();
							}, err => {
								Common.col(err);

								resolve();
							});
							break;
					}
				});
			}
		};
	}
};

module.exports = Bundler;