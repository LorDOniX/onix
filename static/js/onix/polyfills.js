(function() {
	Event = Event || window.Event;

	Event.prototype.stopPropagation = Event.prototype.stopPropagation || function() {
		this.cancelBubble = true;
	};

	Event.prototype.preventDefault = Event.prototype.preventDefault || function () {
		this.returnValue = false;
	};
})();

if(!Array.isArray) {
	/**
	 * Array.isArray dle ES5 - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/isArray
	 */
	Array.isArray = function (vArg) {
		return Object.prototype.toString.call(vArg) === "[object Array]";
	};
}

if (!Array.prototype.forEach) { 
	Array.prototype.forEach = function(cb, _this) {
	    var len = this.length;
	    for (var i=0;i<len;i++) { 
			if (i in this) { cb.call(_this, this[i], i, this); }
		}
	}
}

if (!Array.prototype.every) { 
	Array.prototype.every = function(cb, _this) {
	    var len = this.length;
	    for (var i=0;i<len;i++) {
			if (i in this && !cb.call(_this, this[i], i, this)) { return false; }
	    }
	    return true;
	}
}

if (!Array.prototype.indexOf) { 
	Array.prototype.indexOf = function(item, from) {
	    var len = this.length;
	    var i = from || 0;
	    if (i < 0) { i += len; }
	    for (;i<len;i++) {
			if (i in this && this[i] === item) { return i; }
	    }
	    return -1;
	}
}

if (!("console" in window)) {
	var emptyFn = function() {};

	window.console = {};

	["log", "warn", "error", "clear", "info"].forEach(function(name) {
		window.console[name] = emptyFn;
	});
}

if (!Object.keys) {
	/**
	 * Object.keys dle ES5 - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys
	 */
	Object.keys = (function () {
		'use strict';

		var hasOwnProperty = Object.prototype.hasOwnProperty,
			hasDontEnumBug = !({toString: null}).propertyIsEnumerable('toString'),
			dontEnums = [
				'toString',
				'toLocaleString',
				'valueOf',
				'hasOwnProperty',
				'isPrototypeOf',
				'propertyIsEnumerable',
				'constructor'
			],
			dontEnumsLength = dontEnums.length;

		return function (obj) {
			if (typeof obj !== 'object' && (typeof obj !== 'function' || obj === null)) {
				throw new TypeError('Object.keys called on non-object');
			}

			var result = [], prop, i;

			for (prop in obj) {
				if (hasOwnProperty.call(obj, prop)) {
					result.push(prop);
				}
			}

			if (hasDontEnumBug) {
				for (i = 0; i < dontEnumsLength; i++) {
					if (hasOwnProperty.call(obj, dontEnums[i])) {
						result.push(dontEnums[i]);
					}
				}
			}
			return result;
		};
	}());
}

(function() {
  if(navigator.appVersion.indexOf('MSIE 8') > 0) {
    var _slice = Array.prototype.slice;
    Array.prototype.slice = function() {
      if(this instanceof Array) {
        return _slice.apply(this, arguments);
      } else {
        var result = [];
        var start = (arguments.length >= 1) ? arguments[0] : 0;
        var end = (arguments.length >= 2) ? arguments[1] : this.length;
        for(var i=start; i<end; i++) {
          result.push(this[i]);
        }
        return result;
      }
    };
  }
})();

if (!Object.create) {
	/**
	 * Object.create dle ES5 - https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Object/create
	 */
	Object.create = function (o) {
		if (arguments.length > 1) { throw new Error("Object.create polyfill only accepts the first parameter"); }
		var tmp = function() {};
		tmp.prototype = o;
		return new tmp();
	};
}

if (!Function.prototype.bind) {
	/**
	 * ES5 Function.prototype.bind
	 * Vrací funkci zbindovanou do zadaného kontextu.
	 * Zbylé volitelné parametry jsou předány volání vnitřní funkce.
	 * @param {object} thisObj Nový kontext
	 * @returns {function}
	 */
	Function.prototype.bind = function(thisObj) {
		var fn = this;
		var args = Array.prototype.slice.call(arguments, 1);
		return function() {
			return fn.apply(thisObj, args.concat(Array.prototype.slice.call(arguments)));
		}
	}
};

if (!("addEventListener" in document)) {
	var w = Window.prototype;
	var h = HTMLDocument.prototype;
	var e = Element.prototype;

	w["addEventListener"] = h["addEventListener"] = e["addEventListener"] = function(eventName, listener) {
		if (eventName == "DOMContentLoaded") {
			document.attachEvent("onreadystatechange", function() {
				if (document.readyState === "complete") {
					listener();
				}
			});
		}
		else {
			var obj = this;

			this.attachEvent("on" + eventName, function() {
				return listener.apply(obj, arguments);
			});
		}
	};

	w["removeEventListener"] = h["removeEventListener"] = e["removeEventListener"] = function(eventName, listener) {
		return this.detachEvent("on" + eventName, listener);
	};
}

if (!("classList" in document.documentElement) && window.Element) {
	(function () {
		var prototype = Array.prototype,
		indexOf = prototype.indexOf,
		slice = prototype.slice,
		push = prototype.push,
		splice = prototype.splice,
		join = prototype.join;

		function DOMTokenList(elm) {
			this._element = elm;
			if (elm.className == this._classCache) { return; }
			this._classCache = elm.className;
			if (!this._classCache) { return; }

			var classes = this._classCache.replace(/^\s+|\s+$/g,'').split(/\s+/);
			for (var i = 0; i < classes.length; i++) {
				push.call(this, classes[i]);
			}
		}
		window.DOMTokenList = DOMTokenList;

		function setToClassName(el, classes) {
			el.className = classes.join(" ");
		}

		DOMTokenList.prototype = {
			add: function(token) {
				if (this.contains(token)) { return; }
				push.call(this, token);
				setToClassName(this._element, slice.call(this, 0));
			},
			contains: function(token) {
				return (indexOf.call(this, token) != -1);
			},
			item: function(index) {
				return this[index] || null;
			},
			remove: function(token) {
				var i = indexOf.call(this, token);
				if (i == -1) { return; }
				splice.call(this, i, 1);
				setToClassName(this._element, slice.call(this, 0));
			},
			toString: function() {
				return join.call(this, " ");
			},
			toggle: function(token) {
				if (indexOf.call(this, token) == -1) {
					this.add(token);
					return true;
				} else {
					this.remove(token);
					return false;
				}
			}
		};

		function defineElementGetter (obj, prop, getter) {
			if (Object.defineProperty) {
				Object.defineProperty(obj, prop, {
					get: getter
				});
			} else {
				obj.__defineGetter__(prop, getter);
			}
		}

		defineElementGetter(Element.prototype, "classList", function() {
			return new DOMTokenList(this);
		});
	})();
}
