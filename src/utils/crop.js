onix.factory("$crop", [
	"$dom",
	"$math",
function(
	$dom,
	$math
) {
	/**
	 *
	 * Crop - this class is used for selection crop above the image/element.
	 * 
	 * @param {Object} [options] Configuration
	 * @param {Number} [options.canWidth] Canvas width
	 * @param {Number} [options.canHeight] Canvas height
	 * @param {Number} [options.zoom = 100] start zoom in [%]
	 * @param {Number} [options.minZoom = 20] min zoom in [%]
	 * @param {Number} [options.maxZoom = 100] max zoom in [%]
	 * @param {Number} [options.zoomStep = 10] How many [%] add/dec with zoom change
	 * @param {Number} [options.zoomMoveStep = 1] Under 100% multiplier for faster image movement
	 * @param {Object} [options.curEntity = $anonymizer.ENTITES.CIRCLE] Start entity from $anonymizer.ENTITES
	 * @param {Number} [options.showPreview = true] Show preview - image overview
	 * @param {Number} [options.previewLeft = 17] Preview location from left top corner, axe x [px]
	 * @param {Number} [options.previewTop = 17] Preview location from left top corner, axe y [px]
	 * @param {Number} [options.previewWidth = 200] Preview image width [px]
	 * @class $crop
	 */
	var $crop = function(options) {
		this._CONST = {
			HIDE_CLASS: "hide"
		};

		this._options = {
			width: 250, // initial size
			height: 250,
			minWidth: 10,
			minHeight: 10, // always higher than 0! if resizable=true
			maxWidth: Infinity,
			maxHeight: Infinity,
			resizable: true,
			aspectRatio: null
		};

		for (var op in options) {
			this._options[op] = options[op];
		}

		// areas dimensions
		this._dim = {
			areaWidth: 0,
			areaHeight: 0,
			width: this._options.width,
			height: this._options.height
		};

		this._changed = false;

		this._backupData = null;

		this._groups = {
			"point-nw": [{ type: "nw", x: true, y: true }, { type: "sw", x: true }, { type: "ne", y: true }],
			"point-ne": [{ type: "ne", x: true, y: true }, { type: "se", x: true }, { type: "nw", y: true }],
			"point-sw": [{ type: "sw", x: true, y: true }, { type: "nw", x: true }, { type: "se", y: true }],
			"point-se": [{ type: "se", x: true, y: true }, { type: "ne", x: true }, { type: "sw", y: true }]
		};

		this._points = { nw: { x: 0, y: 0 }, ne: { x: 0, y: 0 }, sw: { x: 0, y: 0 }, se: { x: 0, y: 0 }};
		this._type = null;

		this._mouse = {
			startXSave: 0,
			startYSave: 0,
			startX: 0,
			startY: 0
		};

		this._binds = {
			mouseDown: this._mouseDown.bind(this),
			mouseMove: this._mouseMove.bind(this),
			mouseUp: this._mouseUp.bind(this)
		};

		this._dom = {};

		this._create();

		// set center
		this.setCenter();

		// crop is by default hidden
		this.hide();
	};

	/**
	 * Create crop element.
	 * 
	 * @return {Element}
	 * @member $crop
	 * @private
	 */
	$crop.prototype._create = function() {
		var cropClass = ["crop"];

		if (this._options.resizable) {
			cropClass.push("resizable");
		}

		$dom.create({
			el: "div",
			"class": cropClass,
			child: [{
				el: "div",
				"class": "crop-top",
				child: [{
					el: "span",
					"class": "point-nw"
				}, {
					el: "span",
					"class": "point-ne"
				}],
				_exported: "cropTop"
			}, {
				el: "div",
				"class": "crop-bottom",
				child: [{
					el: "span",
					"class": "point-sw"
				}, {
					el: "span",
					"class": "point-se"
				}],
				_exported: "cropBottom"
			}, {
				el: "div",
				"class": "crop-left",
				_exported: "cropLeft"
			}, {
				el: "div",
				"class": "crop-right",
				_exported: "cropRight"
			}, {
				el: "div",
				"class": "crop-middle",
				_exported: "cropMiddle"
			}],
			_exported: "container"
		}, this._dom);

		this._dom.container.addEventListener("mousedown", this._binds.mouseDown);
	};

	/**
	 * Set crop center above his area.
	 *
	 * @private
	 * @member $crop
	 */
	$crop.prototype._setCenter = function() {
		var width = this._dim.width;
		var height = this._dim.height;

		var leftDiff = Math.round((this._dim.areaWidth - width) / 2);
		var topDiff = Math.round((this._dim.areaHeight - height) / 2);

		var p = this._points;

		p.nw.x = leftDiff;
		p.nw.y = topDiff;

		p.ne.x = p.nw.x + width;
		p.ne.y = p.nw.y + height;

		p.sw.x = this._dim.areaWidth - leftDiff;
		p.sw.y = this._dim.areaHeight - topDiff;

		p.se.x = p.ne.x;
		p.se.y = p.ne.y;
	};

	/**
	 * Align crop points inside his area.
	 * 
	 * @private
	 * @member $crop
	 */
	$crop.prototype._alignPoints = function() {
		var p = this._points;

		p.nw.x = $math.setRange(p.nw.x, 0, this._dim.areaWidth - this._dim.width);
		p.sw.x = $math.setRange(p.sw.x, 0, this._dim.areaWidth - this._dim.width);
		p.ne.x = $math.setRange(p.ne.x, this._dim.width, this._dim.areaWidth);
		p.se.x = $math.setRange(p.se.x, this._dim.width, this._dim.areaWidth);

		p.nw.y = $math.setRange(p.nw.y, 0, this._dim.areaHeight - this._dim.height);
		p.ne.y = $math.setRange(p.ne.y, 0, this._dim.areaHeight - this._dim.height);
		p.sw.y = $math.setRange(p.sw.y, this._dim.height, this._dim.areaHeight);
		p.se.y = $math.setRange(p.se.y, this._dim.height, this._dim.areaHeight);
	};

	/**
	 * Redraw crop - calculate all his points and set them in dom objects.
	 * 
	 * @private
	 * @member $crop
	 */
	$crop.prototype._redraw = function() {
		var p = this._points;

		var leftX = p.nw.x;
		var leftY = p.nw.y;
		var size = this._getSize();

		this._dom.cropTop.style.left = leftX + "px";
		this._dom.cropTop.style.width = size.width + "px";
		this._dom.cropTop.style.height = leftY + "px";

		this._dom.cropBottom.style.left = leftX + "px";
		this._dom.cropBottom.style.width = size.width + "px";
		this._dom.cropBottom.style.height = (this._dim.areaHeight - p.sw.y) + "px";

		this._dom.cropLeft.style.width = leftX + "px";
		this._dom.cropLeft.style.height = this._dim.areaHeight + "px";

		this._dom.cropRight.style.width = (this._dim.areaWidth - p.ne.x) + "px";
		this._dom.cropRight.style.height = this._dim.areaHeight + "px";

		this._dom.cropMiddle.style.width = size.width + "px";
		this._dom.cropMiddle.style.height = size.height + "px";
		this._dom.cropMiddle.style.left = leftX + "px";
		this._dom.cropMiddle.style.top = leftY + "px";
	};

	/**
	 * Mouse down - move/resize crop.
	 * 
	 * @param  {Event} e
	 * @private
	 * @member $crop
	 */
	$crop.prototype._mouseDown = function(e) {
		e.stopPropagation();
		e.preventDefault();

		var target = e ? e.target : null;

		this._type = target.getAttribute("class");

		switch (this._type) {
			case "crop-top":
			case "crop-bottom":
			case "crop-left":
			case "crop-right":
				return;
		}

		// save values during click
		this._mouse.startX = e.clientX;
		this._mouse.startY = e.clientY;
		this._mouse.startXSave = e.clientX;
		this._mouse.startYSave = e.clientY;

		document.addEventListener("mousemove", this._binds.mouseMove);
		document.addEventListener("mouseup", this._binds.mouseUp);
	};

	/**
	 * Mouse move - move/resize crop.
	 * 
	 * @param  {Event} e
	 * @private
	 * @member $crop
	 */
	$crop.prototype._mouseMove = function(e) {
		e.stopPropagation();
		e.preventDefault();

		var diffX =  e.clientX - this._mouse.startX;
		var diffY = e.clientY - this._mouse.startY;

		if (this._type == "crop-middle") {
			// move
			Object.keys(this._points).forEach(function(key) {
				this._points[key].x += diffX;
				this._points[key].y += diffY;
			}, this);

			this._alignPoints();
			this._redraw();
		}
		else {
			// resize - which group?
			var group = this._groups[this._type];

			if (this._options.aspectRatio) {
				diffY = diffX / this._options.aspectRatio * (this._type == "point-nw" || this._type == "point-se" ? 1 : -1);
			}

			if (this._resizeTest(diffX, diffY, group)) {
				group.forEach(function(i) {
					var point = this._points[i.type];

					// add diffx, diffy to all group members
					point.x += i.x ? diffX : 0;
					point.y += i.y ? diffY : 0;
				}, this);

				// update size
				var size = this._getSize();

				this._dim.width = size.width;
				this._dim.height = size.height;

				this._redraw();
			}
		}

		// overwrite
		this._mouse.startX = e.clientX;
		this._mouse.startY = e.clientY;
	};

	/**
	 * Mouse up - end of move/resize crop.
	 * 
	 * @param  {Event} e
	 * @private
	 * @member $crop
	 */
	$crop.prototype._mouseUp = function(e) {
		e.stopPropagation();
		e.preventDefault();

		document.removeEventListener("mousemove", this._binds.mouseMove);
		document.removeEventListener("mouseup", this._binds.mouseUp);

		if (this._mouse.startXSave != e.clientX || this._mouse.startYSave != e.clientY) {
			// crop was changed
			this._changed = true;
		}
	};

	/**
	 * Get size of crop.
	 * 
	 * @param  {Object} [points] Points object, default is used crop points.
	 * @return {Object}
	 * @member $crop
	 */
	$crop.prototype._getSize = function(points) {
		points = points || this._points;

		return {
			width: Math.abs(points.ne.x - points.nw.x),
			height: Math.abs(points.sw.y - points.nw.y)
		};
	};

	/**
	 * Resize test - if returns false, crop size is on the edge of the area.
	 * 
	 * @param  {Number} diffX Increment on axe X
	 * @param  {Number} diffY Increment on axe Y
	 * @param  {Array[Object]} group Selected group from mouse down
	 * @return {Boolean} false - error
	 * @member $crop
	 */
	$crop.prototype._resizeTest = function(diffX, diffY, group) {
		if (!this._options.aspectRatio) {
			return false;
		}

		var points = {
			nw: {
				x: this._points.nw.x,
				y: this._points.nw.y
			},
			ne: {
				x: this._points.ne.x,
				y: this._points.ne.y
			},
			sw: {
				x: this._points.sw.x,
				y: this._points.sw.y
			},
			se: {
				x: this._points.se.x,
				y: this._points.se.y
			}
		}

		group.forEach(function(i) {
			var point = points[i.type];

			// add diffx, diffy to all group members
			point.x = this._points[i.type].x + (i.x ? diffX : 0);
			point.y = this._points[i.type].y + (i.y ? diffY : 0);
		}, this);

		// min. and max. value
		var size = this._getSize(points);

		// test
		if (
			size.width < this._options.minWidth || size.width > this._options.maxWidth ||
			size.height < this._options.minHeight || size.height > this._options.maxHeight ||
			points.nw.x < 0 || points.se.x > this._dim.areaWidth ||
			points.nw.y < 0 || points.sw.y > this._dim.areaHeight
		) {
			return false;
		}
		else {
			return true;
		}
	};

	/**
	 * Set crop center above his area.
	 * 
	 * @member $crop
	 */
	$crop.prototype.setCenter = function() {
		this._setCenter();

		this._redraw();
	};

	/**
	 * Remove crop from DOM.
	 * 
	 * @member $crop
	 */
	$crop.prototype.destroy = function() {
		var c = this.getContainer();

		if (c.parentNode) {
			c.parentNode.removeChild(c);
		}
	};

	/**
	 * Get crop root el.
	 * 
	 * @return {HTMLElement}
	 * @member $crop
	 */
	$crop.prototype.getContainer = function() {
		return this._dom.container;
	};

	/**
	 * Set crop dimensions.
	 * 
	 * @param {Object} dim
	 * @param {Number} dim.width Area width
	 * @param {Number} dim.height Area height
	 * @member $crop
	 */
	$crop.prototype.setDim = function(dim) {
		if (!dim) {
			return;
		}

		var areaWidth = dim.width;
		var areaHeight = dim.height;

		this._dim.areaWidth = areaWidth;
		this._dim.areaHeight = areaHeight;

		this._dom.container.style.width = areaWidth + "px";
		this._dom.container.style.height = areaHeight + "px";

		var width = Math.min(this._dim.width, this._dim.areaWidth);
		var height = Math.min(this._dim.height, this._dim.areaHeight);

		if (this._options.aspectRatio) {
			height = Math.round(width / this._options.aspectRatio);
		}

		this._dim.width = width;
		this._dim.height = height;

		this.setCenter();
	};

	/**
	 * Show crop.
	 *
	 * @member $crop
	 */
	$crop.prototype.show = function() {
		this._dom.container.classList.remove(this._CONST.HIDE_CLASS);
	};

	/**
	 * Hide crop.
	 *
	 * @member $crop
	 */
	$crop.prototype.hide = function() {
		this._dom.container.classList.add(this._CONST.HIDE_CLASS);
	};

	/**
	 * Is crop visible?
	 * 
	 * @return {Boolean}
	 * @member $crop
	 */
	$crop.prototype.isVisible = function() {
		return !(this._dom.container.classList.contains(this._CONST.HIDE_CLASS));
	};

	/**
	 * Is crop changed?
	 * 
	 * @return {Boolean}
	 * @member $crop
	 */
	$crop.prototype.isChanged = function() {
		return this._changed;
	};

	/**
	 * Backup current crop state - his position and change state.
	 * 
	 * @member $crop
	 */
	$crop.prototype.backup = function() {
		this._backupData = {
			changed: this._changed,
			aabb: this.getAABB()
		};
	};

	/**
	 * Restore crop saved state - his position and change state.
	 * 
	 * @member $crop
	 */
	$crop.prototype.restore = function() {
		if (this._backupData) {
			this._changed = this._backupData.changed;

			var aabb = this._backupData.aabb;

			var nw = this._points["nw"];
			var ne = this._points["ne"];
			var sw = this._points["sw"];
			var se = this._points["se"];

			// restore
			nw.x = aabb[0];
			nw.y = aabb[1];
			se.x = aabb[2];
			se.y = aabb[3];

			ne.x = se.x;
			ne.y = nw.y;
			sw.x = nw.x;
			sw.y = se.y;

			this._redraw();

			this._backupData = null;
		}
	};

	/**
	 * Get crop bounding box.
	 * 
	 * @param {Number} [scale=1] Recalculate all positions using scale constants, def. is 1
	 * @return {Array} [x1, y1, x2, y2] 2 points coordinates from top left corner
	 * @member $crop
	 */
	$crop.prototype.getAABB = function(scale) {
		var nw = this._points["nw"];
		var se = this._points["se"];

		scale = scale || 1.0;

		return [
			Math.round(nw.x * scale),
			Math.round(nw.y * scale),
			Math.round(se.x * scale),
			Math.round(se.y * scale)
		];
	};

	return $crop;
}]);
