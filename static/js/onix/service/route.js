/**
 * @namespace $route
 * @description DI: $location, $template;
 */
onix.service("$route", [
	"$routeParams",
	"$location",
	"$template",
function(
	$routeParams,
	$location,
	$template
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
			Object.keys($routeParams).forEach(function(key) {
				delete $routeParams[key];
			});

			var contr = null;
			
			var runContr = function(ctrl) {
				if (ctrl) {
					onix.runController(config.controller);
				}
			};

			Object.keys(config).forEach(function(key) {
				switch (key) {
					case "templateUrl":
						$template.load(config.templateUrl, config.templateUrl).done(function() {
							
						});

					case "controller":
						contr = config[key];
						break;

					default:
						$routeParams[key] = config[key];
				}
			});

			if (contr) {
				
				onix.runController(config.controller);
			}
			else if (config.templateUrl) {
				
			}
		}
	};
}]);
