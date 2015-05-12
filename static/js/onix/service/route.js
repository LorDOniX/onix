/**
 * @namespace $route
 * @description DI: $location;
 */
onix.service("$route", [
	"$location",
function(
	$location
) {
	/**
	 * All routes
	 *
	 * @private
	 * @type {Array}
	 * @memberof $route
	 */
	this._routes = [];

	/**
	 * Otherwise route
	 *
	 * @private
	 * @type {Object}
	 * @memberof $route
	 */
	this._otherwise = null;

	/**
	 * $route init.
	 *
	 * @public
	 * @memberof $route
	 */
	this.init = function() {
	};

	/**
	 * Add route to router.
	 *
	 * @public
	 * @param  {String} url 
	 * @param  {Object} config
	 * @return {Himself}
	 * @memberof $route
	 */
	this.when = function(url, config) {
		this._routes.push({
			url: url,
			config: config
		});

		return this;
	};

	/**
	 * Otherwise
	 *
	 * @public
	 * @param  {String} page
	 * @param  {Object} config
	 * @return {Himself}
	 * @memberof $route
	 */
	this.otherwise = function(config) {
		this._otherwise = {
			config: config
		};

		return this;
	};

	/**
	 * $route GO.
	 *
	 * @public
	 * @memberof $route
	 */
	this.go = function() {
		var path = $location.get();
		var find = false;
		var config = null;
		var data = {};

		this._routes.every(function(item) {
			if (path.match(new RegExp(item.url))) {
				config = item.config;
				find = true;
				
				return false;
			}
			else {
				return true;
			}
		});

		if (!find && this._otherwise) {
			config = this._otherwise.config;
		}

		if (config) {
			if (typeof config.controller === "string") {
				var param = onix.getObject(config.controller);
				onix.DI(param, {
					$scope: { a: 5 }
				}).run();
			}
			else if (Array.isArray(config.controller)) {
				onix.DI(config.controller).run();
			}
			else if (typeof config.controller === "function") {
				config.controller.apply(config.controller, []);
			}
		}
	};
}]);
