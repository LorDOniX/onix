minimalApp = onix.module("minimalApp", ["menu"]);

minimalApp.run([
	"MainMenu",
function(
	MainMenu
) {
	MainMenu.create(MainMenu.PAGES.MINIMAL);

	var el = document.querySelector(".test");
	el.innerHTML = "Minimal script";

	var modules = Object.keys(onix._objects || {});
	var modEl = document.querySelector(".pager");

	modules.forEach(function(moduleName) {
		var moduleEl = document.createElement("li");
		moduleEl.innerHTML = '<a href="#">{NAME}</a>'.replace("{NAME}", moduleName);

		modEl.appendChild(moduleEl);
	});
}]);
