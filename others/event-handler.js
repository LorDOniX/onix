"use strict";

const EOL = require("os").EOL;

class EventHandler {
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

	_updateData(data, header, minimal) {
		// print
		console.log("- Changelog: version " + this._data.version + ", date " + this._data.date);

		// update
		data = data
			// first
			.replace("\"{ONIX_INFO}\"", header || "")
			.replace(/\{VERSION\}/g, this._data.version)
			.replace(/\{DATE\}/g, this._data.date)
			.replace(/\{MINIMAL\}/g, minimal || "")
		;

		return data;
	}

	on(event) {
		switch (event.name) {
			case "before-save-js":
				let data = event.args.writeData;
				let id = event.args.bundle.id;
				let header = event.bundlerScope.getHeader();

				if (id == "minimal") {
					let files = event.args.data.procFiles;
					let minimal = "minimal version: contains [" + files.join(", ") + "]";

					data = this._updateData(data, header, minimal);
				}
				else {
					data = this._updateData(data, header);
				}

				return data;
				break;
		}
	}
};

module.exports = new EventHandler();
