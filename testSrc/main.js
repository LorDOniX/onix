import * as $dom from "dom";
import $i18n from "./i18n";

import Menu from "menu";
import Home from "home";
import Anonymizer from "anonymizer";
import Crop from "crop";
import Test from "test";
import Utils from "utils";

class Page {
	constructor() {
		this._type = "";

		$dom.load(() => {
			this._run();
		});
	}
	
	home() {
		this._type = "home";
	}

	anonymizer() {
		this._type = "anonymizer";
	}

	crop() {
		this._type = "crop";
	}

	test() {
		this._type = "test";
		
	}

	utils() {
		this._type = "utils";
	}

	_run() {
		switch (this._type) {
			case "home":
				new Menu(this._type);
				new Home();
				break;

			case "anonymizer":
				new Menu(this._type);
				new Anonymizer();
				break;

			case "crop":
				new Menu(this._type);
				new Crop();
				break;

			case "test":
				new Menu(this._type);
				new Test();
				break;

			case "utils":
				new Menu(this._type);
				new Utils();
				break;
		}
	}
}

window.Page = new Page();
