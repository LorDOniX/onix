Onix.service("Templates", [
	"Common",
function(
	Common
) {
	// ------------------------ private ---------------------------------------
	
	/**
	 * Template cache.
	 * @type {Object}
	 */
	this._cache = {};

	/**
	 * Regular expressions
	 * @type {Object}
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
	 * @param  {String} value
	 * @return {String}      
	 */
	this._parseFnName = function(value) {
		value = value || "";

		return value.match(/[a-zA-Z0-9_]+/)[0];
	};

	/**
	 * Parse arguments from the string -> makes array from them
	 * @param  {String} value
	 * @param  {Object} config { event, element... }
	 * @return {Array}
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

	// ------------------------ public ----------------------------------------
	
	/**
	 * Init - get all templates from the page.
	 */
	this.init = function() {
		Onix.element("script[type='text/template']").forEach(function(item) {
			this.add(item.id, item.innerHTML);
		}, this);
	};
	
	/**
	 * Add new item to the cachce
	 * @param {String} key 
	 * @param {String} data
	 */
	this.add = function(key, data) {
		this._cache[key] = data;
	};

	/**
	 * Compile one template - replaces all ocurances of {} by model
	 * @param  {String} key  Template key/name
	 * @param  {Object} data Model
	 * @return {String}
	 */
	this.compile = function(key, data) {
		var tmpl = this.get(key);

		if (data) {
			Object.keys(data).forEach(function(key) {
				tmpl = tmpl.replace(new RegExp("{" + key + "}", "g"), data[key]);
			});
		}

		return tmpl;
	};

	/**
	 * Get template from the cache
	 * @param  {String} key Template key/name
	 * @return {String}
	 */
	this.get = function(key) {
		return this._cache[key] || "";
	};

	/**
	 * Bind all elements in the root element.
	 * Supports: click, change, bind
	 * @param  {NodeElement} root
	 * @param  {Object|Function} scope
	 */
	this.bindTemplate = function(root, scope) {
		var allElements = Onix.element("*[data-click], *[data-change], *[data-bind]", root);

		if (allElements.len()) {
			var newEls = {};

			allElements.forEach(function(item) {
				var dataClick = item.getAttribute("data-click");
				var dataChange = item.getAttribute("data-change");
				var dataBind = item.getAttribute("data-bind");

				if (dataClick && this._parseFnName(dataClick) in scope) {
					item.addEventListener("click", Common.bindWithoutScope(function(event, templScope) {
						var value = this.getAttribute("data-click");
						var fnName = templScope._parseFnName(value);
						var args = templScope._parseArgs(value, {
							el: this,
							event: event
						});

						scope[fnName].apply(scope, args);
					}, this));
				}

				if (dataChange && this._parseFnName(dataChange) in scope) {
					item.addEventListener("change", Common.bindWithoutScope(function(event, templScope) {
						var value = this.getAttribute("data-change");
						var fnName = templScope._parseFnName(value);
						var args = templScope._parseArgs(value, {
							el: this,
							event: event
						});

						scope[fnName].apply(scope, args);
					}, this));
				}

				if (dataBind) {
					newEls[dataBind] = item;
				}
			}, this);

			if ("addEls" in scope && typeof scope.addEls === "function") {
				scope.addEls(newEls);
			}
		}
	};
}]);
