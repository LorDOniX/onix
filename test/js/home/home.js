homeApp = onix.module("homeApp", ["myModule", "menu"]);

homeApp.value("Config", {
	// homeApp localization
	LOCALIZATION: {
		LANG: "en",
		PATH: "/locale/en.json"
	},

	// homeApp resource URLs
	URLS: {
		HOME: "/api/home/"
	}
});

homeApp.config(["$i18nProvider", function($i18nProvider) {
	// if you are using underscore -> uncomment line below
	//$i18nProvider.disableGlobalTranslation();
	
	// add language during config phase
	$i18nProvider.addLanguage("cs", {
		"home_page": {
			"title": "Onix framework - testovací stránka"
		}
	});
}]);

homeApp.run([
	"$route",
	"$template",
	"Config",
	"$promise",
	"$i18n",
	"$i18nProvider",
	"$filterUppercase",
function(
	$route,
	$template,
	Config,
	$promise,
	$i18n,
	$i18nProvider,
	$filterUppercase
) {
	$i18n.setLanguage("en");

	console.log("app run - test for provider during run");
	console.log($i18nProvider);

	// route for home page
	var HomePage = {
		controller: ["HomePage", function(HomePage) {
			new HomePage({
				templ: "detail"
			});
		}],
		templateId: "detail",
		templateUrl: "/templ/detail.html",
		id: "HomePage"
	};

	// application routes
	$route
		.when("/", HomePage)
		.otherwise(HomePage);

	// all dependencies before start
	$promise.all([
		$template.load("testTempl", "/templ/test-templ.html"),
		$i18n.loadLanguage(Config.LOCALIZATION.LANG, Config.LOCALIZATION.PATH)
	]).then(function() {
		$route.go();
	}, function() {
		console.error("Error during app run");
	});
}]);
