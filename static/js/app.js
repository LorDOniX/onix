testApp = onix.module("testApp", []);

testApp.config(function() {
	console.log("app config");
});

testApp.run([
	"$route",
	"$template",
	"$config",
	"$q",
	"$i18n",
function(
	$route,
	$template,
	$config,
	$q,
	$i18n
) {
	// application routes
	$route
		.when("/", {
			controller: "HomePage",
			templateUrl: "/js/home/test-templ.html",
			data: {
				a: 5
			}
		})
		.otherwise({
			controller: "HomePage"
		});

	// all dependencies before start
	return $q.all([
		$template.load("testTempl", "/js/home/test-templ.html"),
		$i18n.loadLanguage($config.LOCALIZATION.LANG, $config.LOCALIZATION.PATH)
	]);
}]);
