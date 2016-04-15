onix.service("Route", [
	"$location",
	"$template",
function(
	$location,
	$template
) {
	/**
	 * All routes
	 *
	 * @private
	 * @type {Array}
	 */
	this._routes = [];

	/**
	 * Otherwise route
	 *
	 * @private
	 * @type {Object}
	 * @memberof route
	 */
	this._otherwise = null;

	/**
	 * Route init.
	 *
	 * @public
	 * @memberof route
	 */
	this.init = function() {
	};

	/**
	 * Add route to the router.
	 *
	 * @public
	 * @param  {String} url 
	 * @param  {Object} config
	 * @return {Himself}
	 * @memberof route
	 */
	this.when = function(url, config) {
		this._routes.push({
			url: url,
			config: config
		});

		return this;
	};

	/**
	 * Otherwise.
	 *
	 * @public
	 * @param  {String} page
	 * @param  {Object} config
	 * @return {Himself}
	 * @memberof route
	 */
	this.otherwise = function(config) {
		this._otherwise = {
			config: config
		};

		return this;
	};

	/**
	 * Run controller from route path
	 *
	 * @param  {String|Array|Function} contr
	 * @param  {Object} [contrData] 
	 */
	this._runController = function(contr, contrData) {
		if (typeof contr === "string") {
			var param = onix.getObject(contr);

			onix.bindDI(param, contrData)();
		}
		else if (Array.isArray(contr)) {
			onix.bindDI(contr, contrData)();
		}
		else if (typeof contr === "function") {
			contr.apply(contr, [contrData]);
		}
	};

	/**
	 * Route GO.
	 *
	 * @public
	 * @memberof route
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
			var templateUrl = null;
			var contr = null;
			var contrData = {};

			Object.keys(config).forEach(function(key) {
				var value = config[key];

				switch (key) {
					case "templateUrl":
						templateUrl = value;
						break;
						
					case "controller":
						contr = value;
						break;

					default:
						contrData[key] = value;
				}
			});

			if (templateUrl) {
				$template.load(config.templateUrl, config.templateUrl).done(function() {
					if (contr) {
						this._runController(contr, contrData);
					}
				}.bind(this));
			}
			else {
				if (contr) {
					this._runController(contr, contrData);
				}
			}
		}
	};
}]);
