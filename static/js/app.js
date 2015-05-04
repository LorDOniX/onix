Onix.run([
	"Router",
function(
	Router
) {
	// application routes
	Router
		.route("/", "HomePage", function() {
			return {
				PAGE_CONFIG: {
					a: 5
				}
			}
		})
		.otherwise("HomePage");
}]);
