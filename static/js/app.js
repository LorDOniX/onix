testApp = onix.module("testApp", []);

testApp.config(function() {
	console.log("app config");
});

testApp.run([
	"Router",
	"Templates",
	"CONFIG",
	"Promise",
	"i18n",
function(
	Router,
	Templates,
	CONFIG,
	Promise,
	i18n
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

	// all dependencies before start
	Promise.all([
		Templates.load("testTempl", "/js/home/test-templ.html"),
		i18n.loadLanguage(CONFIG.LOCALIZATION.LANG, CONFIG.LOCALIZATION.PATH)
	]).done(function() {
		// router go
		Router.go();
	});
}]);
