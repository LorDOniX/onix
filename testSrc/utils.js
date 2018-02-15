import $template from "template";
import $jsonViewer from "utils/json-viewer";
import $lightbox from "utils/lightbox";
import $popup, { POSITIONS } from "utils/popup";
import * as $location from "location";

export default class Utils {
	constructor() {
		this._dom = {};
		this._const = {
			URL_VALUE: "https://mapy.cz/zakladni?planovani-trasy&x=14.4667000&y=50.0833000&z=11&rc=9gx36xY2Jf9hrr6mKh9h6k6xXiak&rs=muni&rs=muni&rs=muni&ri=3468&ri=4186&ri=3468&mrp=%7B%22c%22%3A1%2C%22tt%22%3A1%7D&mrp=%7B%22c%22%3A1%2C%22tt%22%3A1%7D&mrp=%7B%22c%22%3A1%2C%22tt%22%3A1%7D&rt=&rt=&rt="
		};

		$template.bindTemplate(document.getElementById("utils"), this, function(dom) {
			this._dom = dom || {};
		}.bind(this));

		this._dom.urlInput.value = this._const.URL_VALUE;
	}

	popup() {
		$popup.alert("alert msg");

		var other = $popup.create({
			position: POSITIONS.TOP_RIGHT,
			padding: 25
		});
	}

	lightbox() {
		var lightbox = new $lightbox();
		lightbox.add("/img-test/pano.jpg", "/img-test/pano.jpg", "pano");
		lightbox.add("/img-test/test-photo.jpg", "/img-test/test-photo.jpg");
		lightbox.open();
	}

	jsonViewer() {
		var parsedUrl = $location.parseURL(this._dom.urlInput.value.trim());
		var jsonViewer = new $jsonViewer();

		this._dom.jsonOutput.innerHTML = "";
		this._dom.jsonOutput.appendChild(jsonViewer.getContainer());

		jsonViewer.showJSON(parsedUrl);
	}
}
