/**
 * @namespace $location
 */
Onix.service("$location", function() {
	// ------------------------ public ----------------------------------------
	
	/**
	 * Page refresh.
	 *
	 * @public
	 * @memberof $location
	 */
	this.refresh = function() {
		window.location.reload();
	};

	/**
	 * Create a new search url.
	 * 
	 * @public
	 * @param  {Object} obj
	 * @return {String}
	 * @memberof $location
	 */
	this.createSearchURL = function(obj) {
		var newURL = [];

		if (obj) {
			// write
			var newURL = [];

			Object.keys(obj).forEach(function(key) {
				newURL.push(key + "=" + encodeURIComponent(obj[key]));
			});
		}

		if (newURL.length) {
			return "?" + newURL.join("&");
		}
		else return "";
	};

	/**
	 * Get or set new url search. obj -> set new url from obj; !obj -> create obj from search part of url
	 *
	 * @public
	 * @param  {Object} [obj]
	 * @return {Null|Object}
	 * @memberof $location
	 */
	this.search = function(obj) {
		if (obj) {
			// write
			var newURL = this.createSearchURL(obj);

			if (newURL) {
				window.location.search = newURL;
			}
		}
		else {
			// read
			var data = location.search;
			var output = {};

			if (data) {
				data = data.replace("?", "");

				data.split("&").forEach(function(item) {
					var parts = item.split("=");
					
					output[parts[0]] = decodeURIComponent(parts[1]);
				});
			}

			return output;
		}
	};

	/**
	 * Get current location
	 *
	 * @public
	 * @return {String}
	 * @memberof $location
	 */
	this.get = function() {
		return window.location.pathname;
	};
	
});
