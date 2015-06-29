/**
 * @class $$directive
 * @description DI: $template;
 */
onix.factory("$$directive", [
	"$template",
function(
	$template
) {
	return {
		/**
		 * Get directive config.
		 *
		 * @private
		 * @return {Object}
		 * @memberof $$directive
		 */
		_getConfig: function() {
			return this._config;
		},

		/**
		 * Get directive element.
		 *
		 * @private
		 * @param  {String} name
		 * @return {NodeElement}
		 * @memberof $$directive
		 */
		_getEl: function(name) {
			return this._els[name];
		},

		/**
		 * Get directive parent.
		 *
		 * @private
		 * @return {NodeElement}
		 * @memberof $$directive
		 */
		_getParent: function() {
			return this._parent;
		},

		/**
		 * Abstract method. Create root element.
		 *
		 * @private
		 * @param  {Object} config
		 * @memberof $$directive
		 */
		_create: function(config) {
			return null;
		},

		/**
		 * Set directive name.
		 *
		 * @private
		 * @param {String} name
		 * @memberof $$directive
		 */
		_setName: function(name) {
			this._name = name;
		},

		/**
		 * Setup directive.
		 *
		 * @private
		 * @abstract
		 * @memberof $$directive
		 */
		_setup: function() {

		},

		/**
		 * Activete directive.
		 *
		 * @private
		 * @abstract
		 * @memberof $$directive
		 */
		_activate: function() {

		},

		/**
		 * Deactivate directive.
		 *
		 * @private
		 * @abstract
		 * @memberof $$directive
		 */
		_deactivate: function() {

		},

		/**
		 * Is directive locked for change?
		 *
		 * @private
		 * @abstract
		 * @memberof $$directive
		 * @return {Boolean}
		 */
		_isLocked: function() {
			return false;
		},

		/**
		 * Init directive
		 *
		 * @public
		 * @param  {Object} config
		 * @param  {Object} parent parent page
		 * @return {NodeElement} root el
		 * @memberof $$directive
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
		 * @public
		 * @param {Object} newEls { key, value - node element}
		 * @memberof $$directive
		 */
		addEls: function(newEls) {
			newEls = newEls || {};

			Object.keys(newEls).forEach(function(key) {
				this._els[key] = newEls[key];
			}, this);
		},

		/**
		 * Setup directive - is called after init. Runs _setup()
		 *
		 * @public
		 * @memberof $$directive
		 */
		setup: function() {
			$template.bindTemplate(this._root, this);
			
			this._setup();
		},

		/**
		 * Activate directive - run _activate()
		 *
		 * @public
		 * @memberof $$directive
		 */
		activate: function() {
			this._activate();
		},

		/**
		 * Deactivate directive - run _deactivate()
		 *
		 * @public
		 * @memberof $$directive
		 */
		deactivate: function() {
			this._deactivate();
		},

		/**
		 * Get directive name.
		 *
		 * @public
		 * @return {String}
		 * @memberof $$directive
		 */
		getName: function() {
			return this._name;
		},

		/**
		 * Is directive locked for change?
		 *
		 * @public
		 * @return {Boolean}
		 * @memberof $$directive
		 */
		isLocked: function() {
			return this._isLocked();
		}
	};
}]);
