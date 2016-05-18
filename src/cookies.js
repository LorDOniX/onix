/**
 * Functionality over browser cookies.
 *
 * @class $cookies
 */
onix.service("$cookies", function() {
	/**
	 * Get cookies by her name.
	 *
	 * @param  {String} name
	 * @return {String}
	 * @member $cookies
	 * @private
	 */
	this.get = function(name) {
		var cookieValue = null;

		if (document.cookie && document.cookie != '') {
			var cookies = document.cookie.split(';');

			cookies.every(function(cookie) {
				cookie = cookie.trim();

				if (cookie.substring(0, name.length + 1) == (name + '=')) {
					cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
					return false;
				}
				else return true;
			});
		}

		return cookieValue;
	};
});
