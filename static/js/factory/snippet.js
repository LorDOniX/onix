testApp.factory("Snippet", [
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
		 * Get directive element.
		 *
		 * @param  {String} name
		 * @return {NodeElement}
		 */
		_getEl: function(name) {
			return this._els[name];
		},

		/**
		 * Get directive parent.
		 *
		 * @return {NodeElement}
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
		 * Set directive name.
		 *
		 * @param {String} name
		 */
		_setName: function(name) {
			this._name = name;
		},

		/**
		 * Setup directive.
		 *
		 * @abstract
		 */
		_setup: function() {

		},

		/**
		 * Activete directive.
		 *
		 * @abstract
		 */
		_activate: function() {

		},

		/**
		 * Deactivate directive.
		 *
		 * @abstract
		 */
		_deactivate: function() {

		},

		/**
		 * Is directive locked for change?
		 *
		 * @abstract
		 * @return {Boolean}
		 */
		_isLocked: function() {
			return false;
		},

		/**
		 * Init directive
		 *
		 * @param  {Object} config
		 * @param  {Object} parent parent page
		 * @return {NodeElement} root el
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
		 * Setup directive - is called after init. Runs _setup()
		 */
		setup: function() {
			$template.bindTemplate(this._root, this);
			
			this._setup();
		},

		/**
		 * Activate directive - run _activate()
		 */
		activate: function() {
			this._activate();
		},

		/**
		 * Deactivate directive - run _deactivate()
		 */
		deactivate: function() {
			this._deactivate();
		},

		/**
		 * Get directive name.
		 *
		 * @return {String}
		 */
		getName: function() {
			return this._name;
		},

		/**
		 * Is directive locked for change?
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
