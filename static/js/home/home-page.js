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
		},

		// ------------------------ public ----------------------------------------
		
		test: function() {
			console.log("btn click");
			console.log(arguments);
			console.log(Templates);
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
