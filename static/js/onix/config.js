/**
 * Main framework configuration
 * @namespace CONFIG
 */
onix.config({
	/**
	 * Localization
	 *
	 * @public
	 * @type {Object}
	 * @memberof CONFIG
	 */
	LOCALIZATION: {
		LANG: "cs",
		PATH: "/js/locale/cs.json"
	},

	/**
	 * Resource urls
	 *
	 * @public
	 * @type {Object}
	 * @memberof CONFIG
	 */
	URLS: {
		HOME: "/api/home/"
	},

	/**
	 * Template delimiter
	 *
	 * @public
	 * @type {Object}
	 * @memberof CONFIG
	 */
	TMPL_DELIMITER: {
		LEFT: "{{",
		RIGHT: "}}"
	},

	/**
	 * Detail page selector
	 *
	 * @public
	 * @type {String}
	 * @memberof CONFIG
	 */
	DETAIL_SEL: ".detail"
});
