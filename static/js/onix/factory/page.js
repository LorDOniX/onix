Onix.factory("Page", [
	"DOM",
	"Templates",
	"CONFIG",
function(
	DOM,
	Templates,
	CONFIG
) {
	return {
		// ------------------------ private ---------------------------------------
		
		/**
		 * Set config.
		 * @param {Object} config
		 */
		_setConfig: function(config) {
			this._config = config;
		},

		/**
		 * Init page - called from App; runs _afterInit
		 */
		_init: function() {
			var config = this._getConfig();
			this._els = {};

			// each page contanins only one detail div
			var rootEl = DOM.get(CONFIG.DETAIL_SEL);

			if (config.els) {
				this._els = DOM.get(config.els, rootEl);
			}

			Templates.bindTemplate(rootEl, this);

			this._afterInit();
		},

		/**
		 * Get page element by his name.
		 * @param  {String} name
		 * @return {NodeElemetn}     
		 */
		_getEl: function(name) {
			return this._els[name];
		},

		/**
		 * Get page config.
		 * @return {Object}
		 */
		_getConfig: function() {
			return this._config || {};
		},

		/**
		 * Get page data object.
		 * @return {Object}
		 */
		_getPageData: function() {
			return this._config && this._config.js_data ? this._config.js_data : {};
		},

		/**
		 * Abstract method
		 */
		_afterInit: function() {

		},

		// ------------------------ public ----------------------------------------

		/**
		 * Add new els to this._els; this function can be called from Templates
		 * @param {Object} newEls
		 */
		addEls: function(newEls) {
			newEls = newEls || {};

			Object.keys(newEls).forEach(function(key) {
				this._els[key] = newEls[key];
			}, this);
		}
	};
}]);
