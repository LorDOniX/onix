onix.value("Config", {
	// app localization
	LOCALIZATION: {
		LANG: "en",
		PATH: "/js/locale/en.json"
	},

	// app resource URLs
	URLS: {
		HOME: "/api/home/"
	},

	// for Page - detail css selector
	DETAIL_SEL: ".detail"
});

onix.config(["$templateProvider", function($templateProvider) {
}]);

onix.run([
	"$route",
	"$template",
	"Config",
	"$q",
	"$i18n",
	"HomePage",
function(
	$route,
	$template,
	Config,
	$q,
	$i18n,
	HomePage
) {
	$i18n.setLanguage("en");

	// application routes
	$route
		.when("/", {
			controller: function() {
				HomePage.setConfig({});
				HomePage.init();
			},
			templateUrl: "/js/test-templ.html"
		})
		.otherwise({
			controller: function() {
				HomePage.setConfig({});
				HomePage.init();
			}
		});

	// all dependencies before start
	$q.all([
		$template.load("testTempl", "/js/test-templ.html"),
		$i18n.loadLanguage(Config.LOCALIZATION.LANG, Config.LOCALIZATION.PATH)
	]).then(function() {
		$route.go();
	}, function() {
		console.error("Error during app run");
	});
}]);
