testApp = onix.module("testApp", []);

testApp.config(function() {
	console.log("app config");
});

testApp.run([
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
	Templates.preload("testTempl", "/js/home/test-templ.html");
}]);
