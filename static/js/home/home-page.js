Onix.factory("HomePage", [
	"API",
	"Page",
	"HomeResource",
function(
	API,
	Page,
	HomeResource
) {
	return API.inherit(Page, {
		// ------------------------ private ---------------------------------------
		
		_afterInit: function() {
			console.log("Yeah! Application is working :)");

			HomeResource.get().then(function(data) {
				console.log("Resource data");
				console.log(data);
			});
		}

		// ------------------------ public ----------------------------------------

	});
}]);
