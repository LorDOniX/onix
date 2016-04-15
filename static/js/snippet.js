onix.factory("Snippet", [
	"$template",
	"$common",
	"$event",
function(
	$template,
	$common,
	$event
) {

	// private Snippet obj
	var Snippet = {
		/**
		 * Get Snippet config.
		 *
		 * @return {Object}
		 */
		_getConfig: function() {
			return this._config;
		},

		/**
		 * Get snippet element.
		 *
		 * @param  {String} name
		 * @return {HTMLElement}
		 */
		_getEl: function(name) {
			return this._els[name];
		},

		/**
		 * Get snippet parent.
		 *
		 * @return {HTMLElement}
		 */
		_getParent: function() {
			return this._parent;
		},

		/**
		 * Abstract method. Create root element.
		 *
		 * @param  {Object} config
		 */
		_create: function(config) {
			return null;
		},

		/**
		 * Set snippet name.
		 *
		 * @param {String} name
		 */
		_setName: function(name) {
			this._name = name;
		},

		/**
		 * Setup snippet.
		 *
		 * @abstract
		 */
		_setup: function() {

		},

		/**
		 * Activete snippet.
		 *
		 * @abstract
		 */
		_activate: function() {

		},

		/**
		 * Deactivate snippet.
		 *
		 * @abstract
		 */
		_deactivate: function() {

		},

		/**
		 * Is snippet locked for change?
		 *
		 * @abstract
		 * @return {Boolean}
		 */
		_isLocked: function() {
			return false;
		},

		/**
		 * Init snippet
		 *
		 * @param  {Object} config
		 * @param  {Object} parent parent page
		 * @return {HTMLElement} root el
		 */
		init: function(config, parent) {
			this._config = config || {};
			this._parent = parent;
			this._els = {};
			this._name = "";
			this._root = this._create(config);

			return this._root;
		},

		/**
		 * Add new els to this._els; this function can be called from $template
		 *
		 * @param {Object} newEls { key, value - node element}
		 */
		addEls: function(newEls) {
			newEls = newEls || {};

			Object.keys(newEls).forEach(function(key) {
				this._els[key] = newEls[key];
			}, this);
		},

		/**
		 * Setup snippet - is called after init. Runs _setup()
		 */
		setup: function() {
			$template.bindTemplate(this._root, this);
			
			this._setup();
		},

		/**
		 * Activate snippet - run _activate()
		 */
		activate: function() {
			this._activate();
		},

		/**
		 * Deactivate snippet - run _deactivate()
		 */
		deactivate: function() {
			this._deactivate();
		},

		/**
		 * Get snippet name.
		 *
		 * @return {String}
		 */
		getName: function() {
			return this._name;
		},

		/**
		 * Is snippet locked for change?
		 *
		 * @return {Boolean}
		 */
		isLocked: function() {
			return this._isLocked();
		}
	};

	// public
	return {
		/**
		 * Create new page object from: Snippet and $event are merged together.
		 * Priority from left to right.
		 * 
		 * @return {Snippet}
		 */
		create: function() {
			return $common.create(Snippet, $event);
		}
	};

}]);
