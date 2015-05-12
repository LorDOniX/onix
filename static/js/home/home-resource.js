testApp.service("HomeResource", [
	"Http",
	"CONFIG",
function(
	Http,
	CONFIG
) {
	// ------------------------ private ---------------------------------------
	
	/**
	 * Base URL.
	 * @type {String}
	 */
	this._baseURL = CONFIG.URLS.HOME;

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
