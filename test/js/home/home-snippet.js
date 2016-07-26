homeApp.factory("HomeSnippet", [
	"$common",
	"Snippet",
	"TestFromModule",
function(
	$common,
	Snippet,
	TestFromModule
) {
	class HomeSnippet extends Snippet {
		constructor(config, parent) {
			super(config, parent);

			TestFromModule.test();
		}

		dirTest() {
			console.log("HomeDir dirTest function()");
		}
	}

	return HomeSnippet;
}]);
