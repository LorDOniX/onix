app.factory("HomePage", [
	"Page",
	"$common",
	"$template",
	"$loader",
	"$select",
	"$q",
	"HomeResource",
	"HomeSnippet",
	"myModule::TestFromModule",
	"$filter",
function(
	Page,
	$common,
	$template,
	$loader,
	$select,
	$q,
	HomeResource,
	HomeSnippet,
	TestFromModule,
	$filter
) {
	// test
	HomeSnippet.dirTest();

	TestFromModule.test();

	var HomePage = Page.create();

	console.log("Test of filter 'lowercase' : HI, HOW ARE YOU? -> " + $filter("lowercase")("HI, HOW ARE YOU?"));
	
	// ------------------------ private ---------------------------------------
	HomePage._afterInit = function() {
		// set title - using i18n get text _ function
		this._getEl("title").innerHTML = _("home_page.title");

		// this._testRequest();

		this._loadTemplate();

		// dropdowns
		var dropdown = new $select(this._getEl("dropdown"));

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

		// test for chaining promises
		$common.chainPromises([{
			method: "_testPromise1",
			scope: this,
			args: [5]
		}, {
			method: "_testPromise2",
			scope: this,
			args: [10]
		}, {
			method: function() {
				var promise = $q.defer();

				setTimeout(function() {
					promise.resolve("test promise 3 - " + $common.humanLength(123456789));
				}, 1000);

				return promise; 
			}
		}]).done(function(output) {
			console.log("All done");
			console.log(output);
		});
	};

	HomePage._testPromise1 = function(val) {
		var promise = $q.defer();

		setTimeout(function() {
			promise.resolve("test promise 1 - " + val);
		}, 1000);

		return promise;
	};

	HomePage._testPromise2 = function(val) {
		var promise = $q.defer();

		setTimeout(function() {
			promise.resolve("test promise 2 - " + val);
		}, 800);

		return promise;
	};

	/**
	 * Test request to API on express server.
	 */
	HomePage._testRequest = function() {
		HomeResource.get().then(function(data) {
			console.log(data);
		});
	};

	/**
	 * Load template to main template in index.html
	 * Compile against data object; bind to HomePage page
	 */
	HomePage._loadTemplate = function() {
		var el = onix.element(".placeholder").html($template.compile("testTempl", {
			name: "Name from HP",
			testObj: {
				a: 5,
				b: 6
			}
		}));

		$template.bindTemplate(el.getEl(), this);
	};

	HomePage.ed = function() {
		var el = document.elementFromPoint(6,316);

		var event = new MouseEvent('click', {
			'bubbles': true,
			'cancelable': true
		});

		el.dispatchEvent(event);
	};

	// ------------------------ public ----------------------------------------
	
	/**
	 * Test button click
	 * All arguments are parsed from the template
	 * @param  {ButtonElement} el
	 * @param  {MouseEvent} event
	 */
	HomePage.test = function(el, event) {
		console.log(el, event);

		// loader
		$loader.start();

		// test for once events
		this.trigger("onceEvent");
		this.trigger("anotherEvent");

		// test for off event
		this.off("anotherEvent");

		setTimeout(function() {
			$loader.end();
		}, 500);
	};

	/**
	 * Another test button for testing purpose.
	 */
	HomePage.test2 = function() {
		var expr = 10*5+2;

		if (expr) {
			console.log(expr);
		}
	};

	/**
	 * Bind click from the dynamic template to our page.
	 */
	HomePage.tmplBtn = function() {
		console.log("tmplBtn click");
	};

	/**
	 * Onkey down
	 */
	HomePage.onkd = function() {
		console.log("onkd");
	};

	return HomePage;

}]);
