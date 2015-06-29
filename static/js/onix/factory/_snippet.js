onix.factory("$$snippet", [
	"$templates",
function(
	$templates
) {
	/**
	 * @interface $$snippet
	 */
	return {
		/**
		 * Get snippet config.
		 *
		 * @private
		 * @return {Object}
		 * @memberof $$snippet
		 */
		_getConfig: function() {
			return this._config;
		},

		/**
		 * Get snippet element.
		 *
		 * @private
		 * @param  {String} name
		 * @return {NodeElement}
		 * @memberof $$snippet
		 */
		_getEl: function(name) {
			return this._els[name];
		},

		/**
		 * Get snippet parent.
		 *
		 * @private
		 * @return {NodeElement}
		 * @memberof $$snippet
		 */
		_getParent: function() {
			return this._parent;
		},

		/**
		 * Abstract method.
		 *
		 * @private
		 * @param  {Object} config
		 * @memberof $$snippet
		 */
		_create: function(config) {
			return null;
		},

		/**
		 * Set snippet name.
		 *
		 * @private
		 * @param {String} name
		 * @memberof $$snippet
		 */
		_setName: function(name) {
			this._name = name;
		},

		/**
		 * Setup
		 *
		 * @private
		 * @abstract
		 * @memberof $$snippet
		 */
		_setup: function() {

		},

		/**
		 * Active
		 *
		 * @private
		 * @abstract
		 * @memberof $$snippet
		 */
		_activate: function() {

		},

		/**
		 * Deactivate
		 *
		 * @private
		 * @abstract
		 * @memberof $$snippet
		 */
		_deactivate: function() {

		},

		/**
		 * Is snippet locked for change?
		 *
		 * @private
		 * @abstract
		 * @memberof _Snippet
		 * @return {Boolean}
		 */
		_isLocked: function() {
			return false;
		},

		/**
		 * Init snippet
		 *
		 * @public
		 * @param  {Object} config
		 * @param  {Object} parent parent page
		 * @return {NodeElement} root el
		 * @memberof $$snippet
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
		 * Add new els to this._els; this function can be called from $templates
		 *
		 * @public
		 * @param {Object} newEls { key, value - node element}
		 * @memberof $$snippet
		 */
		addEls: function(newEls) {
			newEls = newEls || {};

			Object.keys(newEls).forEach(function(key) {
				this._els[key] = newEls[key];
			}, this);
		},

		/**
		 * Setup snippet - is called after init. Runs _setup()
		 *
		 * @public
		 * @memberof $$snippet
		 */
		setup: function() {
			$templates.bindTemplate(this._root, this);
			
			this._setup();
		},

		/**
		 * Activate snippet - run _activate()
		 *
		 * @public
		 * @memberof $$snippet
		 */
		activate: function() {
			this._activate();
		},

		/**
		 * Deactivate snippet - run _deactivate()
		 *
		 * @public
		 * @memberof $$snippet
		 */
		deactivate: function() {
			this._deactivate();
		},

		/**
		 * Get snippet name.
		 *
		 * @public
		 * @return {String}
		 * @memberof $$snippet
		 */
		getName: function() {
			return this._name;
		},

		/**
		 * Is snippet locked for change?
		 *
		 * @public
		 * @memberof _Snippet
		 * @return {Boolean}
		 */
		isLocked: function() {
			return this._isLocked();
		}
	};
}]);
