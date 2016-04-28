app.factory("HomeSnippet", [
	"Snippet",
	"TestFromModule",
function(
	Snippet,
	TestFromModule
) {

	TestFromModule.test();

	var HomeSnippet = Snippet.create();

	HomeSnippet.dirTest = function() {
		console.log("HomeDir dirTest function()");
	};

	return HomeSnippet;
	
}]);
