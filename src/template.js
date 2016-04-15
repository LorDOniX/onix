/**
 * @class $template
 */
onix.service("$template", [
	"$common",
	"$q",
	"$http",
	"$config",
function(
	$common,
	$q,
	$http,
	$config
) {
	/**
	 * Template cache.
	 *
	 * @type {Object}
	 * @member $template
	 * @private
	 */
	this._cache = {};

	/**
	 * Regular expressions
	 *
	 * @type {Object}
	 * @member $template
	 * @private
	 */
	this._RE = {
		VARIABLE: /[$_a-zA-Z][$_a-zA-Z0-9]+/g,
		NUMBERS: /[-]?[0-9]+[.]?([0-9e]+)?/g,
		STRINGS: /["'][^"']+["']/g,
		JSONS: /[{][^}]+[}]/g,
		ALL: /[-]?[0-9]+[.]?([0-9e]+)?|["'][^"']+["']|[{][^}]+[}]|[$_a-zA-Z][$_a-zA-Z0-9]+/g
	};

	/**
	 * Parse a function name from the string.
	 *
	 * @param  {String} value
	 * @return {String}
	 * @member $template
	 * @private
	 */
	this._parseFnName = function(value) {
		value = value || "";

		return value.match(/[a-zA-Z0-9_]+/)[0];
	};

	/**
	 * Parse arguments from the string -> makes array from them
	 *
	 * @param  {String} value
	 * @param  {Object} config { event, element... }
	 * @return {Array}
	 * @member $template
	 * @private
	 */
	this._parseArgs = function(value, config) {
		argsValue = value ? value.replace(/^[^(]+./, "").replace(/\).*$/, "") : "";

		var args = [];
		var matches = argsValue.match(this._RE.ALL);
		
		if (matches) {
			var all = [];

			matches.forEach(function(item) {
				var value;

				if (item.match(this._RE.STRINGS)) {
					value = item.substr(1, item.length - 2)
				}
				else if (item.match(this._RE.NUMBERS)) {
					value = parseFloat(item);
				}
				else if (item.match(this._RE.JSONS)) {
					value = JSON.parse(item);
				}
				else if (item.match(this._RE.VARIABLE)) {
					var variable = item.match(this._RE.VARIABLE)[0];

					if (variable == "$event") {
						value = config.event;
					}
					else if (variable == "$element") {
						value = config.el;
					}
					else {
						// todo - maybe eval with scope
						value = null;
					}
				}

				all.push({
					value: value,
					pos: argsValue.indexOf(item)
				});
			}, this);

			if (all.length) {
				all.sort(function(a, b) {
					return a.pos - b.pos
				}).forEach(function(item) {
					args.push(item.value);
				});
			}
		}

		return args;
	};

	/**
	 * Bind one single event to element.
	 * 
	 * @param  {HTMLElement} el
	 * @param  {String} eventName click, keydown...
	 * @param  {String} data      data-x value
	 * @param  {Function} scope
	 * @member $template
	 * @private
	 */
	this._bindEvent = function(el, eventName, data, scope) {
		if (data && this._parseFnName(data) in scope) {
			el.addEventListener(eventName, $common.bindWithoutScope(function(event, templScope) {
				var value = this.getAttribute("data-" + eventName);
				var fnName = templScope._parseFnName(value);
				var args = templScope._parseArgs(value, {
					el: this,
					event: event
				});

				scope[fnName].apply(scope, args);
			}, this));
		}
	};

	/**
	 * Init - get all templates from the page.
	 *
	 * @member $template
	 */
	this.init = function() {
		onix.element("script[type='text/template']").forEach(function(item) {
			this.add(item.id, item.innerHTML);
		}, this);
	};
	
	/**
	 * Add new item to the cachce
	 *
	 * @param {String} key 
	 * @param {String} data
	 * @member $template
	 */
	this.add = function(key, data) {
		this._cache[key] = data;
	};

	/**
	 * Compile one template - replaces all ocurances of {} by model
	 *
	 * @param  {String} key  Template key/name
	 * @param  {Object} data Model
	 * @return {String}
	 * @member $template
	 */
	this.compile = function(key, data) {
		var tmpl = this.get(key);
		var cnf = $config.TMPL_DELIMITER;

		if (data) {
			Object.keys(data).forEach(function(key) {
				tmpl = tmpl.replace(new RegExp(cnf.LEFT + "[ ]*" + key + "[ ]*" + cnf.RIGHT, "g"), data[key]);
			});
		}

		return tmpl;
	};

	/**
	 * Get template from the cache
	 *
	 * @param  {String} key Template key/name
	 * @return {String}
	 * @member $template
	 */
	this.get = function(key) {
		return this._cache[key] || "";
	};

	/**
	 * Bind all elements in the root element.
	 * Supports: click, change, bind
	 *
	 * @param  {HTMLElement} root
	 * @param  {(Object|Function)} scope
	 * @member $template
	 */
	this.bindTemplate = function(root, scope) {
		var allElements = onix.element("*[data-click], *[data-change], *[data-bind], *[data-keydown]", root);

		if (allElements.len()) {
			var newEls = {};

			allElements.forEach(function(item) {
				this._bindEvent(item, "click", item.getAttribute("data-click"), scope);
				this._bindEvent(item, "change", item.getAttribute("data-change"), scope);
				this._bindEvent(item, "keydown", item.getAttribute("data-keydown"), scope);

				var dataBind = item.getAttribute("data-bind");

				if (dataBind) {
					newEls[dataBind] = item;
				}
			}, this);

			if ("addEls" in scope && typeof scope.addEls === "function") {
				scope.addEls(newEls);
			}
		}
	};

	/**
	 * Load template from the path.
	 *
	 * @param  {String} key
	 * @param  {String} path
	 * @return {$q}
	 * @member $template
	 */
	this.load = function(key, path) {
		var promise = $q.defer();

		$http.createRequest({
			url: path
		}).then(function(data) {
			this.add(key, data.data);

			promise.resolve();
		}.bind(this), function(data) {
			promise.reject();
		});

		return promise;
	};
}]);
