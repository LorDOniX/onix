onix.service("HomeResource", [
	"$http",
	"$config",
function(
	$http,
	$config
) {
	// ------------------------ private ---------------------------------------
	/**
	 * Base URL.
	 * @type {String}
	 */
	this._baseURL = $config.URLS.HOME;

	// ------------------------ public ----------------------------------------

	/**
	 * Get test data.
	 * @return {$q}
	 */
	this.get = function() {
		return $http.createRequest({
			url: this._baseURL
		});
	};
}]);
