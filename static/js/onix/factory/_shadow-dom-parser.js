onix.factory("$$shadowDomParser", function() {
	/**
	 * TODO - not completed yet!
	 * 
	 * @class $$shadowDomParser
	 */
	var $$shadowDomParser = function() {
	};

	$$shadowDomParser.prototype._getData = function() {
		return '<div>' +
			'<h1>Test template - <strong>{{ name }}</strong></h1>' +
			'<onixik></onixik>' +
			'<button type="button" class="btn btn-success">Click on me</button>'+
			'<p>'+
				'<span>obsah p</span>' +
			'</p>' +
			'<ul>' +
				'<li>hodnota x</li>' +
				'<li>hodnota x</li>' +
				'<li>hodnota x</li>' +
				'<li>hodnota x</li>' +
				'<li>hodnota x</li>' +
				'<li>hodnota x</li>' +
				'<li>hodnota x</li>' +
				'<li>hodnota x</li>' +
				'<li>hodnota x</li>' +
				'<li>hodnota x</li>' +
				'<li>hodnota x</li>' +
				'<li>hodnota x</li>' +
				'<li>hodnota x</li>' +
				'<li>hodnota x</li>' +
				'<li>hodnota x</li>' +
				'<li>hodnota x</li>' +
				'<li>hodnota x</li>' +
				'<li>hodnota x</li>' +
				'<li>hodnota x</li>' +
				'<li>hodnota x</li>' +
				'<li>hodnota x</li>' +
				'<li>hodnota x</li>' +
				'<li>hodnota x</li>' +
				'<li>hodnota x</li>' +
				'<li>hodnota x</li>' +
				'<li>hodnota x</li>' +
				'<li>hodnota x</li>' +
				'<li>hodnota x</li>' +
				'<li>hodnota x</li>' +
				'<li>hodnota x</li>' +
				'<li>hodnota x</li>' +
				'<li>hodnota x</li>' +
				'<li>hodnota x</li>' +
				'<li>hodnota x</li>' +
				'<li>hodnota x</li>' +
				'<li>hodnota x</li>' +
				'<li>hodnota x</li>' +
				'<li>hodnota x</li>' +
			'</ul>' +
		'</div>';
	};

	$$shadowDomParser.prototype._getStates = function() {
		// parsovani
		return {
			start: 0,
			element_start: 1,
			element_name: 2,
			element_end: 3,
			element_attr_start: 4,
			element_attr_name: 5,
			element_attr_value_start: 6,
			element_attr_value_end: 7
		};
	};

	$$shadowDomParser.prototype._getRoot = function() {
		return {
			el: "body",
			child: [],
			parent: null,
			level: 0,
			attrs: {
			}
		};
	};

	$$shadowDomParser.prototype._getScope = function() {
		return {
			name: "Template name",
			_aaa: "Roman",

			tmplBtn: function() {
				alert("tmplBtn +" + this._aaa);
			}
		};
	};

	$$shadowDomParser.prototype._nameTest = function(c) {
		return /[a-zA-Z1-9_]/.test(c);
	};

	$$shadowDomParser.prototype._wsTest = function(c) {
		return /\s/.test(c);
	};

	$$shadowDomParser.prototype._templateBind = function(data, scope) {
		data = data || "";
		scope = scope || {};

		var allExp = data.match(/[{]\s*[{][^}]*[}]\s*[}]/);

		if (allExp) {
			allExp.forEach(function(expr) {
				var clear = expr.replace(/[{}]/g, "").trim();
				var value = "";

				if (clear in scope) {
					value = scope[clear];
				}

				data = data.replace(expr, value);
			});
		}

		return data;
	};

	$$shadowDomParser.prototype.parse = function() {
		var currentTree = this._getRoot();
		var currentEl = null;
		var lastAttribute = "";
		var level = 0;
		var lastElement = "";
		var states = this._getStates();
		var state = states.start;
		var data = "";

		for (var i = 0; i < tmplData.length; i++) {
			var c = tmplData[i];

			switch(state) {
				case states.start:
					if (c == "<") {
						if (data) {
							currentTree.child.push({
								el: "#text",
								text: this._templateBind(data, this._getScope()),
								parent: currentTree,
								child: [],
								attrs: {}
							});
						}
						state = states.element_start;
					}
					else {
						data += c;
						continue;
					}
					break;
				case states.element_start:
					if (this._nameTest(c)) {
						state = states.element_name;
						data = c;
					}
					else if (c == "/") {
						state = states.element_end;
						data = "";
					}
					else if (this._wsTest(c)) {
						continue;
					}
					break;
				case states.element_name:
					if (this._nameTest(c)) {
						data += c;
					}
					else if (this._wsTest(c)) {
						state = states.element_attr_start;
					}
					else if (c == ">") {
						level++;
						currentEl = {
							el: data,
							child: [],
							attrs: {},
							parent: currentTree,
							level: level
						};
						lastElement = data;
						currentTree.child.push(currentEl);
						currentTree = currentEl;
						data = "";
						state = states.start;
					}
					break;
				case states.element_end:
					if (this._nameTest(c)) {
						data += c;
					}
					else if (this._wsTest(c)) {
						continue;
					}
					else if (c == ">") {
						level--;
						lastElement = data;
						data = "";
						state = states.start;
						currentTree = currentTree.parent;
					}
					break;
				case states.element_attr_start:
					if (this._wsTest(c)) {
						continue;
					}
					else if (c == ">") {
						data = "";
						state = states.start;
					}
					else {
						if (data) {
							level++;
							currentEl = {
								el: data,
								child: [],
								attrs: {},
								parent: currentTree,
								level: level
							};
							lastElement = data;
							currentTree.child.push(currentEl);
							currentTree = currentEl;
						}
						state = states.element_attr_name;
						data = c;
					}
					break;
				case states.element_attr_name:
					if (this._wsTest(c)) {
						state = states.element_attr_start;
					}
					else if (c == "=") {
						currentEl.attrs[data] = null;
						lastAttribute = data;
						data = "";
						state = states.element_attr_value_start;
					}
					else {
						data += c;
					}
					break;
				case states.element_attr_value_start:
					if (c == '"' || c == "'") {
						data = "";
						state = states.element_attr_value_end;
					}
					else if (this._wsTest(c)) {
						continue;
					}
					break;
				case states.element_attr_value_end:
					if (c == '"' || c == "'") {
						currentEl.attrs[lastAttribute] = data;
						data = "";
						state = states.element_attr_start;
					}
					else {
						data += c;
					}
					break;
			}
		}
	};

	return $$shadowDomParser;
});
