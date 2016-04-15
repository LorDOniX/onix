/**
 * @class $i18n
 */
onix.service("$i18n", [
	"$http",
	"$q",
function(
	$http,
	$q
) {
	/**
	 * All langs data.
	 *
	 * @private
	 * @type {Object}
	 * @member $i18n
	 * @private
	 */
	this._langs = {};

	/**
	 * Current language
	 *
	 * @private
	 * @type {String}
	 * @member $i18n
	 * @private
	 */
	this._currentLang = "";

	/**
	 * Add a new language
	 *
	 * @param {String} lang Language key
	 * @param {Object} data
	 * @member $i18n
	 */
	this.addLanguage = function(lang, data) {
		this._langs[lang] = data;
	};

	/**
	 * Set new language by his key.
	 *
	 * @param {String} lang Language key
	 * @member $i18n
	 */
	this.setLanguage = function(lang) {
		this._currentLang = lang;
	};

	/**
	 * Get text function. Translate for the current language and the key.
	 *
	 * @param  {String} key
	 * @param  {Object} replace Replace all {} in the string
	 * @return {String}
	 * @member $i18n
	 */
	this._ = function(key, replace) {
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

		return this._transReplace(translate, replace);
	};

	/**
	 * Replace translated text by object.
	 *
	 * @param  {String} translate
	 * @param  {Object} replace Replace all {} in the string
	 * @return {String}
	 * @member $i18n
	 * @private
	 */
	this._transReplace = function(translate, replace) {
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
	 * Load language from the file.
	 *
	 * @param  {String} lang Language key
	 * @param  {String} url  Path to the file
	 * @return {$q}
	 * @member $i18n
	 */
	this.loadLanguage = function(lang, url) {
		var promise = $q.defer();

		$http.createRequest({
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
