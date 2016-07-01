homeApp.factory("Page", [
	"$template",
	"$common",
	"$event",
function(
	$template,
	$common,
	$event
) {
	/**
	 * Page
	 */
	class Page extends $event {
		constructor() {
			super();

			// event init
			this._eventInit();
		}

		/**
		 * Constructor for page.
		 *
		 * @param {Object} Page config
		 */
		_constructor(config) {
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

	return Page;
}]);
