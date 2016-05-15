/**
 * Many useful alghoritms.
 * 
 * @class $math
 */
onix.service("$math", function() {
	/**
	 * Is there two bounding box intersection?
	 * 
	 * @param  {Object} bbox1
	 * @param  {Number} bbox1.x Left top coordinates - axe x
	 * @param  {Number} bbox1.y Left top coordinates - axe y
	 * @param  {Number} bbox1.width Width of the bbox
	 * @param  {Number} bbox1.height Height of the bbox
	 * @param  {Object} bbox2
	 * @param  {Number} bbox2.x Left top coordinates - axe x
	 * @param  {Number} bbox2.y Left top coordinates - axe y
	 * @param  {Number} bbox2.width Width of the bbox
	 * @param  {Number} bbox2.height Height of the bbox
	 * @return {Boolean}
	 * @member $math
	 */
	this.isBBoxIntersection = function(bbox1, bbox2) {
		var ltx = Math.max(bbox1.x, bbox2.x);
		var lty = Math.max(bbox1.y, bbox2.y);
		var rbx = Math.min(bbox1.x + bbox1.width, bbox2.x + bbox2.width);
		var rby = Math.min(bbox1.y + bbox1.height, bbox2.y + bbox2.height);

		// width and height of intesection has to be higher than 0
		var width = Math.abs(rbx - ltx);
		var height = Math.abs(rby - lty);

		if (ltx <= rbx && lty <= rby && width * height > 0) {
			return true;
		}
		else {
			return false;
		}
	};

	/**
	 * Get BBox from points.
	 * 
	 * @param  {Object[]} points
	 * @param  {Number} points.x Coordinate on axe x
	 * @param  {Number} points.y Coordinate on axe y
	 * @return {Object} Output bbox with x, y, width and height variables
	 * @member $math
	 */
	this.getBBox = function(points) {
		var minX = Infinity;
		var minY = Infinity;
		var maxX = -Infinity;
		var maxY = -Infinity;

		// for each point
		for (var i = 0; i < points.length; i++) {
			minX = Math.min(points[i].x, minX);
			minY = Math.min(points[i].y, minY);
			maxX = Math.max(points[i].x, maxX);
			maxY = Math.max(points[i].y, maxY);
		}

		return {
			x: minX,
			y: minY,
			width: Math.abs(maxX - minX),
			height: Math.abs(maxY - minY)
		};
	};

	/**
	 * Determinant 2x2 count.
	 * 
	 * @param {Number} x1
	 * @param {Number} x2
	 * @param {Number} y1
	 * @param {Number} y2
	 * @returns {Number}
	 * @member $math
	 */
	this.det2 = function(x1, x2, y1, y2) {
		return (x1 * y2 - y1 * x2);
	};

	/**
	 * Intersection of two lines.
	 * 
	 * @param  {Object} firstLine
	 * @param  {Object} firstLine.x1 Line start axe x
	 * @param  {Object} firstLine.y1 Line start axe y
	 * @param  {Object} firstLine.x2 Line end axe x
	 * @param  {Object} firstLine.y2 Line end axe y
	 * @param  {Object} secondLine
	 * @param  {Object} secondLine.x1 Line start axe x
	 * @param  {Object} secondLine.y1 Line start axe y
	 * @param  {Object} secondLine.x2 Line end axe x
	 * @param  {Object} secondLine.y2 Line end axe y
	 * @returns {Object} Intersection point x, y
	 * @member $math
	 */
	this.linesIntersection = function(firstLine, secondLine) {
		var TOLERANCE = 0.000001;

		var a = this._det2(firstLine.x1 - firstLine.x2, firstLine.y1 - firstLine.y2, secondLine.x1 - secondLine.x2, secondLine.y1 - secondLine.y2);
		if (Math.abs(a) < TOLERANCE) return null; // lines are parallel

		var d1 = this._det2(firstLine.x1, firstLine.y1, firstLine.x2, firstLine.y2);
		var d2 = this._det2(secondLine.x1, secondLine.y1, secondLine.x2, secondLine.y2);
		var x = this._det2(d1, firstLine.x1 - firstLine.x2, d2, secondLine.x1 - secondLine.x2) / a;
		var y = this._det2(d1, firstLine.y1 - firstLine.y2, d2, secondLine.y1 - secondLine.y2) / a;

		if (x < Math.min(firstLine.x1, firstLine.x2) - TOLERANCE || x > Math.max(firstLine.x1, firstLine.x2) + TOLERANCE) return null
		if (y < Math.min(firstLine.y1, firstLine.y2) - TOLERANCE || y > Math.max(firstLine.y1, firstLine.y2) + TOLERANCE) return null
		if (x < Math.min(secondLine.x1, secondLine.x2) - TOLERANCE || x > Math.max(secondLine.x1, secondLine.x2) + TOLERANCE) return null
		if (y < Math.min(secondLine.y1, secondLine.y2) - TOLERANCE || y > Math.max(secondLine.y1, secondLine.y2) + TOLERANCE) return null

		return {
			x: Math.round(x),
			y: Math.round(y)
		};
	};
});
