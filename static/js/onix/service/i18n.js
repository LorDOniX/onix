/**
 * @namespace i18n
 * @description DI: Http, Promise;
 */
onix.service("i18n", [
	"Http",
	"Promise",
function(
	Http,
	Promise
) {
	/**
	 * All langs data.
	 *
	 * @private
	 * @type {Object}
	 * @memberof i18n
	 */
	this._langs = {};

	/**
	 * Current language
	 *
	 * @private
	 * @type {String}
	 * @memberof i18n
	 */
	this._currentLang = "";

	/**
	 * Add new language
	 *
	 * @public
	 * @param {String} lang Language key
	 * @param {Object} data
	 * @memberof i18n
	 */
	this.addLanguage = function(lang, data) {
		this._langs[lang] = data;
	};

	/**
	 * Set new language by his key.
	 *
	 * @public
	 * @param {String} lang Language key
	 * @memberof i18n
	 */
	this.setLanguage = function(lang) {
		this._currentLang = lang;
	};

	/**
	 * Get text function. Translate for the current language and the key.
	 *
	 * @public
	 * @param  {String} key
	 * @return {String}    
	 */
	this._ = function(key) {
		key = key || "";
		var lObj = this._langs[this._currentLang];
		var translate = "";

		if (lObj) {
			var parts = key.split(".");
			var len = parts.length;

			parts.every(function(item, ind) {
				if (item in lObj) {
					lObj = lObj[item];

					if (ind == len - 1) {
						translate = lObj;
						return false;
					}
				}
				else return false;

				// go on
				return true;
			});
		}

		return translate;
	};

	/**
	 * Load language from the file.
	 *
	 * @public
	 * @param  {String} lang Language key
	 * @param  {String} url  Path to the file
	 * @return {Promise}
	 * @memberof i18n
	 */
	this.loadLanguage = function(lang, url) {
		var promise = Promise.defer();

		Http.createRequest({
			url: url
		}).then(function(data) {
			this.addLanguage(lang, data.data);
			promise.resolve();
		}.bind(this), function(data) {
			promise.resolve();
		});

		return promise;
	};
}]);
