onix.provider("$i18n", function() {
	/**
	 * All langs data.
	 *
	 * @type {Object}
	 * @member $i18nProvider
	 * @private
	 */
	var _langs = {};

	/**
	 * Current language-
	 *
	 * @type {String}
	 * @member $i18nProvider
	 * @private
	 */
	var _currentLang = "";

	/**
	 * Bind global _ as translation function-
	 *
	 * @type {String}
	 * @member $i18nProvider
	 * @private
	 */
	var _bindGlobalTranslation = true;

	/**
	 * Replace translated text by object. This functions is implementation of message format object replace inside the string.
	 *
	 * @param  {String} translate
	 * @param  {Object} [replace] Replace all {} in the string
	 * @return {String}
	 * @member $i18nProvider
	 * @private
	 */
	var _transReplace = function(translate, replace) {
		translate = translate || "";
		replace = replace || {};

		var replaceParts = translate.match(/{[^}]+,.*}|{[^}]*}/g);

		if (replaceParts) {
			var finalReplace = {};

			replaceParts.forEach(function(part) {
				var key = part;

				if (key.length > 2) {
					key = key.substr(1, key.length - 2);
				}

				// multi
				var parts = key.split(",");
				var name = parts[0].trim();
				var multiPartsObj = {};

				if (parts.length == 2) {
					var multiParts = parts[1].match(/[a-zA-Z0-9_]+{[^}]*}/g);

					if (multiParts) {
						multiParts.forEach(function(mpart) {
							var mpartSplits = mpart.split("{");
							var mpartValue = mpartSplits[1];
							mpartValue = mpartValue.substr(0, mpartValue.length - 1);

							multiPartsObj[mpartSplits[0].trim()] = mpartValue;
						});
					}
				}

				var replaceValue = name in replace ? replace[name] : "";

				if (typeof replaceValue === "number" && Object.keys(multiPartsObj).length) {
					var multiKey;

					switch (replaceValue) {
						case 1:
							multiKey = "one";
							break;

						case 2:
						case 3:
						case 4:
							multiKey = "few";
							break;

						default:
							multiKey = "other";
					}

					replaceValue = multiKey in multiPartsObj ? multiPartsObj[multiKey] : "";
				}

				finalReplace[part] = replaceValue;
			});

			Object.keys(finalReplace).forEach(function(key) {
				translate = translate.replace(new RegExp(key, "g"), finalReplace[key]);
			});
		}

		return translate;
	};

	/**
	 * Get text function. Translate for the current language and the key.
	 *
	 * @param  {String} key
	 * @param  {Object} [replace] Replace all {} in the string
	 * @return {String}
	 * @member $i18nProvider
	 * @private
	 */
	var _getText = function(key, replace) {
		key = key || "";
		var lObj = _langs[_currentLang];
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

		return _transReplace(translate, replace);
	};

	/**
	 * Add a new language.
	 *
	 * @param {String} lang Language key
	 * @param {Object} data
	 * @member $i18nProvider
	 * @private
	 */
	var _addLanguage = function(lang, data) {
		if (!lang || !data) return;

		if (!_langs[lang]) {
			_langs[lang] = {};
		}

		// merge
		Object.keys(data).forEach(function(key) {
			_langs[lang][key] = data[key];
		});
	};

	/**
	 * Set new language by his key.
	 *
	 * @param {String} lang Language key
	 * @member $i18nProvider
	 * @private
	 */
	var _setLanguage = function(lang) {
		_currentLang = lang || "";
	};

	/**
	 * Disable global translation in _
	 *
	 * @member $i18nProvider
	 */
	this.disableGlobalTranslation = function() {
		_bindGlobalTranslation = false;
	};

	/**
	 * Add a new language.
	 *
	 * @param {String} lang Language key
	 * @param {Object} data
	 * @member $i18nProvider
	 */
	this.addLanguage = function(lang, data) {
		_addLanguage(lang, data);
	};

	/**
	 * Set new language by his key.
	 *
	 * @param {String} lang Language key
	 * @member $i18nProvider
	 */
	this.setLanguage = function(lang) {
		_setLanguage(lang);
	};

	/**
	 * Post process during config phase.
	 *
	 * @member $i18nProvider
	 */
	this.postProcess = function() {
		if (_bindGlobalTranslation) {
			/**
			 * Get text function. Translate for the current language and the key.
			 *
			 * @param  {String} key
			 * @param  {Object} [replace] Replace all {} in the string
			 * @return {String}
			 * @member window
			 * @property {Function}
			 */
			window._ = _getText;
		}
	};

	/**
	 * Language support, string translation with support for message format syntax.
	 * 
	 * @class $i18n
	 */
	this.$get = ["$http", "$promise", function(
				$http, $promise) {
		
		var $i18n = {
			/**
			 * Get text function. Translate for the current language and the key.
			 *
			 * @param  {String} key
			 * @param  {Object} [replace] Replace all {} in the string
			 * @return {String}
			 * @member $i18n
			 */
			_: function(key, replace) {
				return _getText(key, replace);
			},

			/**
			 * Add a new language.
			 *
			 * @param {String} lang Language key
			 * @param {Object} data
			 * @member $i18n
			 */
			addLanguage: function(lang, data) {
				_addLanguage(lang, data);
			},

			/**
			 * Set new language by his key.
			 *
			 * @param {String} lang Language key
			 * @member $i18n
			 */
			setLanguage: function(lang) {
				_setLanguage(lang);
			},

			/**
			 * Get current language key.
			 *
			 * @return {String} Language key
			 * @member $i18n
			 */
			getLanguage: function(lang) {
				return _currentLang;
			},

			/**
			 * Get all languages keys.
			 *
			 * @return {Array[String]} Languages keys
			 * @member $i18n
			 */
			getAllLanguages: function(lang) {
				return Object.keys(_langs);
			},

			/**
			 * Load language from the file.
			 *
			 * @param  {String} lang Language key
			 * @param  {String} url  Path to the file
			 * @return {$promise}
			 * @member $i18n
			 */
			loadLanguage: function(lang, url) {
				return new $promise(function(resolve, reject) {
					$http.createRequest({
						url: url
					}).then(function(data) {
						_addLanguage(lang, data.data);
						resolve();
					}, function(data) {
						reject(data);
					});
				});
			}
		};

		return $i18n;
	}];
});

/**
 * Provider for registering _ translate object.
 *
 * @private
 * @member onix
 */
onix.config(["$i18nProvider", function($i18nProvider) {
	$i18nProvider.postProcess();
}]);
