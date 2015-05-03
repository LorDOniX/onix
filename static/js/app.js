Onix.run([
	"Router",
function(
	Router
) {
	// application routes
	Router
		.route("/", "HomePage")
		.otherwise("HomePage");
}]);
