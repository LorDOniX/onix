homeApp.factory("Snippet", [
	"$template",
	"$common",
function(
	$template,
	$common
) {
	/**
	 * Snippet
	 */
	var Snippet = function() {
	};

	/**
	 * Constructor for snippet.
	 *
	 * @param {Object} config Config for snippet
	 * @param {Object} parent Parent object
	 */
	Snippet.prototype._constructor = function(config, parent) {
		// Object for data-bind elements references
		this._els = {};

		this._config = config || {};
		this._parent = parent;
		this._root = this._create(config);

		$template.bindTemplate(this._root, this, this._addEls.bind(this));

		this._show();
	};

	/**
	 * Add new els to this._els; this function can be called from $template
	 *
	 * @param {Object} newEls { key, value - node element}
	 */
	Snippet.prototype._addEls = function(newEls) {
		$common.extend(this._els, newEls || {});
	};

	/**
	 * Get Snippet config.
	 *
	 * @return {Object}
	 */
	Snippet.prototype._getConfig = function() {
		return this._config;
	};

	/**
	 * Get snippet element.
	 *
	 * @param  {String} name
	 * @return {NodeElement}
	 */
	Snippet.prototype._getEl = function(name) {
		return this._els[name];
	};

	/**
	 * Get snippet parent.
	 *
	 * @return {NodeElement}
	 */
	Snippet.prototype._getParent = function() {
		return this._parent;
	};

	/**
	 * Abstract method. Create root element.
	 *
	 * @param  {Object} config
	 */
	Snippet.prototype._create = function(config) {
		return null;
	};

	/**
	 * Abstract method.
	 */
	Snippet.prototype._show = function() {
	};

	/**
	 * Is snippet locked for change?
	 *
	 * @return {Boolean}
	 */
	Snippet.prototype.isLocked = function() {
		return false;
	};

	/**
	 * Return root el.
	 *
	 * @return {HTMLElement}
	 */
	Snippet.prototype.getRoot = function() {
		return this._root;
	};

	/**
	 * Destroy snippet.
	 */
	Snippet.prototype.destructor = function() {
	};

	return Snippet;
}]);
