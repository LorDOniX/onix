homeApp.factory("Snippet", [
	"$template",
	"$common",
	"$event",
function(
	$template,
	$common,
	$event
) {
	/**
	 * Snippet
	 */
	class Snippet extends $event {
		constructor(config) {
			super();

			// event init
			this._eventInit();
		}

		/**
		 * Constructor for snippet.
		 *
		 * @param {Object} config Config for snippet
		 * @param {Object} parent Parent object
		 */
		_constructor(config, parent) {
			// Object for data-bind elements references
			this._els = {};

			this._config = config || {};
			this._parent = parent;
			this._root = this._create(config);

			$template.bindTemplate(this._root, this, this._addEls.bind(this));

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
		 * Get Snippet config.
		 *
		 * @return {Object}
		 */
		_getConfig() {
			return this._config;
		}

		/**
		 * Get snippet element.
		 *
		 * @param  {String} name
		 * @return {NodeElement}
		 */
		_getEl(name) {
			return this._els[name];
		}

		/**
		 * Get snippet parent.
		 *
		 * @return {NodeElement}
		 */
		_getParent() {
			return this._parent;
		}

		/**
		 * Abstract method. Create root element.
		 *
		 * @param  {Object} config
		 */
		_create(config) {
			return null;
		}

		/**
		 * Abstract method.
		 */
		_show() {
		}

		/**
		 * Is snippet locked for change?
		 *
		 * @return {Boolean}
		 */
		isLocked() {
			return false;
		}

		/**
		 * Return root el.
		 *
		 * @return {HTMLElement}
		 */
		getRoot() {
			return this._root;
		}

		/**
		 * Destroy snippet.
		 */
		destructor() {
		}
	};

	return Snippet;
}]);
