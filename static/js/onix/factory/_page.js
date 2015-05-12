onix.factory("$$page", [
	"$dom",
	"$template",
	"$config",
function(
	$dom,
	$template,
	$config
) {
	/**
	 * @interface $$page
	 * @description DI: $dom, $template, $config;
	 */
	return {
		/**
		 * Set config.
		 *
		 * @private
		 * @param {Object} config
		 * @memberof $$page
		 */
		_setConfig: function(config) {
			this._config = config;
		},

		/**
		 * Init page - called from App; runs _afterInit
		 * 
		 * @private
		 * @memberof $$page
		 */
		_init: function() {
			var config = this._getConfig();
			this._els = {};

			// each page contanins only one detail div
			var rootEl = $dom.get($config.DETAIL_SEL);

			if (config.els) {
				this._els = $dom.get(config.els, rootEl);
			}

			$template.bindTemplate(rootEl, this);

			this._afterInit();
		},

		/**
		 * Get page element by his name.
		 *
		 * @private
		 * @param  {String} name
		 * @return {NodeElemetn}     
		 * @memberof $$page
		 */
		_getEl: function(name) {
			return this._els[name];
		},

		/**
		 * Get page config.
		 *
		 * @private
		 * @return {Object}
		 * @memberof $$page
		 */
		_getConfig: function() {
			return this._config || {};
		},

		/**
		 * Get page data object.
		 *
		 * @private
		 * @return {Object}
		 * @memberof $$page
		 */
		_getPageData: function() {
			return this._config && this._config.js_data ? this._config.js_data : {};
		},

		/**
		 * After init
		 *
		 * @private
		 * @abstract
		 * @memberof $$page
		 */
		_afterInit: function() {

		},

		/**
		 * Add new els to this._els; this function can be called from $template
		 *
		 * @public
		 * @param {Object} newEls
		 * @memberof $$page
		 */
		addEls: function(newEls) {
			newEls = newEls || {};

			Object.keys(newEls).forEach(function(key) {
				this._els[key] = newEls[key];
			}, this);
		}
	};
}]);
