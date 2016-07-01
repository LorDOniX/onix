onix.provider("$template", function() {
	/**
	 * Configuration for template delimeters.
	 *
	 * @type {Object}
	 * @member $templateProvider
	 * @private
	 */
	let _conf = {
		left: "{{",
		right: "}}",
		elPrefix: "data-",
		elDataBind: "data-bind"
	};

	/**
	 * Set template config; you can use "left" {{ and "right" }} template delimeters, elPrefix = "data-" and elDataBind = "data-bind"
	 * 
	 * @param {Object} confParam Object with new config
	 * @member $templateProvider
	 */
	this.setConfig = function(confParam) {
		Object.keys(confParam).forEach(confParamKey => {
			_conf[confParamKey] = confParam[confParamKey];
		});
	};
	
	/**
	 * Function that creates $template.
	 * 
	 * @member $templateProvider
	 * @return {Array}
	 */
	this.$get = ["$common", "$promise", "$http", "$filter", function(
				$common, $promise, $http, $filter) {

		/**
		 * Handle templates, binds events - syntax similar to moustache and angular template system.
		 * $myQuery is used for cache record.
		 *
		 * @class $template
		 */
		class $template {
			constructor() {
				/**
				 * Template cache.
				 *
				 * @type {Object}
				 * @member $template
				 * @private
				 */
				this._cache = {};

				/**
				 * Regular expressions for handle template variables.
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
				 * Constants.
				 * 
				 * @type {Object}
				 * @member $template
				 * @private
				 */
				this._CONST = {
					FILTER_DELIMETER: "|",
					FILTER_PARAM_DELIMETER: ":",
					TEMPLATE_SCRIPT_SELECTOR: "script[type='text/template']"
				};

				// template init
				this._init();
			}

			/**
			 * Parse a function name from the string.
			 *
			 * @param  {String} value
			 * @return {String}
			 * @member $template
			 * @private
			 * @method _parseFnName
			 */
			_parseFnName(value) {
				value = value || "";

				return value.match(/[a-zA-Z0-9_]+/)[0];
			}

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
			 * @method _parseArgs
			 */
			_parseArgs(value, config) {
				let argsValue = value ? value.replace(/^[^(]+./, "").replace(/\).*$/, "") : "";

				let args = [];
				let matches = argsValue.match(this._RE.ALL);
				
				if (matches) {
					let all = [];

					matches.forEach(item => {
						let value;

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
							let variable = item.match(this._RE.VARIABLE)[0];

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
					});

					if (all.length) {
						all.sort((a, b) => {
							return a.pos - b.pos
						}).forEach(item => {
							args.push(item.value);
						});
					}
				}

				return args;
			}

			/**
			 * Bind one single event to the element.
			 * 
			 * @param  {HTMLElement} el
			 * @param  {Object} attr { name, value }
			 * @param  {Function} scope
			 * @member $template
			 * @private
			 * @method _bindEvent
			 */
			_bindEvent(el, attr, scope) {
				if (!el || !attr || !scope) return;

				let eventName = attr.name.replace(_conf.elPrefix, "");
				let fnName = this._parseFnName(attr.value);

				if (eventName && fnName in scope) {
					el.addEventListener(eventName, event => {
						let args = this._parseArgs(attr.value, {
							el: el,
							event: event
						});

						scope[fnName].apply(scope, args);
					});
				}
			}

			/**
			 * Get element prefixed attributes.
			 * 
			 * @param  {HTMLElement} el
			 * @return {Array}
			 * @member $template
			 * @private
			 * @method _getAttributes
			 */
			_getAttributes(el) {
				let output = [];

				if (el && "attributes" in el) {
					Object.keys(el.attributes).forEach(attr => {
						let item = el.attributes[attr];

						// ie8 fix
						if (!item || typeof item !== "object" || !item.name) return;

						if (item.name.indexOf(_conf.elPrefix) != -1) {
							output.push({
								name: item.name,
								value: item.value
							});
						}
					});
				}

				return output;
			}

			/**
			 * Init - get all templates from the page. Uses 'text/template' script with template data.
			 * Each script has to have id and specifi type="text/template".
			 *
			 * @private
			 * @member $template
			 * @method _init
			 */
			_init() {
				onix.element(this._CONST.TEMPLATE_SCRIPT_SELECTOR).forEach(item => {
					this.add(item.id || "", item.innerHTML);
				});
			};
			
			/**
			 * Add new item to the cache.
			 *
			 * @param {String} key 
			 * @param {String} data
			 * @member $template
			 * @method add
			 */
			add(key, data) {
				this._cache[key] = data;
			}

			/**
			 * Compile one template - replaces all ocurances of {{ xxx }} by model.
			 *
			 * @param  {String} key Template key/name
			 * @param  {Object} data Model
			 * @return {String}
			 * @member $template
			 * @method compile
			 */
			compile(key, data) {
				let tmpl = this.get(key);

				if (data) {
					let all = tmpl.match(new RegExp(_conf.left + "(.*?)" + _conf.right, "g")) || [];

					all.forEach(item => {
						let itemSave = item;

						item = item.replace(new RegExp("^" + _conf.left), "").replace(new RegExp(_conf.right + "$"), "");

						if (item.indexOf(this._CONST.FILTER_DELIMETER) != -1) {
							let filterValue;

							// filters
							item.split(this._CONST.FILTER_DELIMETER).forEach((filterItem, ind) => {
								filterItem = filterItem.trim();

								if (!ind) {
									// value
									if (filterItem in data) {
										filterValue = data[filterItem];
									}
								}
								else {
									// preprocessing by filter
									let args = [filterValue];
									let filterParts = filterItem.split(this._CONST.FILTER_PARAM_DELIMETER);
									let filterName = "";

									if (filterParts.length == 1) {
										filterName = filterParts[0].trim();
									}
									else {
										filterParts.forEach((filterPartItem, filterPartInd) => {
											filterPartItem = filterPartItem.trim();

											if (!filterPartInd) {
												filterName = filterPartItem;
											}
											else {
												args.push(filterPartItem);
											}
										});
									}

									let filter = $filter(filterName);

									filterValue = filter.apply(filter, args);
								}
							});

							tmpl = tmpl.replace(itemSave, filterValue || "");
						}
						else {
							// standard
							let replaceValue = "";

							item = item.trim();

							if (item in data) {
								replaceValue = data[item];
							}

							tmpl = tmpl.replace(itemSave, replaceValue);
						}
					});
				}

				return tmpl;
			}

			/**
			 * Get template from the cache.
			 *
			 * @param  {String} key Template key/name
			 * @return {String}
			 * @member $template
			 * @method get
			 */
			get(key) {
				return this._cache[key] || "";
			}

			/**
			 * Bind all elements in the root element. Selectors all data-* and functions are binds against scope object.
			 * For data-bind, scope has to have "addEls" function.
			 * Supports: click, change, keydown, bind.
			 *
			 * @param  {HTMLElement} root Root element
			 * @param  {Object} scope Scope which against will be binding used
			 * @param  {Function} [addElsCb] Callback function with object with all data-bind objects
			 * @member $template
			 * @method bindTemplate
			 */
			bindTemplate(root, scope, addElsCb) {
				let allElements = onix.element("*", root);

				if (allElements.len()) {
					let newEls = {};

					allElements.forEach(item => {
						let attrs = this._getAttributes(item);

						attrs.forEach(attr => {
							if (attr.name == _conf.elDataBind) {
								newEls[attr.value] = item;
							}
							else {
								this._bindEvent(item, attr, scope);
							}
						});
					});

					if (addElsCb && typeof addElsCb === "function") {
						addElsCb(newEls);
					}
				}
			}

			/**
			 * Load template from the path, returns promise after load.
			 *
			 * @param  {String} key
			 * @param  {String} path
			 * @return {$promise}
			 * @member $template
			 * @method load
			 */
			load(key, path) {
				return new $promise((resolve, reject) => {
					$http.createRequest({
						url: path
					}).then(okData => {
						this.add(key, okData.data);

						resolve();
					}, errorData => {
						reject(errorData);
					});
				});
			}
		};

		return new $template();
	}];
});
