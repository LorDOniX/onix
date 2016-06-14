/**
 * Support class for location operations.
 * 
 * @class $location
 */
onix.service("$location", function() {
	// ------------------------ public ----------------------------------------
	
	/**
	 * Page refresh.
	 *
	 * @member $location
	 */
	this.refresh = function() {
		window.location.reload();
	};

	/**
	 * Create a new search url.
	 * 
	 * @param  {Object} obj
	 * @return {String}
	 * @member $location
	 */
	this.createSearchURL = function(obj) {
		var newURL = [];

		if (obj) {
			// write
			var newURL = [];

			Object.keys(obj).forEach(function(key) {
				newURL.push(encodeURIComponent(key) + "=" + encodeURIComponent(obj[key]));
			});
		}

		if (newURL.length) {
			return "?" + newURL.join("&");
		}
		else return "";
	};

	/**
	 * Get or set new url search. obj -> set new url from obj; !obj -> create obj from search part of url.
	 *
	 * @param  {Object} [obj]
	 * @return {Object}
	 * @member $location
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
					var name = decodeURIComponent(parts[0]);
					
					output[name] = decodeURIComponent(parts[1]);
				});
			}

			return output;
		}
	};

	/**
	 * Get current location.
	 *
	 * @return {String}
	 * @member $location
	 */
	this.get = function() {
		return window.location.pathname;
	};
	
});
