testApp.directive("HomeDir", [
	"$scope",
function(
	$scope
) {

	$scope.dirTest = function() {
		console.log("HomeDir dirTest function()");
	};
	
}]);
