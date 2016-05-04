app.factory("Page", [
	"$dom",
	"$template",
	"$common",
	"$event",
function(
	$dom,
	$template,
	$common,
	$event
) {
	var Page = {
		/**
		 * Object for data-bind elements references
		 * 
		 * @type {Object}
		 */
		_els: {

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
		 * Add new elements to this._els; this function can be called from $template
		 *
		 * @param {Object} newEls
		 */
		_addEls: function(newEls) {
			newEls = newEls || {};

			Object.keys(newEls).forEach(function(key) {
				this._els[key] = newEls[key];
			}, this);
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
			var root = onix.element("body").html($template.compile(config.templ || "", this));

			if (config.els) {
				this._addEls($dom.get(config.els, root));
			}

			$template.bindTemplate(root, this, this._addEls.bind(this));

			this._afterInit();
		}
	};

	// public
	return {
		/**
		 * Create new page object from Page
		 * 
		 * @return {Page}
		 */
		create: function() {
			var page = $common.merge(Page);

			$event.bindEvents(page);

			return page;
		}
	};
}]);
