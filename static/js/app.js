onix.config({
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

onix.run([
	"Route",
	"$template",
	"$config",
	"$q",
	"$i18n",
	"HomePage",
function(
	Route,
	$template,
	$config,
	$q,
	$i18n,
	HomePage
) {
	$i18n.setLanguage("en");

	Route.init();

	// application routes
	Route
		.when("/", {
			controller: function() {
				HomePage.setConfig({});
				HomePage.init();
			},
			templateUrl: "/js/home/test-templ.html",
			data: {
				a: 5
			}
		})
		.otherwise({
			controller: function() {
				HomePage.setConfig({});
				HomePage.init();
			}
		});

	// all dependencies before start
	$q.all([
		$template.load("testTempl", "/js/home/test-templ.html"),
		$i18n.loadLanguage($config.LOCALIZATION.LANG, $config.LOCALIZATION.PATH)
	]).then(function() {
		Route.go();
	}, function() {
		console.error("Error during app run");
	});
}]);
