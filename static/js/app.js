Onix.run([
	"Router",
	"Templates",
function(
	Router,
	Templates
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

	// preload templates
	Templates.preload("mujTempl", "/js/home/test-templ.html");
}]);
