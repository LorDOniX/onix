"use strict";

var crypto = require('crypto');
var babelCore = require("babel-core");
var UglifyJS = require("uglify-js");

var Common = require("./common");
var TimeStop = require("./time-stop");

const EOL = require("os").EOL;

class MyES6 {
	constructor(config, header, reload) {
		this._config = config || {};
		this._header = header || {};
		this._reload = reload || {};

		// es6 config
		this._es6config = {
			compact: false,
			presets: this._config.presets.map(preset => {
				return require.resolve(preset)
			}),
			plugins: this._config.plugins.map(plugin => {
				return require.resolve(plugin)
			})
		};

		this._distCache = {};
		this._usedPaths = [];
		this._force = false;
		this._cache = Common.getJSON(config.cache);
		this._onixjsData = null;
		this._reloadSet = false;
		this._timeStop = new TimeStop();
	}

	alwaysRewrite() {
		Common.col("Mode: always rewrite");

		this._force = true;
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

				Common.writeFile(this._config.cache, data).then(() => {
					Common.col("Cache file {0} {1} was written!", this._config.cache, Common.formatSize(data.length));

					resolve();
				}, () => {
					Common.col("Cache file {0} write file error!", this._config.cache);

					reject();
				});
			}
		});
	}

	clearCache() {
		return new Promise((resolve, reject) => {
			Common.removeFile(this._config.cache).then(() => {
				Common.col("Cache file {0} was removed!", this._config.cache);

				resolve();
			}, (err) => {
				Common.col("Cache file {0} remove file error: {1}!", this._config.cache, err.message);

				reject();
			});
		});
	}

	getOnixInfo() {
		if (!this._onixjsData) return;

		let version = this._onixjsData.version;
		let date = this._onixjsData.date;

		Common.col("Onix version {0} date {1}", version, date);
	}

	makeJS(bundle, run) {
		return new Promise((resolve, reject) => {
			let bundleData = bundle.data || [];
			let allFiles = [];
			let allFilesCount = 0;
			let es6Files = [];

			this._timeStop.start("ES6");

			Common.col("Make JS bundle {0}", bundle.id);

			bundleData.forEach(dataItem => {
				allFiles = allFiles.concat(dataItem.files);

				if (dataItem.ES6) {
					es6Files = es6Files.concat(dataItem.files);
				}
			});

			// reload server
			if (bundle.reload) {
				// append to the files
				allFiles.push(this._reload.file);
			}

			// add header
			if (bundle.header) {
				// append to the files
				allFiles.push(this._header.file);
			}

			Common.readFiles(allFiles).then(all => {
				let cached = 0;

				all.forEach((file) => {
					if (bundle.header && file.path == this._header.file) {
						this._setFileCache(file.path, file.data);

						this._setOnixjsData();
					}
					else if (bundle.reload && file.path == this._reload.file) {
						this._setFileCache(file.path, file.data);

						this._setReloadData();
					}
					else {
						let transpile = run == "dev" && es6Files.indexOf(file.path) != -1;

						allFilesCount++;

						if (this._setFileCache(file.path, file.data, transpile)) {
							cached++;
						}
					}
				});

				if (run == "dev") {
					Common.col("ES6 transpilation: {0} files takes {1}, {2} cached, all files count {3}",
								es6Files.length, this._timeStop.end("ES6"), cached, allFilesCount);
				}
				else if (run == "dist") {
					// dist -> always rewrite
					this._force = true;
				}

				if (cached == allFilesCount && !this._force) {
					Common.col("All files are cached - no change!");

					resolve();
				}
				else {
					// output is always
					let devData = this._getData(bundle, run);

					Common.writeFile(bundle.output, devData).then(() => {
						Common.col("Write JS {0} {1}", bundle.output, Common.formatSize(devData.length));

						if (run == "dist" && bundle.outputMin) {
							// min. version
							let distData = this._getData(bundle, run, true);

							Common.writeFile(bundle.outputMin, distData).then(() => {
								Common.col("Write min JS {0} {1}", bundle.outputMin, Common.formatSize(distData.length));

								resolve();
							}, () => {
								Common.col("Write min JS {0} write file error!", e.filename);

								reject();
							});
						}
						else {
							resolve();
						}
					}, () => {
						Common.col("Write JS {0} write file error!", e.filename);

						reject();
					});
				}
			}, (err) => {
				reject(err);
			});
		});
	}

	_getHeader(addComment, bundle) {
		if (!this._header || !this._onixjsData) return "";

		let headerData = this._getCacheItem(this._header.file).data;
		let version = this._onixjsData.version;
		let date = this._onixjsData.date;
		let output = [];
		let joiner = addComment ? "\n" : "";
		let minPh = "";

		if (addComment) {
			output.push("/**");
		}

		// minimal version replace
		if (bundle && bundle.minimal) {
			let allFiles = [];

			bundle.data.forEach(dataItem => {
				allFiles = allFiles.concat(dataItem.files);
			});

			minPh = this._header.minimal.replace(this._header.minimalPH, allFiles.join(", "));
		}
		
		let lines = headerData.split(EOL);

		lines.forEach((line, ind) => {
			if (!line.trim().length) return;

			// minimal version replace
			if (line.match(new RegExp(this._header.minimalPH))) {
				output.push(minPh);
			}
			else {
				// replace version, date
				line = line.replace(this._header.versionPH, version).replace(this._header.datePH, date);

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

	_setReloadData() {
		if (!this._reload || this._reloadSet) return;

		let data = this._getCacheItem(this._reload.file).data;

		// replace server & port
		data = data.replace(this._reload.serverPH, this._reload.server).replace(this._reload.portPH, this._reload.port);

		// update cache
		this._cache[this._reload.file].data = data;
		
		this._reloadSet = true;
	}

	_setOnixjsData() {
		if (!this._header || this._onixjsData) return;

		// onix js
		let onixjsData = this._getCacheItem(this._header.onix).data;
		let version = "";
		let date = "";

		let lines = onixjsData.split(EOL);

		lines.forEach((line) => {
			line = line.trim();

			let ind = line.indexOf(this._header.version);
			let ind2 = line.indexOf(this._header.date);

			if (ind != -1) {
				version = line.substr(ind + this._header.version.length);
			}
			else if (ind2 != -1) {
				date = line.substr(ind2 + this._header.date.length);
			}
		});

		this._onixjsData = {
			data: onixjsData,
			version: version,
			date: date
		};
	}

	_getData(bundle, run, compress) {
		let hasHeader = bundle.header && this._header;
		let output = [];
		let data = bundle.data || [];

		// add header to output;
		if (hasHeader && !compress) {
			output.push(this._getHeader(true, bundle));
		}

		if (run == "dist") {
			this._timeStop.start("ES6Parts");
		}

		data.forEach(dataItem => {
			let parts = [];

			dataItem.files.forEach(file => {
				parts.push(this._getCacheItem(file).data);
			});

			// concat all data together
			if (run == "dev" || !dataItem.ES6) {
				output.push(parts.join(EOL));
			}
			// babel whole part - not single file
			else if (run == "dist") {
				// babel
				let allData = parts.join(EOL);
				let md5hash = this._getMD5hash(allData);
				let ES6 = "";

				if (md5hash in this._distCache) {
					ES6 = this._distCache[md5hash];
				}
				else {
					ES6 = this._transpile("no-path", allData);
					
					this._distCache[md5hash] = ES6;
				}

				output.push(ES6);
			}
		});

		if (run == "dist") {
			Common.col("ES6 transpilation takes {0}", this._timeStop.end("ES6Parts"));
		}
		// dev & reload
		else if (bundle.reload && this._reload) {
			// append reload server to the end
			output.push(this._getCacheItem(this._reload.file).data);
		}

		let outputData = output.join(EOL);

		// replace onix.js - only if bundle has a header
		if (hasHeader) {
			outputData = outputData.replace(this._header.onixPH, this._getHeader());
		}

		// use strict remove, blank lines
		outputData = outputData.replace(/"use strict";/g, "").replace(/(^[ \t]*\n)/gm, "");

		// compress
		if (run == "dist" && compress) {
			let headerData = hasHeader ? this._getHeader(true, bundle) : "";
			outputData = headerData + this._getMinData(outputData);
		}

		return outputData;
	}

	_getCacheItem(file) {
		if (file in this._cache) {
			return this._cache[file];
		}
		else {
			return {
				md5hash: "",
				data: ""
			};
		}
	}

	_getMinData(data) {
		try {
			return UglifyJS.minify(data, {
				fromString: true
			}).code;
		}
		catch (err) {
			Common.col("UglifyJS error {0}", err.message);

			if ("line" in err && "col" in err) {
				Common.col("Line {0} col {1}", err.line, err.col);
			}

			return "";
		}
	}

	_setFileCache(path, data, transpile) {
		if (this._usedPaths.indexOf(path) == -1) {
			this._usedPaths.push(path);
		}

		let item = this._cache[path] || {
			md5hash: "",
			data: ""
		};
		
		let md5hash = this._getMD5hash(data);

		if (item.md5hash == md5hash) {
			// cached
			return true;
		}
		else {
			item.md5hash = md5hash;

			let outputData = data;

			// es6
			if (transpile) {
				outputData = this._transpile(path, data);
			}

			item.data = outputData;
		}

		// save
		this._cache[path] = item;

		return false;
	}

	/**
	 * Transpile data
	 * 
	 * @param  {String} path
	 * @param  {String} data
	 * @return {String}
	 */
	_transpile(path, data) {
		try {
			let transform = babelCore.transform(data, this._es6config);

			return transform.code;
		}
		catch (err) {
			this._parseES6error(path, data, err);

			return "";
		}
	}

	_getMD5hash(data) {
		return crypto.createHash('md5').update(data).digest('hex');
	}

	/**
	 * Parse ES6 transform error. Show path and lineNumber + line content.
	 * Output is shown in console.
	 * @param  {String} path
	 * @param  {String} data
	 * @param  {Object} err 
	 */
	_parseES6error(path, data, err) {
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
		else if (err.loc) {
			Common.col("Line {0}: {1}", err.loc.line, err.loc.column);
		}
	}
};

module.exports = MyES6;
