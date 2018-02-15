import $route from "route";
import $template from "template";
import $i18n from "i18n";
import $resize from "resize";
import $filter from "filter";
import $select from "utils/select";
import $loader from "utils/loader";
import { element } from "my-query";
import * as $common from "common";
import * as $date from "date";
import * as $http from "./http";
import * as $math from "math";
import * as $localStorage from "local-storage";
import * as $dom from "dom";
import $previewImages from "utils/preview-images";

import Page from "./page";
import Snippet from "./snippet";

const CONFIG = {
	// homeApp localization
	LOCALIZATION: {
		LANG: "en",
		PATH: "/locale/en.json"
	},

	// homeApp resource URLs
	URLS: {
		HOME: "/api/home/"
	}
};

class HomeSnippet extends Snippet {
	constructor(config, parent) {
		super(config, parent);
	}

	dirTest() {
		console.log("HomeDir dirTest function()");
	}
}

class HomeResource {
	constructor() {
		this._baseURL = CONFIG.URLS.HOME;
	}

	get() {
		return $http.createRequest({
			url: this._baseURL
		});
	}
}

class HomePage extends Page {
	constructor(config) {
		super(config);
	}

	// ------------------------ private ---------------------------------------
	_show() {
		// set title - using i18n get text _ function
		this._getEl("title").innerHTML = _("home_page.title");

		$resize.start();
		$resize.on("resize", () => {
			console.log("resize event");
		});

		this._loadTemplate();

		// dropdowns
		let dropdown = new $select(this._getEl("dropdown"));
		let dropdown2 = new $select(this._getEl("dropdown2"), {
			addCaption: true
		});

		dropdown.on("change", value => {
			console.log("dropdown change - " + value);
		}, this);

		// events
		this.once("onceEvent", () => {
			console.log("onceEvent");
		});

		this.on("anotherEvent", () => {
			console.log("anotherEvent");
		});

		this.once("onceEvent", () => {
			console.log("onceEvent - another function");
		});
	}

	_testPromise1(val) {
		return new Promise(resolve => {
			setTimeout(() => {
				resolve("test promise 1 - " + val);
			}, 1000);
		});
	}

	_testPromise2(val) {
		return new Promise(resolve => {
			setTimeout(() => {
				resolve("test promise 2 - " + val);
			}, 800);
		});
	}

	/**
	 * Load template to main template in index.html
	 * Compile against data object; bind to HomePage page
	 */
	_loadTemplate() {
		let el = element(".placeholder").html($template.compile("testTempl", {
			name: "Name from HP",
			testObj: {
				a: 5,
				b: 6
			}
		}));

		let langTest = () => {
			this._config.i18n.setLanguage("cs");
			this._getEl("title").innerHTML = _("home_page.title");
			this._config.i18n.setLanguage("en");
			console.log("Website title has changed!");
		};

		$template.bindTemplate(el.getEl(), {
			onkd: () => {
				console.log("On key down");
			},

			/**
			 * Bind click from the dynamic template to our page.
			 */
			tmplBtn: () => {
				console.log("Dynamic template button click");
			},

			langTest
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
		let args = arguments;
		
		console.log(args);

		if (args.length == 8) {
			let fn = args[7];

			$common.col("fnTest {0}", fn());
		}

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
		console.log("Test of filter 'lowercase' : HI, HOW ARE YOU? -> " + $filter("lowercase", "HI, HOW ARE YOU?"));
	}

	snippetTest() {
		var homeSnippet = new HomeSnippet();
		homeSnippet.dirTest();
	}

	/**
	 * Test request to API on express server.
	 */
	apiTest() {
		let homeResource = new HomeResource();

		homeResource.get().then(data => {
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
			method: () => {
				return new Promise(resolve => {
					setTimeout(() => {
						resolve("test promise 3 - " + $common.formatSize(123456789));
					}, 1000);
				});
			}
		}]).then(output => {
			console.log("All done, rejected {0}".format(output.rejected));

			output.output.forEach(i => {
				console.log(i);
			});
		});
	}

	promiseTest() {
		let promise1 = new Promise(resolve => {
			setTimeout(() => {
				resolve();
			}, 500);
		});

		let promise2 = new Promise((resolve, reject) => {
			setTimeout(() => {
				reject();
			}, 300);
		});

		Promise.all([promise1, promise2]).then(() => {
			console.log("Promise all done");
		});

		let race1 = new Promise(resolve => {
			setTimeout(() => {
				resolve({ a: 10 });
			}, 500);
		});

		let race2 = new Promise(resolve => {
			setTimeout(() => {
				resolve({ a: 25 });
			}, 300);
		});

		Promise.race([race1, race2]).then(data => {
			console.log("$race is done");
			console.log(data);
		});

		Promise.reject().then(() => {}, () => {
			console.log("Promise rejected");
		});
	}

	uploadChange() {
		let uploadPreview = this._getEl("uploadPreview");
		let filesInput = this._getEl("uploadInput");
		let showState = $previewImages(uploadPreview, filesInput.files, {
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

	mathAndDate() {
		$common.col("2016-06-31 to CS date = {0}", $date.dateENtoCS("2016-06-31"));
		$common.col("2016-06-31 is CS date? {0}",  $date.isCSdate("2016-06-31") ? "yes" : "no");
		$common.col("zoomToDistance = {0}", $math.zoomToDistance(15, 45, 1024));

		let p = { 
			x: 0,
			y: 10
		};

		$math.movePointByAngle(p, 90);

		$common.col("movePointByAngle <0,10> by angle 90 degrees: x = {0}, y = {1}", Math.round(p.x), Math.round(p.y));

		let line1 = {
			x1: 0,
			y1: 0,
			x2: 10,
			y2: 0
		};

		let line2 = {
			x1: 5,
			y1: -5,
			x2: 5,
			y2: 5
		};

		let line3 = {
			x1: 0,
			y1: 1,
			x2: 10,
			y2: 1
		};

		let inter = $math.linesIntersection(line1, line2);

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

		new Promise(resolve => {
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
	}

	_promiseFlatteningTest2() {
		console.log("pp test 2");

		new Promise(resolve => {
			setTimeout(() => {
				resolve({ a: 5 });
			}, 450);
		}).then(val => {
			console.log("val1");
			console.log(val);

			return new Promise(rr => {
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
	}

	_testReq() {
		return $http.createRequest({
			url: Config.URLS.HOME
		});
	}

	locStor() {
		let LS_KEY = "myLocalStorage";
		let value = "xyz";

		$common.col("Set localStorage {0} with value {1}", LS_KEY, value);
		$localStorage.set(LS_KEY, value);
		$common.col("Get localStorage {0} = {1}", LS_KEY, $localStorage.get(LS_KEY))
		$common.col("Remove localStorage {0}", LS_KEY);
		$localStorage.remove(LS_KEY);
		$common.col("Get localStorage {0} = {1}", LS_KEY, $localStorage.get(LS_KEY))
	}

	myQueryTest() {
		let el = $dom.create({
			el: "div",
			innerHTML: "data",
			css: {
				color: "red",
				"background-color": "white",
				border: "1px solid black"
			}
		});

		let ref = element(".myquery-cont").empty().append(el).append("<div>data2</div>").prepend("<div>data prepend</div>");

		$common.col("Style is {0}", ref.css("display", "none").css("display"));

		ref.css("display", "");

		let colors = ["green", "red", "blue"];
		let bgColors = ["#f5f5f5", "#ccc", "#666"];

		element(".myquery-cont > div").each((el, ind) => {
			element(el).css("color", colors[ind]).css("z-index", 12).css({
				"background-color": bgColors[ind]
			}).click(e => {
				console.log("click on div");
			})
		});

		let doc = element(document).keydown((event, el, mqRef) => {
			console.log("document keydown");
			console.log(arguments);
			console.log(this);

			mqRef.unbind("keydown");
		});

		let clickFn = (e, el, mqRef) => {
			console.log("document click");
		};

		doc.bind("click", clickFn);
		doc.unbind("click", clickFn);
	}

	others() {
		$common.col("$common.col with string only");
		$common.col("i18n trans {0}, missing {1}", _("home_page.testData"), _("home_page.notExists"));
		//$common.col("i18n plural: 0 => {0}, 1 => {1}, 10 => {2}", _("home_page.plural", { COUNT: 0 }), _("home_page.plural", { COUNT: 1 }), _("home_page.plural", { COUNT: 10 }));
		$common.col("i18n plural: 0 => {0}", _("home_page.plural", { COUNT: 0 }));

		let s2 = "There was {   COUNT , plural, one{car} few{cars} other{ cars  }    } {hi} aa    {   daads }   ";
		console.log(s2);
		console.log(_(s2));

		$common.col('valueFromObject({a:{data: 5}}, "a.data") -> {0}', $common.valueFromObject({a:{data: 5}}, "a.data"));
		$common.col('valueFromObject({a:{data: 5}}, "a.x") -> {0}', $common.valueFromObject({a:{data: 5}}, "a.x"));
		$common.col('valueFromObject({a:{data: 5}}, "a.data.x2.y2", 100) -> {0}', $common.valueFromObject({a:{data: 5}}, "a.data.x2.y2", 100));
		$common.col('valueFromObject({a: [{data: 5}, {data: 6}]}, "a[1].data") -> {0}', $common.valueFromObject({a: [{data: 5}, {data: 6}]}, "a[1].data"));

		console.log($common.cloneValue("string"));
		console.log($common.cloneValue([]));
		console.log($common.cloneValue({ a: 5, r: [1, "assda", false]}));
		console.log($common.cloneValue(new Date()));
		console.log($common.cloneValue(10.85));
		console.log($common.cloneValue(null));
		console.log($common.cloneValue(false));
		console.log($common.cloneValue(document.createElement("div")));

		console.log("Date format day.month.year hours:minutes -> {0}".format($date.format(new Date(), "dd.mm.yyyy hh:MM")));
		console.log("Time duration 54321 seconds -> {0}".format($common.timeDuration(54321)));
	}

	allTests() {
		console.log("Running all tests...");

		this.others();
		this.buttonClick();
		this.filterTest();
		this.snippetTest();
		this.apiTest();
		this.chp();
		this.promiseTest();
		this.mathAndDate();
		this.promiseFlattening();
		this.locStor();
		this.myQueryTest();
	}
}

export default class Home {
	constructor() {
		this._i18n = new $i18n();
		window._ = this._i18n._.bind(this._i18n);
		this._i18n.setLanguage("en");
		this._i18n.addLanguage("cs", {
		"home_page": {
			"title": "Onix framework - testovací stránka"
		}});

		console.log("app run - test for provider during run");

		// route for home page
		let templateId = "detail";
		let homePageCtrl = {
			controller: params => {
				new HomePage({
					templ: templateId,
					i18n: this._i18n
				});
			},
			templateId,
			templateUrl: "/templ/detail.html",
			id: "HomePage"
		};

		// application routes
		$route
			.when("/", homePageCtrl)
			.otherwise(homePageCtrl);

		this._run();
	}

	async _run() {
		await $template.load("testTempl", "/templ/test-templ.html"),
		await this._i18n.loadLanguage(CONFIG.LOCALIZATION.LANG, CONFIG.LOCALIZATION.PATH);
		$route.go();
	}
}
