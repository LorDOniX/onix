"use strict";

class TimeStop {
	constructor() {
		this._cache = {};
	}

	start(label) {
		let ct = Date.now();

		label = label || ct;

		this._cache[label] = ct;
	}

	// [getNumber] {Boolean}
	end(label, getNumber) {
		label = label || "";

		let ct = Date.now();
		let cacheItem = this._cache[label];
		let time = 0;

		if (cacheItem) {
			time = ct - cacheItem;
		}

		return (getNumber ? time : this.formatTime(time));
	}

	formatTime(time) {
		time = time || 0;

		if (time < 1000) {
			return time + " ms";
		}
		else {
			let num = time / 1000;

			return num.toFixed(2) + " s";
		}
	}
};

module.exports = TimeStop;
