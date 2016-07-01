onix.provider("$i18n", function() {
	/**
	 * All langs data.
	 *
	 * @type {Object}
	 * @member $i18nProvider
	 * @private
	 */
	let _langs = {};

	/**
	 * Current language-
	 *
	 * @type {String}
	 * @member $i18nProvider
	 * @private
	 */
	let _currentLang = "";

	/**
	 * Bind global _ as translation function-
	 *
	 * @type {String}
	 * @member $i18nProvider
	 * @private
	 */
	let _bindGlobalTranslation = true;

	/**
	 * Replace translated text by object. This functions is implementation of message format object replace inside the string.
	 *
	 * @param  {String} translate
	 * @param  {Object} [replace] Replace all {} in the string
	 * @return {String}
	 * @member $i18nProvider
	 * @private
	 */
	let _transReplace = function(translate, replace) {
		translate = translate || "";
		replace = replace || {};

		let replaceParts = translate.match(/{[^}]+,.*}|{[^}]*}/g);

		if (replaceParts) {
			let finalReplace = {};

			replaceParts.forEach(part => {
				let key = part;

				if (key.length > 2) {
					key = key.substr(1, key.length - 2);
				}

				// multi
				let parts = key.split(",");
				let name = parts[0].trim();
				let multiPartsObj = {};

				if (parts.length == 2) {
					let multiParts = parts[1].match(/[a-zA-Z0-9_]+{[^}]*}/g);

					if (multiParts) {
						multiParts.forEach(mpart => {
							let mpartSplits = mpart.split("{");
							let mpartValue = mpartSplits[1];
							mpartValue = mpartValue.substr(0, mpartValue.length - 1);

							multiPartsObj[mpartSplits[0].trim()] = mpartValue;
						});
					}
				}

				let replaceValue = name in replace ? replace[name] : "";

				if (typeof replaceValue === "number" && Object.keys(multiPartsObj).length) {
					let multiKey;

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

			Object.keys(finalReplace).forEach(key => {
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
	let _getText = function(key, replace) {
		key = key || "";

		let lObj = _langs[_currentLang];
		let translate = "";

		if (lObj) {
			let parts = key.split(".");
			let len = parts.length;

			parts.every((item, ind) => {
				if (item in lObj) {
					lObj = lObj[item];

					if (ind == len - 1) {
						translate = lObj;

						return false;
					}
				}
				else {
					return false;
				}

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
	let _addLanguage = function(lang, data) {
		if (!lang || !data) return;

		if (!_langs[lang]) {
			_langs[lang] = {};
		}

		// merge
		Object.keys(data).forEach(key => {
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
	let _setLanguage = function(lang) {
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
	 * Function that creates $i18n.
	 * 
	 * @member $i18nProvider
	 * @return {Array}
	 */
	this.$get = ["$http", "$promise", function(
				$http, $promise) {
		
		/**
		 * Language support, string translation with support for message format syntax.
		 * 
		 * @class $i18n
		 */
		class $i18n {
			/**
			 * Get text function. Translate for the current language and the key.
			 *
			 * @param  {String} key
			 * @param  {Object} [replace] Replace all {} in the string
			 * @return {String}
			 * @member $i18n
			 * @method _
			 */
			_(key, replace) {
				return _getText(key, replace);
			}

			/**
			 * Add a new language.
			 *
			 * @param {String} lang Language key
			 * @param {Object} data
			 * @member $i18n
			 * @method addLanguage
			 */
			addLanguage(lang, data) {
				_addLanguage(lang, data);
			}

			/**
			 * Set new language by his key.
			 *
			 * @param {String} lang Language key
			 * @member $i18n
			 * @method setLanguage
			 */
			setLanguage(lang) {
				_setLanguage(lang);
			}

			/**
			 * Get current language key.
			 *
			 * @return {String} Language key
			 * @member $i18n
			 * @method getLanguage
			 */
			getLanguage(lang) {
				return _currentLang;
			}

			/**
			 * Get all languages keys.
			 *
			 * @return {Array[String]} Languages keys
			 * @member $i18n
			 * @method getAllLanguages
			 */
			getAllLanguages(lang) {
				return Object.keys(_langs);
			}

			/**
			 * Load language from the file.
			 *
			 * @param  {String} lang Language key
			 * @param  {String} url  Path to the file
			 * @return {$promise}
			 * @member $i18n
			 * @method loadLanguage
			 */
			loadLanguage(lang, url) {
				return new $promise((resolve, reject) => {
					$http.createRequest({
						url: url
					}).then(okData => {
						_addLanguage(lang, okData.data);

						resolve();
					}, errorData => {
						reject(errorData);
					});
				});
			}
		};

		return new $i18n();
	}];
});

/**
 * Provider for registering _ translate object.
 */
onix.config(["$i18nProvider", function($i18nProvider) {
	$i18nProvider.postProcess();
}]);
