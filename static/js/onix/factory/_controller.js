/**
 * @class $$controller
 * @description DI: $dom, $template, $config;
 */
onix.factory("$$controller", [
	"$dom",
	"$template",
	"$config",
function(
	$dom,
	$template,
	$config
) {
	return {
		/**
		 * Set config.
		 *
		 * @private
		 * @param {Object} config
		 * @memberof $$controller
		 */
		_setConfig: function(config) {
			this._config = config;
		},

		/**
		 * Init controller - called from App; runs _afterInit
		 * 
		 * @private
		 * @memberof $$controller
		 */
		_init: function() {
			var config = this._getConfig();
			this._els = {};

			// each controller contanins only one detail div
			var rootEl = $dom.get($config.DETAIL_SEL);

			if (config.els) {
				this._els = $dom.get(config.els, rootEl);
			}

			$template.bindTemplate(rootEl, this);

			this._afterInit();
		},

		/**
		 * Get controller element by his name.
		 *
		 * @private
		 * @param  {String} name
		 * @return {NodeElemetn}     
		 * @memberof $$controller
		 */
		_getEl: function(name) {
			return this._els[name];
		},

		/**
		 * Get controller config.
		 *
		 * @private
		 * @return {Object}
		 * @memberof $$controller
		 */
		_getConfig: function() {
			return this._config || {};
		},

		/**
		 * Get controller data object.
		 *
		 * @private
		 * @return {Object}
		 * @memberof $$controller
		 */
		_getPageData: function() {
			return this._config && this._config.js_data ? this._config.js_data : {};
		},

		/**
		 * After init
		 *
		 * @private
		 * @abstract
		 * @memberof $$controller
		 */
		_afterInit: function() {

		},

		/**
		 * Add new els to this._els; this function can be called from $template
		 *
		 * @public
		 * @param {Object} newEls
		 * @memberof $$controller
		 */
		addEls: function(newEls) {
			newEls = newEls || {};

			Object.keys(newEls).forEach(function(key) {
				this._els[key] = newEls[key];
			}, this);
		}
	};
}]);
