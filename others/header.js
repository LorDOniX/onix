"use strict";

const EOL = require("os").EOL;

class Header {
	constructor() {
		this._data = this._parseChangelog("CHANGELOG.md");
	}

	_parseChangelog(path) {
		let output = {
			version: "UNKNOWN",
			date: "UNKNOWN"
		};

		if (path) {
			try {
				let data = require("fs").readFileSync(path, "utf-8");
				let lines = data.split(EOL);

				lines.every(line => {
					line = line.trim();

					if (line.indexOf("##") != -1) {
						let version = line.match(/([0-9]+\.[0-9]+\.[0-9]+)/);
						let date = line.match(/([0-9]{1,2}\. [0-9]{1,2}\. [0-9]{4})/);

						if (version) {
							output.version = version[0];
						}

						if (date) {
							output.date = date[0];
						}

						return false;
					}
					else {
						return true;
					}
				});
			}
			catch (err) {
			}
		}

		return output;
	}

	_updateData(scope, data, minimal) {
		// print
		console.log("- Changelog: version " + this._data.version + ", date " + this._data.date);

		// update
		data = data
			// first
			.replace("\"{ONIX_INFO}\"", scope.getHeader())
			.replace(/\{VERSION\}/g, this._data.version)
			.replace(/\{DATE\}/g, this._data.date)
			.replace(/\{MINIMAL\}/g, minimal || "")
		;

		return data;
	}

	update(scope, data) {
		return this._updateData(scope, data);
	}

	updateMinimal(scope, data, filesPath) {
		let minimal = "minimal version: contains [" + filesPath.join(", ") + "]"

		return this._updateData(scope, data, minimal);
	}
};

module.exports = new Header();
