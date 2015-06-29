testApp.controller("HomePage", [
	"$page",
	"$common",
	"$template",
	"$loader",
	"$select",
	"HomeResource",
	"HomePageDir",
	"$scope",
	"$routeParams",
function(
	$page,
	$common,
	$template,
	$loader,
	$select,
	HomeResource,
	HomePageDir,
	$scope,
	$routeParams
) {
	console.log($routeParams);
	HomePageDir.dirTest();
	
	// ------------------------ private ---------------------------------------
	$scope._afterInit = function() {
		// set title - using i18n get text _ function
		$scope._getEl("title").innerHTML = _("home_page.title");

		// this._testRequest();

		$scope._loadTemplate();

		// dropdowns
		var dropdown = new $select($scope._getEl("dropdown"));

		dropdown.on("change", function(value) {
			console.log("dropdown change - " + value);
		}, $scope);

		// events
		$scope.once("onceEvent", function() {
			console.log("onceEvent");
		});

		$scope.on("anotherEvent", function() {
			console.log("anotherEvent");
		});

		$scope.once("onceEvent", function() {
			console.log("onceEvent - another function");
		});
	};

	/**
	 * Test request to API on express server.
	 */
	$scope._testRequest = function() {
		HomeResource.get().then(function(data) {
			console.log(data);
		});
	};

	/**
	 * Load template to main template in index.html
	 * Compile against data object; bind to $scope page
	 */
	$scope._loadTemplate = function() {
		var el = onix.element(".placeholder").html($template.compile("testTempl", {
			name: "Name from HP"
		}));

		$template.bindTemplate(el.getEl(), $scope);
	};

	$scope.ed = function() {
		var el = document.elementFromPoint(6,316);

		var event = new MouseEvent('click', {
			'bubbles': true,
			'cancelable': true
		});

		el.dispatchEvent(event);
	};

	$scope._angularTest = function() {
		var x = {};

		var bindWatcher = function(obj, cb) {
			var key = "$watcher";

			if (!(key in obj)) {
				obj[key] = cb || function() {};
			}
		};

		var bindProp = function(obj, prop) {
			var key = "$data";
			var key2 = "$watcher";

			if (!(key in obj)) {
				obj[key] = {};
			}

			Object.defineProperty(obj, prop, {
				get: function() {
					//console.log('get!');
					return obj[key][prop];
				},

				set: function(value) {
					//console.log('set!');
					obj[key][prop] = value;
					if (obj[key2] && typeof obj[key2] === "function") {
						obj[key2](prop, value);
					}
				}
			});
		};

		bindWatcher(x, function() {
			console.log("zmena set objektu x");
			console.log(arguments);
		});
		bindProp(x, "hod1");

		x.hod1 = "onix";
		console.log("hodnta je " + x.hod1); // get

		setTimeout(function() {
			x.hod1 = "roman";
		}, 1000)


		/*
		var propName = 'value' 
		var get = Function("return this['" + propName + "']")
		var set = Function("newValue", "this['" + propName + "'] = newValue")
		var handler = { 'get': get, 'set': set, enumerable: true, configurable: true }
		Object.defineProperty(x, propName, handler)

		var testObj = {};
		Object.defineProperty(testObj, "hod1", {
			get: function() {
				console.log('get!');
				return hod1;
			},
			set: function(value) {
				console.log('set!');
				hod1 = value;
			}
		});
		*/
		
		//testObj.hod1 = "nastavime hodntou;"
		//console.log(testObj.hod1); // get
	};

	// ------------------------ public ----------------------------------------
	
	/**
	 * Test button click
	 * All arguments are parsed from the template
	 * @param  {ButtonElement} el
	 * @param  {MouseEvent} event
	 */
	$scope.test = function(el, event) {
		console.log(el, event);

		// loader
		$loader.start();

		// test for once events
		$scope.trigger("onceEvent");
		$scope.trigger("anotherEvent");

		// test for off event
		$scope.off("anotherEvent");

		setTimeout(function() {
			$loader.end();
		}, 500);
	};

	/**
	 * Another test button for testing purpose.
	 */
	$scope.test2 = function() {
		$common.ift(10*5+2, function(expr) {
			console.log(expr);
		});
	};

	/**
	 * Bind click from the dynamic template to our page.
	 */
	$scope.tmplBtn = function() {
		console.log("tmplBtn click");
	};
}]);
