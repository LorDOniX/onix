onix.factory("$anonymizer", [
	"$dom",
	"$event",
	"$loader",
function(
	$dom,
	$event,
	$loader
) {
	/**
	 * Anonymizer - canvas for image preview with posibility for add geometries.
	 *
	 * @param {HTMLElement} parent Where is canvas appended
	 * @param {Object} [optsArg] Configuration
	 * @param {Number} [optsArg.canWidth] Canvas width
	 * @param {Number} [optsArg.canHeight] Canvas height
	 * @param {Number} [optsArg.zoom = 100] start zoom in [%]
	 * @param {Number} [optsArg.minZoom = 20] min zoom in [%]
	 * @param {Number} [optsArg.maxZoom = 100] max zoom in [%]
	 * @param {Number} [optsArg.zoomStep = 10] o kolik [%] How many [%] add/dec with zoom change
	 * @param {Number} [optsArg.zoomMoveStep = 0] Under 100% multiplier for faster image movement
	 * @param {Object} [optsArg.curEntity = $anonymizer.ENTITES.CIRCLE] Start entity from $anonymizer.ENTITES
	 * @param {Number} [optsArg.showPreview = true] Show preview - image overview
	 * @param {Number} [optsArg.previewLeft = 17] Preview location from left top corner, axe x [px]
	 * @param {Number} [optsArg.previewTop = 17] Preview location from left top corner, axe y [px]
	 * @param {Number} [optsArg.previewWidth = 200] Preview image width [px]
	 * @param {HTMLElement} [optsArg.entityPreview = null] Create entity preview? Parent for append.
	 * @class $anonymizer
	 */
	var $anonymizer = function(parent, optsArg) {
		$event.bindEvents(this);

		// is canvas available?
		this._hasCanvas = !!document.createElement("canvas").getContext;

		if (!this._hasCanvas) {
			console.error("Canvas is not available!");
			return null;
		}

		// parent reference
		this._parent = parent;
		this._parent.classList.add("anonymizer");

		this._opts = {
			canWidth: parent.offsetWidth || 0,
			canHeight: parent.offsetHeight || 0,
			zoom: 100,
			minZoom: 20,
			maxZoom: 100,
			zoomStep: 10,
			zoomMoveStep: 0,
			curEntity: $anonymizer.ENTITES.CIRCLE,
			showPreview: true,
			previewLeft: 17,
			previewTop: 17,
			previewWidth: 200,
			entityPreview: null
		};

		for (var key in optsArg) {
			this._opts[key] = optsArg[key];
		}

		// act. image width
		this._curWidth = 0;
		// act. image height
		this._curHeight = 0;
		// step for zoom move
		this._zoomMoveStep = 0;

		// create main canvas
		this._canvas = document.createElement("canvas");
		this._canvas.width = this._opts.canWidth;
		this._canvas.height = this._opts.canHeight;

		// ctx of main canvas
		this._ctx = this._canvas.getContext("2d");
		// loaded image
		this._img = null;

		// original image width
		this._imgWidth = 0;
		// original image height
		this._imgHeight = 0;

		// canvas & ctx for create line
		this._lineCanvas = null;
		this._lineCanvasCtx = null;

		// canvas & ctx for preview of a entity
		this._entityCanvas = null;
		this._entityCanvasCtx = null;

		// entites to draw
		this._entites = [];

		// image draw offset axe x
		this._x = 0;

		// image draw offset axe y
		this._y = 0;

		// threshold for click
		this._THRESHOLD = {
			MIN: -1,
			MAX: 1
		};

		// helper for mouse event
		this._mouse = {
			startXSave: 0,
			startYSave: 0,
			startX: 0,
			startY: 0,
			wasRightClick: false,
			wasMove: false,
			wasPreview: false,
			wasLine: false,
			wasImgMove: false
		};

		// binds
		this._binds = {
			mouseWheel: this._mouseWheel.bind(this),
			mouseDown: this._mouseDown.bind(this),
			mouseMove: this._mouseMove.bind(this),
			mouseUp: this._mouseUp.bind(this),
			mouseMoveLine: this._mouseMoveLine.bind(this),
			mouseUpLine: this._mouseUpLine.bind(this),
			mouseUpDocument: this._mouseUpDocument.bind(this),
			contextMenu: this._contextmenu.bind(this)
		};

		// firefox
		this._canvas.addEventListener("DOMMouseScroll", this._binds.mouseWheel);
		// others
		this._canvas.addEventListener("mousewheel", this._binds.mouseWheel);
		this._canvas.addEventListener("mousedown", this._binds.mouseDown);
		this._canvas.addEventListener("contextmenu", this._binds.contextMenu);

		// spinner - progress for image load
		this._spinner = $loader.getSpinner();
		parent.appendChild(this._spinner);
		parent.appendChild(this._canvas);

		// preview canvas
		if (this._opts.entityPreview) {
			this._entityCanvas = document.createElement("canvas");
			this._entityCanvas.width = 300;
			this._entityCanvas.height = 150;
			this._entityCanvasCtx = this._entityCanvas.getContext("2d");

			this._opts.entityPreview.appendChild(this._entityCanvas);
		}
	};

	/**
	 * List of entites.
	 * 
	 * @type {Object}
	 * @member $anonymizer
	 * @static
	 */
	$anonymizer.ENTITES = {
		/**
		 * Circle entity.
		 * 
		 * @property CIRCLE
		 * @member $anonymizer.ENTITES
		 */
		CIRCLE: {
			min: 10,
			value: 50,
			max: 50,
			id: "CIRCLE",
			fillStyle: "rgba(0, 0, 255, 0.5)",
			priority: 1
		},
		/**
		 * Line entity.
		 * 
		 * @property LINE
		 * @member $anonymizer.ENTITES
		 */
		LINE: {
			min: 10,
			value: 20,
			max: 100,
			id: "LINE",
			strokeStyle: "rgba(0, 255, 0, 0.5)",
			priority: 2
		}
	};

	/**
	 * Scene redraw - clear, picture, entites.
	 *
	 * @private
	 * @member $anonymizer
	 */
	$anonymizer.prototype._redraw = function() {
		// pictue
		this._ctx.clearRect(0, 0, this._opts.canWidth, this._opts.canHeight);
		this._ctx.drawImage(this._img, this._x, this._y, this._img.width, this._img.height, 0, 0, this._curWidth, this._curHeight);

		// entites
		if (this._entites.length) {
			var zc = this._opts.zoom / 100;
			var xc = this._x * zc;
			var yc = this._y * zc;

			this._entites.forEach(function(entity) {
				switch (entity.id) {
					case $anonymizer.ENTITES.CIRCLE.id:
						var radius = Math.round(entity.value * zc);
						var x = Math.round(this._curWidth * entity.xRatio - xc);
						var y = Math.round(this._curHeight * entity.yRatio - yc);

						this._drawCircle(this._ctx, x, y, radius);
						break;

					case $anonymizer.ENTITES.LINE.id:
						var lineWidth = Math.round(entity.value * zc);
						var x = Math.round(this._curWidth * entity.xRatio - xc);
						var y = Math.round(this._curHeight * entity.yRatio - yc);
						var x2 = Math.round(this._curWidth * entity.x2Ratio - xc);
						var y2 = Math.round(this._curHeight * entity.y2Ratio - yc);

						this._drawLine(this._ctx, x, y, x2, y2, lineWidth);
						break;
				}
			}, this);
		}

		// image preview
		this._drawPreview();
	};

	/**
	 * Draw a circle.
	 * 
	 * @param  {Canvas} ctx Canvas context
	 * @param  {Number} x Center coordinates axe x
	 * @param  {Number} y Center coordinates axe y
	 * @param  {Number} radius Circle radius
	 * @private
	 * @member $anonymizer
	 */
	$anonymizer.prototype._drawCircle = function(ctx, x, y, radius) {
		ctx.beginPath();
		ctx.arc(x, y, radius, 0, 2*Math.PI);
		ctx.fillStyle = $anonymizer.ENTITES.CIRCLE.fillStyle;
		ctx.closePath();
		ctx.fill();
	};

	/**
	 * Draw a line.
	 * 
	 * @param  {Canvas} ctx Canvas context
	 * @param  {Number} x Line start coordinates axe x
	 * @param  {Number} y Line start coordinates axe y
	 * @param  {Number} x2 Line end coordinates axe x
	 * @param  {Number} y2 Line end coordinates axe y
	 * @param  {Number} lineWidth Line width [px]
	 * @private
	 * @member $anonymizer
	 */
	$anonymizer.prototype._drawLine = function(ctx, x, y, x2, y2, lineWidth) {
		ctx.beginPath();
		ctx.moveTo(x, y);
		ctx.lineTo(x2, y2);
		ctx.lineWidth = lineWidth;
		ctx.strokeStyle = $anonymizer.ENTITES.LINE.strokeStyle;
		ctx.closePath();
		ctx.stroke();
	};

	/**
	 * Draw a filled rectangle.
	 * 
	 * @param  {Canvas} ctx Canvas context
	 * @param  {Number} x Start coordinates axe x
	 * @param  {Number} y Start coordinates axe y
	 * @param  {Number} width Rectangle width
	 * @param  {Number} height Rectangle height
	 * @param  {String} fillStyle Fill style
	 * @private
	 * @member $anonymizer
	 */
	$anonymizer.prototype._drawFillRect = function(ctx, x, y, width, height, fillStyle) {
		ctx.beginPath();
		ctx.fillStyle = fillStyle || "";
		ctx.fillRect(x, y, width, height);
		ctx.closePath();
	};

	/**
	 * Draw a rectangle, only border.
	 * 
	 * @param  {Canvas} ctx Canvas context
	 * @param  {Number} x Start coordinates axe x
	 * @param  {Number} y Start coordinates axe y
	 * @param  {Number} width Rectangle width
	 * @param  {Number} height Rectangle height
	 * @param  {String} strokeStyle Border style
	 * @param  {Number} lineWidth Border width
	 * @private
	 * @member $anonymizer
	 */
	$anonymizer.prototype._drawRect = function(ctx, x, y, width, height, strokeStyle, lineWidth) {
		ctx.beginPath();
		ctx.rect(x, y, width, height);
		ctx.lineWidth = lineWidth || 1;
		ctx.strokeStyle = strokeStyle || "";
		ctx.closePath();
		ctx.stroke();
	};

	/**
	 * Draw a image preview.
	 *
	 * @private
	 * @member $anonymizer
	 */
	$anonymizer.prototype._drawPreview = function() {
		if (!this._opts.showPreview) return;

		var ratio = this._imgWidth / this._imgHeight;
		var height = Math.round(this._opts.previewWidth / ratio);

		// background
		this._drawFillRect(this._ctx, this._opts.previewLeft - 1, this._opts.previewTop - 1, this._opts.previewWidth + 2, height + 2, "rgba(255, 255, 255, 0.5)");

		// picture
		this._ctx.drawImage(this._img, 0, 0, this._img.width, this._img.height, this._opts.previewLeft, this._opts.previewTop, this._opts.previewWidth, height);

		// red border - current view
		var zc = this._opts.zoom / 100;
		var xc = this._x * zc;
		var yc = this._y * zc;

		var xRatio = xc / this._curWidth;
		var yRatio = yc / this._curHeight;
		var x2Ratio = (xc + this._opts.canWidth) / this._curWidth;
		var y2Ratio = (yc + this._opts.canHeight) / this._curHeight;

		// restrictions
		xRatio = this._setRange(xRatio, 0, 1);
		yRatio = this._setRange(yRatio, 0, 1);
		x2Ratio = this._setRange(x2Ratio, 0, 1);
		y2Ratio = this._setRange(y2Ratio, 0, 1);

		var x1 = Math.round(this._opts.previewLeft + xRatio * this._opts.previewWidth);
		var y1 = Math.round(this._opts.previewTop + yRatio * height);
		var x2 = Math.round(this._opts.previewLeft + x2Ratio * this._opts.previewWidth);
		var y2 = Math.round(this._opts.previewTop + y2Ratio * height);

		// red border
		this._drawRect(this._ctx, x1, y1, x2 - x1, y2 - y1, "#C01", 1);
	};

	/**
	 * Draw a entity preview for circle/line.
	 *
	 * @private
	 * @member $anonymizer
	 */
	$anonymizer.prototype._drawEntityPreview = function() {
		if (!this._opts.entityPreview) return;

		var width = this._entityCanvas.width;
		var height = this._entityCanvas.height;

		this._entityCanvasCtx.clearRect(0, 0, width, height);
		this._drawFillRect(this._entityCanvasCtx, 0, 0, width, height, "#f9f9f9");

		var curEnt = this._opts.curEntity;
		var zc = this._opts.zoom / 100;

		switch (curEnt.id) {
			case $anonymizer.ENTITES.CIRCLE.id:
				var radius = Math.round(curEnt.value * zc);
				var x = Math.round(width / 2);
				var y = Math.round(height / 2);

				this._drawCircle(this._entityCanvasCtx, x, y, radius);
				break;

			case $anonymizer.ENTITES.LINE.id:
				var x1 = Math.round(width * 0.2);
				var y1 = Math.round(height / 2);
				var x2 = Math.round(width * 0.8);
				// y2 = y1
				var lineWidth = Math.round(curEnt.value * zc);

				this._drawLine(this._entityCanvasCtx, x1, y1, x2, y1, lineWidth);
				break;
		}
	};

	/**
	 * Get center point for zoom, otherwise is used point with mouse wheel and cursor position.
	 *
	 * @param {Number} [x] Coordinates on canvas axe x, otherwise is used center point on axe x
	 * @param {Number} [y] Coordinates on canvas axe y, otherwise is used center point on axe y
	 * @return {Object}
	 * @private
	 * @member $anonymizer
	 */
	$anonymizer.prototype._getFromPoint = function(x, y) {
		var fromPoint = {
			x: x || Math.round(this._opts.canWidth / 2),
			y: y || Math.round(this._opts.canHeight / 2)
		};

		var zc = this._opts.zoom / 100;
		var x = Math.round(this._x * zc) + fromPoint.x;
		var y = Math.round(this._y * zc) + fromPoint.y;

		fromPoint.xRatio = x / this._curWidth;
		fromPoint.yRatio = y / this._curHeight;

		return fromPoint;
	};

	/**
	 * Post zoom operation - new image dimenstions, new move zoom step.
	 * 
	 * @private
	 * @member $anonymizer
	 */
	$anonymizer.prototype._postZoom = function() {
		var zc = this._opts.zoom / 100;

		this._curWidth = Math.round(this._img.width * zc);
		this._curHeight = Math.round(this._img.height * zc);

		if (this._opts.zoom < 100) {
			// function for zoom and mouse move
			this._zoomMoveStep = Math.max(((100 - this._opts.zoom) / 10 * this._opts.zoomMoveStep) / 2, 1);
		}
	};

	/**
	 * Set value in selected range.
	 * 
	 * @param {Number} value Input value
	 * @param {Number} min Min value
	 * @param {Number} max Max value
	 * @return {Number}
	 * @private
	 * @member $anonymizer
	 */
	$anonymizer.prototype._setRange = function(value, min, max) {
		if (value < min) {
			return min;
		}
		else if (value > max) {
			return max;
		}
		else {
			return value;
		}
	};

	/**
	 * Set image center on the canvas center.
	 *
	 * @private
	 * @member $anonymizer
	 */
	$anonymizer.prototype._setCenter = function() {
		this._setPosition(0.5, 0.5);
	};
	
	/**
	 * Set image offset position.
	 * 
	 * @param {Number} xRatio <0;1> Point position on the image
	 * @param {Number} yRatio <0;1> Point position on the image
	 * @param {Number} [x] Screen offset, otherwise center [px], axe x
	 * @param {Number} [y] Screen offset, otherwise center [px], axe y
	 * @private
	 * @member $anonymizer
	 */
	$anonymizer.prototype._setPosition = function(xRatio, yRatio, x, y) {
		x = x || this._opts.canWidth / 2;
		y = y || this._opts.canHeight / 2;

		xRatio = this._setRange(xRatio, 0, 1);
		yRatio = this._setRange(yRatio, 0, 1);

		var zc = this._opts.zoom / 100;
		var xc = (this._curWidth * xRatio) - x;
		var yc = (this._curHeight * yRatio) - y;

		this._x = Math.max(Math.round(xc / zc), 0);
		this._y = Math.max(Math.round(yc / zc), 0);
	};

	/**
	 * Align image to the canvas - left top corner and bottom right corner.
	 *
	 * @private
	 * @member $anonymizer
	 */
	$anonymizer.prototype._alignImgToCanvas = function() {
		var maxX = Math.max(this._curWidth - this._opts.canWidth, 0);
		var currX = Math.round(this._x * this._opts.zoom / 100);

		if (this._x < 0) {
			this._x = 0;
		}
		else if (currX > maxX) {
			this._x = Math.round(maxX * 100 / this._opts.zoom);
		}

		var maxY = Math.max(this._curHeight - this._opts.canHeight, 0);
		var currY = Math.round(this._y * this._opts.zoom / 100);

		if (this._y < 0) {
			this._y = 0;
		}
		else if (currY > maxY) {
			this._y = Math.round(maxY * 100 / this._opts.zoom);
		}
	};

	/**
	 * It event contains right mouse click?
	 *
	 * @param {Event} e Mouse event
	 * @return {Boolean}
	 * @private
	 * @member $anonymizer
	 */
	$anonymizer.prototype._isRightClick = function(e) {
		if (e && ((e.which && e.which == 3) || (e.button && e.button == 2))) {
			return true;
		}
		else {
			return false;
		}
	};

	/**
	 * Disable context menu for canvas during right mouse click.
	 * 
	 * @param  {Event} e Mouse event
	 * @private
	 * @member $anonymizer
	 */
	$anonymizer.prototype._contextmenu = function(e) {
		e.stopPropagation();
		e.preventDefault();
	};

	/**
	 * Mouse wheel event.
	 *
	 * @param {Event} e Mouse event
	 * @private
	 * @member $anonymizer
	 */
	$anonymizer.prototype._mouseWheel = function(e) {
		var delta = e.wheelDelta || -e.detail;
		if (!delta) { return; }

		e.stopPropagation();
		e.preventDefault();

		var fromPoint = this._getFromPoint(e.offsetX, e.offsetY);

		if (delta > 0) {
			this.zoomPlus(fromPoint);
		}
		else {
			this.zoomMinus(fromPoint);
		}
	};

	/**
	 * Mouse down - create a circle, start of the line, start of move.
	 *
	 * @param {Event} e Mouse event
	 * @private
	 * @member $anonymizer
	 */
	$anonymizer.prototype._mouseDown = function(e) {
		e.stopPropagation();
		e.preventDefault();

		this._mouse.startXSave = e.offsetX;
		this._mouse.startYSave = e.offsetY;
		this._mouse.startX = e.offsetX;
		this._mouse.startY = e.offsetY;
		this._mouse.wasMove = false;
		this._mouse.wasRightClick = this._isRightClick(e);

		// circle
		if (this._opts.curEntity == $anonymizer.ENTITES.CIRCLE) {
			this._mouse.wasImgMove = false;

			this._canvas.addEventListener("mousemove", this._binds.mouseMove);
			this._canvas.addEventListener("mouseup", this._binds.mouseUp);
			this._canvas.addEventListener("mouseleave", this._binds.mouseUp);
		}
		// line
		else if (this._opts.curEntity == $anonymizer.ENTITES.LINE) {
			// add canvas
			var lineCanvas = document.createElement("canvas");
			lineCanvas.width = this._opts.canWidth;
			lineCanvas.height = this._opts.canHeight;
			lineCanvas.classList.add("line-canvas");

			this._mouse.wasPreview = false;
			this._mouse.wasLine = false;

			this._lineCanvas = lineCanvas;
			this._lineCanvas.addEventListener("mousemove", this._binds.mouseMoveLine);
			this._lineCanvas.addEventListener("mouseup", this._binds.mouseUpLine);
			this._lineCanvas.addEventListener("contextmenu", this._binds.contextMenu);

			if (this._mouse.wasRightClick) {
				this._lineCanvas.classList.add("is-dragged");
			}

			document.addEventListener("mouseup", this._binds.mouseUpDocument);

			this._lineCanvasCtx = this._lineCanvas.getContext("2d");

			this._parent.appendChild(lineCanvas);
		}
	};

	/**
	 * Image move - according to the coordinates of the mouse.
	 * 
	 * @param  {Number} newX New value on the axe x
	 * @param  {Number} newY New value on the axe y
	 * @private
	 * @member $anonymizer
	 */
	$anonymizer.prototype._imgMove = function(newX, newY) {
		var diffX = this._mouse.startX - newX;
		var diffY = this._mouse.startY - newY;

		if (diffX == 0 && diffY == 0) {
			return;
		}

		// image movement constant
		var zms = this._zoomMoveStep > 0 ? this._zoomMoveStep : 1;

		// move image to the new coordinates
		this._x = diffX * zms + this._x;
		this._y = diffY * zms + this._y;

		this._alignImgToCanvas();
		this._redraw();
	};

	/**
	 * Mouse move over the canvas.
	 *
	 * @param {Event} e Mouse event
	 * @private
	 * @member $anonymizer
	 */
	$anonymizer.prototype._mouseMove = function(e) {
		// mouse cursor
		if (!this._mouse.wasMove) {
			this._canvas.classList.add("is-dragged");
		}

		// mouse move flag
		this._mouse.wasMove = true;

		// mouse move over the preview?
		var isPreview = this._isPreview(e.offsetX, e.offsetY);

		if (!this._mouse.wasRightClick && !this._mouse.wasImgMove && isPreview) {
			// image move over the preview
			this._setPosition(isPreview.xRatio, isPreview.yRatio);

			this._alignImgToCanvas();
			this._redraw();
		}
		else {
			// image move - flag
			this._mouse.wasImgMove = true;

			// image move
			this._imgMove(e.offsetX, e.offsetY);
		}

		// save
		this._mouse.startX = e.offsetX;
		this._mouse.startY = e.offsetY;
	};

	/**
	 * Is there a preview on coordinates x, y?
	 * 
	 * @param  {Number} x Click position on canvas, axe x
	 * @param  {Number} y Click position on canvas, axe y
	 * @return {Object} Object with percent ration or null
	 * @private
	 * @member $anonymizer
	 */
	$anonymizer.prototype._isPreview = function(x, y) {
		if (!this._opts.showPreview) return null;

		var ratio = this._imgWidth / this._imgHeight;

		// sirka a vyska nahledu
		var width = this._opts.previewWidth;
		var height = Math.round(this._opts.previewWidth / ratio);

		var left = this._opts.previewLeft;
		var top = this._opts.previewTop;
		var zc = this._opts.zoom / 100;

		x = x || 0;
		y = y || 0;

		if (x >= left && x <= left + width && y >= top && y <= top + height) {
			return {
				xRatio: (x - left) / width,
				yRatio: (y - top) / height
			};
		}
		else {
			return null;
		}
	};

	/**
	 * Mouse up - draw a circle, end of move, preview click.
	 *
	 * @param {Event} e Mouse event
	 * @private
	 * @member $anonymizer
	 */
	$anonymizer.prototype._mouseUp = function(e) {
		var thresholdTest = false;

		// only it was move
		if (this._mouse.wasMove) {
			// difference towards start click
			var diffX = this._mouse.startXSave - e.offsetX;
			var diffY = this._mouse.startYSave - e.offsetY;

			if (diffX >= this._THRESHOLD.MIN && diffX <= this._THRESHOLD.MAX && diffY >= this._THRESHOLD.MIN && diffY <= this._THRESHOLD.MAX) {
				// we are in the range
				thresholdTest = true;
			}
		}

		// click - there was no move, threshold test, it is disabled for right mouse click
		if (!this._mouse.wasRightClick && (!this._mouse.wasMove || thresholdTest)) {
			var isPreview = this._isPreview(e.offsetX, e.offsetY);

			if (isPreview) {
				// preview click - click coordinates on the canvas center
				this._setPosition(isPreview.xRatio, isPreview.yRatio);
				this._alignImgToCanvas();
				this._redraw();
			}
			else {
				// add circle
				var zc = this._opts.zoom / 100;
				var x = Math.round(this._x * zc) + e.offsetX;
				var y = Math.round(this._y * zc) + e.offsetY;

				this._entites.push({
					id: this._opts.curEntity.id,
					value: this._opts.curEntity.value,
					xRatio: x / this._curWidth,
					yRatio: y / this._curHeight
				});

				this._redraw();
			}
		}

		this._canvas.classList.remove("is-dragged");

		this._canvas.removeEventListener("mousemove", this._binds.mouseMove);
		this._canvas.removeEventListener("mouseup", this._binds.mouseUp);
		this._canvas.removeEventListener("mouseleave", this._binds.mouseUp);
	};

	/**
	 * Mouse move over canvas - line draw.
	 *
	 * @param {Event} e Mouse event
	 * @private
	 * @member $anonymizer
	 */
	$anonymizer.prototype._mouseMoveLine = function(e) {
		// mouse move
		this._mouse.wasMove = true;

		// right mouse click
		if (this._mouse.wasRightClick) {
			// image move
			this._imgMove(e.offsetX, e.offsetY);

			// save
			this._mouse.startX = e.offsetX;
			this._mouse.startY = e.offsetY;
		}
		// left mouse click
		else {
			var isPreview = this._isPreview(e.offsetX, e.offsetY);
			var wasPreview = this._mouse.wasPreview;

			if (!this._mouse.wasLine && isPreview) {
				this._mouse.wasPreview = true;

				// move over preview
				this._setPosition(isPreview.xRatio, isPreview.yRatio);
				this._alignImgToCanvas();
				this._redraw();
			}
			else if (!this._mouse.wasPreview) {
				this._mouse.wasLine = true;

				// line width
				var lineWidth = Math.round(this._opts.curEntity.value * this._opts.zoom / 100);

				// clear
				this._lineCanvasCtx.clearRect(0, 0, this._opts.canWidth, this._opts.canHeight);
				// draw a line
				this._drawLine(this._lineCanvasCtx, this._mouse.startX, this._mouse.startY, e.offsetX, e.offsetY, lineWidth);
			}

			// change of state
			if (!wasPreview && this._mouse.wasPreview) {
				this._lineCanvas.classList.add("is-dragged");
			}
		}
	};

	/**
	 * End of move over canvas - create line, image move.
	 * Draw a line in main canvas.
	 *
	 * @param {Event} e Mouse event
	 * @private
	 * @member $anonymizer
	 */
	$anonymizer.prototype._mouseUpLine = function(e) {
		var isPreview = null;

		if (!this._mouse.wasMove) {
			isPreview = this._isPreview(e.offsetX, e.offsetY);
		}

		// only for left mouse click
		if (!this._mouse.wasRightClick) {
			if (isPreview) {
				// preview click - click coordinates on the canvas center
				this._setPosition(isPreview.xRatio, isPreview.yRatio);
				this._alignImgToCanvas();
				this._redraw();
			}
			else if (this._mouse.wasLine) {
				// create a line
				var zc = this._opts.zoom / 100;
				var xc = Math.round(this._x * zc);
				var yc = Math.round(this._y * zc);

				var x = xc + this._mouse.startX;
				var y = yc + this._mouse.startY;
				var x2 = xc + e.offsetX;
				var y2 = yc + e.offsetY;

				this._entites.push({
					id: this._opts.curEntity.id,
					value: this._opts.curEntity.value,
					xRatio: x / this._curWidth,
					yRatio: y / this._curHeight,
					x2Ratio: x2 / this._curWidth,
					y2Ratio: y2 / this._curHeight
				});

				this._redraw();
			}
		}

		this._lineCanvas.classList.remove("is-dragged");

		this._lineCanvas.removeEventListener("mousemove", this._binds.mouseMoveLine);
		this._lineCanvas.removeEventListener("mouseup", this._binds.mouseUpLine);
		this._lineCanvas.removeEventListener("contextmenu", this._binds.contextMenu);

		document.removeEventListener("mouseup", this._binds.mouseUpDocument);

		this._parent.removeChild(this._lineCanvas);

		this._lineCanvas = null;
	};

	/**
	 * Mouse up over the document - drawing a line outside a canvas and mouse up -> line is canceled.
	 *
	 * @param {Event} e Mouse event
	 * @private
	 * @member $anonymizer
	 */
	$anonymizer.prototype._mouseUpDocument = function(e) {
		this._mouse.wasLine = false;
		this._mouseUpLine(e);
	};

	/**
	 * Load and show image in canvas.
	 * 
	 * @param  {String} url Path to image
	 * @member $anonymizer
	 */
	$anonymizer.prototype.loadImage = function(url) {
		this._spinner.classList.remove("hide");

		var img = new Image();
		img.onload = function() {
			this._spinner.classList.add("hide");
			this._img = img;
			this._imgWidth = img.width;
			this._imgHeight = img.height;

			this.trigger("zoom", this._opts.zoom);

			this._postZoom();
			this._setCenter();
			this._alignImgToCanvas();
			this._drawEntityPreview();
			this._redraw();
		}.bind(this);
		img.src = url || "";
	};

	/**
	 * Increase zoom by one step, fires signal "zoom".
	 * 
	 * @param  {Object} [fromPoint] Center of the screen or data from mouse wheel
	 * @member $anonymizer
	 */
	$anonymizer.prototype.zoomPlus = function(fromPoint) {
		fromPoint = fromPoint || this._getFromPoint();

		this._opts.zoom += this._opts.zoomStep;

		if (this._opts.zoom > this._opts.maxZoom) {
			this._opts.zoom = this._opts.maxZoom;
		}

		this.trigger("zoom", this._opts.zoom);

		this._postZoom();
		this._setPosition(fromPoint.xRatio, fromPoint.yRatio, fromPoint.x, fromPoint.y);
		this._alignImgToCanvas();
		this._drawEntityPreview();
		this._redraw();
	};

	/**
	 * Decrease zoom by one step, fires signal "zoom".
	 * 
	 * @param  {Object} [fromPoint] Center of the screen or data from mouse wheel
	 * @member $anonymizer
	 */
	$anonymizer.prototype.zoomMinus = function(fromPoint) {
		fromPoint = fromPoint || this._getFromPoint();

		this._opts.zoom -= this._opts.zoomStep;

		if (this._opts.zoom < this._opts.minZoom) {
			this._opts.zoom = this._opts.minZoom;
		}

		this.trigger("zoom", this._opts.zoom);

		this._postZoom();
		this._setPosition(fromPoint.xRatio, fromPoint.yRatio, fromPoint.x, fromPoint.y);
		this._alignImgToCanvas();
		this._drawEntityPreview();
		this._redraw();
	};

	/**
	 * Get current draw entity ID.
	 * 
	 * @return {String}
	 * @member $anonymizer
	 */
	$anonymizer.prototype.getEntityId = function() {
		return this._opts.curEntity.id;
	};

	/**
	 * Switch to other entity, uses priority.
	 *
	 * @member $anonymizer
	 */
	$anonymizer.prototype.switchEntity = function() {
		var variants = Object.keys($anonymizer.ENTITES);
		var priority = this._opts.curEntity.priority;
		var selVariant = null;
		var lowestVariant = null;

		variants.forEach(function(variant) {
			var varObj = $anonymizer.ENTITES[variant];

			if (!selVariant && varObj.priority > this._opts.curEntity.priority) {
				selVariant = varObj;
			}

			if (!lowestVariant || varObj.priority < lowestVariant.priority) {
				lowestVariant = varObj;
			}
		}, this);

		if (!selVariant) {
			selVariant = lowestVariant;
		}

		this._opts.curEntity = selVariant;

		this._drawEntityPreview();
	};

	/**
	 * Get current entity object.
	 * 
	 * @return {Object}
	 * @member $anonymizer
	 */
	$anonymizer.prototype.getEntity = function() {
		return this._opts.curEntity;
	};

	/**
	 * Set value for current entity.
	 * 
	 * @param {Number} val New value
	 * @return {Boolean} If there was an error -> it returns false
	 * @member $anonymizer
	 */
	$anonymizer.prototype.setEntityValue = function(val) {
		val = val || 0;

		if (val >= this._opts.curEntity.min && val <= this._opts.curEntity.max) {
			this._opts.curEntity.value = val;
			this._drawEntityPreview();
			return true;
		}
		else {
			return false;
		}
	};

	/**
	 * Set circle as a selected entity.
	 *
	 * @member $anonymizer
	 */
	$anonymizer.prototype.setCircleEntity = function() {
		this._opts.curEntity = $anonymizer.ENTITES.CIRCLE;
		this._drawEntityPreview();
	};

	/**
	 * Set line as a selected entity.
	 *
	 * @member $anonymizer
	 */
	$anonymizer.prototype.setLineEntity = function() {
		this._opts.curEntity = $anonymizer.ENTITES.LINE;
		this._drawEntityPreview();
	};

	/**
	 * Take last entity and redraw a scene.
	 * 
	 * @member $anonymizer
	 */
	$anonymizer.prototype.stepBack = function() {
		this._entites.pop();
		this._redraw();
	};

	/**
	 * Remove all entites and redraw a scene.
	 * 
	 * @member $anonymizer
	 */
	$anonymizer.prototype.removeAll = function() {
		this._entites = [];
		this._redraw();
	};

	/**
	 * Export all entites on the screen and count them towards original image size.
	 * 
	 * @return {Object}
	 * @member $anonymizer
	 */
	$anonymizer.prototype.exportEntites = function() {
		var output = {
			actions: [],
			image: {
				width: this._imgWidth,
				height: this._imgHeight
			}
		};

		this._entites.forEach(function(entity) {
			switch (entity.id) {
				case $anonymizer.ENTITES.CIRCLE.id:
					output.actions.push({
						type: entity.id.toLowerCase(),
						x: Math.round(this._imgWidth * entity.xRatio),
						y: Math.round(this._imgHeight * entity.yRatio),
						r: entity.value
					});
					break;

				case $anonymizer.ENTITES.LINE.id:
					output.actions.push({
						type: entity.id.toLowerCase(),
						x1: Math.round(this._imgWidth * entity.xRatio),
						y1: Math.round(this._imgHeight * entity.yRatio),
						x2: Math.round(this._imgWidth * entity.x2Ratio),
						y2: Math.round(this._imgHeight * entity.y2Ratio),
						width: entity.value
					});
					break;
			}
		}, this);

		return output;
	};

	/**
	 * Resize canvas with new width and height.
	 * 
	 * @param  {Number} [width] New width in [px]
	 * @param  {Number} [height] New height in [px]
	 * @member $anonymizer
	 */
	$anonymizer.prototype.syncPort = function(width, height) {
		width = width || this._parent.offsetWidth;
		height = height || this._parent.offsetHeight;

		this._opts.canWidth = width;
		this._opts.canHeight = height;

		this._canvas.width = this._opts.canWidth;
		this._canvas.height = this._opts.canHeight;

		if (this._img) {
			this._postZoom();
			this._setCenter();
			this._alignImgToCanvas();
			this._drawEntityPreview();
			this._redraw();
		}
	};

	return $anonymizer;
}]);
