"use strict";

var Less = require('less');

var Common = require("./common");
var TimeStop = require("./time-stop");

class MyLess {
	makeLess(bundle, run) {
		return new Promise((resolve, reject) => {
			Common.readFile(bundle.source).then(data => {
				// readed less files, prepare config
				let lessOpts = {
					filename: bundle.source,
					compress: run == "dist"
				};

				Less.render(data, lessOpts, (e, output) => {
					// render output
					if (e && e.message) {
						Common.col("CSS error {0}: {1}", e.filename, e.message);
						Common.col("Line {0}: {1}", e.line, (e.extract[0] || "").trim());

						reject();
					}
					else {
						// write output
						Common.writeFile(bundle.output, output.css).then(ok => {
							Common.col("Write CSS {0} {1}", bundle.output, Common.formatSize(output.css.length));

							resolve();
						}, err => {
							Common.col("Write {0} write file error!", e.filename);

							reject();
						});
					}
				});
			}, err => {
				Common.col(err.message);

				reject();
			});
		});
	}
};

module.exports = MyLess;
