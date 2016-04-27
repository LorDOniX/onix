onix.factory("Page", [
	"$dom",
	"$template",
	"$common",
	"$event",
	"Config",
function(
	$dom,
	$template,
	$common,
	$event,
	Config
) {

	// private Page obj
	var Page = {
		/**
		 * Set config.
		 *
		 * @param {Object} config
		 */
		setConfig: function(config) {
			this._config = config;
		},

		/**
		 * Init page - called from App; runs _afterInit
		 * 
		 */
		init: function() {
			var config = this._getConfig();
			this._els = {};

			// each page contanins only one detail div
			var rootEl = $dom.get(Config.DETAIL_SEL);

			if (config.els) {
				this._els = $dom.get(config.els, rootEl);
			}

			$template.bindTemplate(rootEl, this);

			this._afterInit();
		},

		/**
		 * Get page element by his name.
		 *
		 * @param  {String} name
		 * @return {NodeElemetn}     
		 */
		_getEl: function(name) {
			return this._els[name];
		},

		/**
		 * Get page config.
		 *
		 * @return {Object}
		 */
		_getConfig: function() {
			return this._config || {};
		},

		/**
		 * After init
		 *
		 * @abstract
		 */
		_afterInit: function() {

		},

		/**
		 * Add new els to this._els; this function can be called from $template
		 *
		 * @param {Object} newEls
		 */
		addEls: function(newEls) {
			newEls = newEls || {};

			Object.keys(newEls).forEach(function(key) {
				this._els[key] = newEls[key];
			}, this);
		}
	};

	// public
	return {
		/**
		 * Create new page object from: Page and $event are merged together.
		 * Priority from left to right.
		 * 
		 * @return {Page}
		 */
		create: function() {
			return $common.create(Page, $event);
		}
	};

}]);
