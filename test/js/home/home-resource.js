homeApp.service("HomeResource", [
	"$http",
	"Config",
function(
	$http,
	Config
) {
	
	// ------------------------ private ---------------------------------------
	/**
	 * Base URL.
	 * @type {String}
	 */
	this._baseURL = Config.URLS.HOME;

	// ------------------------ public ----------------------------------------

	/**
	 * Get test data.
	 * @return {$promise}
	 */
	this.get = function() {
		return $http.createRequest({
			url: this._baseURL
		});
	};
}]);
