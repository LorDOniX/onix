Onix.service("Router", [
	"$location",
function(
	$location
) {
	// ------------------------ private ---------------------------------------
	
	/**
	 * All routes
	 * @type {Array}
	 */
	this._routes = [];

	/**
	 * Otherwise route
	 * @type {Object}
	 */
	this._otherwise = null;

	// ------------------------ public ----------------------------------------
	
	/**
	 * Router init.
	 */
	this.init = function() {
	};

	/**
	 * Add route to router.
	 * @param  {String} url 
	 * @param  {String} page
	 * @param  {Function} [fn]
	 * @return {Himself}
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
	 * @param  {String} page
	 * @param  {Function} [fn]
	 * @return {Himself}
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
