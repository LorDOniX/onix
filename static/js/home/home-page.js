Onix.factory("HomePage", [
	"Page",
	"HomeResource",
function(
	Page,
	HomeResource
) {
	return Page.create(["Events"], {
		// ------------------------ private ---------------------------------------
		
		_afterInit: function() {
			HomeResource.get().then(function(data) {
				console.log(data);
			});
		},

		// ------------------------ public ----------------------------------------
		
		test: function() {
			console.log("btn click");
			console.log(arguments);
		}

	});
}]);
