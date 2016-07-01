homeApp.factory("HomePage", [
	"$common",
	"$date",
	"$event",
	"$filter",
	"$i18n",
	"$image",
	"$loader",
	"$math",
	"$previewImages",
	"$promise",
	"$resize",
	"$routeParams",
	"$select",
	"$template",
	"HomeResource",
	"HomeSnippet",
	"MainMenu",
	"Page",
	"myModule::TestFromModule",
function(
	$common,
	$date,
	$event,
	$filter,
	$i18n,
	$image,
	$loader,
	$math,
	$previewImages,
	$promise,
	$resize,
	$routeParams,
	$select,
	$template,
	HomeResource,
	HomeSnippet,
	MainMenu,
	Page,
	TestFromModule
) {

	class HomePage extends Page {
		constructor(config) {
			super();

			this._constructor(config);
		}

		// ------------------------ private ---------------------------------------
		_show() {
			// set title - using i18n get text _ function
			this._getEl("title").innerHTML = _("home_page.title");

			$resize.start();
			$resize.on("resize", function() {
				console.log("resize event");
			});

			this._loadTemplate();

			MainMenu.create(MainMenu.PAGES.HOME);

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
		}

		_testPromise1(val) {
			return new $promise(function(resolve) {
				setTimeout(function() {
					resolve("test promise 1 - " + val);
				}, 1000);
			});
		}

		_testPromise2(val) {
			return new $promise(function(resolve) {
				setTimeout(function() {
					resolve("test promise 2 - " + val);
				}, 800);
			});
		}

		/**
		 * Load template to main template in index.html
		 * Compile against data object; bind to HomePage page
		 */
		_loadTemplate() {
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
		}

		// ------------------------ public ----------------------------------------
		
		/**
		 * Test button click
		 * All arguments are parsed from the template
		 * @param  {ButtonElement} el
		 * @param  {MouseEvent} event
		 */
		buttonClick(el, event) {
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
		}

		filterTest() {
			console.log("Test of filter 'lowercase' : HI, HOW ARE YOU? -> " + $filter("lowercase")("HI, HOW ARE YOU?"));
		}

		snippetTest() {
			var homeSnippet = new HomeSnippet();
			homeSnippet.dirTest();
		}

		moduleTest() {
			TestFromModule.test();
		}

		/**
		 * Test request to API on express server.
		 */
		apiTest() {
			HomeResource.get().then(function(data) {
				console.log(data);
			});
		}

		chp() {
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
					return new $promise(function(resolve) {
						setTimeout(function() {
							resolve("test promise 3 - " + $common.formatSize(123456789));
						}, 1000);
					});
				}
			}]).then(function(output) {
				console.log("All done");
				console.log(output);
			});
		}

		routeParams() {
			console.log("routeParams");
			console.log($routeParams);
		}

		promiseTest() {
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

			var race1 = new $promise(function(resolve) {
				setTimeout(function() {
					resolve({ a: 10 });
				}, 500);
			});

			var race2 = new $promise(function(resolve) {
				setTimeout(function() {
					resolve({ a: 25 });
				}, 300);
			});

			$promise.race([race1, race2]).then(function(data) {
				console.log("$race is done");
				console.log(data);
			});

			$promise.reject().then(function() {}, function() {
				console.log("$promise rejected");
			});
		}

		uploadChange() {
			var uploadPreview = this._getEl("uploadPreview");
			var filesInput = this._getEl("uploadInput");

			$previewImages.show(uploadPreview, filesInput.files, {
				maxSize: 180,
				count: 2,
				createHolder: true
			});
		}

		mathAndDate() {
			$common.col("2016-06-31 to CS date = {0}", $date.dateENtoCS("2016-06-31"));
			$common.col("2016-06-31 is CS date? {0}",  $date.isCSdate("2016-06-31") ? "yes" : "no");
			$common.col("zoomToDistance = {0}", $math.zoomToDistance(15, 45, 1024));

			var p = { 
				x: 0,
				y: 10
			};

			$math.movePointByAngle(p, 90);

			$common.col("movePointByAngle <0,10> by angle 90 degrees: x = {0}, y = {1}", Math.round(p.x), Math.round(p.y));

			var line1 = {
				x1: 0,
				y1: 0,
				x2: 10,
				y2: 0
			};

			var line2 = {
				x1: 5,
				y1: -5,
				x2: 5,
				y2: 5
			};

			var line3 = {
				x1: 0,
				y1: 1,
				x2: 10,
				y2: 1
			};

			var inter = $math.linesIntersection(line1, line2);

			if (inter) {
				$common.col("linesIntersection in point: x = {0}, y = {1}", Math.round(inter.x), Math.round(inter.y));
			}

			// parallel
			inter = $math.linesIntersection(line1, line3);

			if (!inter) {
				$common.col("there is no intersection!");
			}
		}

		promiseFlattening() {
			this._promiseFlatteningTest1();
		}

		_promiseFlatteningTest1() {
			console.log("pp test 1");

			new $promise(resolve => {
				setTimeout(() => {
					resolve({ a: 5 });
				}, 450);
			}).then(val => {
				console.log("val1");
				console.log(val);

				return { b: 6 };
			}).then(val2 => {
				console.log("val2");
				console.log(val2);

				return { c: 6 };
			}, error2 => {
				console.log(error2);
			}).then(val3 => {
				console.log("val3");
				console.log(val3);

				this._promiseFlatteningTest2();
			});
		};

		_promiseFlatteningTest2() {
			console.log("pp test 2");

			new $promise(resolve => {
				setTimeout(() => {
					resolve({ a: 5 });
				}, 450);
			}).then(val => {
				console.log("val1");
				console.log(val);

				return new $promise(rr => {
					setTimeout(() => {
						rr({ roman: true });
					}, 500);
				});
			}).then(val2 => {
				console.log("val2");
				console.log(val2);
			}).then(val3 => {
				console.log("val3");
				console.log(val3);
			});
		};

		allTests() {
			console.log("Running all tests...");

			this.buttonClick();
			this.filterTest();
			this.snippetTest();
			this.moduleTest();
			this.apiTest();
			this.chp();
			this.routeParams();
			this.promiseTest();
			this.mathAndDate();
			this.promiseFlattening();
		}
	}

	return HomePage;
}]);
