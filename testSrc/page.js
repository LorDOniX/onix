import * as $common from "common";
import $template from "template";
import $event from "event";
import { element } from "my-query";

/**
 * Page
 */
class Page extends $event {
	/**
	 * Constructor for page.
	 *
	 * @param {Object} Page config
	 */
	constructor(config) {
		super();

		let root = element("body").append($template.compile(config.templ || "", this));

		// Object for data-bind elements references
		this._els = {};
		this._config = config;

		// each page contanins only one page div
		$template.bindTemplate(root, this, this._addEls.bind(this));

		this._show();
	}

	/**
	 * Add new els to this._els; this function can be called from $template
	 *
	 * @param {Object} newEls { key, value - node element}
	 */
	_addEls(newEls) {
		$common.extend(this._els, newEls || {});
	}

	/**
	 * Get page config.
	 *
	 * @return {Object}
	 */
	_getConfig() {
		return this._config;
	}

	/**
	 * Get page element.
	 *
	 * @param  {String} name
	 * @return {NodeElement}
	 */
	_getEl(name) {
		return this._els[name];
	}

	/**
	 * Abstract method.
	 */
	_show() {
	}
};

export default Page;
