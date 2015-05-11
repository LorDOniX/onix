Onix.factory("HomePage", [
	"Page",
	"HomeResource",
	"Common",
	"Templates",
function(
	Page,
	HomeResource,
	Common,
	Templates
) {
	return Page.create(["Events"], {
		// ------------------------ private ---------------------------------------
		
		_afterInit: function() {
			HomeResource.get().then(function(data) {
				console.log(data);
			});

			var el = Onix.element(".placeholder").html(Templates.compile("testTempl", {
				name: "Name from HP"
			}));

			Templates.bindTemplate(el.getEl(), this);

			this.once("onceEvent", function() {
				console.log("onceEvent");
			});

			this.on("aaa", function() {
				console.log("aaa event");
			});

			this.once("onceEvent", function() {
				console.log("onceEvent2");
			});
		},

		// ------------------------ public ----------------------------------------
		
		test: function() {
			console.log("btn click");
			console.log(arguments);
			console.log(Templates);
			
			this.trigger("onceEvent");
			this.trigger("aaa");
			this.off("aaa");
		},

		test2: function() {
			console.log("btn click2");
			Common.ift(10*5+2, function(expr) {
				console.log(expr);
			});
		},

		tmplBtn: function() {
			console.log("tmplBtn click");
		}
	});
}]);
