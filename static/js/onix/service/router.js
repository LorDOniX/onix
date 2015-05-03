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
	 * @type {String}
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
	 * @return {Himself}
	 */
	this.route = function(url, page) {
		this._routes.push({
			url: url,
			page: page
		});

		return this;
	};

	/**
	 * Otherwise
	 * @param  {String} page
	 * @return {Himself}
	 */
	this.otherwise = function(page) {
		this._otherwise = page;

		return this;
	};

	/**
	 * Router GO.
	 */
	this.go = function() {
		var path = $location.get();
		var find = false;
		var page = "";

		this._routes.forEach(function(item) {
			if (path.match(new RegExp(item.url))) {
				page = item.page;
			}
		});

		if (!find && this._otherwise) {
			page = this._otherwise;
		}

		if (page) {
			var pageObj = Onix.getObject(page);

			if (pageObj) {
				pageObj._setConfig({});
				pageObj._init();
			}
		}
	};
}]);
