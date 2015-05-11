Onix.factory("Page", [
	"DOM",
	"Templates",
	"Common",
function(
	DOM,
	Templates,
	Common
) {
	/**
	 * @interface _Page
	 * @description Parent: Page;
	 */
	var _Page = {
		/**
		 * Set config.
		 *
		 * @private
		 * @param {Object} config
		 * @memberof _Page
		 */
		_setConfig: function(config) {
			this._config = config;
		},

		/**
		 * Init page - called from App; runs _afterInit
		 * 
		 * @private
		 * @memberof _Page
		 */
		_init: function() {
			var config = this._getConfig();
			this._els = {};

			// each page contanins only one detail div
			var rootEl = DOM.get(Onix.config("DETAIL_SEL"));

			if (config.els) {
				this._els = DOM.get(config.els, rootEl);
			}

			Templates.bindTemplate(rootEl, this);

			this._afterInit();
		},

		/**
		 * Get page element by his name.
		 *
		 * @private
		 * @param  {String} name
		 * @return {NodeElemetn}     
		 * @memberof _Page
		 */
		_getEl: function(name) {
			return this._els[name];
		},

		/**
		 * Get page config.
		 *
		 * @private
		 * @return {Object}
		 * @memberof _Page
		 */
		_getConfig: function() {
			return this._config || {};
		},

		/**
		 * Get page data object.
		 *
		 * @private
		 * @return {Object}
		 * @memberof _Page
		 */
		_getPageData: function() {
			return this._config && this._config.js_data ? this._config.js_data : {};
		},

		/**
		 * After init
		 *
		 * @private
		 * @abstract
		 * @memberof _Page
		 */
		_afterInit: function() {

		},

		/**
		 * Add new els to this._els; this function can be called from Templates
		 *
		 * @public
		 * @param {Object} newEls
		 * @memberof _Page
		 */
		addEls: function(newEls) {
			newEls = newEls || {};

			Object.keys(newEls).forEach(function(key) {
				this._els[key] = newEls[key];
			}, this);
		}
	};

	/**
 	 * @namespace Page
 	 * @description DI: DOM, Templates, Common;
 	 */
	return {
		/**
		 * Create a new page
		 *
		 * @public
		 * @param  {Object|Function} a page data | dependicies
		 * @param  {Object|Function} [b] page data | dependicies
		 * @return {_Page}
		 * @memberof Page
		 */
		create: function(a, b) {
			return Common.create(_Page, a, b);
		}
	};
}]);
