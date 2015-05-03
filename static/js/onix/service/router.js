Onix.service("Router", [
	"$location",
function($location) {
	// ------------------------ private ---------------------------------------
	
	this._routes = [];
	this._otherwise = null;

	// ------------------------ public ----------------------------------------
	
	/**
	 * Router init.
	 */
	this.init = function() {
	};

	this.route = function(url, page) {
		this._routes.push({
			url: url,
			page: page
		});

		return this;
	};

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
