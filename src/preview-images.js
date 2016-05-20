/**
 * Class for creating img previews from File[] variable.
 * 
 * @class $previewImages
 */
onix.service("$previewImages", [
	"$q",
	"$image",
	"$dom",
	"$job",
	"$loader",
function(
	$q,
	$image,
	$dom,
	$job,
	$loader
) {
	/**
	 * Create one image preview.
	 *
	 * @private
	 * @param  {File} file
	 * @param  {Number} [maxSize] Max image size
	 * @return {Object} dom references
	 * @member $previewImages
	 */
	this._createPreview = function(file, maxSize) {
		var exported = {};

		var cont = $dom.create({
			el: "span",
			"class": ["preview-item", "preview-loading"],
			child: [{
				el: "span",
				"class": "canvas-cover",
				child: [$loader.getSpinner(true)],
				style: "height: " + (maxSize || 100) + "px",
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
	 * Create preview holders. Only for images count 4 and 7.
	 * Four images are in the one row, seven images has the last one above them.
	 *
	 * @private
	 * @param {HTMLElement} el
	 * @param {Number} count
	 * @member $previewImages
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

	/**
	 * One job task
	 *
	 * @private
	 * @param  {Object} previewObj Object with file and preview ID
	 * @param  {Number} maxSize Max image size in px
	 * @param  {Function} jobDone Function which indicates that job is done
	 */
	this._jobTask = function(previewObj, maxSize, jobDone) {
		var file = previewObj.file;
		var previewID = previewObj.previewID;
		var preview = this._createPreview(file, maxSize);
		
		// append
		if (previewID in this._dom) {
			this._dom[previewID].appendChild(preview.cont);
		}
		else {
			this._dom.previewItems.appendChild(preview.cont);
		}

		$image.readFromFile(file, maxSize).then(function(readFileObj) {
			preview.cont.classList.remove("preview-loading");
			preview.canvasCover.innerHTML = "";
			preview.canvasCover.appendChild(readFileObj.canvas);

			jobDone();
		});
	};

	/**
	 * Main function for showing img previews.
	 * 
	 * @param  {HTMLElement} el Placeholder element
	 * @param  {File[]} files
	 * @param  {Object} [opts] Configuration
	 * @param  {Number} [opts.maxSize] Max image size in px; the size is used for image scale
	 * @param  {Number} [opts.count] How many images are processed simultinously
	 * @param  {Boolean} [opts.createHolder] Create placeholder, see _createPreviewHolders function
	 * @member $previewImages
	 */
	this.show = function(el, files, optsArg) {
		// clear previous
		el.innerHTML = "";

		// add class
		el.classList.add("preview-images");

		var opts = {
			maxSize: 0,
			count: 0,
			createHolder: false
		};

		for (var key in optsArg) {
			opts[key] = optsArg[key];
		}

		this._dom = {
			previewItems: el
		};

		var pictureFiles = $image.getPictureFiles(files);
		var count = pictureFiles.length;

		if (count) {
			// create placeholder?
			if (opts.createHolder) {
				this._createPreviewHolders(el, count);
			}

			var jobsArray = [];

			// sort by name, make previewID - only for 7 pictures
			pictureFiles = pictureFiles.sort(function(a, b) {
				if (a.name < b.name)
					return -1;
				else if (a.name > b.name)
					return 1;
				else 
					return 0;
			}).forEach(function(pf, ind) {
				jobsArray.push({
					task: this._jobTask,
					scope: this,
					args: [{
						file: pf,
						previewID: "img_0" + ind
					}, opts.maxSize]
				});
			}, this);

			// run jobs array
			$job.multipleJobs(jobsArray, opts.count);
		}
	};
}]);
