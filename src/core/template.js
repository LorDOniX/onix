onix.provider("$template", function() {
	/**
	 * Configuration for template delimeters.
	 *
	 * @type {Object}
	 * @member $templateProvider
	 * @private
	 */
	var _conf = {
		left: "{{",
		right: "}}"
	};

	/**
	 * Set template config; you can use "left" {{ and "right" }} template delimeters.
	 * 
	 * @param {Object} confParam Object with new config
	 * @member $templateProvider
	 */
	this.setConfig = function(confParam) {
		Object.keys(confParam).forEach(function(confParamKey) {
			_conf[confParamKey] = confParam[confParamKey];
		});
	};

	/**
	 * Handle templates, binds events - syntax similar to moustache and angular template system.
	 * $myQuery is used for cache record.
	 *
	 * @class $template
	 */
	this.$get = ["$common", "$promise", "$http", "$filter", function(
				$common, $promise, $http, $filter) {

		var $template = {
			/**
			 * Template cache.
			 *
			 * @type {Object}
			 * @member $template
			 * @private
			 */
			_cache: {},

			/**
			 * Regular expressions for handle template variables.
			 *
			 * @type {Object}
			 * @member $template
			 * @private
			 */
			_RE: {
				VARIABLE: /[$_a-zA-Z][$_a-zA-Z0-9]+/g,
				NUMBERS: /[-]?[0-9]+[.]?([0-9e]+)?/g,
				STRINGS: /["'][^"']+["']/g,
				JSONS: /[{][^}]+[}]/g,
				ALL: /[-]?[0-9]+[.]?([0-9e]+)?|["'][^"']+["']|[{][^}]+[}]|[$_a-zA-Z][$_a-zA-Z0-9]+/g
			},

			/**
			 * Constants.
			 * 
			 * @type {Object}
			 * @member $template
			 * @private
			 */
			_CONST: {
				FILTER_DELIMETER: "|",
				FILTER_PARAM_DELIMETER: ":",
				EL_PREFIX: "data-",
				DATA_BIND: "data-bind",
				TEMPLATE_SCRIPT_SELECTOR: "script[type='text/template']"
			},

			/**
			 * Parse a function name from the string.
			 *
			 * @param  {String} value
			 * @return {String}
			 * @member $template
			 * @private
			 */
			_parseFnName: function(value) {
				value = value || "";

				return value.match(/[a-zA-Z0-9_]+/)[0];
			},

			/**
			 * Parse arguments from the string -> makes array from them.
			 *
			 * @param  {String} value
			 * @param  {Object} config
			 * @param  {Object} config.$event Event object
			 * @param  {Object} config.$element Reference to element
			 * @return {Array}
			 * @member $template
			 * @private
			 */
			_parseArgs: function(value, config) {
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
			},

			/**
			 * Bind one single event to the element.
			 * 
			 * @param  {HTMLElement} el
			 * @param  {Object} attr { name, value }
			 * @param  {Function} scope
			 * @member $template
			 * @private
			 */
			_bindEvent: function(el, attr, scope) {
				if (!el || !attr || !scope) return;

				var eventName = attr.name.replace(this._CONST.EL_PREFIX, "");
				var fnName = this._parseFnName(attr.value);

				if (eventName && fnName in scope) {
					el.addEventListener(eventName, $common.bindWithoutScope(function(event, templScope) {
						var args = templScope._parseArgs(attr.value, {
							el: this,
							event: event
						});

						scope[fnName].apply(scope, args);
					}, this));
				}
			},

			/**
			 * Get element prefixed attributes.
			 * 
			 * @param  {HTMLElement} el
			 * @return {Array}
			 * @member $template
			 * @private
			 */
			_getAttributes: function(el) {
				var output = [];

				if (el && "attributes" in el) {
					Object.keys(el.attributes).forEach(function(attr) {
						var item = el.attributes[attr];

						if (item.name.indexOf(this._CONST.EL_PREFIX) != -1) {
							output.push({
								name: item.name,
								value: item.value
							});
						}
					}, this);
				}

				return output;
			},

			/**
			 * Init - get all templates from the page. Uses 'text/template' script with template data.
			 * Each script has to have id and specifi type="text/template".
			 *
			 * @private
			 * @member $template
			 */
			_init: function() {
				onix.element(this._CONST.TEMPLATE_SCRIPT_SELECTOR).forEach(function(item) {
					this.add(item.id || "", item.innerHTML);
				}, this);
			},
			
			/**
			 * Add new item to the cache.
			 *
			 * @param {String} key 
			 * @param {String} data
			 * @member $template
			 */
			add: function(key, data) {
				this._cache[key] = data;
			},

			/**
			 * Compile one template - replaces all ocurances of {{ xxx }} by model.
			 *
			 * @param  {String} key Template key/name
			 * @param  {Object} data Model
			 * @return {String}
			 * @member $template
			 */
			compile: function(key, data) {
				var tmpl = this.get(key);

				if (data) {
					var all = tmpl.match(new RegExp(_conf.left + "(.*?)" + _conf.right, "g")) || [];

					all.forEach(function(item) {
						var itemSave = item;

						item = item.replace(new RegExp("^" + _conf.left), "").replace(new RegExp(_conf.right + "$"), "");

						if (item.indexOf(this._CONST.FILTER_DELIMETER) != -1) {
							var filterValue;

							// filters
							item.split(this._CONST.FILTER_DELIMETER).forEach(function(filterItem, ind) {
								filterItem = filterItem.trim();

								if (!ind) {
									// value
									if (filterItem in data) {
										filterValue = data[filterItem];
									}
								}
								else {
									// preprocessing by filter
									var args = [filterValue];
									var filterParts = filterItem.split(this._CONST.FILTER_PARAM_DELIMETER);
									var filterName = "";

									if (filterParts.length == 1) {
										filterName = filterParts[0].trim();
									}
									else {
										filterParts.forEach(function(filterPartItem, filterPartInd) {
											filterPartItem = filterPartItem.trim();

											if (!filterPartInd) {
												filterName = filterPartItem;
											}
											else {
												args.push(filterPartItem);
											}
										});
									}

									var filter = $filter(filterName);
									filterValue = filter.apply(filter, args);
								}
							}, this);

							tmpl = tmpl.replace(itemSave, filterValue || "");
						}
						else {
							// standard
							var replaceValue = "";

							item = item.trim();

							if (item in data) {
								replaceValue = data[item];
							}

							tmpl = tmpl.replace(itemSave, replaceValue);
						}
					}, this);
				}

				return tmpl;
			},

			/**
			 * Get template from the cache.
			 *
			 * @param  {String} key Template key/name
			 * @return {String}
			 * @member $template
			 */
			get: function(key) {
				return this._cache[key] || "";
			},

			/**
			 * Bind all elements in the root element. Selectors all data-* and functions are binds against scope object.
			 * For data-bind, scope has to have "addEls" function.
			 * Supports: click, change, keydown, bind.
			 *
			 * @param  {HTMLElement} root Root element
			 * @param  {Object} scope Scope which against will be binding used
			 * @param  {Function} [addElsCb] Callback function with object with all data-bind objects
			 * @member $template
			 */
			bindTemplate: function(root, scope, addElsCb) {
				var allElements = onix.element("*", root);

				if (allElements.len()) {
					var newEls = {};

					allElements.forEach(function(item) {
						var attrs = this._getAttributes(item);

						attrs.forEach(function(attr) {
							if (attr.name == this._CONST.DATA_BIND) {
								newEls[attr.value] = item;
							}
							else {
								this._bindEvent(item, attr, scope);
							}
						}, this);
					}, this);

					if (addElsCb && typeof addElsCb === "function") {
						addElsCb(newEls);
					}
				}
			},

			/**
			 * Load template from the path, returns promise after load.
			 *
			 * @param  {String} key
			 * @param  {String} path
			 * @return {$promise}
			 * @member $template
			 */
			load: function(key, path) {
				return new $promise(function(resolve, reject) {
					$http.createRequest({
						url: path
					}).then(function(data) {
						this.add(key, data.data);

						resolve();
					}.bind(this), function(data) {
						reject(data);
					});
				}.bind(this));
			}
		};

		// template init
		$template._init();

		return $template;
	}];
});
