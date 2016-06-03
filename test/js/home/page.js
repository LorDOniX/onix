homeApp.factory("Page", [
	"$template",
	"$common",
function(
	$template,
	$common
) {
	/**
	 * Page
	 */
	var Page = function() {
	};

	/**
	 * Constructor for page.
	 *
	 * @param {Object} Page config
	 */
	Page.prototype._constructor = function(config) {
		var root = onix.element("body").html($template.compile(config.templ || "", this));

		// Object for data-bind elements references
		this._els = {};

		// each page contanins only one page div
		$template.bindTemplate(root, this, this._addEls.bind(this));

		this._show();
	};

	/**
	 * Add new els to this._els; this function can be called from $template
	 *
	 * @param {Object} newEls { key, value - node element}
	 */
	Page.prototype._addEls = function(newEls) {
		$common.extend(this._els, newEls || {});
	};

	/**
	 * Get page config.
	 *
	 * @return {Object}
	 */
	Page.prototype._getConfig = function() {
		return this._config;
	};

	/**
	 * Get page element.
	 *
	 * @param  {String} name
	 * @return {NodeElement}
	 */
	Page.prototype._getEl = function(name) {
		return this._els[name];
	};

	/**
	 * Abstract method.
	 */
	Page.prototype._show = function() {
	};

	return Page;
}]);
