"use strict";

var chokidar = require('chokidar');

var Common = require("./common");

class Watcher {
	constructor(delay) {
		this._timeoutID = null;
		this._timeDelay = delay || 500;
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

	getWatchPaths() {
		return this._paths;
	}

	/**
	 * Callback, when the file is changed.
	 * @param {Function} cb
	 */
	setCallback(cb) {
		this._cb = cb;
	}

	/**
	 * Start watching files.
	 */
	start() {
		if (!this._paths.length) return;

		Common.col("Watcher is starting...");

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

module.exports = Watcher;
