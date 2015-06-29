onix.factory("$$shadowDom", function() {
	/**
	 * TODO - not completed yet!
	 * 
	 * @param  {NodeElement} root Maping element
	 * @class $$shadowDom
	 */
	var $$shadowDom = function(root) {
		this._root = root;
	};

	$$shadowDom.prototype.map = function(el) {
		el = el || document.body;
		this._el = el;
		this._map(this._root, this._el);
	}

	$$shadowDom.prototype._toArray = function(nodelist) {
		return Array.prototype.slice.call(nodelist);
	}

	$$shadowDom.prototype._map = function(sdEl, el, dontC) {
		if (sdEl.parent && !dontC) {
			el = this._createWCH(sdEl);
		}

		var childs = [];
		this._toArray(el.childNodes).forEach(function(child) {
			if (!(child.nodeName == "#text" && !child.textContent.trim())) {
				childs.push(child);
			}
		});

		var nodeChilds = childs.length;
		var sdChilds = sdEl.child.length;

		var to = Math.max(nodeChilds, sdChilds);

		for (var i = 0; i < to; i++) {
			var nodeChild = i < childs.length ? childs[i] : null;
			var sdChild = i < sdEl.child.length ? sdEl.child[i] : null;

			if (nodeChild && !sdChild) {
				nodeChild.parentNode.removeChild(nodeChild);
			}
			else if (!nodeChild && sdChild) {
				var child = this._createWCH(sdChild);

				el.appendChild(child);

				sdChild.child.forEach(function(subChild) {
					var newChild = this._map(subChild, child);
					child.appendChild(newChild);
				}, this);
			}
			else if (nodeChild && sdChild) {
				// update
				this._update(sdChild, nodeChild);
			}
		}

		return el;
	};

	$$shadowDom.prototype._getDirectives = function() {
		return {
			"onixik": true
		};
	};

	$$shadowDom.prototype._parseFnName = function(value) {
		value = value || "";

		return value.match(/[a-zA-Z0-9_]+/)[0];
	};

	// create without children
	$$shadowDom.prototype._createWCH = function(sdEl) {
		// directives
		if (sdEl.el in this._getDirectives()) {
			console.log("custom directive " + sdEl.el);
		}
		var newEl = sdEl.el != "#text" ? document.createElement(sdEl.el) : document.createTextNode(sdEl.text);

		// bind elements
		var be = [];

		Object.keys(sdEl.attrs || {}).forEach(function(name) {
			var value = sdEl.attrs[name];

			if (!value) {
				newEl[name] = true;
			}
			else {
				newEl.setAttribute(name, value);
			}

			// events
			switch (name) {
				case "data-click":
					var fnName = this._parseFnName(value);

					console.log("data-click = " + value + ", " + fnName);
					if (fnName in $scope) {
						newEl.addEventListener("click", function(e) {
							// todo parse click
							$scope[fnName].apply($scope, [e, this]);
						});
						be.push("click");
					}
					break;
			}
		});

		if (be.length) {
			// internal attribute
			newEl.setAttribute("data-onix-be", be.join(";"));
		}

		return newEl;
	};

	$$shadowDom.prototype._update = function(sdEl, el) {
		// different elements
		if (sdEl.el != el.nodeName.toLowerCase()) {
			var newEl = this._map(sdEl, this._createWCH(sdEl));

			el.parentNode.insertBefore(newEl, el);
			el.parentNode.removeChild(el);
		}
		// same elements text
		else if (sdEl.el == "#text") {
			el.textContent = templateBind(sdEl.text, $scope);
		}
		// same elements others
		else {
			var toRemove = {};

			Object.keys(el.attributes).forEach(function(attr) {
				var name = el.attributes[attr].name;

				// only for names; skip our
				if (name && name != "data-onix-be") {
					toRemove[name] = true;
				}
			});

			// set first
			var beData = (el.getAttribute("data-onix-be") || "");
			var be;

			if (beData) {
				be = beData.split(";");
			}
			else {
				be = [];
			}

			Object.keys(sdEl.attrs).forEach(function(key) {
				var value = sdEl.attrs[key];
				el.setAttribute(key, value);
				delete toRemove[key];


				if (key == "data-click") {
					console.log("aaa");
					if (be.indexOf("click") != -1) {
						// already bounded
					}
					else {
						var fnName = this._parseFnName(value);

						if (fnName in $scope) {
							el.addEventListener("click", function(e) {
								// todo parse click
								$scope[fnName].apply($scope, [e, this]);
							});
							be.push("click");
						}
					}
				}
			});

			// remove them
			Object.keys(toRemove).forEach(function(key) {
				el.removeAttribute(key);

				if (key == "data-click") {
					el.removeEventListener("click");
					be.splice(be.indexOf("data-click"), 1);
				}
			});

			if (be.length) {
				el.setAttribute("data-onix-be", be.join(";"));
			}
			else {
				el.removeAttribute("data-onix-be");
			}

			// update children
			this._map(sdEl, el, true); // dont create parent el
		}
	};

	//var shadowDom = new $$shadowDom(root);
	//shadowDom.map();

	return $$shadowDom;
});
