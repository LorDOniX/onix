testApp = onix.module("testApp", []);

testApp.config(function(config) {
	config.LOCALIZATION.LANG = "en";
	config.LOCALIZATION.PATH = "/js/locale/en.json";
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
	$i18n.setLanguage("en");

	// application routes
	$route
		.when("/", {
			controller: "HomeCtrl",
			templateUrl: "/js/home/test-templ.html",
			data: {
				a: 5
			}
		})
		.otherwise({
			controller: "HomeCtrl"
		});

	// all dependencies before start
	return $q.all([
		$template.load("testTempl", "/js/home/test-templ.html"),
		$i18n.loadLanguage($config.LOCALIZATION.LANG, $config.LOCALIZATION.PATH)
	]);
}]);
