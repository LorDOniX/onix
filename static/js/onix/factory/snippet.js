Onix.factory("Snippet", [
	"Templates",
	"Common",
function(
	Templates,
	Common
) {
	// ------------------------ private ---------------------------------------
	
	var Snippet = {
		/**
		 * Get snippet config.
		 * @return {Object}
		 */
		_getConfig: function() {
			return this._config;
		},

		/**
		 * Get snippet element.
		 * @param  {String} name
		 * @return {NodeElement}
		 */
		_getEl: function(name) {
			return this._els[name];
		},

		/**
		 * Get snippet parent.
		 * @return {NodeElement}
		 */
		_getParent: function() {
			return this._parent;
		},

		/**
		 * Abstract method.
		 * @param  {Object} config
		 */
		_create: function(config) {
			return null;
		},

		/**
		 * Set snippet name.
		 * @param {String} name
		 */
		_setName: function(name) {
			this._name = name;
		},

		/**
		 * Abstract method.
		 */
		_setup: function() {

		},

		/**
		 * Abstract method.
		 */
		_activate: function() {

		},

		/**
		 * Abstract method.
		 */
		_deactivate: function() {

		},

		// ------------------------ public ----------------------------------------
		
		/**
		 * Init snippet
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
		 * Add new els to this._els; this function can be called from Templates
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
			Templates.bindTemplate(this._root, this);
			
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
		 * @return {String}
		 */
		getName: function() {
			return this._name;
		}
	};

	// --- public ----
	
	return {
		/**
		 * Create new snippet
		 * @param  {Object|Function} a snippet data | dependicies
		 * @param  {Object|Function} [b] snippet data | dependicies
		 * @return {Page}
		 */
		create: function(a, b) {
			return Common.create(Snippet, a, b);
		}
	};
}]);
