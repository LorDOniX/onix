Onix.factory("HomePage", [
	"API",
	"Page",
function(
	API,
	Page
) {
	return API.inherit(Page, {
		// ------------------------ private ---------------------------------------
		
		_afterInit: function() {
			console.log("Yeah! Application is working :)")
		}

		// ------------------------ public ----------------------------------------

	});
}]);
