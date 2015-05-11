/**
 * @namespace DOM
 */
Onix.service("DOM", function() {
	/**
	 * Create DOM from the configuration.
	 * config: {
	 * 	el string: element name
	 * 	attrs json: attributes
	 * 	child array: children, with same config
	 * 	events array
	 * 	innerHTML -- default
	 * 	value
	 * 	multiple...
	 * }
	 * exported - to this object will be exported all marked elements (_exported attr.)
	 *
	 * @public
	 * @param  {Object} config
	 * @param  {Object} [exported]
	 * @return {NodeElement}
	 * @memberof DOM
	 */
	this.create = function(config, exported) {
		var el = document.createElement(config.el);

		Object.keys(config).forEach(function(key) {
			switch (key) {
				case "el":
					break;

				case "attrs":
					Object.keys(config.attrs).forEach(function(attr) {
						el.setAttribute(attr, config.attrs[attr]);
					});
					break;

				case "events":
					config.events.forEach(function(item) {
						el.addEventListener(item.event, item.fn);
					});
					break;

				case "child":
					config.child.forEach(function(child) {
						el.appendChild(this.create(child, exported));
					}, this);
					break;

				case "_exported":
					exported[config._exported] = el;
					break;

				case "class":
					var value = config["class"];

					if (typeof value === "string") {
						el.classList.add(value);
					}
					else if (Array.isArray(value)) {
						value.forEach(function(item) {
							el.classList.add(item);
						});
					}
					break;

				default:
					el[key] = config[key];
			}
		}, this);

		return el;
	};

	/**
	 * Get element from the document.
	 *
	 * @public
	 * @param  {String|Array} els     els = "" -> element; array [] -> {...}
	 * @param  {NodeElement} parent
	 * @return {NodeElement}
	 * @memberof DOM
	 */
	this.get = function(els, parent) {
		var output;
		parent = parent || document;

		if (typeof els === "string" && els) {
			output = parent.querySelector(els);
		}
		else if (Array.isArray(els)) {
			output = {};

			els.forEach(function(item) {
				if (typeof item === "string") {
					var name = item.replace(/^[.# ]+/g, "");

					output[name] = parent.querySelector(item);
				}
				else {
					var name = item.sel.replace(/^[.# ]+/g, "");

					output[item.name || name] = parent.querySelector(item.sel);
				}
			});
		}

		return output;
	};
});
