menuModule = onix.module("menu");
menuModule.service("MainMenu", ["$dom", function ($dom) {
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
		TEST: {
			name: "Test",
			url: "/test"
		}
	};
	this.create = function (activePage) {
		var pagesLi = [];
		// pages order
		[this.PAGES.HOME, this.PAGES.MINIMAL, this.PAGES.ANONYMIZER, this.PAGES.CROPPER, this.PAGES.TEST].forEach(function (page, ind) {
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
		var menuEl = $dom.create({
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
	};
}]);
myModule = onix.module("myModule", []);
myModule.service("TestFromModule", function () {
	this.test = function () {
		console.log("TestFromModule - test function");
	};
});
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
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
homeApp.factory("HomePage", ["$common", "$date", "$event", "$filter", "$i18n", "$image", "$loader", "$math", "$previewImages", "$promise", "$resize", "$routeParams", "$select", "$template", "HomeResource", "HomeSnippet", "MainMenu", "Page", "myModule::TestFromModule", function ($common, $date, $event, $filter, $i18n, $image, $loader, $math, $previewImages, $promise, $resize, $routeParams, $select, $template, HomeResource, HomeSnippet, MainMenu, Page, TestFromModule) {
	var HomePage = function (_Page) {
		_inherits(HomePage, _Page);
		function HomePage(config) {
			_classCallCheck(this, HomePage);
			var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(HomePage).call(this));
			_this._constructor(config);
			return _this;
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
				console.log(el, event);
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
					console.log("All done");
					console.log(output);
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
				$previewImages.show(uploadPreview, filesInput.files, {
					maxSize: 180,
					count: 2,
					createHolder: true
				});
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
			key: "allTests",
			value: function allTests() {
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
		}]);
		return HomePage;
	}(Page);
	return HomePage;
}]);
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
homeApp.factory("HomeSnippet", ["$common", "Snippet", "TestFromModule", function ($common, Snippet, TestFromModule) {
	var HomeSnippet = function (_Snippet) {
		_inherits(HomeSnippet, _Snippet);
		function HomeSnippet(config, parent) {
			_classCallCheck(this, HomeSnippet);
			var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(HomeSnippet).call(this));
			_this._constructor(config, parent);
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
		function Page() {
			_classCallCheck(this, Page);
			// event init
			var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Page).call(this));
			_this._eventInit();
			return _this;
		}
		/**
   * Constructor for page.
   *
   * @param {Object} Page config
   */
		_createClass(Page, [{
			key: "_constructor",
			value: function _constructor(config) {
				var root = onix.element("body").html($template.compile(config.templ || "", this));
				// Object for data-bind elements references
				this._els = {};
				// each page contanins only one page div
				$template.bindTemplate(root, this, this._addEls.bind(this));
				this._show();
			}
			/**
    * Add new els to this._els; this function can be called from $template
    *
    * @param {Object} newEls { key, value - node element}
    */
		}, {
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
		function Snippet(config) {
			_classCallCheck(this, Snippet);
			// event init
			var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Snippet).call(this));
			_this._eventInit();
			return _this;
		}
		/**
   * Constructor for snippet.
   *
   * @param {Object} config Config for snippet
   * @param {Object} parent Parent object
   */
		_createClass(Snippet, [{
			key: "_constructor",
			value: function _constructor(config, parent) {
				// Object for data-bind elements references
				this._els = {};
				this._config = config || {};
				this._parent = parent;
				this._root = this._create(config);
				$template.bindTemplate(this._root, this, this._addEls.bind(this));
				this._show();
			}
			/**
    * Add new els to this._els; this function can be called from $template
    *
    * @param {Object} newEls { key, value - node element}
    */
		}, {
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