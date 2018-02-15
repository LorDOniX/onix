import $crop from "utils/crop";
import $template from "template";
import * as $cookie from "cookie";
import * as $common from "common";

const COOKIE_NAME = "testCookie";

export default class Test {
	constructor() {
		this._els = null;

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
	}

	_mouseDown(e) {
		this._mouse.bcr = this._els.testArea.getBoundingClientRect();
		
		let data = this._getXY(e);
		
		this._mouse.x = data.x;
		this._mouse.y = data.y;
		this._mouse.startX = this._mouse.x;
		this._mouse.startY = this._mouse.y;

		document.addEventListener("mousemove", this._binds.mouseMove);
		document.addEventListener("mouseup", this._binds.mouseUp);
	}

	_mouseMove(e) {
		let data = this._getXY(e);
		let diffX = data.x - this._mouse.x;
		let diffY = data.y - this._mouse.y;

		console.log(diffX + ":" + diffY);

		this._mouse.x = data.x;
		this._mouse.y = data.y;
	}

	_mouseUp(e) {
		let data = this._getXY(e);

		if (data.x == this._mouse.startX && data.y == this._mouse.startY) {
			console.log("click");
		}

		document.removeEventListener("mousemove", this._binds.mouseMove);
		document.removeEventListener("mouseup", this._binds.mouseUp);
	}

	_getXY(e) {
		return {
			x: e.clientX - this._mouse.bcr.left,
			y: e.clientY - this._mouse.bcr.top
		};
	}

	mouseenter() {
		console.log("mouseenter");
	}

	mouseleave(e) {
		console.log("mouseleave");
		console.log(e);
	}

	setCookie() {
		let value = "my val";

		$common.col("Set cookie {0} with value {1}", COOKIE_NAME, value);
		$cookie.set(COOKIE_NAME, value);

		this.getCookie();
	}

	getCookie() {
		$common.col("Get cookie {0} = {1}", COOKIE_NAME, $cookie.get(COOKIE_NAME))
	}

	removeCookie() {
		$common.col("Remove cookie {0}", COOKIE_NAME);
		$cookie.remove(COOKIE_NAME);

		this.getCookie();

		$common.confirm("Confirm test").then(() => {
			console.log("yes");
		}, () => {
			console.log("no");
		});
	}
}
