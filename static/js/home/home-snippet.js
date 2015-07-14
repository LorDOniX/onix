testApp.factory("HomeSnippet", [
	"Snippet",
function(
	Snippet
) {

	var HomeSnippet = Snippet.create();

	HomeSnippet.dirTest = function() {
		console.log("HomeDir dirTest function()");
	};

	return HomeSnippet;
	
}]);
