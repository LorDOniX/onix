app = onix.module("app", ["myModule"]);

app.value("Config", {
	// app localization
	LOCALIZATION: {
		LANG: "en",
		PATH: "/locale/en.json"
	},

	// app resource URLs
	URLS: {
		HOME: "/api/home/"
	},

	// for Page - detail css selector
	DETAIL_SEL: ".detail"
});

app.config(["$templateProvider", function($templateProvider) {
}]);

app.run([
	"$route",
	"$template",
	"Config",
	"$q",
	"$i18n",
function(
	$route,
	$template,
	Config,
	$q,
	$i18n
) {
	$i18n.setLanguage("en");

	// application routes
	$route
		.when("/", {
			controller: ["HomePage", function(HomePage) {
				HomePage.setConfig({});
				HomePage.init();
			}],
			templateUrl: "/templ/test-templ.html",
			a: 5
		})
		.otherwise({
			controller: ["HomePage", function(HomePage) {
				HomePage.setConfig({});
				HomePage.init();
			}]
		});

	// all dependencies before start
	$q.all([
		$template.load("testTempl", "/templ/test-templ.html"),
		$i18n.loadLanguage(Config.LOCALIZATION.LANG, Config.LOCALIZATION.PATH)
	]).then(function() {
		$route.go();
	}, function() {
		console.error("Error during app run");
	});
}]);
