testApp = onix.module("testApp");

testApp.config({
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

testApp.run([
	"$route",
	"$template",
	"$config",
	"$q",
	"$i18n",
	"HomePage",
function(
	$route,
	$template,
	$config,
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
		$route.go();
	}, function() {
		console.error("Error during app run");
	});
}]);
