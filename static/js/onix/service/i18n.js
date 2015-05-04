Onix.service("i18n", [
	"Http",
	"Promise",
function(
	Http,
	Promise
) {
	// ------------------------ private ---------------------------------------
	
	/**
	 * All langs data.
	 * @type {Object}
	 */
	this._langs = {};

	/**
	 * Current language
	 * @type {String}
	 */
	this._currentLang = "";

	// ------------------------ public ----------------------------------------

	/**
	 * Add new language
	 * @param {String} lang Language key
	 * @param {Object} data
	 */
	this.addLanguage = function(lang, data) {
		this._langs[lang] = data;
	};

	/**
	 * Set new language by his key.
	 * @param {String} lang Language key
	 */
	this.setLanguage = function(lang) {
		this._currentLang = lang;
	};

	/**
	 * Get text function. Translate for the current language and the key.
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
	 * @param  {String} lang Language key
	 * @param  {String} url  Path to the file
	 * @return {Promise}
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
