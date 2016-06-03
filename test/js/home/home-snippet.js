homeApp.factory("HomeSnippet", [
	"$common",
	"Snippet",
	"TestFromModule",
function(
	$common,
	Snippet,
	TestFromModule
) {
	var HomeSnippet = function(config, parent) {
		this._constructor(config, parent);

		TestFromModule.test();
	};

	$common.inherit(HomeSnippet, Snippet);

	HomeSnippet.prototype.dirTest = function() {
		console.log("HomeDir dirTest function()");
	};

	return HomeSnippet;
}]);
