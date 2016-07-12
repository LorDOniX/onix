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

module.exports = TimeStop;
