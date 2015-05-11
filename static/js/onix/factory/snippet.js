Onix.factory("Snippet", [
	"Templates",
	"Common",
function(
	Templates,
	Common
) {
	/**
	 * @interface _Snippet
	 * @description Parent: Snippet;
	 */
	var _Snippet = {
		/**
		 * Get snippet config.
		 *
		 * @private
		 * @return {Object}
		 * @memberof _Snippet
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
		 * @memberof _Snippet
		 */
		_getEl: function(name) {
			return this._els[name];
		},

		/**
		 * Get snippet parent.
		 *
		 * @private
		 * @return {NodeElement}
		 * @memberof _Snippet
		 */
		_getParent: function() {
			return this._parent;
		},

		/**
		 * Abstract method.
		 *
		 * @private
		 * @param  {Object} config
		 * @memberof _Snippet
		 */
		_create: function(config) {
			return null;
		},

		/**
		 * Set snippet name.
		 *
		 * @private
		 * @param {String} name
		 * @memberof _Snippet
		 */
		_setName: function(name) {
			this._name = name;
		},

		/**
		 * Setup
		 *
		 * @private
		 * @abstract
		 * @memberof _Snippet
		 */
		_setup: function() {

		},

		/**
		 * Active
		 *
		 * @private
		 * @abstract
		 * @memberof _Snippet
		 */
		_activate: function() {

		},

		/**
		 * Deactivate
		 *
		 * @private
		 * @abstract
		 * @memberof _Snippet
		 */
		_deactivate: function() {

		},

		/**
		 * Init snippet
		 *
		 * @public
		 * @param  {Object} config
		 * @param  {Object} parent parent page
		 * @return {NodeElement} root el
		 * @memberof _Snippet
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
		 * Add new els to this._els; this function can be called from Templates
		 *
		 * @public
		 * @param {Object} newEls { key, value - node element}
		 * @memberof _Snippet
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
		 * @memberof _Snippet
		 */
		setup: function() {
			Templates.bindTemplate(this._root, this);
			
			this._setup();
		},

		/**
		 * Activate snippet - run _activate()
		 *
		 * @public
		 * @memberof _Snippet
		 */
		activate: function() {
			this._activate();
		},

		/**
		 * Deactivate snippet - run _deactivate()
		 *
		 * @public
		 * @memberof _Snippet
		 */
		deactivate: function() {
			this._deactivate();
		},

		/**
		 * Get snippet name.
		 *
		 * @public
		 * @return {String}
		 * @memberof _Snippet
		 */
		getName: function() {
			return this._name;
		}
	};

	/**
 	 * @namespace Snippet
 	 * @description DI: Templates, Common;
 	 */
	return {
		/**
		 * Create a new snippet
		 *
		 * @public
		 * @param  {Object|Function} a snippet data | dependicies
		 * @param  {Object|Function} [b] snippet data | dependicies
		 * @return {_Snippet}
		 * @memberof Snippet
		 */
		create: function(a, b) {
			return Common.create(_Snippet, a, b);
		}
	};
}]);
