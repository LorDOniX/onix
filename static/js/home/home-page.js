testApp.factory("HomePage", [
	"Page",
	"HomeResource",
	"Common",
	"Templates",
	"Loader",
	"Select",
function(
	Page,
	HomeResource,
	Common,
	Templates,
	Loader,
	Select
) {
	return Page.create(["Events"], {
		// ------------------------ private ---------------------------------------
		
		_afterInit: function() {
			// set title - using i18n get text _ function
			this._getEl("title").innerHTML = _("home_page.title");

			// this._testRequest();

			this._loadTemplate();

			// dropdowns
			var dropdown = new Select(this._getEl("dropdown"));

			dropdown.on("change", function(value) {
				console.log("dropdown change - " + value);
			}, this);

			// events
			this.once("onceEvent", function() {
				console.log("onceEvent");
			});

			this.on("anotherEvent", function() {
				console.log("anotherEvent");
			});

			this.once("onceEvent", function() {
				console.log("onceEvent - another function");
			});
		},

		/**
		 * Test request to API on express server.
		 */
		_testRequest: function() {
			HomeResource.get().then(function(data) {
				console.log(data);
			});
		},

		/**
		 * Load template to main template in index.html
		 * Compile against data object; bind to this page
		 */
		_loadTemplate: function() {
			var el = onix.element(".placeholder").html(Templates.compile("testTempl", {
				name: "Name from HP"
			}));

			Templates.bindTemplate(el.getEl(), this);
		},

		// ------------------------ public ----------------------------------------
		
		/**
		 * Test button click
		 * All arguments are parsed from the template
		 * @param  {ButtonElement} el
		 * @param  {MouseEvent} event
		 */
		test: function(el, event) {
			console.log(el, event);

			// loader
			Loader.start();

			// test for once events
			this.trigger("onceEvent");
			this.trigger("anotherEvent");

			// test for off event
			this.off("anotherEvent");

			setTimeout(function() {
				Loader.end();
			}, 500);
		},

		/**
		 * Another test button for testing purpose.
		 */
		test2: function() {
			Common.ift(10*5+2, function(expr) {
				console.log(expr);
			});
		},

		/**
		 * Bind click from the dynamic template to our page.
		 */
		tmplBtn: function() {
			console.log("tmplBtn click");
		}
	});
}]);
