Onix.service("HomeResource", [
	"Http",
function(
	Http
) {
	// ------------------------ private ---------------------------------------
	
	/**
	 * Base URL.
	 * @type {String}
	 */
	this._baseURL = Onix.config("URLS").HOME;

	// ------------------------ public ----------------------------------------

	/**
	 * Get test data.
	 * @return {Promise}
	 */
	this.get = function() {
		return Http.createRequest({
			url: this._baseURL
		});
	};
}]);
