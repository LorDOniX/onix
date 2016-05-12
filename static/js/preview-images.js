/**
 * Class for creating img previews from File[] variable.
 * 
 * @class PreviewImages
 */
onix.service("PreviewImages", [
	"$q",
	"$image",
	"$dom",
	"$common",
function(
	$q,
	$image,
	$dom,
	$common
) {
	/**
	 * Max preview image width/height.
	 *
	 * @private
	 * @member PreviewImages
	 * @type {Object}
	 */
	this._const = {
		PREVIEW_MAX_SIZE: 180
	};

	/**
	 * Loading gif URL path.
	 * 
	 * @type {String}
	 */
	this._loadingGifUrl = "/img/loading.gif";

	/**
	 * Create one image preview.
	 *
	 * @private
	 * @param  {File} file
	 * @return {Object} dom references
	 * @member PreviewImages
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
	 * Create preview holders.
	 *
	 * @private
	 * @param {HTMLElement} el
	 * @param {Number} count
	 * @member PreviewImages
	 */
	this._createPreviewHolders = function(el, count) {
		if (!el || (count != 4 && count != 7)) return;

		var exported = {};

		// placeholder for 7 images
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

	this._jobTask = function(previewObj) {
		var promise = $q.defer();
		var file = previewObj.file;
		var previewID = previewObj.previewID;
		var preview = this._createPreview(file);
		
		// append
		if (previewID in this._dom) {
			this._dom[previewID].appendChild(preview.cont);
		}
		else {
			this._dom.previewItems.appendChild(preview.cont);
		}

		$image.readFile(file, this._const.PREVIEW_MAX_SIZE).then(function(readFileObj) {
			preview.cont.classList.remove("preview-loading");
			preview.canvasCover.innerHTML = "";
			preview.canvasCover.appendChild(readFileObj.canvas);

			promise.resolve();
		});

		return promise;
	};

	/**
	 * Main function for showing img previews.
	 * 
	 * @param  {HTMLElement} el
	 * @param  {File[]} files
	 * @member PreviewImages
	 */
	this.show = function(el, files) {
		// clear previous
		el.innerHTML = "";

		this._dom = {
			previewItems: el
		};

		var pictureFiles = $image.getPictureFiles(files);
		var count = pictureFiles.length;

		if (count) {
			this._createPreviewHolders(el, count);

			var jobsArray = [];

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
			}).forEach(function(pf) {
				jobsArray.push({
					task: this._jobTask,
					scope: this,
					args: [pf]
				});
			}, this);

			// run jobs
			$common.doJobs(jobsArray, 2);
		}
	};
}]);
