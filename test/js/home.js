"use strict";

menuModule = onix.module("menu");

menuModule.service("MainMenu", ["$features", function ($features) {
	this.PAGES = {
		HOME: {
			name: "Home page",
			url: "/"
		},
		MINIMAL: {
			name: "Minimal",
			url: "/minimal"
		},
		ANONYMIZER: {
			name: "Anonymizer",
			url: "/anonymizer"
		},
		CROPPER: {
			name: "Crop",
			url: "/crop"
		},
		UTILS: {
			name: "Utils",
			url: "/utils"
		},
		TEST: {
			name: "Test",
			url: "/test"
		},
		DOCS: {
			name: "Documentation",
			url: "/docs"
		}
	};

	this._createFromObj = function (config) {
		var el = document.createElement(config.el);

		Object.keys(config).forEach(function (key) {
			var value;

			switch (key) {
				case "el":
					break;

				case "child":
					value = config.child;

					if (!Array.isArray(value)) {
						value = [value];
					}

					value.forEach(function (child) {
						el.appendChild(this._createFromObj(child));
					}, this);
					break;

				case "class":
					value = config["class"];

					if (typeof value === "string") {
						el.classList.add(value);
					} else if (Array.isArray(value)) {
						value.forEach(function (item) {
							el.classList.add(item);
						});
					}
					break;

				default:
					el[key] = config[key];
			}
		}, this);

		return el;
	};

	this.create = function (activePage) {
		var pagesLi = [];

		// pages order
		[this.PAGES.HOME, this.PAGES.MINIMAL, this.PAGES.ANONYMIZER, this.PAGES.CROPPER, this.PAGES.UTILS, this.PAGES.TEST, this.PAGES.DOCS].forEach(function (page, ind) {
			var pageObj = {
				el: "li",
				child: [{
					el: "a",
					href: page.url,
					innerHTML: page.name
				}]
			};

			if (!activePage && !ind || page == activePage) {
				pageObj["class"] = "active";
				pageObj.child[0].href = "javascript:void(0)";
			}

			pagesLi.push(pageObj);
		});

		var menuEl = this._createFromObj({
			el: "div",
			"class": ["navbar", "navbar-default"],
			child: [{
				el: "div",
				"class": "container",
				child: [{
					el: "div",
					"class": "navbar-header",
					child: [{
						el: "a",
						"class": "navbar-brand",
						href: "/",
						innerHTML: "Onix test website"
					}]
				}, {
					el: "div",
					"class": ["navbar-collapse", "collapse"],
					id: "navbar",
					child: [{
						el: "ul",
						"class": ["nav", "navbar-nav"],
						child: pagesLi
					}]
				}]
			}]
		});

		document.body.insertBefore(menuEl, document.body.firstChild);

		// old browsers menu fix
		var hasMediaQuery = $features ? $features.MEDIA_QUERY : "matchMedia" in window && "matches" in window.matchMedia("(min-width: 500px)");

		if (!hasMediaQuery) {
			document.body.classList.add("no-media-query");
		}
	};
}]);
"use strict";

myModule = onix.module("myModule", []);

myModule.service("TestFromModule", function () {
	this.test = function () {
		console.log("TestFromModule - test function");
	};
});
"use strict";

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

homeApp.config(["$i18nProvider", function ($i18nProvider) {
	// if you are using underscore -> uncomment line below
	//$i18nProvider.disableGlobalTranslation();

	// add language during config phase
	$i18nProvider.addLanguage("cs", {
		"home_page": {
			"title": "Onix framework - testovací stránka"
		}
	});
}]);

homeApp.run(["$route", "$template", "Config", "$promise", "$i18n", "$i18nProvider", "$filterUppercase", function ($route, $template, Config, $promise, $i18n, $i18nProvider, $filterUppercase) {
	$i18n.setLanguage("en");

	console.log("app run - test for provider during run");
	console.log($i18nProvider);

	// route for home page
	var HomePage = {
		controller: ["HomePage", function (HomePage) {
			new HomePage({
				templ: "detail"
			});
		}],
		templateId: "detail",
		templateUrl: "/templ/detail.html",
		id: "HomePage"
	};

	// application routes
	$route.when("/", HomePage).otherwise(HomePage);

	// all dependencies before start
	$promise.all([$template.load("testTempl", "/templ/test-templ.html"), $i18n.loadLanguage(Config.LOCALIZATION.LANG, Config.LOCALIZATION.PATH)]).then(function () {
		$route.go();
	}, function () {
		console.error("Error during app run");
	});
}]);
"use strict";

homeApp.service("HomeResource", ["$http", "Config", function ($http, Config) {

	// ------------------------ private ---------------------------------------
	/**
  * Base URL.
  * @type {String}
  */
	this._baseURL = Config.URLS.HOME;

	// ------------------------ public ----------------------------------------

	/**
  * Get test data.
  * @return {$promise}
  */
	this.get = function () {
		return $http.createRequest({
			url: this._baseURL
		});
	};
}]);
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

homeApp.factory("HomePage", ["$common", "$date", "$event", "$filter", "$i18n", "$image", "$loader", "$math", "$previewImages", "$promise", "$resize", "$routeParams", "$select", "$template", "$localStorage", "$dom", "HomeResource", "HomeSnippet", "MainMenu", "Page", "myModule::TestFromModule", function ($common, $date, $event, $filter, $i18n, $image, $loader, $math, $previewImages, $promise, $resize, $routeParams, $select, $template, $localStorage, $dom, HomeResource, HomeSnippet, MainMenu, Page, TestFromModule) {
	var HomePage = function (_Page) {
		_inherits(HomePage, _Page);

		function HomePage(config) {
			_classCallCheck(this, HomePage);

			return _possibleConstructorReturn(this, Object.getPrototypeOf(HomePage).call(this, config));
		}

		// ------------------------ private ---------------------------------------


		_createClass(HomePage, [{
			key: "_show",
			value: function _show() {
				// set title - using i18n get text _ function
				this._getEl("title").innerHTML = _("home_page.title");

				$resize.start();
				$resize.on("resize", function () {
					console.log("resize event");
				});

				this._loadTemplate();

				MainMenu.create(MainMenu.PAGES.HOME);

				// dropdowns
				var dropdown = new $select(this._getEl("dropdown"));
				var dropdown2 = new $select(this._getEl("dropdown2"), {
					addCaption: true
				});

				dropdown.on("change", function (value) {
					console.log("dropdown change - " + value);
				}, this);

				// events
				this.once("onceEvent", function () {
					console.log("onceEvent");
				});

				this.on("anotherEvent", function () {
					console.log("anotherEvent");
				});

				this.once("onceEvent", function () {
					console.log("onceEvent - another function");
				});
			}
		}, {
			key: "_testPromise1",
			value: function _testPromise1(val) {
				return new $promise(function (resolve) {
					setTimeout(function () {
						resolve("test promise 1 - " + val);
					}, 1000);
				});
			}
		}, {
			key: "_testPromise2",
			value: function _testPromise2(val) {
				return new $promise(function (resolve) {
					setTimeout(function () {
						resolve("test promise 2 - " + val);
					}, 800);
				});
			}

			/**
    * Load template to main template in index.html
    * Compile against data object; bind to HomePage page
    */

		}, {
			key: "_loadTemplate",
			value: function _loadTemplate() {
				var el = onix.element(".placeholder").html($template.compile("testTempl", {
					name: "Name from HP",
					testObj: {
						a: 5,
						b: 6
					}
				}));

				var langTest = function () {
					$i18n.setLanguage("cs");
					this._getEl("title").innerHTML = _("home_page.title");
					$i18n.setLanguage("en");
					console.log("Website title has changed!");
				}.bind(this);

				$template.bindTemplate(el.getEl(), {
					onkd: function onkd() {
						console.log("On key down");
					},

					/**
      * Bind click from the dynamic template to our page.
      */
					tmplBtn: function tmplBtn() {
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

		}, {
			key: "buttonClick",
			value: function buttonClick(el, event) {
				var args = arguments;

				console.log(args);

				if (args.length == 8) {
					var fn = args[7];

					$common.col("fnTest {0}", fn());
				}

				// loader
				$loader.start();

				// test for once events
				this.trigger("onceEvent");
				this.trigger("anotherEvent");

				// test for off event
				this.off("anotherEvent");

				setTimeout(function () {
					$loader.end();
				}, 500);
			}
		}, {
			key: "filterTest",
			value: function filterTest() {
				console.log("Test of filter 'lowercase' : HI, HOW ARE YOU? -> " + $filter("lowercase")("HI, HOW ARE YOU?"));
			}
		}, {
			key: "snippetTest",
			value: function snippetTest() {
				var homeSnippet = new HomeSnippet();
				homeSnippet.dirTest();
			}
		}, {
			key: "moduleTest",
			value: function moduleTest() {
				TestFromModule.test();
			}

			/**
    * Test request to API on express server.
    */

		}, {
			key: "apiTest",
			value: function apiTest() {
				HomeResource.get().then(function (data) {
					console.log(data);
				});
			}
		}, {
			key: "chp",
			value: function chp() {
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
					method: function method() {
						return new $promise(function (resolve) {
							setTimeout(function () {
								resolve("test promise 3 - " + $common.formatSize(123456789));
							}, 1000);
						});
					}
				}]).then(function (output) {
					console.log("All done, rejected {0}".format(output.rejected));

					output.output.forEach(function (i) {
						console.log(i);
					});
				});
			}
		}, {
			key: "routeParams",
			value: function routeParams() {
				console.log("routeParams");
				console.log($routeParams);
			}
		}, {
			key: "promiseTest",
			value: function promiseTest() {
				var promise1 = new $promise(function (resolve) {
					setTimeout(function () {
						resolve();
					}, 500);
				});

				var promise2 = new $promise(function (resolve, reject) {
					setTimeout(function () {
						reject();
					}, 300);
				});

				$promise.all([promise1, promise2]).then(function () {
					console.log("$promise all done");
				});

				var race1 = new $promise(function (resolve) {
					setTimeout(function () {
						resolve({ a: 10 });
					}, 500);
				});

				var race2 = new $promise(function (resolve) {
					setTimeout(function () {
						resolve({ a: 25 });
					}, 300);
				});

				$promise.race([race1, race2]).then(function (data) {
					console.log("$race is done");
					console.log(data);
				});

				$promise.reject().then(function () {}, function () {
					console.log("$promise rejected");
				});
			}
		}, {
			key: "uploadChange",
			value: function uploadChange() {
				var uploadPreview = this._getEl("uploadPreview");
				var filesInput = this._getEl("uploadInput");

				var showState = $previewImages.show(uploadPreview, filesInput.files, {
					maxSize: 180,
					count: 2,
					createHolder: true
				});

				if (!showState) {
					uploadPreview.innerHTML = "SELECT IMAGES FOR THEIRS PREVIEWS";
				}

				// clear value
				filesInput.value = null;
			}
		}, {
			key: "mathAndDate",
			value: function mathAndDate() {
				$common.col("2016-06-31 to CS date = {0}", $date.dateENtoCS("2016-06-31"));
				$common.col("2016-06-31 is CS date? {0}", $date.isCSdate("2016-06-31") ? "yes" : "no");
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
		}, {
			key: "promiseFlattening",
			value: function promiseFlattening() {
				this._promiseFlatteningTest1();
			}
		}, {
			key: "_promiseFlatteningTest1",
			value: function _promiseFlatteningTest1() {
				var _this2 = this;

				console.log("pp test 1");

				new $promise(function (resolve) {
					setTimeout(function () {
						resolve({ a: 5 });
					}, 450);
				}).then(function (val) {
					console.log("val1");
					console.log(val);

					return { b: 6 };
				}).then(function (val2) {
					console.log("val2");
					console.log(val2);

					return { c: 6 };
				}, function (error2) {
					console.log(error2);
				}).then(function (val3) {
					console.log("val3");
					console.log(val3);

					_this2._promiseFlatteningTest2();
				});
			}
		}, {
			key: "_promiseFlatteningTest2",
			value: function _promiseFlatteningTest2() {
				console.log("pp test 2");

				new $promise(function (resolve) {
					setTimeout(function () {
						resolve({ a: 5 });
					}, 450);
				}).then(function (val) {
					console.log("val1");
					console.log(val);

					return new $promise(function (rr) {
						setTimeout(function () {
							rr({ roman: true });
						}, 500);
					});
				}).then(function (val2) {
					console.log("val2");
					console.log(val2);
				}).then(function (val3) {
					console.log("val3");
					console.log(val3);
				});
			}
		}, {
			key: "locStor",
			value: function locStor() {
				var LS_KEY = "myLocalStorage";
				var value = "xyz";

				$common.col("Set localStorage {0} with value {1}", LS_KEY, value);

				$localStorage.set(LS_KEY, value);

				$common.col("Get localStorage {0} = {1}", LS_KEY, $localStorage.get(LS_KEY));

				$common.col("Remove localStorage {0}", LS_KEY);

				$localStorage.remove(LS_KEY);

				$common.col("Get localStorage {0} = {1}", LS_KEY, $localStorage.get(LS_KEY));
			}
		}, {
			key: "myQueryTest",
			value: function myQueryTest() {
				var el = $dom.create({
					el: "div",
					innerHTML: "data",
					css: {
						color: "red",
						"background-color": "white",
						border: "1px solid black"
					}
				});

				var ref = onix.element(".myquery-cont").empty().append(el).append("<div>data2</div>").prepend("<div>data prepend</div>");

				$common.col("Style is {0}", ref.css("display", "none").css("display"));

				ref.css("display", "");

				var colors = ["green", "red", "blue"];
				var bgColors = ["#f5f5f5", "#ccc", "#666"];

				onix.element(".myquery-cont > div").each(function (el, ind) {
					onix.element(el).css("color", colors[ind]).css("z-index", 12).css({
						"background-color": bgColors[ind]
					}).click(function (e) {
						console.log("click on div");
					});
				});

				var doc = onix.element(document).keydown(function (event, el, mqRef) {
					console.log("document keydown");
					console.log(arguments);
					console.log(this);

					mqRef.unbind("keydown");
				});

				var clickFn = function clickFn(e, el, mqRef) {
					console.log("document click");
				};

				doc.bind("click", clickFn);
				doc.unbind("click", clickFn);
			}
		}, {
			key: "others",
			value: function others() {
				$common.col("$common.col with string only");
				$common.col("i18n trans {0}, missing {1}", _("home_page.testData"), _("home_page.notExists"));
				//$common.col("i18n plural: 0 => {0}, 1 => {1}, 10 => {2}", _("home_page.plural", { COUNT: 0 }), _("home_page.plural", { COUNT: 1 }), _("home_page.plural", { COUNT: 10 }));
				$common.col("i18n plural: 0 => {0}", _("home_page.plural", { COUNT: 0 }));

				var s2 = "There was {   COUNT , plural, one{car} few{cars} other{ cars  }    } {hi} aa    {   daads }   ";
				console.log(s2);
				console.log(_(s2));

				$common.col('valueFromObject({a:{data: 5}}, "a.data") -> {0}', $common.valueFromObject({ a: { data: 5 } }, "a.data"));
				$common.col('valueFromObject({a:{data: 5}}, "a.x") -> {0}', $common.valueFromObject({ a: { data: 5 } }, "a.x"));
				$common.col('valueFromObject({a:{data: 5}}, "a.data.x2.y2", 100) -> {0}', $common.valueFromObject({ a: { data: 5 } }, "a.data.x2.y2", 100));
				$common.col('valueFromObject({a: [{data: 5}, {data: 6}]}, "a[1].data") -> {0}', $common.valueFromObject({ a: [{ data: 5 }, { data: 6 }] }, "a[1].data"));

				console.log($common.cloneValue("string"));
				console.log($common.cloneValue([]));
				console.log($common.cloneValue({ a: 5, r: [1, "assda", false] }));
				console.log($common.cloneValue(new Date()));
				console.log($common.cloneValue(10.85));
				console.log($common.cloneValue(null));
				console.log($common.cloneValue(false));
				console.log($common.cloneValue(document.createElement("div")));

				console.log("Date format day.month.year hours:minutes -> {0}".format($date.format(new Date(), "dd.mm.yyyy hh:MM")));
				console.log("Time duration 54321 seconds -> {0}".format($common.timeDuration(54321)));
			}
		}, {
			key: "allTests",
			value: function allTests() {
				console.log("Running all tests...");

				this.others();
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
				this.locStor();
				this.myQueryTest();
			}
		}]);

		return HomePage;
	}(Page);

	return HomePage;
}]);
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

homeApp.factory("HomeSnippet", ["$common", "Snippet", "TestFromModule", function ($common, Snippet, TestFromModule) {
	var HomeSnippet = function (_Snippet) {
		_inherits(HomeSnippet, _Snippet);

		function HomeSnippet(config, parent) {
			_classCallCheck(this, HomeSnippet);

			var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(HomeSnippet).call(this, config, parent));

			TestFromModule.test();
			return _this;
		}

		_createClass(HomeSnippet, [{
			key: "dirTest",
			value: function dirTest() {
				console.log("HomeDir dirTest function()");
			}
		}]);

		return HomeSnippet;
	}(Snippet);

	return HomeSnippet;
}]);
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

homeApp.factory("Page", ["$template", "$common", "$event", function ($template, $common, $event) {
	/**
  * Page
  */
	var Page = function (_$event) {
		_inherits(Page, _$event);

		/**
   * Constructor for page.
   *
   * @param {Object} Page config
   */
		function Page(config) {
			_classCallCheck(this, Page);

			var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Page).call(this));

			var root = onix.element("body").html($template.compile(config.templ || "", _this));

			// Object for data-bind elements references
			_this._els = {};

			// each page contanins only one page div
			$template.bindTemplate(root, _this, _this._addEls.bind(_this));

			_this._show();
			return _this;
		}

		/**
   * Add new els to this._els; this function can be called from $template
   *
   * @param {Object} newEls { key, value - node element}
   */


		_createClass(Page, [{
			key: "_addEls",
			value: function _addEls(newEls) {
				$common.extend(this._els, newEls || {});
			}

			/**
    * Get page config.
    *
    * @return {Object}
    */

		}, {
			key: "_getConfig",
			value: function _getConfig() {
				return this._config;
			}

			/**
    * Get page element.
    *
    * @param  {String} name
    * @return {NodeElement}
    */

		}, {
			key: "_getEl",
			value: function _getEl(name) {
				return this._els[name];
			}

			/**
    * Abstract method.
    */

		}, {
			key: "_show",
			value: function _show() {}
		}]);

		return Page;
	}($event);

	;

	return Page;
}]);
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

homeApp.factory("Snippet", ["$template", "$common", "$event", function ($template, $common, $event) {
	/**
  * Snippet
  */
	var Snippet = function (_$event) {
		_inherits(Snippet, _$event);

		/**
   * Constructor for snippet.
   *
   * @param {Object} config Config for snippet
   * @param {Object} parent Parent object
   */
		function Snippet(config, parent) {
			_classCallCheck(this, Snippet);

			// Object for data-bind elements references
			var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Snippet).call(this));

			_this._els = {};

			_this._config = config || {};
			_this._parent = parent;
			_this._root = _this._create(config);

			$template.bindTemplate(_this._root, _this, _this._addEls.bind(_this));

			_this._show();
			return _this;
		}

		/**
   * Add new els to this._els; this function can be called from $template
   *
   * @param {Object} newEls { key, value - node element}
   */


		_createClass(Snippet, [{
			key: "_addEls",
			value: function _addEls(newEls) {
				$common.extend(this._els, newEls || {});
			}

			/**
    * Get Snippet config.
    *
    * @return {Object}
    */

		}, {
			key: "_getConfig",
			value: function _getConfig() {
				return this._config;
			}

			/**
    * Get snippet element.
    *
    * @param  {String} name
    * @return {NodeElement}
    */

		}, {
			key: "_getEl",
			value: function _getEl(name) {
				return this._els[name];
			}

			/**
    * Get snippet parent.
    *
    * @return {NodeElement}
    */

		}, {
			key: "_getParent",
			value: function _getParent() {
				return this._parent;
			}

			/**
    * Abstract method. Create root element.
    *
    * @param  {Object} config
    */

		}, {
			key: "_create",
			value: function _create(config) {
				return null;
			}

			/**
    * Abstract method.
    */

		}, {
			key: "_show",
			value: function _show() {}

			/**
    * Is snippet locked for change?
    *
    * @return {Boolean}
    */

		}, {
			key: "isLocked",
			value: function isLocked() {
				return false;
			}

			/**
    * Return root el.
    *
    * @return {HTMLElement}
    */

		}, {
			key: "getRoot",
			value: function getRoot() {
				return this._root;
			}

			/**
    * Destroy snippet.
    */

		}, {
			key: "destructor",
			value: function destructor() {}
		}]);

		return Snippet;
	}($event);

	;

	return Snippet;
}]);