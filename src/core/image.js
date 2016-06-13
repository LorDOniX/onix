/**
 * Class for creating img previews from File[] variable.
 * 
 * @class $image
 */
onix.service("$image", [
	"$promise",
function(
	$promise
) {
	/**
	 * FileReader is available.
	 *
	 * @private
	 * @member $image
	 * @type {Boolean}
	 */
	this._hasFileReader = "FileReader" in window;

	/**
	 * Canvas is available.
	 *
	 * @private
	 * @member $image
	 * @type {Boolean}
	 */
	this._hasCanvas = !!document.createElement("canvas").getContext;

	/**
	 * Read one image file - gets canvas with it. EXIF is readed, you can specific max size for image scale.
	 *
	 * @param  {Object} file Input file
	 * @param  {Number} [maxSize] If image width/height is higher than this value, image will be scaled to this dimension
	 * @return {$promise} Promise with output object
	 * @member $image
	 */
	this.readFromFile = function(file, maxSize) {
		return new $promise(function(resolve, reject) {
			if (!this._hasFileReader) {
				reject();
				return;
			}

			var reader = new FileReader();
			var output = {
				img: null,
				exif: null,
				canvas: null
			};

			reader.onload = function(e) {
				var binaryData = reader.result;
				var binaryDataArray = new Uint8Array(binaryData);
				var exif = null;

				// exif only for jpeg
				if (file.type != "png") {
					exif = this.getEXIF(binaryData);
				}

				var img = new Image();

				img.onload = function() {
					var imd = this.getImageDim(img, maxSize);
					var canvas = this.getCanvas(img, {
						width: imd.width,
						height: imd.height,
						orientation: exif ? exif.Orientation : 0,
						scaled: imd.scale != 1
					});

					output.img = img;
					output.exif = exif;
					output.canvas = canvas;

					resolve(output);
				}.bind(this);

				img.src = this.fileToBase64(file.type, binaryDataArray);
			}.bind(this);

			reader.readAsArrayBuffer(file);
		}.bind(this));
	};

	/**
	 * Counts image dimension; if maxSize is available, new dimension is calculated.
	 *
	 * @param  {Image} img
	 * @param  {Number} [maxSize] If image width/height is higher than this value, image will be scaled to this dimension
	 * @return {Object}
	 * @member $image
	 */
	this.getImageDim = function(img, maxSize) {
		var maxSize = maxSize || 0;
		var largeWidth = maxSize > 0 && img.width > maxSize;
		var largeHeight = maxSize > 0 && img.height > maxSize;

		var output = {
			width: img.width,
			height: img.height,
			scale: 1
		};

		if (largeWidth || largeHeight) {
			// resize picture
			var imgWidth = img.width;
			var imgHeight = img.height;

			// portrait x landscape
			if (img.width > img.height) {
				// landscape
				imgHeight = maxSize * imgHeight / imgWidth;
				imgWidth = maxSize;
			}
			else {
				// portrait
				imgWidth = maxSize * imgWidth / imgHeight;
				imgHeight = maxSize;
			}

			output.scale = img.width / imgWidth; // ratio between original x scaled image
			output.width = imgWidth;
			output.height = imgHeight;
		}

		return output;
	};

	/**
	 * Get image canvas - read input img, create canvas with it.
	 *
	 * @param  {Image} img
	 * @param  {Object} [optsArg] Variable options
	 * @param  {Number} [optsArg.width] Output canvas width
	 * @param  {Number} [optsArg.height] Output canvas height
	 * @param  {Number} [optsArg.orientation] EXIF orientation
	 * @param  {Boolean} [optsArg.scaled = false]
	 * @return {Canvas}
	 * @member $image
	 */
	this.getCanvas = function(img, optsArg) {
		var opts = {
			width: img.width || 0,
			height: img.height || 0,
			orientation: 0,
			scaled: false
		};

		for (var key in optsArg) {
			opts[key] = optsArg[key];
		}

		if (!this._hasCanvas) return null;

		var canvas = document.createElement("canvas");
		var ctx = canvas.getContext("2d");
		var draw = true;

		canvas.width = opts.width;
		canvas.height = opts.height;

		// rotate
		if (opts.orientation) {
			switch (opts.orientation) {
				case 2:
					// horizontal flip
					ctx.translate(opts.width, 0);
					ctx.scale(-1, 1);
					break;

				case 3:
					// 180° rotate left
					ctx.translate(opts.width, opts.height);
					ctx.rotate(Math.PI);
					break;

				case 4:
					// vertical flip
					ctx.translate(0, opts.height);
					ctx.scale(1, -1);
					break;

				case 5:
					// vertical flip + 90 rotate right
					canvas.width = opts.height;
					canvas.height = opts.width;
					ctx.rotate(0.5 * Math.PI);
					ctx.scale(1, -1);

					if (opts.scaled) {
						ctx.clearRect(0, 0, canvas.width, canvas.height);
						ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, canvas.height, canvas.width);
						draw = false;
					}
					break;

				case 6:
					// 90° rotate right
					canvas.width = opts.height;
					canvas.height = opts.width;
					ctx.rotate(0.5 * Math.PI);
					ctx.translate(0, -opts.height);
					
					if (opts.scaled) {
						ctx.clearRect(0, 0, canvas.width, canvas.height);
						ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, canvas.height, canvas.width);
						draw = false;
					}
					break;

				case 7:
					// horizontal flip + 90 rotate right
					canvas.width = opts.height;
					canvas.height = opts.width;
					ctx.rotate(0.5 * Math.PI);
					ctx.translate(opts.width, -opts.height);
					ctx.scale(-1, 1);

					if (opts.scaled) {
						ctx.clearRect(0, 0, canvas.width, canvas.height);
						ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, canvas.height, canvas.width);
						draw = false;
					}
					break;

				case 8:
					// 90° rotate left
					canvas.width = opts.height;
					canvas.height = opts.width;
					ctx.rotate(-0.5 * Math.PI);
					ctx.translate(-opts.width, 0);

					if (opts.scaled) {
						ctx.clearRect(0, 0, canvas.width, canvas.height);
						ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, canvas.height, canvas.width);
						draw = false;
					}
			}
		}

		if (draw) {
			ctx.clearRect(0, 0, canvas.width, canvas.height);

			if (opts.scaled) {
				ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, canvas.width, canvas.height);
			}
			else {
				ctx.drawImage(img, 0, 0);
			}
		}

		return canvas;
	};

	/**
	 * Binary data to base64.
	 *
	 * @param  {String} fileType
	 * @param  {Array} binaryData
	 * @return {String}
	 * @member $image
	 */
	this.fileToBase64 = function(fileType, binaryData) {
		var length = binaryData.length;
		var output = "";

		for (var i = 0; i < length; i += 1) {
			output += String.fromCharCode(binaryData[i]);
		}

		return 'data:' + fileType + ';base64,' + btoa(output);
	};

	/**
	 * Is file a picture?
	 *
	 * @param  {File}  file
	 * @return {Boolean}
	 * @member $image
	 */
	this.isPicture = function(file) {
		if (file) {
			return (file.type == "image/jpeg" || file.type == "image/pjpeg" || file.type == "image/png");
		}
		else return false;
	};

	/**
	 * Get picture files from array of files.
	 * 
	 * @param  {Array} array of files
	 * @return {Array}
	 * @member $image
	 */
	this.getPictureFiles = function(files) {
		var pictureFiles = [];

		if (files && files.length) {
			for (var i = 0; i < files.length; i++) {
				var item = files[i];

				if (this.isPicture(item)) {
					pictureFiles.push(item);
				}
			}
		}

		return pictureFiles;
	};

	/**
	 * Get picture files count from the array of Files. This function uses 'getPictureFiles'.
	 * 
	 * @param  {Array} array of files
	 * @return {Boolean}
	 * @member $image
	 */
	this.getPicturesCount = function(files) {
		return this.getPictureFiles(files).length;
	};

	/**
	 * Get image EXIF information.
	 * 
	 * @param  {Binary[]} imgData Binary img data
	 * @return {Object}
	 * @member $image
	 */
	this.getEXIF = function(imgData) {
		if ("EXIF" in window) {
			return EXIF.readFromBinaryFile(imgData);
		}
		else {
			return {};
		}
	};
}]);
