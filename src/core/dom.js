/**
 * Class for creating DOM elements and getting their references.
 * 
 * @class $dom
 */
onix.service("$dom", function() {
	/**
	 * Create $dom from the configuration.
	 *
	 * @param  {Object} config
	 * @param  {String} config.el Element name
	 * @param  {Object} config.attrs Atributes
	 * @param  {Array|Object} config.child Child nodes
	 * @param  {Array} config.events Bind events
	 * @param  {String|Array} config.class Add CSS class/es
	 * @param  {Object} [exported] to this object will be exported all marked elements (_exported attr.)
	 * @return {Object}
	 * @member $dom
	 */
	this.create = function(config, exported) {
		let el = document.createElement(config.el);

		Object.keys(config).forEach(key => {
			let value;

			switch (key) {
				case "el":
					break;

				case "attrs":
					Object.keys(config.attrs).forEach(attr => {
						el.setAttribute(attr, config.attrs[attr]);
					});
					break;

				case "events":
					config.events.forEach(item => {
						el.addEventListener(item.event, item.fn);
					});
					break;

				case "child":
					value = config.child;

					if (!Array.isArray(value)) {
						value = [value];
					}
					
					value.forEach(child => {
						el.appendChild(this.create(child, exported));
					});
					break;

				case "_exported":
					exported[config._exported] = el;
					break;

				case "class":
					value = config["class"];

					if (typeof value === "string") {
						el.classList.add(value);
					}
					else if (Array.isArray(value)) {
						value.forEach(item => {
							el.classList.add(item);
						});
					}
					break;

				default:
					el[key] = config[key];
			}
		});

		return el;
	};

	/**
	 * Get element from the document.
	 *
	 * @param  {String|Array} els Els = "" -> element; [x, y] -> { x: el, y: el }; [{sel: "div", name: "xyz"}] -> { "xyz": div el }
	 * @param  {Object} [parent]
	 * @return {Object}
	 * @member $dom
	 */
	this.get = function(els, parent) {
		parent = parent || document;
		
		let output;

		if (typeof els === "string" && els) {
			output = parent.querySelector(els);
		}
		else if (Array.isArray(els)) {
			output = {};

			els.forEach((item) => {
				let name;

				if (typeof item === "string") {
					name = item.replace(/^[.# ]+/g, "");

					output[name] = parent.querySelector(item);
				}
				else {
					name = item.sel.replace(/^[.# ]+/g, "");

					output[item.name || name] = parent.querySelector(item.sel);
				}
			});
		}

		return output;
	};
});
