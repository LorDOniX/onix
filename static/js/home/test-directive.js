testApp.directive("HomePageDir", [
	"$scope",
function(
	$scope
) {

	$scope.dirTest = function() {
		console.log("dir test");
	};
	
}]);
