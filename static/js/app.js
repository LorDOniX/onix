Onix.run([
	"Router",
function(
	Router
) {
	Router
		.route("/", "HomePage")
		.otherwise("HomePage");

	console.log("App run");
}]);
