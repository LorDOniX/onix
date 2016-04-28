/**
 * @class $uploadImages
 *
 * Class for creating img previews from File[] variable
 */
onix.service("$uploadImages", [
	"$job",
	"$q",
	"$dom",
function(
	$job,
	$q,
	$dom
) {
	/**
	 * Disable?
	 *
	 * @private
	 * @member $uploadImages
	 * @type {Boolean}
	 */
	this._disable = !("FileReader" in window);

	/**
	 * Max preview image height
	 *
	 * @private
	 * @member $uploadImages
	 * @type {Object}
	 */
	this._const = {
		PREVIEW_MAX_SIZE: 180
	};

	/**
	 * Loading gif URL path
	 * 
	 * @type {String}
	 */
	this._loadingGifUrl = "/img/loading.gif";

	/**
	 * Do jobs for processing all images
	 *
	 * @private
	 * @param  {Array} dataArray Array of files with images
	 * @param  {Function} fn Job task
	 * @param  {Number} count How many functions processed simultinously
	 * @param  {Function} taskDoneObj Callback after one task have been done
	 * @return {$q} Callback after all job is done
	 * @member $uploadImages
	 */
	this._doJobs = function(dataArray, fn, count, taskDoneObj) {
		var len = dataArray.length;
		var jobs = [];

		for (var i = 0; i < len; i++) {
			var jp = i % count;

			if (!jobs[jp]) {
				jobs[jp] = $job.create();

				if (taskDoneObj) {
					jobs[jp].setTaskDone(taskDoneObj.cb, taskDoneObj.scope);
				}
			}

			jobs[jp].add(fn, this, dataArray[i]);
		}

		var jobPromises = [];

		jobs.forEach(function(job) {
			jobPromises.push(job.start());
		});

		return $q.all(jobPromises);
	};

	/**
	 * Is file a picture?
	 *
	 * @private
	 * @param  {File}  file
	 * @return {Boolean}
	 * @member $uploadImages
	 */
	this._isPicture = function(file) {
		if (file) {
			return (file.type == "image/jpeg" || file.type == "image/pjpeg" || file.type == "image/png");
		}
		else return false;
	};

	/**
	 * Read one file, create one preview
	 *
	 * @private
	 * @param  {Object} fileObj
	 * @param  {Object} fileObj.file File reference
	 * @param  {String} fileObj.previewID Preview ID for DOM position
	 * @param  {Function} doneFn Callback, after one preview is loaded and drawed to canvas
	 * @member $uploadImages
	 */
	this._readFile = function(fileObj, doneFn) {
		var file = fileObj.file;
		var previewID = fileObj.previewID;

		var fileObj = {
			file: file,
			exif: null,
			img: null
		};

		var preview = this._createPreview(file);
		
		// append
		if (previewID in this._dom) {
			this._dom[previewID].appendChild(preview.cont);
		}
		else {
			this._dom.previewItems.appendChild(preview.cont);
		}

		var reader = new FileReader();

		reader.onload = function(e) {
			var binaryData = reader.result;
			var binaryDataArray = new Uint8Array(binaryData);
			var exif = null;

			if (file.type != "png") {
				exif = EXIF.readFromBinaryFile(binaryData);
			}

			var img = new Image();

			img.onload = function() {
				var imd = this._getImageDim(img);
				var canvas = this._processInputImage(img, imd, exif.Orientation);
				
				preview.cont.classList.remove("preview-loading");
				preview.canvasCover.innerHTML = "";
				preview.canvasCover.appendChild(canvas);

				fileObj.exif = exif;
				fileObj.img = img;
				doneFn();
			}.bind(this);

			img.src = this._fileToBase64(file.type, binaryDataArray);
		}.bind(this);

		reader.readAsArrayBuffer(file);
	};

	/**
	 * Create one image preview
	 *
	 * @private
	 * @param  {File} file
	 * @return {Object} dom references
	 * @member $uploadImages
	 */
	this._createPreview = function(file) {
		var exported = {};

		var cont = $dom.create({
			el: "span",
			"class": ["preview-item", "preview-loading"],
			child: [{
				el: "span",
				"class": "canvas-cover",
				child: [{
					el: "img",
					"class": "preview-loader",
					src: this._loadingGifUrl
				}],
				_exported: "canvasCover"
			}, {
				el: "span",
				"class": "title",
				innerHTML: file.name.replace(/\..*/g, "")
			}]
		}, exported);

		return {
			cont: cont,
			canvasCover: exported.canvasCover
		};
	};

	/**
	 * Counts image dimension; if maxSize is available, new dimension is calculated
	 *
	 * @private
	 * @param  {Image} img
	 * @return {Object}
	 * @member $uploadImages
	 */
	this._getImageDim = function(img) {
		var maxSize = this._const.PREVIEW_MAX_SIZE;
		var largeWidth = img.width > maxSize;
		var largeHeight = img.height > maxSize;

		var output = {
			width: img.width,
			height: img.height,
			scale: 1,
			large: false
		};

		if (largeWidth || largeHeight) {
			// resizneme obrazek
			var imgWidth = img.width;
			var imgHeight = img.height;

			// vybereme vetsi ze stran
			if (img.width > img.height) {
				// sirka
				imgHeight = maxSize * imgHeight / imgWidth;
				imgWidth = maxSize;
			}
			else {
				// vyska
				imgWidth = maxSize * imgWidth / imgHeight;
				imgHeight = maxSize;
			}

			output.scale = img.width / imgWidth; // pomer orig. a zmenseneho obrazku
			output.width = imgWidth;
			output.height = imgHeight;
			output.large = true;
		}

		return output;
	};

	/**
	 * Process image: rotate by exif, decrase size according to MAX SIZE
	 *
	 * @private
	 * @param  {Image} img
	 * @param  {Object} imd object dimension
	 * @param  {Number} orientation EXIF orientation
	 * @return {Canvas}
	 * @member $uploadImages
	 */
	this._processInputImage = function(img, imd, orientation) {
		var canvas = document.createElement("canvas");
		var ctx = canvas.getContext("2d");
		var draw = true;

		canvas.width = imd.width;
		canvas.height = imd.height;

		// rotate
		if (orientation) {
			switch (orientation) {
				case 2:
					// horizontal flip
					ctx.translate(imd.width, 0);
					ctx.scale(-1, 1);
					break;

				case 3:
					// 180° rotate left
					ctx.translate(imd.width, imd.height);
					ctx.rotate(Math.PI);
					break;

				case 4:
					// vertical flip
					ctx.translate(0, imd.height);
					ctx.scale(1, -1);
					break;

				case 5:
					// vertical flip + 90 rotate right
					canvas.width = imd.height;
					canvas.height = imd.width;
					ctx.rotate(0.5 * Math.PI);
					ctx.scale(1, -1);

					if (imd.large) {
						ctx.clearRect(0, 0, canvas.width, canvas.height);
						ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, canvas.height, canvas.width);
						draw = false;
					}
					break;

				case 6:
					// 90° rotate right
					canvas.width = imd.height;
					canvas.height = imd.width;
					ctx.rotate(0.5 * Math.PI);
					ctx.translate(0, -imd.height);
					
					if (imd.large) {
						ctx.clearRect(0, 0, canvas.width, canvas.height);
						ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, canvas.height, canvas.width);
						draw = false;
					}
					break;

				case 7:
					// horizontal flip + 90 rotate right
					canvas.width = imd.height;
					canvas.height = imd.width;
					ctx.rotate(0.5 * Math.PI);
					ctx.translate(imd.width, -imd.height);
					ctx.scale(-1, 1);

					if (imd.large) {
						ctx.clearRect(0, 0, canvas.width, canvas.height);
						ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, canvas.height, canvas.width);
						draw = false;
					}
					break;

				case 8:
					// 90° rotate left
					canvas.width = imd.height;
					canvas.height = imd.width;
					ctx.rotate(-0.5 * Math.PI);
					ctx.translate(-imd.width, 0);

					if (imd.large) {
						ctx.clearRect(0, 0, canvas.width, canvas.height);
						ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, canvas.height, canvas.width);
						draw = false;
					}
			}
		}

		if (draw) {
			ctx.clearRect(0, 0, canvas.width, canvas.height);

			if (imd.large) {
				ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, canvas.width, canvas.height);
			}
			else {
				ctx.drawImage(img, 0, 0);
			}
		}

		return canvas;
	};

	/**
	 * Binary data to base64
	 *
	 * @private
	 * @param  {String} fileType
	 * @param  {Array} binaryData
	 * @return {String}
	 * @member $uploadImages
	 */
	this._fileToBase64 = function(fileType, binaryData) {
		var length = binaryData.length
		var output = "";

		for (var i = 0; i < length; i += 1) {
			output += String.fromCharCode(binaryData[i]);
		}

		return 'data:' + fileType + ';base64,' + btoa(output);
	};

	/**
	 * Create preview holders.
	 *
	 * @private
	 * @param {HTMLElement} el
	 * @param {Number} count
	 * @member $uploadImages
	 */
	this._createPreviewHolders = function(el, count) {
		if (!el || (count != 4 && count != 7)) return;

		var exported = {};

		// placeholder for panorama
		if (count == 7) {
			// ceiling line
			el.appendChild($dom.create({
				el: "div",
				child: [{
					el: "span",
					_exported: "img_06"
				}]
			}, exported));
		}

		var child = [];
		var childCount = count == 7 ? 6 : 4;

		for (var i = 0; i < childCount; i++) {
			child.push({
				el: "span",
				_exported: "img_0" + i
			});
		}

		// rest line
		el.appendChild($dom.create({
			el: "div",
			child: child
		}, exported));

		for (var i = 0; i < count; i++) {
			this._dom["img_0" + i] = exported["img_0" + i];
		}
	};

	/**
	 * Main function for showing img previews.
	 * 
	 * @param  {HTMLElement} el
	 * @param  {File[]} files
	 * @member $uploadImages
	 */
	this.show = function(el, files) {
		if (this._disable || !el || !files) return;

		// clear previous
		el.innerHTML = "";

		this._dom = {
			previewItems: el
		};

		var pictureFiles = this.getPictureFiles(files);
		var count = pictureFiles.length;

		if (count) {
			this._createPreviewHolders(el, count);

			// sort by name, make previewID - only for 7 pictures
			pictureFiles = pictureFiles.sort(function(a, b) {
				if (a.name < b.name)
					return -1;
				else if (a.name > b.name)
					return 1;
				else 
					return 0;
			}).map(function(file, ind) {
				return {
					file: file,
					previewID: "img_0" + ind
				};
			});

			this._doJobs(pictureFiles, this._readFile, 2);
		}
	};

	/**
	 * Get picture files from array of files
	 * 
	 * @param  {Array} array of files
	 * @return {Array}
	 * @member $uploadImages
	 */
	this.getPictureFiles = function(files) {
		var pictureFiles = [];

		if (files && files.length) {
			for (var i = 0; i < files.length; i++) {
				var item = files[i];

				if (this._isPicture(item)) {
					pictureFiles.push(item);
				}
			}
		}

		return pictureFiles;
	};

	/**
	 * Get picture files count from the array of Files. This function uses 'getPictureFiles'
	 * 
	 * @param  {Array} array of files
	 * @return {Boolean}
	 * @member $uploadImages
	 */
	this.getPicturesCount = function(files) {
		return this.getPictureFiles(files).length;
	};

	/**
	 * Set loading gif URL
	 * 
	 * @param {String} lgu URL path
	 * @member $uploadImages
	 */
	this.setLoadingGifUrl = function(lgu) {
		this._loadingGifUrl = lgu || "";
	};
}]);
