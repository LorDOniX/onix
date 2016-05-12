app.factory("HomePage", [
	"Page",
	"$common",
	"$template",
	"$loader",
	"$select",
	"$q",
	"$promise",
	"HomeResource",
	"HomeSnippet",
	"myModule::TestFromModule",
	"$filter",
	"$i18n",
	"$routeParams",
function(
	Page,
	$common,
	$template,
	$loader,
	$select,
	$q,
	$promise,
	HomeResource,
	HomeSnippet,
	TestFromModule,
	$filter,
	$i18n,
	$routeParams
) {

	var HomePage = Page.create();
	
	// ------------------------ private ---------------------------------------
	HomePage._afterInit = function() {
		// set title - using i18n get text _ function
		this._getEl("title").innerHTML = _("home_page.title");

		this._loadTemplate();

		// dropdowns
		var dropdown = new $select(this._getEl("dropdown"));
		var dropdown2 = new $select(this._getEl("dropdown2"), {
			addCaption: true
		});

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

		var langTest = function() {
			$i18n.setLanguage("cs");
			this._getEl("title").innerHTML = _("home_page.title");
			$i18n.setLanguage("en");
			console.log("Website title has changed!");
		}.bind(this);

		$template.bindTemplate(el.getEl(), {
			onkd: function() {
				console.log("On key down");
			},

			/**
			 * Bind click from the dynamic template to our page.
			 */
			tmplBtn: function() {
				console.log("Dynamic template button click");
			},

			langTest: langTest
		});
	};

	// ------------------------ public ----------------------------------------
	
	/**
	 * Test button click
	 * All arguments are parsed from the template
	 * @param  {ButtonElement} el
	 * @param  {MouseEvent} event
	 */
	HomePage.buttonClick = function(el, event) {
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

	HomePage.filterTest = function() {
		console.log("Test of filter 'lowercase' : HI, HOW ARE YOU? -> " + $filter("lowercase")("HI, HOW ARE YOU?"));
	};

	HomePage.snippetTest = function() {
		HomeSnippet.dirTest();
	};

	HomePage.moduleTest = function() {
		TestFromModule.test();
	};

	/**
	 * Test request to API on express server.
	 */
	HomePage.apiTest = function() {
		HomeResource.get().then(function(data) {
			console.log(data);
		});
	};

	HomePage.chp = function() {
		// test for chaining promises
		console.log("chainPromises start...");

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

	HomePage.routeParams = function() {
		console.log("routeParams");
		console.log($routeParams);
	};

	HomePage.promiseTest = function() {
		var promise1 = new $promise(function(resolve) {
			setTimeout(function() {
				resolve();
			}, 500);
		});

		var promise2 = new $promise(function(resolve, reject) {
			setTimeout(function() {
				reject();
			}, 300);
		});

		$promise.all([promise1, promise2]).then(function() {
			console.log("$promise all done");
		});

		$promise.reject().then(function() {}, function() {
			console.log("$promise rejected");
		});
	};

	HomePage.allTests = function() {
		console.log("Running all tests...");

		this.filterTest();
		this.snippetTest();
		this.moduleTest();
		this.apiTest();
		this.chp();
		this.routeParams();
		this.promiseTest();
	};

	return HomePage;
}]);
