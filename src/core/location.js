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
	 * Create a new search url. This method appends ? to the start of the url.
	 * 
	 * @param  {Object} obj
	 * @return {String}
	 * @member $location
	 */
	this.createSearchURL = function(obj) {
		let url = this.objToURL(obj);

		return url ? "?" + url : "";
	};

	/**
	 * Object to url.
	 * 
	 * @param  {Array|Object} { name: x, value: y} | obj Mapping key -> name, value -> value.
	 * @return {String}
	 * @member $location
	 */
	this.objToURL = function(obj) {
		let url = [];

		if (Array.isArray(obj)) {
			obj.forEach(item => {
				url.push(encodeURIComponent(item.name) + "=" + encodeURIComponent(item.value));
			});
		}
		else if (typeof obj === "object") {
			Object.keys(obj).forEach(key => {
				url.push(encodeURIComponent(key) + "=" + encodeURIComponent(obj[key]));
			});
		}

		return url.join("&");
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
			let newURL = this.createSearchURL(obj);

			if (newURL) {
				window.location.search = newURL;
			}
		}
		else {
			// read
			let data = location.search;
			let output = {};

			if (data) {
				data = data.replace("?", "");

				data.split("&").forEach(item => {
					let parts = item.split("=");
					let name = decodeURIComponent(parts[0]);
					
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
