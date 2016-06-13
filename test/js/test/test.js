testApp = onix.module("testApp", ["menu"]);

testApp.run([
	"$crop",
	"$template",
	"$cookie",
	"$common",
	"MainMenu",
function(
	$crop,
	$template,
	$cookie,
	$common,
	MainMenu
) {
	var Test = function() {
		MainMenu.create(MainMenu.PAGES.TEST);

		this._els = null;

		this._CONST = {
			COOKIE_NAME: "testCookie"
		};

		$template.bindTemplate(document.querySelector(".main-cont"), this, function(elsObj) {
			this._els = elsObj;
		}.bind(this));

		this._mouse = {
			bcr: null,
			x: 0,
			y: 0,
			startX: 0,
			startY: 0
		};

		this._binds = {
			mouseDown: this._mouseDown.bind(this),
			mouseMove: this._mouseMove.bind(this),
			mouseUp: this._mouseUp.bind(this)
		};

		this._els.testArea.addEventListener("mousedown", this._binds.mouseDown);
	};

	Test.prototype._mouseDown = function(e) {
		this._mouse.bcr = this._els.testArea.getBoundingClientRect();

		var data = this._getXY(e);

		this._mouse.x = data.x;
		this._mouse.y = data.y;
		this._mouse.startX = this._mouse.x;
		this._mouse.startY = this._mouse.y;

		document.addEventListener("mousemove", this._binds.mouseMove);
		document.addEventListener("mouseup", this._binds.mouseUp);
	};

	Test.prototype._mouseMove = function(e) {
		var data = this._getXY(e);

		var diffX = data.x - this._mouse.x;
		var diffY = data.y - this._mouse.y;

		console.log(diffX + ":" + diffY);

		this._mouse.x = data.x;
		this._mouse.y = data.y;
	};

	Test.prototype._mouseUp = function(e) {
		var data = this._getXY(e);

		if (data.x == this._mouse.startX && data.y == this._mouse.startY) {
			console.log("click");
		}

		document.removeEventListener("mousemove", this._binds.mouseMove);
		document.removeEventListener("mouseup", this._binds.mouseUp);
	};

	Test.prototype._getXY = function(e) {
		return {
			x: e.clientX - this._mouse.bcr.left,
			y: e.clientY - this._mouse.bcr.top
		}
	};

	Test.prototype.mouseenter = function() {
		console.log("mouseenter");
	};

	Test.prototype.mouseleave = function(e) {
		console.log("mouseleave");
		console.log(e);
	};

	Test.prototype.setCookie = function() {
		var value = "my val";

		$common.col("Set cookie {0} with value {1}", this._CONST.COOKIE_NAME, value);

		$cookie.set(this._CONST.COOKIE_NAME, value);

		this.getCookie();
	};

	Test.prototype.getCookie = function() {
		$common.col("Get cookie {0} = {1}", this._CONST.COOKIE_NAME, $cookie.get(this._CONST.COOKIE_NAME))
	};

	Test.prototype.removeCookie = function() {
		$common.col("Remove cookie {0}", this._CONST.COOKIE_NAME);

		$cookie.remove(this._CONST.COOKIE_NAME);

		this.getCookie();

		$common.confirm("Confirm test").then(function() {
			console.log("yes");
		}, function() {
			console.log("no");
		});
	};

	new Test();
}]);
