/**
 * @namespace Router
 * @description DI: $location;
 */
onix.service("Router", [
	"$location",
function(
	$location
) {
	/**
	 * All routes
	 *
	 * @private
	 * @type {Array}
	 * @memberof Router
	 */
	this._routes = [];

	/**
	 * Otherwise route
	 *
	 * @private
	 * @type {Object}
	 * @memberof Router
	 */
	this._otherwise = null;

	/**
	 * Router init.
	 *
	 * @public
	 * @memberof Router
	 */
	this.init = function() {
	};

	/**
	 * Add route to router.
	 *
	 * @public
	 * @param  {String} url 
	 * @param  {String} page
	 * @param  {Function} [fn]
	 * @return {Himself}
	 * @memberof Router
	 */
	this.route = function(url, page, fn) {
		this._routes.push({
			url: url,
			page: page,
			fn: fn
		});

		return this;
	};

	/**
	 * Otherwise
	 *
	 * @public
	 * @param  {String} page
	 * @param  {Function} [fn]
	 * @return {Himself}
	 * @memberof Router
	 */
	this.otherwise = function(page, fn) {
		this._otherwise = {
			page: page,
			fn: fn
		};

		return this;
	};

	/**
	 * Router GO.
	 *
	 * @public
	 * @memberof Router
	 */
	this.go = function() {
		var path = $location.get();
		var find = false;
		var page = "";
		var data = {};

		this._routes.every(function(item) {
			if (path.match(new RegExp(item.url))) {
				page = item.page;
				data = item.fn();
				find = true;
				
				return false;
			}
			else {
				return true;
			}
		});

		if (!find && this._otherwise) {
			page = this._otherwise.page;
			data = this._otherwise.fn();
		}

		if (page) {
			var pageObj = Onix.getObject(page);

			if (pageObj) {
				pageObj._setConfig(data);
				pageObj._init();
			}
		}
	};
}]);
