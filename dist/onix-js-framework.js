/**
 * OnixJS framework
 * 2.7.5/10. 7. 2016
 * source: https://gitlab.com/LorDOniX/onix
 * documentation: https://gitlab.com/LorDOniX/onix/tree/master/docs
 * @license MIT
 * - Free for use in both personal and commercial projects
 */
(function() {
	Event = Event || window.Event;
	Event.prototype.stopPropagation = Event.prototype.stopPropagation || function() {
		this.cancelBubble = true;
	};
	Event.prototype.preventDefault = Event.prototype.preventDefault || function () {
		this.returnValue = false;
	};
})();
if (!("btoa" in window)) {
	window.btoa = function(val) {
		return val;
	}
}
if (!String.prototype.trim) {
	String.prototype.trim = function () {
		return this.replace(/^\s+|\s+$/g, '');
	};
}
if(!Array.isArray) {
	/**
	 * Array.isArray dle ES5 - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/isArray
	 */
	Array.isArray = function (vArg) {
		return Object.prototype.toString.call(vArg) === "[object Array]";
	};
}
/**
 * Shim for "fixing" IE's lack of support (IE < 9) for applying slice
 * on host objects like NamedNodeMap, NodeList, and HTMLCollection
 * (technically, since host objects have been implementation-dependent,
 * at least before ES6, IE hasn't needed to work this way).
 * Also works on strings, fixes IE < 9 to allow an explicit undefined
 * for the 2nd argument (as in Firefox), and prevents errors when
 * called on other DOM objects.
 */
(function () {
  'use strict';
  var _slice = Array.prototype.slice;
  try {
    // Can't be used with DOM elements in IE < 9
    _slice.call(document.documentElement);
  } catch (e) { // Fails in IE < 9
    // This will work for genuine arrays, array-like objects, 
    // NamedNodeMap (attributes, entities, notations),
    // NodeList (e.g., getElementsByTagName), HTMLCollection (e.g., childNodes),
    // and will not fail on other DOM objects (as do DOM elements in IE < 9)
    Array.prototype.slice = function(begin, end) {
      // IE < 9 gets unhappy with an undefined end argument
      end = (typeof end !== 'undefined') ? end : this.length;
      // For native Array objects, we use the native slice function
      if (Object.prototype.toString.call(this) === '[object Array]'){
        return _slice.call(this, begin, end); 
      }
      // For array like object we handle it ourselves.
      var i, cloned = [],
        size, len = this.length;
      // Handle negative value for "begin"
      var start = begin || 0;
      start = (start >= 0) ? start : Math.max(0, len + start);
      // Handle negative value for "end"
      var upTo = (typeof end == 'number') ? Math.min(end, len) : len;
      if (end < 0) {
        upTo = len + end;
      }
      // Actual expected size of the slice
      size = upTo - start;
      if (size > 0) {
        cloned = new Array(size);
        if (this.charAt) {
          for (i = 0; i < size; i++) {
            cloned[i] = this.charAt(start + i);
          }
        } else {
          for (i = 0; i < size; i++) {
            cloned[i] = this[start + i];
          }
        }
      }
      return cloned;
    };
  }
}());
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
	document["addEventListener"] = w["addEventListener"] = h["addEventListener"] = e["addEventListener"] = function(eventName, listener) {
		if (!this.__eventListeners) {
			this.__eventListeners = {};
		}
		if (eventName == "DOMContentLoaded") {
			this.attachEvent("onreadystatechange", function() {
				if (document.readyState === "complete") {
					listener();
				}
			});
		}
		else {
			if (!this.__eventListeners[eventName]) {
				this.__eventListeners[eventName] = [];
			}
			var fn = function() {
				return listener.apply(this, arguments);
			}.bind(this);
			this.__eventListeners[eventName].push({
				fn: fn,
				listener: listener
			});
			this.attachEvent("on" + eventName, fn);
		}
	};
	document["removeEventListener"] = w["removeEventListener"] = h["removeEventListener"] = e["removeEventListener"] = function(eventName, listener) {
		var all = this.__eventListeners || {};
		var items = all[eventName] || [];
		var fn = null;
		var pos = -1;
		for (var i = 0; i < items.length; i++) {
			var item = items[i];
			if (item.listener == listener) {
				fn = item.fn;
				pos = i;
				break;
			}
		}
		if (fn) {
			items.splice(pos, 1);
			if (!items.length) {
				delete all[eventName];
			}
			return this.detachEvent("on" + eventName, fn);
		}
		else return null;
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
if (!Date.now) {
	/**
	 * aktuální timestamp dle ES5 - http://dailyjs.com/2010/01/07/ecmascript5-date/
	 */
	Date.now = function() { return +(new Date); }
}
/*!
 * https://github.com/es-shims/es5-shim
 * @license es5-shim Copyright 2009-2015 by contributors, MIT License
 * see https://github.com/es-shims/es5-shim/blob/master/LICENSE
 */
// vim: ts=4 sts=4 sw=4 expandtab
// Add semicolon to prevent IIFE from being passed as argument to concatenated code.
;
// UMD (Universal Module Definition)
// see https://github.com/umdjs/umd/blob/master/templates/returnExports.js
(function (root, factory) {
    'use strict';
    /* global define, exports, module */
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(factory);
    } else if (typeof exports === 'object') {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like enviroments that support module.exports,
        // like Node.
        module.exports = factory();
    } else {
        // Browser globals (root is window)
        root.returnExports = factory();
  }
}(this, function () {
var call = Function.call;
var prototypeOfObject = Object.prototype;
var owns = call.bind(prototypeOfObject.hasOwnProperty);
var isEnumerable = call.bind(prototypeOfObject.propertyIsEnumerable);
var toStr = call.bind(prototypeOfObject.toString);
// If JS engine supports accessors creating shortcuts.
var defineGetter;
var defineSetter;
var lookupGetter;
var lookupSetter;
var supportsAccessors = owns(prototypeOfObject, '__defineGetter__');
if (supportsAccessors) {
    /* eslint-disable no-underscore-dangle */
    defineGetter = call.bind(prototypeOfObject.__defineGetter__);
    defineSetter = call.bind(prototypeOfObject.__defineSetter__);
    lookupGetter = call.bind(prototypeOfObject.__lookupGetter__);
    lookupSetter = call.bind(prototypeOfObject.__lookupSetter__);
    /* eslint-enable no-underscore-dangle */
}
 /**
 * Object.keys by ES5 - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys
 */
if (!Object.keys) {
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
// ES5 15.2.3.2
// http://es5.github.com/#x15.2.3.2
if (!Object.getPrototypeOf) {
    // https://github.com/es-shims/es5-shim/issues#issue/2
    // http://ejohn.org/blog/objectgetprototypeof/
    // recommended by fschaefer on github
    //
    // sure, and webreflection says ^_^
    // ... this will nerever possibly return null
    // ... Opera Mini breaks here with infinite loops
    Object.getPrototypeOf = function getPrototypeOf(object) {
        /* eslint-disable no-proto */
        var proto = object.__proto__;
        /* eslint-enable no-proto */
        if (proto || proto === null) {
            return proto;
        } else if (toStr(object.constructor) === '[object Function]') {
            return object.constructor.prototype;
        } else if (object instanceof Object) {
          return prototypeOfObject;
        } else {
          // Correctly return null for Objects created with `Object.create(null)`
          // (shammed or native) or `{ __proto__: null}`.  Also returns null for
          // cross-realm objects on browsers that lack `__proto__` support (like
          // IE <11), but that's the best we can do.
          return null;
        }
    };
}
// ES5 15.2.3.3
// http://es5.github.com/#x15.2.3.3
var doesGetOwnPropertyDescriptorWork = function doesGetOwnPropertyDescriptorWork(object) {
    try {
        object.sentinel = 0;
        return Object.getOwnPropertyDescriptor(object, 'sentinel').value === 0;
    } catch (exception) {
        return false;
    }
};
// check whether getOwnPropertyDescriptor works if it's given. Otherwise, shim partially.
if (Object.defineProperty) {
    var getOwnPropertyDescriptorWorksOnObject = doesGetOwnPropertyDescriptorWork({});
    var getOwnPropertyDescriptorWorksOnDom = typeof document === 'undefined' ||
    doesGetOwnPropertyDescriptorWork(document.createElement('div'));
    if (!getOwnPropertyDescriptorWorksOnDom || !getOwnPropertyDescriptorWorksOnObject) {
        var getOwnPropertyDescriptorFallback = Object.getOwnPropertyDescriptor;
    }
}
if (!Object.getOwnPropertyDescriptor || getOwnPropertyDescriptorFallback) {
    var ERR_NON_OBJECT = 'Object.getOwnPropertyDescriptor called on a non-object: ';
    /* eslint-disable no-proto */
    Object.getOwnPropertyDescriptor = function getOwnPropertyDescriptor(object, property) {
        if ((typeof object !== 'object' && typeof object !== 'function') || object === null) {
            throw new TypeError(ERR_NON_OBJECT + object);
        }
        // make a valiant attempt to use the real getOwnPropertyDescriptor
        // for I8's DOM elements.
        if (getOwnPropertyDescriptorFallback) {
            try {
                return getOwnPropertyDescriptorFallback.call(Object, object, property);
            } catch (exception) {
                // try the shim if the real one doesn't work
            }
        }
        var descriptor;
        // If object does not owns property return undefined immediately.
        if (!owns(object, property)) {
            return descriptor;
        }
        // If object has a property then it's for sure `configurable`, and
        // probably `enumerable`. Detect enumerability though.
        descriptor = {
            enumerable: isEnumerable(object, property),
            configurable: true
        };
        // If JS engine supports accessor properties then property may be a
        // getter or setter.
        if (supportsAccessors) {
            // Unfortunately `__lookupGetter__` will return a getter even
            // if object has own non getter property along with a same named
            // inherited getter. To avoid misbehavior we temporary remove
            // `__proto__` so that `__lookupGetter__` will return getter only
            // if it's owned by an object.
            var prototype = object.__proto__;
            var notPrototypeOfObject = object !== prototypeOfObject;
            // avoid recursion problem, breaking in Opera Mini when
            // Object.getOwnPropertyDescriptor(Object.prototype, 'toString')
            // or any other Object.prototype accessor
            if (notPrototypeOfObject) {
                object.__proto__ = prototypeOfObject;
            }
            var getter = lookupGetter(object, property);
            var setter = lookupSetter(object, property);
            if (notPrototypeOfObject) {
                // Once we have getter and setter we can put values back.
                object.__proto__ = prototype;
            }
            if (getter || setter) {
                if (getter) {
                    descriptor.get = getter;
                }
                if (setter) {
                    descriptor.set = setter;
                }
                // If it was accessor property we're done and return here
                // in order to avoid adding `value` to the descriptor.
                return descriptor;
            }
        }
        // If we got this far we know that object has an own property that is
        // not an accessor so we set it as a value and return descriptor.
        descriptor.value = object[property];
        descriptor.writable = true;
        return descriptor;
    };
    /* eslint-enable no-proto */
}
// ES5 15.2.3.4
// http://es5.github.com/#x15.2.3.4
if (!Object.getOwnPropertyNames) {
    Object.getOwnPropertyNames = function getOwnPropertyNames(object) {
        return Object.keys(object);
    };
}
// ES5 15.2.3.5
// http://es5.github.com/#x15.2.3.5
if (!Object.create) {
    // Contributed by Brandon Benvie, October, 2012
    var createEmpty;
    var supportsProto = !({ __proto__: null } instanceof Object);
                        // the following produces false positives
                        // in Opera Mini => not a reliable check
                        // Object.prototype.__proto__ === null
    // Check for document.domain and active x support
    // No need to use active x approach when document.domain is not set
    // see https://github.com/es-shims/es5-shim/issues/150
    // variation of https://github.com/kitcambridge/es5-shim/commit/4f738ac066346
    /* global ActiveXObject */
    var shouldUseActiveX = function shouldUseActiveX() {
        // return early if document.domain not set
        if (!document.domain) {
            return false;
        }
        try {
            return !!new ActiveXObject('htmlfile');
        } catch (exception) {
            return false;
        }
    };
    // This supports IE8 when document.domain is used
    // see https://github.com/es-shims/es5-shim/issues/150
    // variation of https://github.com/kitcambridge/es5-shim/commit/4f738ac066346
    var getEmptyViaActiveX = function getEmptyViaActiveX() {
        var empty;
        var xDoc;
        xDoc = new ActiveXObject('htmlfile');
        xDoc.write('<script><\/script>');
        xDoc.close();
        empty = xDoc.parentWindow.Object.prototype;
        xDoc = null;
        return empty;
    };
    // The original implementation using an iframe
    // before the activex approach was added
    // see https://github.com/es-shims/es5-shim/issues/150
    var getEmptyViaIFrame = function getEmptyViaIFrame() {
        var iframe = document.createElement('iframe');
        var parent = document.body || document.documentElement;
        var empty;
        iframe.style.display = 'none';
        parent.appendChild(iframe);
        /* eslint-disable no-script-url */
        iframe.src = 'javascript:';
        /* eslint-enable no-script-url */
        empty = iframe.contentWindow.Object.prototype;
        parent.removeChild(iframe);
        iframe = null;
        return empty;
    };
    /* global document */
    if (supportsProto || typeof document === 'undefined') {
        createEmpty = function () {
            return { __proto__: null };
        };
    } else {
        // In old IE __proto__ can't be used to manually set `null`, nor does
        // any other method exist to make an object that inherits from nothing,
        // aside from Object.prototype itself. Instead, create a new global
        // object and *steal* its Object.prototype and strip it bare. This is
        // used as the prototype to create nullary objects.
        createEmpty = function () {
            // Determine which approach to use
            // see https://github.com/es-shims/es5-shim/issues/150
            var empty = shouldUseActiveX() ? getEmptyViaActiveX() : getEmptyViaIFrame();
            delete empty.constructor;
            delete empty.hasOwnProperty;
            delete empty.propertyIsEnumerable;
            delete empty.isPrototypeOf;
            delete empty.toLocaleString;
            delete empty.toString;
            delete empty.valueOf;
            var Empty = function Empty() {};
            Empty.prototype = empty;
            // short-circuit future calls
            createEmpty = function () {
                return new Empty();
            };
            return new Empty();
        };
    }
    Object.create = function create(prototype, properties) {
        var object;
        var Type = function Type() {}; // An empty constructor.
        if (prototype === null) {
            object = createEmpty();
        } else {
            if (typeof prototype !== 'object' && typeof prototype !== 'function') {
                // In the native implementation `parent` can be `null`
                // OR *any* `instanceof Object`  (Object|Function|Array|RegExp|etc)
                // Use `typeof` tho, b/c in old IE, DOM elements are not `instanceof Object`
                // like they are in modern browsers. Using `Object.create` on DOM elements
                // is...err...probably inappropriate, but the native version allows for it.
                throw new TypeError('Object prototype may only be an Object or null'); // same msg as Chrome
            }
            Type.prototype = prototype;
            object = new Type();
            // IE has no built-in implementation of `Object.getPrototypeOf`
            // neither `__proto__`, but this manually setting `__proto__` will
            // guarantee that `Object.getPrototypeOf` will work as expected with
            // objects created using `Object.create`
            /* eslint-disable no-proto */
            object.__proto__ = prototype;
            /* eslint-enable no-proto */
        }
        if (properties !== void 0) {
            Object.defineProperties(object, properties);
        }
        return object;
    };
}
// ES5 15.2.3.6
// http://es5.github.com/#x15.2.3.6
// Patch for WebKit and IE8 standard mode
// Designed by hax <hax.github.com>
// related issue: https://github.com/es-shims/es5-shim/issues#issue/5
// IE8 Reference:
//     http://msdn.microsoft.com/en-us/library/dd282900.aspx
//     http://msdn.microsoft.com/en-us/library/dd229916.aspx
// WebKit Bugs:
//     https://bugs.webkit.org/show_bug.cgi?id=36423
var doesDefinePropertyWork = function doesDefinePropertyWork(object) {
    try {
        Object.defineProperty(object, 'sentinel', {});
        return 'sentinel' in object;
    } catch (exception) {
        return false;
    }
};
// check whether defineProperty works if it's given. Otherwise,
// shim partially.
if (Object.defineProperty) {
    var definePropertyWorksOnObject = doesDefinePropertyWork({});
    var definePropertyWorksOnDom = typeof document === 'undefined' ||
        doesDefinePropertyWork(document.createElement('div'));
    if (!definePropertyWorksOnObject || !definePropertyWorksOnDom) {
        var definePropertyFallback = Object.defineProperty,
            definePropertiesFallback = Object.defineProperties;
    }
}
if (!Object.defineProperty || definePropertyFallback) {
    var ERR_NON_OBJECT_DESCRIPTOR = 'Property description must be an object: ';
    var ERR_NON_OBJECT_TARGET = 'Object.defineProperty called on non-object: ';
    var ERR_ACCESSORS_NOT_SUPPORTED = 'getters & setters can not be defined on this javascript engine';
    Object.defineProperty = function defineProperty(object, property, descriptor) {
        if ((typeof object !== 'object' && typeof object !== 'function') || object === null) {
            throw new TypeError(ERR_NON_OBJECT_TARGET + object);
        }
        if ((typeof descriptor !== 'object' && typeof descriptor !== 'function') || descriptor === null) {
            throw new TypeError(ERR_NON_OBJECT_DESCRIPTOR + descriptor);
        }
        // make a valiant attempt to use the real defineProperty
        // for I8's DOM elements.
        if (definePropertyFallback) {
            try {
                return definePropertyFallback.call(Object, object, property, descriptor);
            } catch (exception) {
                // try the shim if the real one doesn't work
            }
        }
        // If it's a data property.
        if ('value' in descriptor) {
            // fail silently if 'writable', 'enumerable', or 'configurable'
            // are requested but not supported
            /*
            // alternate approach:
            if ( // can't implement these features; allow false but not true
                ('writable' in descriptor && !descriptor.writable) ||
                ('enumerable' in descriptor && !descriptor.enumerable) ||
                ('configurable' in descriptor && !descriptor.configurable)
            ))
                throw new RangeError(
                    'This implementation of Object.defineProperty does not support configurable, enumerable, or writable.'
                );
            */
            if (supportsAccessors && (lookupGetter(object, property) || lookupSetter(object, property))) {
                // As accessors are supported only on engines implementing
                // `__proto__` we can safely override `__proto__` while defining
                // a property to make sure that we don't hit an inherited
                // accessor.
                /* eslint-disable no-proto */
                var prototype = object.__proto__;
                object.__proto__ = prototypeOfObject;
                // Deleting a property anyway since getter / setter may be
                // defined on object itself.
                delete object[property];
                object[property] = descriptor.value;
                // Setting original `__proto__` back now.
                object.__proto__ = prototype;
                /* eslint-enable no-proto */
            } else {
                object[property] = descriptor.value;
            }
        } else {
            if (!supportsAccessors && (('get' in descriptor) || ('set' in descriptor))) {
                throw new TypeError(ERR_ACCESSORS_NOT_SUPPORTED);
            }
            // If we got that far then getters and setters can be defined !!
            if ('get' in descriptor) {
                defineGetter(object, property, descriptor.get);
            }
            if ('set' in descriptor) {
                defineSetter(object, property, descriptor.set);
            }
        }
        return object;
    };
}
// ES5 15.2.3.7
// http://es5.github.com/#x15.2.3.7
if (!Object.defineProperties || definePropertiesFallback) {
    Object.defineProperties = function defineProperties(object, properties) {
        // make a valiant attempt to use the real defineProperties
        if (definePropertiesFallback) {
            try {
                return definePropertiesFallback.call(Object, object, properties);
            } catch (exception) {
                // try the shim if the real one doesn't work
            }
        }
        Object.keys(properties).forEach(function (property) {
            if (property !== '__proto__') {
                Object.defineProperty(object, property, properties[property]);
            }
        });
        return object;
    };
}
// ES5 15.2.3.8
// http://es5.github.com/#x15.2.3.8
if (!Object.seal) {
    Object.seal = function seal(object) {
        if (Object(object) !== object) {
            throw new TypeError('Object.seal can only be called on Objects.');
        }
        // this is misleading and breaks feature-detection, but
        // allows "securable" code to "gracefully" degrade to working
        // but insecure code.
        return object;
    };
}
// ES5 15.2.3.9
// http://es5.github.com/#x15.2.3.9
if (!Object.freeze) {
    Object.freeze = function freeze(object) {
        if (Object(object) !== object) {
            throw new TypeError('Object.freeze can only be called on Objects.');
        }
        // this is misleading and breaks feature-detection, but
        // allows "securable" code to "gracefully" degrade to working
        // but insecure code.
        return object;
    };
}
// detect a Rhino bug and patch it
try {
    Object.freeze(function () {});
} catch (exception) {
    Object.freeze = (function (freezeObject) {
        return function freeze(object) {
            if (typeof object === 'function') {
                return object;
            } else {
                return freezeObject(object);
            }
        };
    }(Object.freeze));
}
// ES5 15.2.3.10
// http://es5.github.com/#x15.2.3.10
if (!Object.preventExtensions) {
    Object.preventExtensions = function preventExtensions(object) {
        if (Object(object) !== object) {
            throw new TypeError('Object.preventExtensions can only be called on Objects.');
        }
        // this is misleading and breaks feature-detection, but
        // allows "securable" code to "gracefully" degrade to working
        // but insecure code.
        return object;
    };
}
// ES5 15.2.3.11
// http://es5.github.com/#x15.2.3.11
if (!Object.isSealed) {
    Object.isSealed = function isSealed(object) {
        if (Object(object) !== object) {
            throw new TypeError('Object.isSealed can only be called on Objects.');
        }
        return false;
    };
}
// ES5 15.2.3.12
// http://es5.github.com/#x15.2.3.12
if (!Object.isFrozen) {
    Object.isFrozen = function isFrozen(object) {
        if (Object(object) !== object) {
            throw new TypeError('Object.isFrozen can only be called on Objects.');
        }
        return false;
    };
}
// ES5 15.2.3.13
// http://es5.github.com/#x15.2.3.13
if (!Object.isExtensible) {
    Object.isExtensible = function isExtensible(object) {
        // 1. If Type(O) is not Object throw a TypeError exception.
        if (Object(object) !== object) {
            throw new TypeError('Object.isExtensible can only be called on Objects.');
        }
        // 2. Return the Boolean value of the [[Extensible]] internal property of O.
        var name = '';
        while (owns(object, name)) {
            name += '?';
        }
        object[name] = true;
        var returnValue = owns(object, name);
        delete object[name];
        return returnValue;
    };
}
}));
(function() {
	var debug = false;
	var root = this;
	var EXIF = function(obj) {
		if (obj instanceof EXIF) return obj;
		if (!(this instanceof EXIF)) return new EXIF(obj);
		this.EXIFwrapped = obj;
	};
	if (typeof exports !== 'undefined') {
		if (typeof module !== 'undefined' && module.exports) {
			exports = module.exports = EXIF;
		}
		exports.EXIF = EXIF;
	} else {
		root.EXIF = EXIF;
	}
	var ExifTags = EXIF.Tags = {
		// version tags
		0x9000 : "ExifVersion",             // EXIF version
		0xA000 : "FlashpixVersion",         // Flashpix format version
		// colorspace tags
		0xA001 : "ColorSpace",              // Color space information tag
		// image configuration
		0xA002 : "PixelXDimension",         // Valid width of meaningful image
		0xA003 : "PixelYDimension",         // Valid height of meaningful image
		0x9101 : "ComponentsConfiguration", // Information about channels
		0x9102 : "CompressedBitsPerPixel",  // Compressed bits per pixel
		// user information
		0x927C : "MakerNote",               // Any desired information written by the manufacturer
		0x9286 : "UserComment",             // Comments by user
		// related file
		0xA004 : "RelatedSoundFile",        // Name of related sound file
		// date and time
		0x9003 : "DateTimeOriginal",        // Date and time when the original image was generated
		0x9004 : "DateTimeDigitized",       // Date and time when the image was stored digitally
		0x9290 : "SubsecTime",              // Fractions of seconds for DateTime
		0x9291 : "SubsecTimeOriginal",      // Fractions of seconds for DateTimeOriginal
		0x9292 : "SubsecTimeDigitized",     // Fractions of seconds for DateTimeDigitized
		// picture-taking conditions
		0x829A : "ExposureTime",            // Exposure time (in seconds)
		0x829D : "FNumber",                 // F number
		0x8822 : "ExposureProgram",         // Exposure program
		0x8824 : "SpectralSensitivity",     // Spectral sensitivity
		0x8827 : "ISOSpeedRatings",         // ISO speed rating
		0x8828 : "OECF",                    // Optoelectric conversion factor
		0x9201 : "ShutterSpeedValue",       // Shutter speed
		0x9202 : "ApertureValue",           // Lens aperture
		0x9203 : "BrightnessValue",         // Value of brightness
		0x9204 : "ExposureBias",            // Exposure bias
		0x9205 : "MaxApertureValue",        // Smallest F number of lens
		0x9206 : "SubjectDistance",         // Distance to subject in meters
		0x9207 : "MeteringMode",            // Metering mode
		0x9208 : "LightSource",             // Kind of light source
		0x9209 : "Flash",                   // Flash status
		0x9214 : "SubjectArea",             // Location and area of main subject
		0x920A : "FocalLength",             // Focal length of the lens in mm
		0xA20B : "FlashEnergy",             // Strobe energy in BCPS
		0xA20C : "SpatialFrequencyResponse",    //
		0xA20E : "FocalPlaneXResolution",   // Number of pixels in width direction per FocalPlaneResolutionUnit
		0xA20F : "FocalPlaneYResolution",   // Number of pixels in height direction per FocalPlaneResolutionUnit
		0xA210 : "FocalPlaneResolutionUnit",    // Unit for measuring FocalPlaneXResolution and FocalPlaneYResolution
		0xA214 : "SubjectLocation",         // Location of subject in image
		0xA215 : "ExposureIndex",           // Exposure index selected on camera
		0xA217 : "SensingMethod",           // Image sensor type
		0xA300 : "FileSource",              // Image source (3 == DSC)
		0xA301 : "SceneType",               // Scene type (1 == directly photographed)
		0xA302 : "CFAPattern",              // Color filter array geometric pattern
		0xA401 : "CustomRendered",          // Special processing
		0xA402 : "ExposureMode",            // Exposure mode
		0xA403 : "WhiteBalance",            // 1 = auto white balance, 2 = manual
		0xA404 : "DigitalZoomRation",       // Digital zoom ratio
		0xA405 : "FocalLengthIn35mmFilm",   // Equivalent foacl length assuming 35mm film camera (in mm)
		0xA406 : "SceneCaptureType",        // Type of scene
		0xA407 : "GainControl",             // Degree of overall image gain adjustment
		0xA408 : "Contrast",                // Direction of contrast processing applied by camera
		0xA409 : "Saturation",              // Direction of saturation processing applied by camera
		0xA40A : "Sharpness",               // Direction of sharpness processing applied by camera
		0xA40B : "DeviceSettingDescription",    //
		0xA40C : "SubjectDistanceRange",    // Distance to subject
		// other tags
		0xA005 : "InteroperabilityIFDPointer",
		0xA420 : "ImageUniqueID"            // Identifier assigned uniquely to each image
	};
	var TiffTags = EXIF.TiffTags = {
		0x0100 : "ImageWidth",
		0x0101 : "ImageHeight",
		0x8769 : "ExifIFDPointer",
		0x8825 : "GPSInfoIFDPointer",
		0xA005 : "InteroperabilityIFDPointer",
		0x0102 : "BitsPerSample",
		0x0103 : "Compression",
		0x0106 : "PhotometricInterpretation",
		0x0112 : "Orientation",
		0x0115 : "SamplesPerPixel",
		0x011C : "PlanarConfiguration",
		0x0212 : "YCbCrSubSampling",
		0x0213 : "YCbCrPositioning",
		0x011A : "XResolution",
		0x011B : "YResolution",
		0x0128 : "ResolutionUnit",
		0x0111 : "StripOffsets",
		0x0116 : "RowsPerStrip",
		0x0117 : "StripByteCounts",
		0x0201 : "JPEGInterchangeFormat",
		0x0202 : "JPEGInterchangeFormatLength",
		0x012D : "TransferFunction",
		0x013E : "WhitePoint",
		0x013F : "PrimaryChromaticities",
		0x0211 : "YCbCrCoefficients",
		0x0214 : "ReferenceBlackWhite",
		0x0132 : "DateTime",
		0x010E : "ImageDescription",
		0x010F : "Make",
		0x0110 : "Model",
		0x0131 : "Software",
		0x013B : "Artist",
		0x8298 : "Copyright"
	};
	var GPSTags = EXIF.GPSTags = {
		0x0000 : "GPSVersionID",
		0x0001 : "GPSLatitudeRef",
		0x0002 : "GPSLatitude",
		0x0003 : "GPSLongitudeRef",
		0x0004 : "GPSLongitude",
		0x0005 : "GPSAltitudeRef",
		0x0006 : "GPSAltitude",
		0x0007 : "GPSTimeStamp",
		0x0008 : "GPSSatellites",
		0x0009 : "GPSStatus",
		0x000A : "GPSMeasureMode",
		0x000B : "GPSDOP",
		0x000C : "GPSSpeedRef",
		0x000D : "GPSSpeed",
		0x000E : "GPSTrackRef",
		0x000F : "GPSTrack",
		0x0010 : "GPSImgDirectionRef",
		0x0011 : "GPSImgDirection",
		0x0012 : "GPSMapDatum",
		0x0013 : "GPSDestLatitudeRef",
		0x0014 : "GPSDestLatitude",
		0x0015 : "GPSDestLongitudeRef",
		0x0016 : "GPSDestLongitude",
		0x0017 : "GPSDestBearingRef",
		0x0018 : "GPSDestBearing",
		0x0019 : "GPSDestDistanceRef",
		0x001A : "GPSDestDistance",
		0x001B : "GPSProcessingMethod",
		0x001C : "GPSAreaInformation",
		0x001D : "GPSDateStamp",
		0x001E : "GPSDifferential"
	};
	var StringValues = EXIF.StringValues = {
		ExposureProgram : {
			0 : "Not defined",
			1 : "Manual",
			2 : "Normal program",
			3 : "Aperture priority",
			4 : "Shutter priority",
			5 : "Creative program",
			6 : "Action program",
			7 : "Portrait mode",
			8 : "Landscape mode"
		},
		MeteringMode : {
			0 : "Unknown",
			1 : "Average",
			2 : "CenterWeightedAverage",
			3 : "Spot",
			4 : "MultiSpot",
			5 : "Pattern",
			6 : "Partial",
			255 : "Other"
		},
		LightSource : {
			0 : "Unknown",
			1 : "Daylight",
			2 : "Fluorescent",
			3 : "Tungsten (incandescent light)",
			4 : "Flash",
			9 : "Fine weather",
			10 : "Cloudy weather",
			11 : "Shade",
			12 : "Daylight fluorescent (D 5700 - 7100K)",
			13 : "Day white fluorescent (N 4600 - 5400K)",
			14 : "Cool white fluorescent (W 3900 - 4500K)",
			15 : "White fluorescent (WW 3200 - 3700K)",
			17 : "Standard light A",
			18 : "Standard light B",
			19 : "Standard light C",
			20 : "D55",
			21 : "D65",
			22 : "D75",
			23 : "D50",
			24 : "ISO studio tungsten",
			255 : "Other"
		},
		Flash : {
			0x0000 : "Flash did not fire",
			0x0001 : "Flash fired",
			0x0005 : "Strobe return light not detected",
			0x0007 : "Strobe return light detected",
			0x0009 : "Flash fired, compulsory flash mode",
			0x000D : "Flash fired, compulsory flash mode, return light not detected",
			0x000F : "Flash fired, compulsory flash mode, return light detected",
			0x0010 : "Flash did not fire, compulsory flash mode",
			0x0018 : "Flash did not fire, auto mode",
			0x0019 : "Flash fired, auto mode",
			0x001D : "Flash fired, auto mode, return light not detected",
			0x001F : "Flash fired, auto mode, return light detected",
			0x0020 : "No flash function",
			0x0041 : "Flash fired, red-eye reduction mode",
			0x0045 : "Flash fired, red-eye reduction mode, return light not detected",
			0x0047 : "Flash fired, red-eye reduction mode, return light detected",
			0x0049 : "Flash fired, compulsory flash mode, red-eye reduction mode",
			0x004D : "Flash fired, compulsory flash mode, red-eye reduction mode, return light not detected",
			0x004F : "Flash fired, compulsory flash mode, red-eye reduction mode, return light detected",
			0x0059 : "Flash fired, auto mode, red-eye reduction mode",
			0x005D : "Flash fired, auto mode, return light not detected, red-eye reduction mode",
			0x005F : "Flash fired, auto mode, return light detected, red-eye reduction mode"
		},
		SensingMethod : {
			1 : "Not defined",
			2 : "One-chip color area sensor",
			3 : "Two-chip color area sensor",
			4 : "Three-chip color area sensor",
			5 : "Color sequential area sensor",
			7 : "Trilinear sensor",
			8 : "Color sequential linear sensor"
		},
		SceneCaptureType : {
			0 : "Standard",
			1 : "Landscape",
			2 : "Portrait",
			3 : "Night scene"
		},
		SceneType : {
			1 : "Directly photographed"
		},
		CustomRendered : {
			0 : "Normal process",
			1 : "Custom process"
		},
		WhiteBalance : {
			0 : "Auto white balance",
			1 : "Manual white balance"
		},
		GainControl : {
			0 : "None",
			1 : "Low gain up",
			2 : "High gain up",
			3 : "Low gain down",
			4 : "High gain down"
		},
		Contrast : {
			0 : "Normal",
			1 : "Soft",
			2 : "Hard"
		},
		Saturation : {
			0 : "Normal",
			1 : "Low saturation",
			2 : "High saturation"
		},
		Sharpness : {
			0 : "Normal",
			1 : "Soft",
			2 : "Hard"
		},
		SubjectDistanceRange : {
			0 : "Unknown",
			1 : "Macro",
			2 : "Close view",
			3 : "Distant view"
		},
		FileSource : {
			3 : "DSC"
		},
		Components : {
			0 : "",
			1 : "Y",
			2 : "Cb",
			3 : "Cr",
			4 : "R",
			5 : "G",
			6 : "B"
		}
	};
	function addEvent(element, event, handler) {
		if (element.addEventListener) {
			element.addEventListener(event, handler, false);
		} else if (element.attachEvent) {
			element.attachEvent("on" + event, handler);
		}
	}
	function imageHasData(img) {
		return !!(img.exifdata);
	}
	function base64ToArrayBuffer(base64, contentType) {
		contentType = contentType || base64.match(/^data\:([^\;]+)\;base64,/mi)[1] || ''; // e.g. 'data:image/jpeg;base64,...' => 'image/jpeg'
		base64 = base64.replace(/^data\:([^\;]+)\;base64,/gmi, '');
		var binary = atob(base64);
		var len = binary.length;
		var buffer = new ArrayBuffer(len);
		var view = new Uint8Array(buffer);
		for (var i = 0; i < len; i++) {
			view[i] = binary.charCodeAt(i);
		}
		return buffer;
	}
	function objectURLToBlob(url, callback) {
		var http = new XMLHttpRequest();
		http.open("GET", url, true);
		http.responseType = "blob";
		http.onload = function(e) {
			if (this.status == 200 || this.status === 0) {
				callback(this.response);
			}
		};
		http.send();
	}
	function getImageData(img, callback) {
		function handleBinaryFile(binFile) {
			var data = findEXIFinJPEG(binFile);
			var iptcdata = findIPTCinJPEG(binFile);
			img.exifdata = data || {};
			img.iptcdata = iptcdata || {};
			if (callback) {
				callback.call(img);
			}
		}
		if (img.src) {
			if (/^data\:/i.test(img.src)) { // Data URI
				var arrayBuffer = base64ToArrayBuffer(img.src);
				handleBinaryFile(arrayBuffer);
			} else if (/^blob\:/i.test(img.src)) { // Object URL
				var fileReader = new FileReader();
				fileReader.onload = function(e) {
					handleBinaryFile(e.target.result);
				};
				objectURLToBlob(img.src, function (blob) {
					fileReader.readAsArrayBuffer(blob);
				});
			} else {
				var http = new XMLHttpRequest();
				http.onload = function() {
					if (this.status == 200 || this.status === 0) {
						handleBinaryFile(http.response);
					} else {
						throw "Could not load image";
					}
					http = null;
				};
				http.open("GET", img.src, true);
				http.responseType = "arraybuffer";
				http.send(null);
			}
		} else if (window.FileReader && (img instanceof window.Blob || img instanceof window.File)) {
			var fileReader = new FileReader();
			fileReader.onload = function(e) {
				if (debug) console.log("Got file of length " + e.target.result.byteLength);
				handleBinaryFile(e.target.result);
			};
			fileReader.readAsArrayBuffer(img);
		}
	}
	function findEXIFinJPEG(file) {
		var dataView = new DataView(file);
		if (debug) console.log("Got file of length " + file.byteLength);
		if ((dataView.getUint8(0) != 0xFF) || (dataView.getUint8(1) != 0xD8)) {
			if (debug) console.log("Not a valid JPEG");
			return false; // not a valid jpeg
		}
		var offset = 2,
			length = file.byteLength,
			marker;
		while (offset < length) {
			if (dataView.getUint8(offset) != 0xFF) {
				if (debug) console.log("Not a valid marker at offset " + offset + ", found: " + dataView.getUint8(offset));
				return false; // not a valid marker, something is wrong
			}
			marker = dataView.getUint8(offset + 1);
			if (debug) console.log(marker);
			// we could implement handling for other markers here,
			// but we're only looking for 0xFFE1 for EXIF data
			if (marker == 225) {
				if (debug) console.log("Found 0xFFE1 marker");
				return readEXIFData(dataView, offset + 4, dataView.getUint16(offset + 2) - 2);
				// offset += 2 + file.getShortAt(offset+2, true);
			} else {
				offset += 2 + dataView.getUint16(offset+2);
			}
		}
	}
	function findIPTCinJPEG(file) {
		var dataView = new DataView(file);
		if (debug) console.log("Got file of length " + file.byteLength);
		if ((dataView.getUint8(0) != 0xFF) || (dataView.getUint8(1) != 0xD8)) {
			if (debug) console.log("Not a valid JPEG");
			return false; // not a valid jpeg
		}
		var offset = 2,
			length = file.byteLength;
		var isFieldSegmentStart = function(dataView, offset){
			return (
				dataView.getUint8(offset) === 0x38 &&
				dataView.getUint8(offset+1) === 0x42 &&
				dataView.getUint8(offset+2) === 0x49 &&
				dataView.getUint8(offset+3) === 0x4D &&
				dataView.getUint8(offset+4) === 0x04 &&
				dataView.getUint8(offset+5) === 0x04
			);
		};
		while (offset < length) {
			if ( isFieldSegmentStart(dataView, offset )){
				// Get the length of the name header (which is padded to an even number of bytes)
				var nameHeaderLength = dataView.getUint8(offset+7);
				if(nameHeaderLength % 2 !== 0) nameHeaderLength += 1;
				// Check for pre photoshop 6 format
				if(nameHeaderLength === 0) {
					// Always 4
					nameHeaderLength = 4;
				}
				var startOffset = offset + 8 + nameHeaderLength;
				var sectionLength = dataView.getUint16(offset + 6 + nameHeaderLength);
				return readIPTCData(file, startOffset, sectionLength);
				break;
			}
			// Not the marker, continue searching
			offset++;
		}
	}
	var IptcFieldMap = {
		0x78 : 'caption',
		0x6E : 'credit',
		0x19 : 'keywords',
		0x37 : 'dateCreated',
		0x50 : 'byline',
		0x55 : 'bylineTitle',
		0x7A : 'captionWriter',
		0x69 : 'headline',
		0x74 : 'copyright',
		0x0F : 'category'
	};
	function readIPTCData(file, startOffset, sectionLength){
		var dataView = new DataView(file);
		var data = {};
		var fieldValue, fieldName, dataSize, segmentType, segmentSize;
		var segmentStartPos = startOffset;
		while(segmentStartPos < startOffset+sectionLength) {
			if(dataView.getUint8(segmentStartPos) === 0x1C && dataView.getUint8(segmentStartPos+1) === 0x02){
				segmentType = dataView.getUint8(segmentStartPos+2);
				if(segmentType in IptcFieldMap) {
					dataSize = dataView.getInt16(segmentStartPos+3);
					segmentSize = dataSize + 5;
					fieldName = IptcFieldMap[segmentType];
					fieldValue = getStringFromDB(dataView, segmentStartPos+5, dataSize);
					// Check if we already stored a value with this name
					if(data.hasOwnProperty(fieldName)) {
						// Value already stored with this name, create multivalue field
						if(data[fieldName] instanceof Array) {
							data[fieldName].push(fieldValue);
						}
						else {
							data[fieldName] = [data[fieldName], fieldValue];
						}
					}
					else {
						data[fieldName] = fieldValue;
					}
				}
			}
			segmentStartPos++;
		}
		return data;
	}
	function readTags(file, tiffStart, dirStart, strings, bigEnd) {
		var entries = file.getUint16(dirStart, !bigEnd),
			tags = {},
			entryOffset, tag,
			i;
		for (i=0;i<entries;i++) {
			entryOffset = dirStart + i*12 + 2;
			tag = strings[file.getUint16(entryOffset, !bigEnd)];
			if (!tag && debug) console.log("Unknown tag: " + file.getUint16(entryOffset, !bigEnd));
			tags[tag] = readTagValue(file, entryOffset, tiffStart, dirStart, bigEnd);
		}
		return tags;
	}
	function readTagValue(file, entryOffset, tiffStart, dirStart, bigEnd) {
		var type = file.getUint16(entryOffset+2, !bigEnd),
			numValues = file.getUint32(entryOffset+4, !bigEnd),
			valueOffset = file.getUint32(entryOffset+8, !bigEnd) + tiffStart,
			offset,
			vals, val, n,
			numerator, denominator;
		switch (type) {
			case 1: // byte, 8-bit unsigned int
			case 7: // undefined, 8-bit byte, value depending on field
				if (numValues == 1) {
					return file.getUint8(entryOffset + 8, !bigEnd);
				} else {
					offset = numValues > 4 ? valueOffset : (entryOffset + 8);
					vals = [];
					for (n=0;n<numValues;n++) {
						vals[n] = file.getUint8(offset + n);
					}
					return vals;
				}
			case 2: // ascii, 8-bit byte
				offset = numValues > 4 ? valueOffset : (entryOffset + 8);
				return getStringFromDB(file, offset, numValues-1);
			case 3: // short, 16 bit int
				if (numValues == 1) {
					return file.getUint16(entryOffset + 8, !bigEnd);
				} else {
					offset = numValues > 2 ? valueOffset : (entryOffset + 8);
					vals = [];
					for (n=0;n<numValues;n++) {
						vals[n] = file.getUint16(offset + 2*n, !bigEnd);
					}
					return vals;
				}
			case 4: // long, 32 bit int
				if (numValues == 1) {
					return file.getUint32(entryOffset + 8, !bigEnd);
				} else {
					vals = [];
					for (n=0;n<numValues;n++) {
						vals[n] = file.getUint32(valueOffset + 4*n, !bigEnd);
					}
					return vals;
				}
			case 5:    // rational = two long values, first is numerator, second is denominator
				if (numValues == 1) {
					numerator = file.getUint32(valueOffset, !bigEnd);
					denominator = file.getUint32(valueOffset+4, !bigEnd);
					val = new Number(numerator / denominator);
					val.numerator = numerator;
					val.denominator = denominator;
					return val;
				} else {
					vals = [];
					for (n=0;n<numValues;n++) {
						numerator = file.getUint32(valueOffset + 8*n, !bigEnd);
						denominator = file.getUint32(valueOffset+4 + 8*n, !bigEnd);
						vals[n] = new Number(numerator / denominator);
						vals[n].numerator = numerator;
						vals[n].denominator = denominator;
					}
					return vals;
				}
			case 9: // slong, 32 bit signed int
				if (numValues == 1) {
					return file.getInt32(entryOffset + 8, !bigEnd);
				} else {
					vals = [];
					for (n=0;n<numValues;n++) {
						vals[n] = file.getInt32(valueOffset + 4*n, !bigEnd);
					}
					return vals;
				}
			case 10: // signed rational, two slongs, first is numerator, second is denominator
				if (numValues == 1) {
					return file.getInt32(valueOffset, !bigEnd) / file.getInt32(valueOffset+4, !bigEnd);
				} else {
					vals = [];
					for (n=0;n<numValues;n++) {
						vals[n] = file.getInt32(valueOffset + 8*n, !bigEnd) / file.getInt32(valueOffset+4 + 8*n, !bigEnd);
					}
					return vals;
				}
		}
	}
	function getStringFromDB(buffer, start, length) {
		var outstr = "";
		for (n = start; n < start+length; n++) {
			outstr += String.fromCharCode(buffer.getUint8(n));
		}
		return outstr;
	}
	function readEXIFData(file, start) {
		if (getStringFromDB(file, start, 4) != "Exif") {
			if (debug) console.log("Not valid EXIF data! " + getStringFromDB(file, start, 4));
			return false;
		}
		var bigEnd,
			tags, tag,
			exifData, gpsData,
			tiffOffset = start + 6;
		// test for TIFF validity and endianness
		if (file.getUint16(tiffOffset) == 0x4949) {
			bigEnd = false;
		} else if (file.getUint16(tiffOffset) == 0x4D4D) {
			bigEnd = true;
		} else {
			if (debug) console.log("Not valid TIFF data! (no 0x4949 or 0x4D4D)");
			return false;
		}
		if (file.getUint16(tiffOffset+2, !bigEnd) != 0x002A) {
			if (debug) console.log("Not valid TIFF data! (no 0x002A)");
			return false;
		}
		var firstIFDOffset = file.getUint32(tiffOffset+4, !bigEnd);
		if (firstIFDOffset < 0x00000008) {
			if (debug) console.log("Not valid TIFF data! (First offset less than 8)", file.getUint32(tiffOffset+4, !bigEnd));
			return false;
		}
		tags = readTags(file, tiffOffset, tiffOffset + firstIFDOffset, TiffTags, bigEnd);
		if (tags.ExifIFDPointer) {
			exifData = readTags(file, tiffOffset, tiffOffset + tags.ExifIFDPointer, ExifTags, bigEnd);
			for (tag in exifData) {
				switch (tag) {
					case "LightSource" :
					case "Flash" :
					case "MeteringMode" :
					case "ExposureProgram" :
					case "SensingMethod" :
					case "SceneCaptureType" :
					case "SceneType" :
					case "CustomRendered" :
					case "WhiteBalance" :
					case "GainControl" :
					case "Contrast" :
					case "Saturation" :
					case "Sharpness" :
					case "SubjectDistanceRange" :
					case "FileSource" :
						exifData[tag] = StringValues[tag][exifData[tag]];
						break;
					case "ExifVersion" :
					case "FlashpixVersion" :
						exifData[tag] = String.fromCharCode(exifData[tag][0], exifData[tag][1], exifData[tag][2], exifData[tag][3]);
						break;
					case "ComponentsConfiguration" :
						exifData[tag] =
							StringValues.Components[exifData[tag][0]] +
							StringValues.Components[exifData[tag][1]] +
							StringValues.Components[exifData[tag][2]] +
							StringValues.Components[exifData[tag][3]];
						break;
				}
				tags[tag] = exifData[tag];
			}
		}
		if (tags.GPSInfoIFDPointer) {
			gpsData = readTags(file, tiffOffset, tiffOffset + tags.GPSInfoIFDPointer, GPSTags, bigEnd);
			for (tag in gpsData) {
				switch (tag) {
					case "GPSVersionID" :
						gpsData[tag] = gpsData[tag][0] +
							"." + gpsData[tag][1] +
							"." + gpsData[tag][2] +
							"." + gpsData[tag][3];
						break;
				}
				tags[tag] = gpsData[tag];
			}
		}
		return tags;
	}
	EXIF.getData = function(img, callback) {
		if ((img instanceof Image || img instanceof HTMLImageElement) && !img.complete) return false;
		if (!imageHasData(img)) {
			getImageData(img, callback);
		} else {
			if (callback) {
				callback.call(img);
			}
		}
		return true;
	}
	EXIF.getTag = function(img, tag) {
		if (!imageHasData(img)) return;
		return img.exifdata[tag];
	}
	EXIF.getAllTags = function(img) {
		if (!imageHasData(img)) return {};
		var a,
			data = img.exifdata,
			tags = {};
		for (a in data) {
			if (data.hasOwnProperty(a)) {
				tags[a] = data[a];
			}
		}
		return tags;
	}
	EXIF.pretty = function(img) {
		if (!imageHasData(img)) return "";
		var a,
			data = img.exifdata,
			strPretty = "";
		for (a in data) {
			if (data.hasOwnProperty(a)) {
				if (typeof data[a] == "object") {
					if (data[a] instanceof Number) {
						strPretty += a + " : " + data[a] + " [" + data[a].numerator + "/" + data[a].denominator + "]\r\n";
					} else {
						strPretty += a + " : [" + data[a].length + " values]\r\n";
					}
				} else {
					strPretty += a + " : " + data[a] + "\r\n";
				}
			}
		}
		return strPretty;
	}
	EXIF.readFromBinaryFile = function(file) {
		return findEXIFinJPEG(file);
	}
	if (typeof define === 'function' && define.amd) {
		define('exif-js', [], function() {
			return EXIF;
		});
	}
}.call(this));
var _typeof2 = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };
var _typeof = typeof Symbol === "function" && _typeof2(Symbol.iterator) === "symbol" ? function (obj) {
	return typeof obj === "undefined" ? "undefined" : _typeof2(obj);
} : function (obj) {
	return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof2(obj);
};
function _classCallCheck(instance, Constructor) {
	if (!(instance instanceof Constructor)) {
		throw new TypeError("Cannot call a class as a function");
	}
}
onix = function () {
	/* ************************************* $module **************************** */
	/**
  * Module object - handles one module object with services, factories etc.
  * This object cannot be used in dependency injection!
  * 
  * @class $module
  */
	var $module = function () {
		/**
   * New module.
   * 
   * @param  {String} name Module name
   * @param  {Array} dependencies Other modules dependencies
   */
		function $module(name, dependencies) {
			_classCallCheck(this, $module);
			/**
    * All objects.
    *
    * @type {Object}
    * @member $module
    * @private
    */
			this._objects = {};
			/**
    * All run objects.
    *
    * @type {Object}
    * @member $module
    * @private
    */
			this._runs = [];
			/**
    * All config objects.
    *
    * @type {Object}
    * @member $module
    * @private
    */
			this._configs = [];
			/**
    * Module name.
    * 
    * @type {String}
    * @member $module
    * @private
    */
			this._name = name || "";
			/**
    * Module dependencies.
    * 
    * @type {Array}
    * @member $module
    * @private
    */
			this._dependencies = dependencies || [];
		}
		/**
   * Parse parameters. From param parse function and dependencies.
   *
   * @property {Function}
   * @param  {Array|Function} param 
   * @return {Object} Parse object
   * @member $module
   * @static
   * @method parseParam
   */
		$module.parseParam = function parseParam(param) {
			var fn = void 0;
			var inject = [];
			if (Array.isArray(param)) {
				param.every(function (item) {
					if (typeof item === "function") {
						fn = item;
						return false;
					} else if (typeof item === "string") {
						inject.push(item);
					}
					return true;
				});
			} else {
				fn = param;
			}
			return {
				fn: fn,
				inject: inject
			};
		};
		/**
   * Get filter name.
   * 
   * @param  {String} name
   * @return {String}
   * @member $module
   * @static
   * @method getFilterName
   */
		$module.getFilterName = function getFilterName(name) {
			name = name || "";
			return $module.CONST.FILTER_NAME + name[0].toUpperCase() + name.substr(1);
		};
		/**
   * Get dependencies.
   * 
   * @return {Array}
   * @member $module
   * @method getDependencies
   */
		$module.prototype.getDependencies = function getDependencies() {
			return this._dependencies;
		};
		/**
   * Get module name.
   * 
   * @return {String}
   * @member $module
   * @method getName
   */
		$module.prototype.getName = function getName() {
			return this._name;
		};
		/**
   * Get module configs.
   * 
   * @return {Array}
   * @member $module
   * @method getConfigs
   */
		$module.prototype.getConfigs = function getConfigs() {
			return this._configs;
		};
		/**
   * Get module runs.
   * 
   * @return {Array}
   * @member $module
   * @method getRuns
   */
		$module.prototype.getRuns = function getRuns() {
			return this._runs;
		};
		/**
   * Get module objects.
   * 
   * @return {Array}
   * @member $module
   * @method getObjects
   */
		$module.prototype.getObjects = function getObjects() {
			return this._objects;
		};
		/**
   * Add provider to the application.
   *
   * @chainable
   * @param  {String} name 
   * @param  {Function} param
   * @member $module
   * @method provider
   */
		$module.prototype.provider = function provider(name, param) {
			if (!name || !param) {
				return this;
			}
			var pp = $module.parseParam(param);
			this._objects[name + $module.CONST.PROVIDER_NAME] = {
				name: name + $module.CONST.PROVIDER_NAME,
				inject: pp.inject,
				fn: pp.fn,
				cache: null,
				type: $module.CONST.TYPE.PROVIDER
			};
			this._objects[name] = {
				name: name,
				inject: null,
				fn: null,
				cache: null,
				provider: name + $module.CONST.PROVIDER_NAME,
				type: $module.CONST.TYPE.FACTORY
			};
			return this;
		};
		/**
   * Add service to the application.
   *
   * @chainable
   * @param  {String} name 
   * @param  {Function|Array} param
   * @member $module
   * @method service
   */
		$module.prototype.service = function service(name, param) {
			if (!name || !param) {
				return this;
			}
			var pp = $module.parseParam(param);
			this._objects[name] = {
				name: name,
				inject: pp.inject,
				fn: pp.fn,
				cache: null,
				type: $module.CONST.TYPE.SERVICE
			};
			return this;
		};
		/**
   * Add factory to the application.
   *
   * @chainable
   * @param  {String} name 
   * @param  {Function|Array} param
   * @member $module
   * @method factory
   */
		$module.prototype.factory = function factory(name, param) {
			if (!name || !param) {
				return this;
			}
			var pp = $module.parseParam(param);
			this._objects[name] = {
				name: name,
				inject: pp.inject,
				fn: pp.fn,
				cache: null,
				type: $module.CONST.TYPE.FACTORY
			};
			return this;
		};
		/**
   * Add new constant.
   *
   * @chainable
   * @param  {String} name
   * @param  {Object} param
   * @member $module
   * @method constant
   */
		$module.prototype.constant = function constant(name, obj) {
			if (!name || !obj) {
				return this;
			}
			this._objects[name] = {
				name: name,
				cache: obj,
				type: $module.CONST.TYPE.CONSTANT
			};
			return this;
		};
		/**
   * Add a new value.
   *
   * @chainable
   * @param  {String} name
   * @param  {Object} param
   * @member $module
   * @method value
   */
		$module.prototype.value = function value(name, obj) {
			if (!name || !obj) {
				return this;
			}
			this._objects[name] = {
				name: name,
				cache: obj,
				type: $module.CONST.TYPE.VALUE
			};
			return this;
		};
		/**
   * Add filter to the application.
   *
   * @chainable
   * @param  {String} name 
   * @param  {Function|Array} param
   * @member $module
   * @method filter
   */
		$module.prototype.filter = function filter(name, param) {
			if (!name || !param) {
				return this;
			}
			var pp = $module.parseParam(param);
			this._objects[$module.getFilterName(name)] = {
				name: name,
				inject: pp.inject,
				fn: pp.fn,
				cache: null,
				type: $module.CONST.TYPE.FILTER
			};
			return this;
		};
		/**
   * Add a new config.
   *
   * @chainable
   * @param  {Array|Function} param With DI
   * @member $module
   * @method config
   */
		$module.prototype.config = function config(param) {
			if (!param) {
				return this;
			}
			var pp = $module.parseParam(param);
			this._configs.push({
				fn: pp.fn,
				inject: pp.inject,
				type: $module.CONST.TYPE.CONFIG
			});
			return this;
		};
		/**
   * Add a new run.
   *
   * @chainable
   * @param  {Array|Function} param With DI
   * @member $module
   * @method run
   */
		$module.prototype.run = function run(param) {
			if (!param) {
				return this;
			}
			var pp = $module.parseParam(param);
			this._runs.push({
				fn: pp.fn,
				inject: pp.inject,
				type: $module.CONST.TYPE.RUN
			});
			return this;
		};
		/**
   * Add a new controller - only for back comptability with angular modules.
   * This feature is not implemented!
   *
   * @chainable
   * @member $module
   * @method controller
   */
		$module.prototype.controller = function controller() {
			return this;
		};
		/**
   * Add a new directive - only for back comptability with angular modules.
   * This feature is not implemented!
   *
   * @chainable
   * @member $module
   * @method directive
   */
		$module.prototype.directive = function directive() {
			return this;
		};
		return $module;
	}();
	;
	/**
  * Module constants.
  *
  * @property {Object}
  * @type {Object}
  * @member $module
  * @private
  * @static
  */
	$module.CONST = {
		PROVIDER_NAME: "Provider",
		FILTER_NAME: "$filter",
		TYPE: {
			PROVIDER: 1,
			SERVICE: 2,
			FACTORY: 3,
			CONSTANT: 4,
			VALUE: 5,
			FILTER: 6,
			CONFIG: 7,
			RUN: 8
		}
	};
	/* ************************************* $modules **************************** */
	/**
  * Modules object - handles all modules in the application; runs object.
  * This object cannot be used in dependency injection!
  *
  * @class $modules
  */
	var $modules = function () {
		function $modules() {
			var _this = this;
			_classCallCheck(this, $modules);
			/**
    * All modules array.
    *
    * @private
    * @member $modules
    * @type {Array}
    */
			this._modules = [];
			/**
    * All modules object - quick access.
    *
    * @private
    * @member $modules
    * @type {Object}
    */
			this._modulesObj = {};
			/**
    * Modules constants.
    *
    * @private
    * @member $modules
    * @type {Object}
    */
			this._CONST = {
				MODULE_SEPARATOR: "::"
			};
			// bind DOM ready
			document.addEventListener("DOMContentLoaded", function () {
				_this._domLoad();
			});
		}
		/**
   * Event - Dom LOAD.
   *
   * @member $modules
   * @private
   * @method _domLoad
   */
		$modules.prototype._domLoad = function _domLoad() {
			var _this2 = this;
			var configs = [];
			var runs = [];
			this._modules.forEach(function (module) {
				var error = false;
				var dependencies = module.getDependencies();
				dependencies.every(function (dep) {
					if (!(dep in _this2._modulesObj)) {
						console.error("Module '" + _this2._name + "' dependency '" + dep + "' not found!");
						error = true;
						return false;
					} else {
						return true;
					}
				});
				if (!error) {
					configs = configs.concat(module.getConfigs());
					runs = runs.concat(module.getRuns());
				}
			});
			// run all configs
			configs.forEach(function (config) {
				_this2.run(config, true);
			});
			// run all runs
			runs.forEach(function (run) {
				_this2.run(run);
			});
		};
		/**
   * Get object by his name.
   *
   * @param {String} name Object name
   * @return {Object} Object data
   * @member $modules
   * @private
   * @method _getObject
   */
		$modules.prototype._getObject = function _getObject(name) {
			var output = null;
			var searchModuleName = "";
			var searchObjectName = "";
			if (name.indexOf(this._CONST.MODULE_SEPARATOR) != -1) {
				var parts = name.split(this._CONST.MODULE_SEPARATOR);
				if (parts.length == 2) {
					searchModuleName = parts[0];
					searchObjectName = parts[1];
				} else {
					console.error("Get object " + name + " error! Wrong module separator use.");
					return null;
				}
			} else {
				searchObjectName = name;
			}
			this._modules.every(function (module) {
				var moduleObjects = module.getObjects();
				if (searchModuleName) {
					if (module.getName() != searchModuleName) return true;
					if (searchObjectName in moduleObjects) {
						output = moduleObjects[searchObjectName];
						return false;
					} else {
						console.error("Get object " + searchObjectName + " error! Cannot find object in the module " + searchModuleName + ".");
						return false;
					}
				} else {
					if (searchObjectName in moduleObjects) {
						output = moduleObjects[searchObjectName];
						return false;
					} else return true;
				}
			});
			return output;
		};
		/**
   * Function which does nothing.
   *
   * @member $modules
   * @method noop
   */
		$modules.prototype.noop = function noop() {};
		/**
   * Run object configuration; returns his cache (data).
   *
   * @param  {Object}  obj Object configuration
   * @param  {Boolean} [isConfig] Is config phase?
   * @param  {Array} [parent] Parent objects
   * @return {Object}
   * @member $modules
   * @method run
   */
		$modules.prototype.run = function run(obj, isConfig, parent) {
			var _this3 = this;
			parent = parent || [];
			if (parent.indexOf(obj.name) != -1) {
				console.error("Circular dependency error! Object name: " + obj.name + ", parents: " + parent.join("|"));
				return null;
			}
			var inject = [];
			if (obj.provider) {
				var providerObj = this._getObject(obj.provider);
				if (!providerObj.cache) {
					var providerFn = providerObj.fn || this.noop;
					providerObj.cache = new providerFn();
				}
				var getFn = providerObj.cache["$get"] || this.noop;
				var pp = $module.parseParam(getFn);
				obj.fn = pp.fn;
				obj.inject = pp.inject;
				delete obj.provider;
			}
			if (obj.inject && obj.inject.length) {
				obj.inject.forEach(function (objName) {
					if (typeof objName === "string") {
						var injObj = _this3._getObject(objName);
						if (!injObj) {
							console.error("Object name: " + objName + " not found!");
							inject.push(null);
						} else {
							inject.push(_this3.run(injObj, isConfig, obj.name ? parent.concat(obj.name) : parent));
						}
					} else if ((typeof objName === "undefined" ? "undefined" : _typeof(objName)) === "object") {
						inject.push(objName);
					}
				});
			}
			// config phase
			if (isConfig) {
				switch (obj.type) {
					case $module.CONST.TYPE.PROVIDER:
						if (!obj.cache) {
							var _fn = obj.fn || this.noop;
							obj.cache = new _fn();
						}
						return obj.cache;
						break;
					case $module.CONST.TYPE.CONSTANT:
						return obj.cache;
						break;
					case $module.CONST.TYPE.CONFIG:
						var fn = obj.fn || this.noop;
						return fn.apply(fn, inject);
						break;
					default:
						return null;
				}
			}
			// run phase
			else {
					switch (obj.type) {
						case $module.CONST.TYPE.FACTORY:
						case $module.CONST.TYPE.FILTER:
							if (!obj.cache) {
								var _fn3 = obj.fn || this.noop;
								obj.cache = _fn3.apply(_fn3, inject);
							}
							return obj.cache;
							break;
						case $module.CONST.TYPE.SERVICE:
							if (!obj.cache) {
								var _fn4 = obj.fn || this.noop;
								var serviceObj = Object.create(_fn4.prototype);
								_fn4.apply(serviceObj, inject);
								obj.cache = serviceObj;
							}
							return obj.cache;
							break;
						case $module.CONST.TYPE.VALUE:
							return obj.cache;
							break;
						case $module.CONST.TYPE.CONSTANT:
							return obj.cache;
							break;
						case $module.CONST.TYPE.RUN:
							var _fn2 = obj.fn || this.noop;
							return _fn2.apply(_fn2, inject);
							break;
						default:
							return null;
					}
				}
		};
		/**
   * Add a new module to the application.
   * 
   * @param {String} name Module name
   * @param {Array} [dependencies] Module dependencies
   * @return {Object} Created module
   * @member $modules
   * @method addModule
   */
		$modules.prototype.addModule = function addModule(name, dependencies) {
			var module = new $module(name, dependencies);
			this._modulesObj[name] = module;
			this._modules.push(module);
			return module;
		};
		return $modules;
	}();
	;
	// new instance from $modules class
	var $modulesInst = new $modules();
	/* ************************************* onix **************************** */
	/**
  * Main framework object, which is created like new module with name 'onix'.
  * Module has addtional functions.
  * 
  * @class onix
  */
	var onix = $modulesInst.addModule("onix");
	/**
  * Add a new module to the application.
  * 
  * @param {String} name Module name
  * @param {Array} [dependencies] Module dependencies
  * @return {$module} Created module
  * @static
  * @member onix
  */
	onix.module = function (name, dependencies) {
		return $modulesInst.addModule(name, dependencies);
	};
	/**
  * Empty function.
  *
  * @member onix
  * @method noop
  * @static
  */
	onix.noop = $modulesInst.noop;
	/**
  * Framework info.
  *
  * version: 2.7.5
  * date: 10. 7. 2016
  * @member onix
  * @static
  */
	onix.info = function () {
		console.log('OnixJS framework\n'+
'2.7.5/10. 7. 2016\n'+
'source: https://gitlab.com/LorDOniX/onix\n'+
'documentation: https://gitlab.com/LorDOniX/onix/tree/master/docs\n'+
'@license MIT\n'+
'- Free for use in both personal and commercial projects\n');
	};
	/* ************************************* $di **************************** */
	onix.factory("$di", function () {
		/**
   * Helper factory for dependency injection and parsing function parameters.
   * 
   * @class $di
   */
		return {
			/**
    * Parse parameters. From param parse function and dependencies.
    *
    * @param  {Array|Function} param 
    * @return {Object} Parse object
    * @member $di
    */
			parseParam: $module.parseParam,
			/**
    * Get filter name.
    * 
    * @param  {String} name
    * @return {String}
    * @member $di
    */
			getFilterName: $module.getFilterName,
			/**
    * Run function with possible inject - handles dependency injection.
    * 
    * @param  {Object} runObj
    * @param  {Function} runObj.fn
    * @param  {Array} runObj.inject
    * @return {Object} Function output
    * @member $di
    */
			run: function run(runObj) {
				if (!runObj) return null;
				if (!runObj.fn) {
					runObj.fn = function () {};
				}
				// def. type
				runObj.type = $module.CONST.TYPE.RUN;
				return $modulesInst.run(runObj);
			}
		};
	});
	return onix;
}();
/**
 * Filter process input data and output can be used in template or in the code.
 *
 * @class $filter
 */
onix.factory("$filter", ["$di", function ($di) {
	/**
  * Return filter by his name or returns empty filter. Filter name is concatenation of $filter + Filter name.
  *
  * @method filter
  * @param  {String} filterName 
  * @return {Object}
  * @member $filter
  */
	return function (filterName) {
		var emptyFilter = function emptyFilter(value) {
			return value || "";
		};
		if (!filterName) {
			return emptyFilter;
		}
		return $di.run({
			fn: function fn(moduleObj) {
				return moduleObj || emptyFilter;
			},
			// get filter name for injection
			inject: [$di.getFilterName(filterName)]
		});
	};
}]);
var _typeof = typeof Symbol === "function" && _typeof2(Symbol.iterator) === "symbol" ? function (obj) {
	return typeof obj === "undefined" ? "undefined" : _typeof2(obj);
} : function (obj) {
	return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof2(obj);
};
/**
 * Commom functions used in whole application.
 *
 * @class $common
 */
onix.service("$common", ["$promise", function ($promise) {
	/**
  * Object copy, from source to dest.
  *
  * @param  {Object} dest
  * @param  {Object} source
  * @member $common
  * @private
  */
	this._objCopy = function (dest, source) {
		var _this = this;
		Object.keys(source).forEach(function (prop) {
			if (source.hasOwnProperty(prop)) {
				dest[prop] = _this.cloneValue(source[prop]);
			}
		});
	};
	/**
  * Inner method for chaining promises.
  * 
  * @param  {Object[]} opts
  * @param  {String|Function} opts.method Function or method name inside scope
  * @param  {Object} opts.scope Scope for method function
  * @param  {Array} opts.args Additional arguments for function
  * @param  {Function} resolve Resolve callback for $promise
  * @param  {Array} outArray Array for output from all executed promises
  * @private
  * @member $common
  */
	this._chainPromisesInner = function (opts, resolve, outArray) {
		var _this2 = this;
		var firstItem = opts.shift();
		if (firstItem) {
			// string or function itself
			var fn = void 0;
			var error = false;
			switch (_typeof(firstItem.method)) {
				case "string":
					if (!firstItem.scope || !(firstItem.method in firstItem.scope)) {
						error = true;
					} else {
						fn = firstItem.scope[firstItem.method];
						if (typeof fn !== "function") {
							error = true;
						}
					}
					break;
				case "function":
					fn = firstItem.method;
					break;
				default:
					error = true;
			}
			if (!error) {
				fn.apply(firstItem.scope || fn, firstItem.args || []).then(function (data) {
					outArray.push(data);
					_this2._chainPromisesInner(opts, resolve, outArray);
				}, function (err) {
					outArray.push(err);
					_this2._chainPromisesInner(opts, resolve, outArray);
				});
			} else {
				resolve(outArray);
			}
		} else {
			resolve(outArray);
		}
	};
	/**
  * Confirm window, returns promise.
  *
  * @param  {String} txt
  * @return {$promise}
  * @member $common
  */
	this.confirm = function (txt) {
		return new $promise(function (resolve, reject) {
			if (confirm(txt)) {
				resolve();
			} else {
				reject();
			}
		});
	};
	/**
  * Merge multiple objects into the single one.
  *
  * @return {Object}
  * @member $common
  */
	this.merge = function () {
		var count = arguments.length;
		var dest = {};
		if (count > 0) {
			for (var i = 0; i < count; i++) {
				var source = arguments[i];
				this._objCopy(dest, source);
			}
		}
		return dest;
	};
	/**
  * Extend one object by other; from source to dest.
  *
  * @param  {Object} dest
  * @param  {Object} source
  * @member $common
  */
	this.extend = function (dest, source) {
		dest = dest || {};
		source = source || {};
		this._objCopy(dest, source);
	};
	/**
  * Clone value without references.
  * 
  * @param  {Object} value Input value
  * @param  {Number} [lvl] Recursive threshold
  * @return {Object} cloned value
  * @member $common
  */
	this.cloneValue = function (value, lvl) {
		var _this3 = this;
		lvl = lvl || 1;
		// recursive call threshold
		if (lvl > 100) return null;
		switch (typeof value === "undefined" ? "undefined" : _typeof(value)) {
			case "object":
				if (Array.isArray(value)) {
					var _ret = function () {
						// array
						var newArray = [];
						value.forEach(function (item) {
							newArray.push(_this3.cloneValue(item, lvl + 1));
						});
						return {
							v: newArray
						};
					}();
					if ((typeof _ret === "undefined" ? "undefined" : _typeof(_ret)) === "object") return _ret.v;
				} else if (value instanceof Date) {
					// date
					return new Date(value.getTime());
				} else if (value instanceof Element) {
					// element
					return value;
				} else if (value) {
					var _ret2 = function () {
						// object
						var newObj = {};
						Object.keys(value).forEach(function (prop) {
							if (value.hasOwnProperty(prop)) {
								newObj[prop] = _this3.cloneValue(value[prop], lvl + 1);
							}
						});
						return {
							v: newObj
						};
					}();
					if ((typeof _ret2 === "undefined" ? "undefined" : _typeof(_ret2)) === "object") return _ret2.v;
				} else {
					// null
					return null;
				}
			case "undefined":
			case "function":
			case "number":
			case "string":
				return value;
		}
	};
	/**
  * Inherit function with another function/s.
  * First argument is source function, others are for inheritance.
  * Last parameters have higher priority than the previous ones.
  *
  * @member $common
  */
	this.inherit = function () {
		// first is source, rest is inherit classess
		var args = arguments;
		if (args.length < 2) return;
		var source = args[0].prototype;
		var inherits = Array.prototype.slice.call(args, 1);
		// all inherits items
		inherits.forEach(function (inhItem) {
			// iterate prototype items
			for (var p in inhItem.prototype) {
				source[p] = _typeof(inhItem.prototype[p]) != "object" ? inhItem.prototype[p] : JSON.parse(JSON.stringify(inhItem.prototype[p]));
			}
		});
	};
	/**
  * Bind function arguments without scope.
  *
  * @param  {Function} cb
  * @return {Function}
  * @member $common
  */
	this.bindWithoutScope = function (cb) {
		var bindArgs = Array.prototype.slice.call(arguments, 1);
		return function () {
			var internalArgs = Array.prototype.slice.call(arguments, 0);
			var args = Array.prototype.concat(internalArgs, bindArgs);
			return cb.apply(this, args);
		};
	};
	/**
  * Missing for each for Node array.
  *
  * @param  {Object[]} nodes
  * @param  {Function} cb
  * @param  {Object|Function} scope
  * @member $common
  */
	this.nodesForEach = function (nodes, cb, scope) {
		if (typeof cb !== "function") return;
		if (nodes) {
			Array.prototype.slice.call(nodes).forEach(function (item, ind) {
				cb.apply(scope || cb, [item, ind]);
			});
		}
	};
	/**
  * Reverse for each.
  *
  * @param {Array} arr
  * @param {Function} cb
  * @param {Function} [scope]
  * @member $common
  */
	this.reverseForEach = function (arr, cb, scope) {
		if (typeof cb !== "function") return;
		arr = arr || [];
		for (var i = arr.length - 1; i >= 0; i--) {
			cb.apply(scope || this, [arr[i], i]);
		}
	};
	/**
  * HEX value to DEC.
  *
  * @param  {String} hex
  * @return {Number}
  * @member $common
  */
	this.hexToD = function (hex) {
		hex = hex.toLowerCase();
		switch (hex) {
			case "a":
				return 10;
			case "b":
				return 11;
			case "c":
				return 12;
			case "d":
				return 13;
			case "e":
				return 14;
			case "f":
				return 15;
			default:
				return parseInt(hex, 10);
		}
	};
	/**
  * HEX value to RGB.
  *
  * @param  {String} hexColor
  * @return {Object}
  * @member $common
  */
	this.hexToRGB = function (hexColor) {
		if (hexColor[0] == "#") {
			hexColor = hexColor.replace("#", "");
			if (hexColor.length == 3) {
				return {
					r: this.hexToD(hexColor[0]) * 16 + this.hexToD(hexColor[0]),
					g: this.hexToD(hexColor[1]) * 16 + this.hexToD(hexColor[1]),
					b: this.hexToD(hexColor[2]) * 16 + this.hexToD(hexColor[2])
				};
			} else {
				return {
					r: this.hexToD(hexColor[0]) * 16 + this.hexToD(hexColor[1]),
					g: this.hexToD(hexColor[2]) * 16 + this.hexToD(hexColor[3]),
					b: this.hexToD(hexColor[4]) * 16 + this.hexToD(hexColor[5])
				};
			}
		} else {
			return hexColor;
		}
	};
	/**
  * Is value element?
  *
  * @param  {Object} val
  * @return {Boolean}
  * @member $common
  */
	this.isElement = function (val) {
		return val instanceof HTMLElement;
	};
	/**
  * Is item object?
  * 
  * @param  {Object} item
  * @return {Boolean}
  * @member $common
  */
	this.isObject = function (item) {
		return (typeof item === "undefined" ? "undefined" : _typeof(item)) === "object" && !Array.isArray(item) && item !== null;
	};
	/**
  * Cover function for console.log, which allows to replace {0..n} occurences inside string.
  * First argument is string, other arguments are for replace objects by key.
  * 
  * @member $common
  */
	this.col = function () {
		var args = Array.prototype.slice.call(arguments);
		var output = "";
		var params = {};
		args.forEach(function (arg, ind) {
			if (ind == 0) {
				output = arg;
			} else {
				params["[{]" + (ind - 1) + "[}]"] = arg;
			}
		});
		Object.keys(params).forEach(function (param) {
			output = output.replace(new RegExp(param, "g"), params[param]);
		});
		if (output) {
			console.log(output);
		}
	};
	/**
  * Format size in bytes.
  * 
  * @param  {Number} size
  * @return {String}
  * @member $common
  */
	this.formatSize = function (size) {
		if (typeof size !== "number") {
			return "null";
		}
		var lv = size > 0 ? Math.floor(Math.log(size) / Math.log(1000)) : 0;
		var sizes = ["", "K", "M", "G", "T"];
		lv = Math.min(sizes.length, lv);
		var value = lv > 0 ? (size / Math.pow(1000, lv)).toFixed(2) : size;
		return value + " " + sizes[lv] + "B";
	};
	/**
  * Chaining multiple methods with promises, returns promise.
  * 
  * @param  {Object[]} opts
  * @param  {String|Function} opts.method Function or method name inside scope
  * @param  {Object} opts.scope Scope for method function
  * @param  {Array} opts.args Additional arguments for function
  * @return {$promise}
  * @member $common
  */
	this.chainPromises = function (opts) {
		var _this4 = this;
		return new $promise(function (resolve) {
			_this4._chainPromisesInner(opts, resolve, []);
		});
	};
	/**
  * Cancel event and his propagation.
  * 
  * @param  {Event} e
  * @member $common
  */
	this.cancelEvents = function (e) {
		if (e) {
			e.stopPropagation();
			e.preventDefault();
		}
	};
	/**
  * Converts css name to javascript style interpretation.
  * 
  * @param {String} value
  * @return {String} "z-index" -> zIndex
  * @member $common
  */
	this.cssNameToJS = function (value) {
		var parts = value.split("-");
		var output = "";
		parts.forEach(function (part, ind) {
			output += !ind ? part : part[0].toUpperCase() + part.substr(1);
		});
		return output;
	};
}]);
/**
 * Functionality over browser cookies.
 *
 * @class $cookie
 */
onix.service("$cookie", ["$date", function ($date) {
	/**
  * $cookie constants.
  * 
  * @member $cookie
  * @private
  */
	this._CONST = {
		EXPIRES: {
			MAX: "Fri, 31 Dec 9999 23:59:59 GMT",
			MIN: "Thu, 01 Jan 1970 00:00:00 GMT"
		}
	};
	/**
  * Set cookie. Default expiration is 30 days from creation.
  *
  * @param  {String} name
  * @param  {String} value
  * @param  {Object} [optsArg]
  * @param  {Number|String|Date} [optsArg.expiration=null] Cookie expiration
  * @param  {String} [optsArg.path=""] Cookie path
  * @param  {String} [optsArg.domain=""] Cookie domain
  * @param  {String} [optsArg.secure=""] Cookie secure
  * @return {Boolean}
  * @member $cookie
  * @private
  */
	this.set = function (name, value, optsArg) {
		if (!name || /^(?:expires|max\-age|path|domain|secure)$/i.test(name)) {
			return false;
		}
		var opts = {
			expiration: $date.addDays(new Date(), 30),
			path: "",
			domain: "",
			secure: ""
		};
		var expires = "";
		if (opts.expiration) {
			switch (opts.expiration.constructor) {
				case Number:
					expires = opts.expiration === Infinity ? "; expires=" + this._CONST.EXPIRES.MAX : "; max-age=" + opts.expiration;
					break;
				case String:
					expires = "; expires=" + opts.expiration;
					break;
				case Date:
					expires = "; expires=" + opts.expiration.toUTCString();
					break;
			}
		}
		document.cookie = encodeURIComponent(name) + "=" + encodeURIComponent(value) + expires + (opts.domain ? "; domain=" + opts.domain : "") + (opts.path ? "; path=" + opts.path : "") + (opts.secure ? "; secure" : "");
		return true;
	};
	/**
  * Get cookies by her name.
  *
  * @param  {String} name
  * @return {String}
  * @member $cookie
  * @private
  */
	this.get = function (name) {
		name = name || "";
		var cookieValue = null;
		if (document.cookie && document.cookie != '') {
			var cookies = document.cookie.split(';');
			cookies.every(function (cookie) {
				cookie = cookie.trim();
				if (cookie.substring(0, name.length + 1) == name + '=') {
					cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
					return false;
				} else return true;
			});
		}
		return cookieValue;
	};
	/**
  * Remove cookie.
  *
  * @param  {String} name Cookie name
  * @param  {String} [domain] Cookie domain
  * @param  {String} [path] Cookie path
  * @return {Boolean}
  * @member $cookie
  * @private
  */
	this.remove = function (name, domain, path) {
		if (!this.contains(name)) {
			return false;
		}
		document.cookie = encodeURIComponent(name) + "=; expires=" + this._CONST.EXPIRES.MIN + (domain ? "; domain=" + domain : "") + (path ? "; path=" + path : "");
		return true;
	};
	/**
  * Document contains cookie?
  *
  * @param  {String} name Cookie name
  * @return {Boolean}
  * @member $cookie
  * @private
  */
	this.contains = function (name) {
		if (!name) return false;
		return new RegExp("(?:^|;\\s*)" + encodeURIComponent(name).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=").test(document.cookie);
	};
}]);
/**
 * Date operations.
 * 
 * @class $date
 */
onix.service("$date", function () {
	/**
  * Parse EN date to CS format.
  * year-month-day -> day. month. year
  * 2016-06-31 -> 31. 6. 2016
  * 
  * @param {String} enDate
  * @return {String}
  * @member $date
  */
	this.dateENtoCS = function (enDate) {
		enDate = enDate || "";
		var parts = enDate.split("-");
		if (parts.length == 3) {
			// delete first 0
			return [parts[2].replace(/^0/, ""), parts[1].replace(/^0/, ""), parts[0]].join(". ");
		} else {
			return "";
		}
	};
	/**
  * Parse CS date to EN format.
  * day. month. year -> year-month-day
  * 31. 6. 2016 -> 2016-06-31
  * 
  * @param {String} csDate
  * @return {String}
  * @member $date
  */
	this.dateCStoEN = function (csDate) {
		// day. month. year 31. 12. 2015
		csDate = csDate || "";
		var parts = csDate.split(".");
		if (parts.length == 3) {
			var year = parts[2].trim();
			var month = parts[1].trim();
			var date = parts[0].trim();
			// add 0 from left
			date = date.length == 1 ? "0" + date : date;
			month = month.length == 1 ? "0" + month : month;
			return [year, month, date].join("-");
		} else {
			return "";
		}
	};
	/**
  * Is string contains CS date format?
  * 
  * @param  {String} csDate
  * @return {Boolean}
  * @member $date
  */
	this.isCSdate = function (csDate) {
		csDate = csDate || "";
		return !!csDate.match(/([1-9]|[1-3][0-9])\.[ ]*([1-9]|1[0-2])\.[ ]*[1-9][0-9]{3}/);
	};
	/**
  * Add days to date.
  * 
  * @param  {Date} date
  * @param  {Number} days
  * @return {Date}
  * @member $date
  */
	this.addDays = function (date, days) {
		days = days || 0;
		var addTime = 1000 * 60 * 60 * 24 * days;
		return new Date(date.getTime() + addTime);
	};
});
var _typeof = typeof Symbol === "function" && _typeof2(Symbol.iterator) === "symbol" ? function (obj) {
	return typeof obj === "undefined" ? "undefined" : _typeof2(obj);
} : function (obj) {
	return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof2(obj);
};
/**
 * Class for creating DOM elements and getting their references.
 * 
 * @class $dom
 */
onix.service("$dom", ["$common", function ($common) {
	/**
  * Create $dom from the configuration.
  *
  * @param  {Object} config
  * @param  {String} config.el Element name, default creates "div"
  * @param  {Object} [config.attrs] Atributes
  * @param  {Object} [config.css] Object with css styles
  * @param  {Array|Object} [config.events] Bind events {event, fn}
  * @param  {Array|Object} [config.child] Child nodes
  * @param  {String|Array} [config.class] Add CSS class/es
  * @param  {Object} [exported] to this object will be exported all marked elements (_exported attr.)
  * @return {Element}
  * @member $dom
  */
	this.create = function (config, exported) {
		var _this = this;
		var el = document.createElement(config.el || "div");
		Object.keys(config).forEach(function (key) {
			var value = void 0;
			switch (key) {
				case "el":
					break;
				case "attrs":
					value = config.attrs;
					if (value && (typeof value === "undefined" ? "undefined" : _typeof(value)) === "object" && !Array.isArray(value)) {
						Object.keys(value).forEach(function (attr) {
							el.setAttribute(attr, value[attr]);
						});
					}
					break;
				case "css":
					value = config.css;
					if (value && (typeof value === "undefined" ? "undefined" : _typeof(value)) === "object" && !Array.isArray(value)) {
						Object.keys(value).forEach(function (name) {
							el.style[$common.cssNameToJS(name)] = value[name];
						});
					}
					break;
				case "events":
					value = config.events;
					if (!Array.isArray(value)) {
						value = [value];
					}
					value.forEach(function (item) {
						el.addEventListener(item.event, item.fn);
					});
					break;
				case "child":
					value = config.child;
					if (!Array.isArray(value)) {
						value = [value];
					}
					value.forEach(function (child) {
						el.appendChild(_this.create(child, exported));
					});
					break;
				case "_exported":
					exported[config._exported] = el;
					break;
				case "class":
					value = config["class"];
					if (typeof value === "string") {
						el.classList.add(value);
					} else if (Array.isArray(value)) {
						value.forEach(function (item) {
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
  * @return {Object|Element}
  * @member $dom
  */
	this.get = function (els, parent) {
		parent = parent || document;
		var output = void 0;
		if (typeof els === "string" && els) {
			output = parent.querySelector(els);
		} else if (Array.isArray(els)) {
			output = {};
			els.forEach(function (item) {
				var name = void 0;
				if (typeof item === "string") {
					name = item.replace(/^[.# ]+/g, "");
					output[name] = parent.querySelector(item);
				} else {
					name = item.sel.replace(/^[.# ]+/g, "");
					output[item.name || name] = parent.querySelector(item.sel);
				}
			});
		}
		return output;
	};
}]);
function _classCallCheck(instance, Constructor) {
	if (!(instance instanceof Constructor)) {
		throw new TypeError("Cannot call a class as a function");
	}
}
onix.factory("$event", function () {
	/**
  * This class is used for extending existing objects and brings signal functionality.
  * 
 	 * @class $event
 	 */
	var $event = function () {
		function $event() {
			_classCallCheck(this, $event);
		}
		/**
   * Init event functionality.
   * 
   * @member $event
   * @private
   * @method _eventInit
   */
		$event.prototype._eventInit = function _eventInit() {
			/**
    * All events. { name: name, event: function, scope, [once] }
    * 
    * @type {Array}
    * @member $event
    * @private
    */
			this._allEvents = [];
		};
		/**
   * Add new event to the stack.
   * 
   * @param  {String} name 
   * @param  {Function} fn
   * @param  {Object|Function} [scope]
   * @member $event
   * @method on
   */
		$event.prototype.on = function on(name, fn, scope) {
			if (!name || !fn) return;
			this._allEvents.push({
				name: name,
				fn: fn,
				scope: scope
			});
		};
		/**
   * Remove event from the stack.
   * 
   * @param  {String} name 
   * @param  {Function} [fn]
   * @param  {Object|Function} [scope]
   * @member $event
   * @method off
   */
		$event.prototype.off = function off(name, fn, scope) {
			if (!name) return;
			var len = this._allEvents.length - 1;
			for (var i = len; i >= 0; i--) {
				var item = this._allEvents[i];
				if (item.name != name) continue;
				if ((!fn || fn == item.fn) && (!scope || scope == item.scope)) {
					this._allEvents.splice(i, 1);
				}
			}
		};
		/**
   * Add one time event to the stack.
   * 
   * @param  {String} name
   * @param  {Function} [fn]
   * @param  {Object|Function} [scope]
   * @member $event
   * @method once
   */
		$event.prototype.once = function once(name, fn, scope) {
			if (!name || !fn) return;
			this._allEvents.push({
				name: name,
				fn: fn,
				scope: scope,
				once: true
			});
		};
		/**
   * Trigger event with arguments 0..n.
   * 
   * @param  {String} name
   * @member $event
   * @method trigger
   */
		$event.prototype.trigger = function trigger(name) {
			if (!name) return;
			var args = Array.prototype.slice.call(arguments, 1);
			var len = this._allEvents.length - 1;
			for (var i = len; i >= 0; i--) {
				var item = this._allEvents[i];
				if (item.name != name) continue;
				// call fn
				item.fn.apply(item.scope || this, args);
				// once event
				if (item.once) {
					this._allEvents.splice(i, 1);
				}
			}
		};
		return $event;
	}();
	;
	return $event;
});
function _classCallCheck(instance, Constructor) {
	if (!(instance instanceof Constructor)) {
		throw new TypeError("Cannot call a class as a function");
	}
}
function _possibleConstructorReturn(self, call) {
	if (!self) {
		throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
	}return call && ((typeof call === "undefined" ? "undefined" : _typeof2(call)) === "object" || typeof call === "function") ? call : self;
}
function _inherits(subClass, superClass) {
	if (typeof superClass !== "function" && superClass !== null) {
		throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : _typeof2(superClass)));
	}subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}
onix.factory("$resize", ["$event", function ($event) {
	// ------------------------ private ----------------------------------------
	/**
  * Handle window resize event, triggers signal "resize".
  *
  * @class $resize
  */
	var $resize = function (_$event) {
		_inherits($resize, _$event);
		function $resize() {
			_classCallCheck(this, $resize);
			// event init
			var _this = _possibleConstructorReturn(this, _$event.call(this));
			_this._eventInit();
			/**
    * Is active?
    *
    * @member $resize
    * @private
    */
			_this._active = false;
			/**
    * Resize object.
    *
    * @member $resize
    * @private
    */
			_this._resizeObj = {
				id: null,
				timeout: 333
			};
			/**
    * Binds for functions.
    *
    * @member $resize
    * @private
    */
			_this._binds = {
				resize: _this._resize.bind(_this),
				resizeInner: _this._resizeInner.bind(_this)
			};
			return _this;
		}
		/**
   * Window resize event.
   *
   * @member $resize
   * @private
   * @method _resize
   */
		$resize.prototype._resize = function _resize() {
			if (this._resizeObj.id) {
				clearTimeout(this._resizeObj.id);
				this._resizeObj.id = null;
			}
			this._resizeObj.id = setTimeout(this._binds.resizeInner, this._resizeObj.timeout);
		};
		/**
   * Window resize event - trigger signal "resize".
   *
   * @member $resize
   * @private
   * @method _resizeInner
   */
		$resize.prototype._resizeInner = function _resizeInner() {
			this.trigger("resize");
		};
		// ------------------------ public ----------------------------------------
		/**
   * Bind resize event to window object.
   *
   * @member $resize
   * @method start
   */
		$resize.prototype.start = function start() {
			if (this._active) return;
			window.addEventListener("resize", this._binds.resize);
			this._active = true;
		};
		/**
   * Unbind resize event from window object.
   *
   * @member $resize
   * @method end
   */
		$resize.prototype.end = function end() {
			if (!this._active) return;
			window.removeEventListener("resize", this._binds.resize);
			this._active = false;
		};
		return $resize;
	}($event);
	;
	return new $resize();
}]);
var _typeof = typeof Symbol === "function" && _typeof2(Symbol.iterator) === "symbol" ? function (obj) {
	return typeof obj === "undefined" ? "undefined" : _typeof2(obj);
} : function (obj) {
	return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof2(obj);
};
/**
 * Filter - lowercase functionality.
 *
 * @class $filterLowercase
 */
onix.filter("lowercase", function () {
	/**
  * Input is transformatted to lowercase.
  *
  * @method lowercase
  * @param  {String} input
  * @return {String|Object}
  * @member $filterLowercase
  */
	return function (input) {
		if (typeof input === "string") {
			return input.toLowerCase();
		} else {
			return input;
		}
	};
});
/**
 * Filter - uppercase functionality.
 *
 * @class $filterUppercase
 */
onix.filter("uppercase", function () {
	/**
  * Input is transformatted to uppercase.
  *
  * @method uppercase
  * @param  {String} input
  * @return {String|Object}
  * @member $filterUppercase
  */
	return function (input) {
		if (typeof input === "string") {
			return input.toUpperCase();
		} else {
			return input;
		}
	};
});
/**
 * Filter - json stringify functionality.
 *
 * @class $filterJson
 */
onix.filter("json", function () {
	/**
  * Input object is stringfied.
  *
  * @method json
  * @param {Object} obj Input object
  * @param {Number} [spacing] Number of spaces per indetation
  * @return {String}
  * @member $filterJson
  */
	return function (obj, spacing) {
		if ((typeof obj === "undefined" ? "undefined" : _typeof(obj)) === "object") {
			var space = null;
			if (spacing) {
				spacing = parseInt(spacing, 10);
				space = isNaN(spacing) ? null : spacing;
			}
			return JSON.stringify(obj, null, space);
		} else {
			return obj;
		}
	};
});
/**
 * XMLHttpRequest cover class.
 * 
 * @class $http
 */
onix.service("$http", ["$promise", "$common", "$location", function ($promise, $common, $location) {
	/**
  * https://developer.mozilla.org/en-US/docs/Web/Guide/Using_FormData_Objects.
  * Prepare post data.
  *
  * @param  {Object|Array} data { name, value }
  * @return {Object}
  * @member $http
  * @private
  */
	this._preparePostData = function (data) {
		var formData = new FormData();
		if (data) {
			if (Array.isArray(data)) {
				data.forEach(function (item) {
					formData.append(item.name, item.value);
				});
			} else {
				Object.keys(data).forEach(function (key) {
					formData.append(key, data[key]);
				});
			}
		}
		return formData;
	};
	/**
  * Update URL using get data.
  *
  * @param  {String} url
  * @param  {Array} data { name, value }
  * @return {String}
  * @member $http
  * @private
  */
	this._updateURL = function (url, data) {
		var getURL = $location.objToURL(data);
		if (getURL) {
			url += (url.indexOf("?") == -1 ? "?" : "") + getURL;
		}
		return url;
	};
	/**
  * Request types.
  *
  * @property {Object}
  * @param {Number} JSON
  * @param {Number} FORM_DATA
  * @member $http
  */
	this.POST_TYPES = {
		JSON: 1,
		FORM_DATA: 2
	};
	/**
  * Http methods.
  *
  * @property {Object}
  * @param {String} POST
  * @param {String} GET
  * @param {String} DELETE
  * @param {String} PATCH
  * @member $http
  */
	this.METHOD = {
		POST: "POST",
		GET: "GET",
		DELETE: "DELETE",
		PATCH: "PATCH"
	};
	/**
  * Create new XHR request, returns promise.
  *
  * @param  {Object} config
  * @param  {String} config.url URL
  * @param  {String} [config.method] Method from $http.METHOD
  * @param  {String} [config.postType] Post type from $http.POST_TYPES
  * @param  {Object|Array} [config.getData] Data, which will be send in the url (GET)
  * @param  {Object|FormData} [config.postData] Post data
  * @param  {Object} [config.headers] Additional headers
  * @return {$promise}
  * @member $http
  */
	this.createRequest = function (config) {
		var _this = this;
		return new $promise(function (resolve, reject) {
			config = config || {};
			var request = new XMLHttpRequest();
			var method = config.method || _this.METHOD.GET;
			var url = config.url || "";
			if (!url) {
				reject();
				return;
			}
			url = _this._updateURL(url, config.getData);
			request.onerror = function (err) {
				reject(err);
			};
			request.open(method, url, true);
			request.onreadystatechange = function () {
				if (request.readyState == 4) {
					var responseData = request.responseText || "";
					var responseType = request.getResponseHeader("Content-Type");
					var promiseData = null;
					if (responseType == "application/json") {
						promiseData = responseData.length ? JSON.parse(responseData) : {};
					} else {
						promiseData = responseData;
					}
					var promiseObj = {
						status: request.status,
						data: promiseData,
						url: url,
						method: method
					};
					// 200 ok
					// 201 created
					// 204 succesfully deleted
					// 403 unautorized
					if (request.status >= 200 && request.status < 300) {
						resolve(promiseObj);
					} else {
						reject(promiseObj);
					}
				}
			};
			try {
				(function () {
					// add headers
					var headers = config.headers;
					if ($common.isObject(headers)) {
						Object.keys(headers).forEach(function (headerName) {
							request.setRequestHeader(headerName, headers[headerName]);
						});
					}
					if (method == _this.METHOD.GET) {
						request.setRequestHeader('Accept', 'application/json');
					}
					var type = config.postType || _this.POST_TYPES.JSON;
					if (config.postData && type == _this.POST_TYPES.JSON) {
						request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
						request.send(JSON.stringify(config.postData));
					} else if (config.postData && type == _this.POST_TYPES.FORM_DATA) {
						request.send(_this._preparePostData(config.postData));
					} else {
						request.send();
					}
				})();
			} catch (err) {
				reject(err);
			}
		});
	};
}]);
function _classCallCheck(instance, Constructor) {
	if (!(instance instanceof Constructor)) {
		throw new TypeError("Cannot call a class as a function");
	}
}
onix.provider("$i18n", function () {
	/**
  * All langs data.
  *
  * @type {Object}
  * @member $i18nProvider
  * @private
  */
	var _langs = {};
	/**
  * Current language-
  *
  * @type {String}
  * @member $i18nProvider
  * @private
  */
	var _currentLang = "";
	/**
  * Bind global _ as translation function-
  *
  * @type {String}
  * @member $i18nProvider
  * @private
  */
	var _bindGlobalTranslation = true;
	/**
  * Replace translated text by object. This functions is implementation of message format object replace inside the string.
  *
  * @param  {String} translate
  * @param  {Object} [replace] Replace all {} in the string
  * @return {String}
  * @member $i18nProvider
  * @private
  */
	var _transReplace = function _transReplace(translate, replace) {
		translate = translate || "";
		replace = replace || {};
		var replaceParts = translate.match(/{[^}]+,.*}|{[^}]*}/g);
		if (replaceParts) {
			(function () {
				var finalReplace = {};
				replaceParts.forEach(function (part) {
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
							multiParts.forEach(function (mpart) {
								var mpartSplits = mpart.split("{");
								var mpartValue = mpartSplits[1];
								mpartValue = mpartValue.substr(0, mpartValue.length - 1);
								multiPartsObj[mpartSplits[0].trim()] = mpartValue;
							});
						}
					}
					var replaceValue = name in replace ? replace[name] : "";
					if (typeof replaceValue === "number" && Object.keys(multiPartsObj).length) {
						var multiKey = void 0;
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
				Object.keys(finalReplace).forEach(function (key) {
					translate = translate.replace(new RegExp(key, "g"), finalReplace[key]);
				});
			})();
		}
		return translate;
	};
	/**
  * Get text function. Translate for the current language and the key.
  *
  * @param  {String} key
  * @param  {Object} [replace] Replace all {} in the string
  * @return {String}
  * @member $i18nProvider
  * @private
  */
	var _getText = function _getText(key, replace) {
		key = key || "";
		var lObj = _langs[_currentLang];
		var translate = "";
		if (lObj) {
			(function () {
				var parts = key.split(".");
				var len = parts.length;
				parts.every(function (item, ind) {
					if (item in lObj) {
						lObj = lObj[item];
						if (ind == len - 1) {
							translate = lObj;
							return false;
						}
					} else {
						return false;
					}
					// go on
					return true;
				});
			})();
		}
		return _transReplace(translate, replace);
	};
	/**
  * Add a new language.
  *
  * @param {String} lang Language key
  * @param {Object} data
  * @member $i18nProvider
  * @private
  */
	var _addLanguage = function _addLanguage(lang, data) {
		if (!lang || !data) return;
		if (!_langs[lang]) {
			_langs[lang] = {};
		}
		// merge
		Object.keys(data).forEach(function (key) {
			_langs[lang][key] = data[key];
		});
	};
	/**
  * Set new language by his key.
  *
  * @param {String} lang Language key
  * @member $i18nProvider
  * @private
  */
	var _setLanguage = function _setLanguage(lang) {
		_currentLang = lang || "";
	};
	/**
  * Disable global translation in _
  *
  * @member $i18nProvider
  */
	this.disableGlobalTranslation = function () {
		_bindGlobalTranslation = false;
	};
	/**
  * Add a new language.
  *
  * @param {String} lang Language key
  * @param {Object} data
  * @member $i18nProvider
  */
	this.addLanguage = function (lang, data) {
		_addLanguage(lang, data);
	};
	/**
  * Set new language by his key.
  *
  * @param {String} lang Language key
  * @member $i18nProvider
  */
	this.setLanguage = function (lang) {
		_setLanguage(lang);
	};
	/**
  * Post process during config phase.
  *
  * @member $i18nProvider
  */
	this.postProcess = function () {
		if (_bindGlobalTranslation) {
			/**
    * Get text function. Translate for the current language and the key.
    *
    * @param  {String} key
    * @param  {Object} [replace] Replace all {} in the string
    * @return {String}
    * @member window
    * @property {Function}
    */
			window._ = _getText;
		}
	};
	/**
  * Function that creates $i18n.
  * 
  * @member $i18nProvider
  * @return {Array}
  */
	this.$get = ["$http", "$promise", function ($http, $promise) {
		/**
   * Language support, string translation with support for message format syntax.
   * 
   * @class $i18n
   */
		var $i18n = function () {
			function $i18n() {
				_classCallCheck(this, $i18n);
			}
			/**
    * Get text function. Translate for the current language and the key.
    *
    * @param  {String} key
    * @param  {Object} [replace] Replace all {} in the string
    * @return {String}
    * @member $i18n
    * @method _
    */
			$i18n.prototype._ = function _(key, replace) {
				return _getText(key, replace);
			};
			/**
    * Add a new language.
    *
    * @param {String} lang Language key
    * @param {Object} data
    * @member $i18n
    * @method addLanguage
    */
			$i18n.prototype.addLanguage = function addLanguage(lang, data) {
				_addLanguage(lang, data);
			};
			/**
    * Set new language by his key.
    *
    * @param {String} lang Language key
    * @member $i18n
    * @method setLanguage
    */
			$i18n.prototype.setLanguage = function setLanguage(lang) {
				_setLanguage(lang);
			};
			/**
    * Get current language key.
    *
    * @return {String} Language key
    * @member $i18n
    * @method getLanguage
    */
			$i18n.prototype.getLanguage = function getLanguage(lang) {
				return _currentLang;
			};
			/**
    * Get all languages keys.
    *
    * @return {Array[String]} Languages keys
    * @member $i18n
    * @method getAllLanguages
    */
			$i18n.prototype.getAllLanguages = function getAllLanguages(lang) {
				return Object.keys(_langs);
			};
			/**
    * Load language from the file.
    *
    * @param  {String} lang Language key
    * @param  {String} url  Path to the file
    * @return {$promise}
    * @member $i18n
    * @method loadLanguage
    */
			$i18n.prototype.loadLanguage = function loadLanguage(lang, url) {
				return new $promise(function (resolve, reject) {
					$http.createRequest({
						url: url
					}).then(function (okData) {
						_addLanguage(lang, okData.data);
						resolve();
					}, function (errorData) {
						reject(errorData);
					});
				});
			};
			return $i18n;
		}();
		;
		return new $i18n();
	}];
});
/**
 * Provider for registering _ translate object.
 */
onix.config(["$i18nProvider", function ($i18nProvider) {
	$i18nProvider.postProcess();
}]);
/**
 * Class for creating img previews from File[] variable.
 * 
 * @class $image
 */
onix.service("$image", ["$promise", "$features", function ($promise, $features) {
	/**
  * Read one image file - gets canvas with it. EXIF is readed, you can specific max size for image scale.
  *
  * @param  {Object} file Input file
  * @param  {Number} [maxSize] If image width/height is higher than this value, image will be scaled to this dimension
  * @return {$promise} Promise with output object
  * @member $image
  */
	this.readFromFile = function (file, maxSize) {
		var _this = this;
		return new $promise(function (resolve, reject) {
			if (!$features.FILE_READER) {
				reject();
				return;
			}
			var reader = new FileReader();
			var output = {
				img: null,
				exif: null,
				canvas: null
			};
			reader.onload = function (e) {
				var binaryData = reader.result;
				var binaryDataArray = new Uint8Array(binaryData);
				var exif = null;
				// exif only for jpeg
				if (file.type == "image/jpeg" || file.type == "image/pjpeg") {
					exif = _this.getEXIF(binaryData);
				}
				var img = new Image();
				img.onload = function () {
					var imd = _this.getImageDim(img, maxSize);
					var canvas = _this.getCanvas(img, {
						width: imd.width,
						height: imd.height,
						orientation: exif ? exif.Orientation : 0,
						scaled: imd.scale != 1
					});
					output.img = img;
					output.exif = exif;
					output.canvas = canvas;
					resolve(output);
				};
				img.src = _this.fileToBase64(file.type, binaryDataArray);
			};
			reader.readAsArrayBuffer(file);
		});
	};
	/**
  * Counts image dimension; if maxSize is available, new dimension is calculated.
  *
  * @param  {Image} img
  * @param  {Number} [maxSize] If image width/height is higher than this value, image will be scaled to this dimension
  * @return {Object}
  * @member $image
  */
	this.getImageDim = function (img, maxSize) {
		maxSize = maxSize || 0;
		var largeWidth = maxSize > 0 && img.width > maxSize;
		var largeHeight = maxSize > 0 && img.height > maxSize;
		var output = {
			width: img.width,
			height: img.height,
			scale: 1
		};
		if (largeWidth || largeHeight) {
			// resize picture
			var imgWidth = img.width;
			var imgHeight = img.height;
			// portrait x landscape
			if (img.width > img.height) {
				// landscape
				imgHeight = maxSize * imgHeight / imgWidth;
				imgWidth = maxSize;
			} else {
				// portrait
				imgWidth = maxSize * imgWidth / imgHeight;
				imgHeight = maxSize;
			}
			output.scale = img.width / imgWidth; // ratio between original x scaled image
			output.width = imgWidth;
			output.height = imgHeight;
		}
		return output;
	};
	/**
  * Get canvas from image/canvas - read input imgData, create canvas with it.
  *
  * @param  {Image} imgData
  * @param  {Object} [optsArg] Variable options
  * @param  {Number} [optsArg.width] Output canvas width
  * @param  {Number} [optsArg.height] Output canvas height
  * @param  {Number} [optsArg.orientation = 0] EXIF orientation; degrees 90, 180, 270 CCW
  * @param  {Boolean} [optsArg.scaled = false]
  * @param  {Canvas} [optsArg.canvas = null] Do not create canvas - use canvas from options
  * @return {Canvas}
  * @member $image
  */
	this.getCanvas = function (imgData, optsArg) {
		var opts = {
			width: imgData.width || 0,
			height: imgData.height || 0,
			orientation: 0,
			scaled: false,
			canvas: null
		};
		for (var key in optsArg) {
			opts[key] = optsArg[key];
		}
		if (!$features.CANVAS) {
			return null;
		}
		var canvas = opts.canvas || document.createElement("canvas");
		canvas.width = opts.width;
		canvas.height = opts.height;
		var ctx = canvas.getContext("2d");
		var draw = true;
		// rotate
		if (opts.orientation) {
			switch (opts.orientation) {
				case 2:
					// horizontal flip
					ctx.translate(opts.width, 0);
					ctx.scale(-1, 1);
					break;
				case 180:
				case 3:
					// 180° rotate left
					ctx.translate(opts.width, opts.height);
					ctx.rotate(Math.PI);
					break;
				case 4:
					// vertical flip
					ctx.translate(0, opts.height);
					ctx.scale(1, -1);
					break;
				case 5:
					// vertical flip + 90 rotate right
					canvas.width = opts.height;
					canvas.height = opts.width;
					ctx.rotate(0.5 * Math.PI);
					ctx.scale(1, -1);
					if (opts.scaled) {
						ctx.clearRect(0, 0, canvas.width, canvas.height);
						ctx.drawImage(imgData, 0, 0, imgData.width, imgData.height, 0, 0, canvas.height, canvas.width);
						draw = false;
					}
					break;
				case 90:
				case 6:
					// 90° rotate right
					canvas.width = opts.height;
					canvas.height = opts.width;
					ctx.rotate(0.5 * Math.PI);
					ctx.translate(0, -opts.height);
					if (opts.scaled) {
						ctx.clearRect(0, 0, canvas.width, canvas.height);
						ctx.drawImage(imgData, 0, 0, imgData.width, imgData.height, 0, 0, canvas.height, canvas.width);
						draw = false;
					}
					break;
				case 7:
					// horizontal flip + 90 rotate right
					canvas.width = opts.height;
					canvas.height = opts.width;
					ctx.rotate(0.5 * Math.PI);
					ctx.translate(opts.width, -opts.height);
					ctx.scale(-1, 1);
					if (opts.scaled) {
						ctx.clearRect(0, 0, canvas.width, canvas.height);
						ctx.drawImage(imgData, 0, 0, imgData.width, imgData.height, 0, 0, canvas.height, canvas.width);
						draw = false;
					}
					break;
				case 270:
				case 8:
					// 90° rotate left
					canvas.width = opts.height;
					canvas.height = opts.width;
					ctx.rotate(-0.5 * Math.PI);
					ctx.translate(-opts.width, 0);
					if (opts.scaled) {
						ctx.clearRect(0, 0, canvas.width, canvas.height);
						ctx.drawImage(imgData, 0, 0, imgData.width, imgData.height, 0, 0, canvas.height, canvas.width);
						draw = false;
					}
			}
		}
		if (draw) {
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			if (opts.scaled) {
				ctx.drawImage(imgData, 0, 0, imgData.width, imgData.height, 0, 0, canvas.width, canvas.height);
			} else {
				ctx.drawImage(imgData, 0, 0);
			}
		}
		return canvas;
	};
	/**
  * Binary data to base64.
  *
  * @param  {String} fileType
  * @param  {Array} binaryData
  * @return {String}
  * @member $image
  */
	this.fileToBase64 = function (fileType, binaryData) {
		var length = binaryData.length;
		var output = "";
		for (var i = 0; i < length; i += 1) {
			output += String.fromCharCode(binaryData[i]);
		}
		return 'data:' + fileType + ';base64,' + btoa(output);
	};
	/**
  * Is file a picture?
  *
  * @param  {File}  file
  * @return {Boolean}
  * @member $image
  */
	this.isPicture = function (file) {
		return file && (file.type == "image/jpeg" || file.type == "image/pjpeg" || file.type == "image/png");
	};
	/**
  * Get picture files from array of files.
  * 
  * @param  {Array} array of files
  * @return {Array}
  * @member $image
  */
	this.getPictureFiles = function (files) {
		var pictureFiles = [];
		if (files && files.length) {
			for (var i = 0; i < files.length; i++) {
				var item = files[i];
				if (this.isPicture(item)) {
					pictureFiles.push(item);
				}
			}
		}
		return pictureFiles;
	};
	/**
  * Get picture files count from the array of Files. This function uses 'getPictureFiles'.
  * 
  * @param  {Array} array of files
  * @return {Boolean}
  * @member $image
  */
	this.getPicturesCount = function (files) {
		return this.getPictureFiles(files).length;
	};
	/**
  * Get image EXIF information.
  * 
  * @param  {Binary[]} imgData Binary img data
  * @return {Object}
  * @member $image
  */
	this.getEXIF = function (imgData) {
		if ("EXIF" in window) {
			return EXIF.readFromBinaryFile(imgData);
		} else {
			return {};
		}
	};
}]);
function _classCallCheck(instance, Constructor) {
	if (!(instance instanceof Constructor)) {
		throw new TypeError("Cannot call a class as a function");
	}
}
onix.factory("$job", ["$promise", function ($promise) {
	/**
  * Factory for manage multiple tasks.
  * 
  * @class $job
  */
	var $job = function () {
		function $job() {
			_classCallCheck(this, $job);
			this._isRunning = false;
			this._tasks = [];
			this._taskDone = {
				cb: null,
				scope: null
			};
		}
		/**
   * Add task to job. Every job task needs to call doneFn(), which is added to the last argument position.
   * 
   * @param {Function} task Job function
   * @param {Function|Object} [scope] Variable function scope
   * @param {Object} [args] Add params to the function
   * @member $job
   * @method add
   */
		$job.prototype.add = function add(task, scope, args) {
			args = args || [];
			if (!Array.isArray(args)) {
				args = [args];
			}
			this._tasks.push({
				task: task,
				scope: scope,
				args: args
			});
		};
		/**
   * Start job.
   *
   * @return {$promise} Returns promise for whole job
   * @member $job
   * @method start
   */
		$job.prototype.start = function start() {
			var _this = this;
			return new $promise(function (resolve, reject) {
				if (_this._isRunning || !_this._tasks.length) {
					reject();
					return;
				}
				// job is running
				_this._isRunning = true;
				// because of pop
				_this._tasks.reverse();
				_this._doJob(resolve);
			});
		};
		/**
   * Clear all job taks.
   *
   * @member $job
   * @method clear
   */
		$job.prototype.clear = function clear() {
			this._tasks = [];
		};
		/**
   * Set progress function, which will be called after each task will be done.
   * 
   * @param {Function} cb
   * @param {Function|Object} [scope]
   * @member $job
   * @method setTaskDone
   */
		$job.prototype.setTaskDone = function setTaskDone(cb, scope) {
			this._taskDone.cb = cb;
			this._taskDone.scope = scope;
		};
		/**
   * Internal function for running job queue.
   *
   * @param {Function} resolve Promise object
   * @member $job
   * @method _doJob
   */
		$job.prototype._doJob = function _doJob(resolve) {
			var _this2 = this,
			    _arguments = arguments;
			var rest = this._tasks.length;
			if (rest == 0) {
				this._isRunning = false;
				resolve();
			} else {
				var job = this._tasks.pop();
				job.task.apply(job.scope || job.task, job.args.concat(function () {
					if (_this2._taskDone.cb) {
						var doneFnArgs = Array.prototype.slice.call(_arguments, 0);
						_this2._taskDone.cb.apply(_this2._taskDone.scope || _this2._taskDone.cb, doneFnArgs);
					}
					_this2._doJob(resolve);
				}));
			}
		};
		return $job;
	}();
	;
	return {
		/**
   * Factory for creating new job.
   *
   * @member $job
   * @method create
   */
		create: function create() {
			return new $job();
		},
		/**
   * Run jobs array with count for how many functions will be processed simultinously.
   *
   * @param  {Object[]} jobsArray Array with jobs objects
   * @param  {Function} jobsArray.task Job function
   * @param  {Function} [jobsArray.scope] Variable function scope
   * @param  {Function} [jobsArray.args] Add params to the function
   * @param  {Number} count How many functions processed simultinously
   * @param  {Object} taskDoneObj Callback after one task have been done
   * @param  {Object} taskDoneObj.cb Function
   * @param  {Object} [taskDoneObj.scope] Function scope
   * @return {$promise} Callback after all jobs are done
   * @member $job
   * @method multipleJobs
   */
		multipleJobs: function multipleJobs(jobsArray, count, taskDoneObj) {
			var len = jobsArray.length;
			var jobs = [];
			for (var i = 0; i < len; i++) {
				var jp = count > 0 ? i % count : i;
				var jobItem = jobsArray[i];
				if (!jobs[jp]) {
					jobs[jp] = this.create();
					if (taskDoneObj) {
						jobs[jp].setTaskDone(taskDoneObj.cb, taskDoneObj.scope);
					}
				}
				// add one job
				jobs[jp].add(jobItem.task, jobItem.scope, jobItem.args);
			}
			var jobPromises = [];
			jobs.forEach(function (job) {
				jobPromises.push(job.start());
			});
			return $promise.all(jobPromises);
		}
	};
}]);
/**
 * Cover class for localStorage.
 * 
 * @class $localStorage
 */
onix.factory("$localStorage", ["$features", function ($features) {
	// localStorage provider
	var provider = $features.LOCAL_STORAGE ? window.localStorage : {
		_data: {},
		setItem: function setItem(key, value) {
			if (!key) return;
			this._data[key] = value;
		},
		getItem: function getItem(key) {
			if (!key) return null;
			return this._data[key];
		},
		removeItem: function removeItem(key) {
			if (!key) return;
			if (key in this._data) {
				delete this._data[key];
			}
		}
	};
	return {
		/**
   * Set value to localStorage.
   *
   * @param {String} key
   * @param {String} [value]
   * @member $localStorage
   */
		set: function set(key, value) {
			provider.setItem(key, value);
		},
		/**
   * Get value from localStorage.
   *
   * @param {String} key
   * @return {String}
   * @member $localStorage
   */
		get: function get(key) {
			return provider.getItem(key);
		},
		/**
   * Remove key from localStorage.
   *
   * @param {String} key
   * @return {Boolean}
   * @member $localStorage
   */
		remove: function remove(key) {
			provider.removeItem(key);
		}
	};
}]);
var _typeof = typeof Symbol === "function" && _typeof2(Symbol.iterator) === "symbol" ? function (obj) {
	return typeof obj === "undefined" ? "undefined" : _typeof2(obj);
} : function (obj) {
	return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof2(obj);
};
/**
 * Support class for location operations.
 * 
 * @class $location
 */
onix.service("$location", function () {
	// ------------------------ public ----------------------------------------
	/**
  * Page refresh.
  *
  * @member $location
  */
	this.refresh = function () {
		window.location.reload();
	};
	/**
  * Create a new search url. This method appends ? to the start of the url.
  * 
  * @param  {Object} obj
  * @return {String}
  * @member $location
  */
	this.createSearchURL = function (obj) {
		var url = this.objToURL(obj);
		return url ? "?" + url : "";
	};
	/**
  * Object to url.
  * 
  * @param  {Array|Object} { name: x, value: y} | obj Mapping key -> name, value -> value.
  * @return {String}
  * @member $location
  */
	this.objToURL = function (obj) {
		var url = [];
		if (Array.isArray(obj)) {
			obj.forEach(function (item) {
				url.push(encodeURIComponent(item.name) + "=" + encodeURIComponent(item.value));
			});
		} else if ((typeof obj === "undefined" ? "undefined" : _typeof(obj)) === "object") {
			Object.keys(obj).forEach(function (key) {
				url.push(encodeURIComponent(key) + "=" + encodeURIComponent(obj[key]));
			});
		}
		return url.join("&");
	};
	/**
  * Get or set new url search. obj -> set new url from obj; !obj -> create obj from search part of url.
  *
  * @param  {Object} [obj]
  * @return {Object}
  * @member $location
  */
	this.search = function (obj) {
		if (obj) {
			// write
			var newURL = this.createSearchURL(obj);
			if (newURL) {
				window.location.search = newURL;
			}
		} else {
			var _ret = function () {
				// read
				var data = location.search;
				var output = {};
				if (data) {
					data = data.replace("?", "");
					data.split("&").forEach(function (item) {
						var parts = item.split("=");
						var name = decodeURIComponent(parts[0]);
						output[name] = decodeURIComponent(parts[1]);
					});
				}
				return {
					v: output
				};
			}();
			if ((typeof _ret === "undefined" ? "undefined" : _typeof(_ret)) === "object") return _ret.v;
		}
	};
	/**
  * Get current location.
  *
  * @return {String}
  * @member $location
  */
	this.get = function () {
		return window.location.pathname;
	};
});
/**
 * Many useful alghoritms.
 * 
 * @class $math
 */
onix.service("$math", function () {
	/**
  * Math constants.
  *
  * @private
  * @type {Object}
  * @member $math
  */
	this._CONST = {
		ZOOM: 156543.034
	};
	/**
  * Is there two bounding box intersection?
  * 
  * @param  {Object} bbox1
  * @param  {Number} bbox1.x Left top coordinates - axe x
  * @param  {Number} bbox1.y Left top coordinates - axe y
  * @param  {Number} bbox1.width Width of the bbox
  * @param  {Number} bbox1.height Height of the bbox
  * @param  {Object} bbox2
  * @param  {Number} bbox2.x Left top coordinates - axe x
  * @param  {Number} bbox2.y Left top coordinates - axe y
  * @param  {Number} bbox2.width Width of the bbox
  * @param  {Number} bbox2.height Height of the bbox
  * @return {Boolean}
  * @member $math
  */
	this.isBBoxIntersection = function (bbox1, bbox2) {
		var ltx = Math.max(bbox1.x, bbox2.x);
		var lty = Math.max(bbox1.y, bbox2.y);
		var rbx = Math.min(bbox1.x + bbox1.width, bbox2.x + bbox2.width);
		var rby = Math.min(bbox1.y + bbox1.height, bbox2.y + bbox2.height);
		// width and height of intesection has to be higher than 0
		var width = Math.abs(rbx - ltx);
		var height = Math.abs(rby - lty);
		if (ltx <= rbx && lty <= rby && width * height > 0) {
			return true;
		} else {
			return false;
		}
	};
	/**
  * Get BBox from points.
  * 
  * @param  {Object[]} points
  * @param  {Number} points.x Coordinate on axe x
  * @param  {Number} points.y Coordinate on axe y
  * @return {Object} Output bbox with x, y, width and height variables
  * @member $math
  */
	this.getBBox = function (points) {
		var minX = Infinity;
		var minY = Infinity;
		var maxX = -Infinity;
		var maxY = -Infinity;
		// for each point
		for (var i = 0; i < points.length; i++) {
			minX = Math.min(points[i].x, minX);
			minY = Math.min(points[i].y, minY);
			maxX = Math.max(points[i].x, maxX);
			maxY = Math.max(points[i].y, maxY);
		}
		return {
			x: minX,
			y: minY,
			width: Math.abs(maxX - minX),
			height: Math.abs(maxY - minY)
		};
	};
	/**
  * Determinant 2x2 count.
  * 
  * @param {Number} x1
  * @param {Number} x2
  * @param {Number} y1
  * @param {Number} y2
  * @returns {Number}
  * @member $math
  */
	this.det2 = function (x1, x2, y1, y2) {
		return x1 * y2 - y1 * x2;
	};
	/**
  * Intersection of two lines.
  * 
  * @param  {Object} firstLine
  * @param  {Object} firstLine.x1 Line start axe x
  * @param  {Object} firstLine.y1 Line start axe y
  * @param  {Object} firstLine.x2 Line end axe x
  * @param  {Object} firstLine.y2 Line end axe y
  * @param  {Object} secondLine
  * @param  {Object} secondLine.x1 Line start axe x
  * @param  {Object} secondLine.y1 Line start axe y
  * @param  {Object} secondLine.x2 Line end axe x
  * @param  {Object} secondLine.y2 Line end axe y
  * @returns {Object} Intersection point x, y
  * @member $math
  */
	this.linesIntersection = function (firstLine, secondLine) {
		var TOLERANCE = 0.000001;
		var a = this.det2(firstLine.x1 - firstLine.x2, firstLine.y1 - firstLine.y2, secondLine.x1 - secondLine.x2, secondLine.y1 - secondLine.y2);
		// lines are parallel
		if (Math.abs(a) < TOLERANCE) {
			return null;
		}
		var d1 = this.det2(firstLine.x1, firstLine.y1, firstLine.x2, firstLine.y2);
		var d2 = this.det2(secondLine.x1, secondLine.y1, secondLine.x2, secondLine.y2);
		var x = this.det2(d1, firstLine.x1 - firstLine.x2, d2, secondLine.x1 - secondLine.x2) / a;
		var y = this.det2(d1, firstLine.y1 - firstLine.y2, d2, secondLine.y1 - secondLine.y2) / a;
		if (x < Math.min(firstLine.x1, firstLine.x2) - TOLERANCE || x > Math.max(firstLine.x1, firstLine.x2) + TOLERANCE) {
			return null;
		}
		if (y < Math.min(firstLine.y1, firstLine.y2) - TOLERANCE || y > Math.max(firstLine.y1, firstLine.y2) + TOLERANCE) {
			return null;
		}
		if (x < Math.min(secondLine.x1, secondLine.x2) - TOLERANCE || x > Math.max(secondLine.x1, secondLine.x2) + TOLERANCE) {
			return null;
		}
		if (y < Math.min(secondLine.y1, secondLine.y2) - TOLERANCE || y > Math.max(secondLine.y1, secondLine.y2) + TOLERANCE) {
			return null;
		}
		return {
			x: Math.round(x),
			y: Math.round(y)
		};
	};
	/**
  * Is there point and bounding box intersection?
  * 
  * @param  {Object} point
  * @param  {Number} point.x Point coordinates - axe x
  * @param  {Number} point.y Point coordinates - axe y
  * @param  {Object} bbox
  * @param  {Number} bbox.x Left top coordinates - axe x
  * @param  {Number} bbox.y Left top coordinates - axe y
  * @param  {Number} bbox.width Width of the bbox
  * @param  {Number} bbox.height Height of the bbox
  * @return {Boolean}
  * @member $math
  */
	this.pointBBoxIntersection = function (point, bbox) {
		return point.x >= bbox.x && point.x <= bbox.x + bbox.width && point.y >= bbox.y && point.y <= bbox.y + bbox.height;
	};
	/**
  * Logarithm - base 2.
  * 
  * @param  {Number} val Input value
  * @return {Number}
  * @member $math
  */
	this.log2 = function (val) {
		return Math.log(val) / Math.log(2);
	};
	/**
  * Map zoom in mercator projection to distance in meters.
  * 
  * @param  {Number} zoom   Mercator zoom - 2..n
  * @param  {Number} horFOV Horizontal field of view
  * @param  {Number} height Screen height size
  * @return {Number} Distance in meters
  * @member $math
  */
	this.zoomToDistance = function (zoom, horFOV, height) {
		var resolution = this._CONST.ZOOM / Math.pow(2, zoom); // m/px
		var halfHeight = height / 2;
		var y = Math.floor(resolution * halfHeight);
		// we need a half - its in degrees - thats why / 2 * / 180 for radians [rad]; vertical fov -> we need height
		var alfa = horFOV / 360 * Math.PI;
		return Math.floor(y / Math.tan(alfa));
	};
	/**
  * Reverse function for zoomToDistance - distance in meters to zoom in mercator projection.
  * 
  * @param  {Number} distance Distance in meters
  * @param  {Number} horFOV Horizontal field of view
  * @param  {Number} height Screen height size
  * @return {Number} Mercator zoom
  * @member $math
  */
	this.distanceToZoom = function (distance, horFOV, height) {
		var alfa = horFOV / 360 * Math.PI;
		var y = Math.tan(alfa) * distance;
		var mPPx = 2 * y / height; // distance / half of height; meters per pixel
		return Math.floor(this.log2(this._CONST.ZOOM / mPPx));
	};
	/**
  * Move point coordinates by angle in degrees.
  * 
  * @param  {Object} point
  * @param  {Number} point.x Point coordinates - axe x
  * @param  {Number} point.y Point coordinates - axe y
  * @param  {Number} angle Angle in degrees CW
  * @member $math
  */
	this.movePointByAngle = function (point, angle) {
		var rad = (360 - angle) / 180 * Math.PI;
		var x = point.x;
		var y = point.y;
		point.x = x * Math.cos(rad) - y * Math.sin(rad);
		point.y = x * Math.sin(rad) + y * Math.cos(rad);
	};
	/**
  * Move point by vector, you can also rotate vector by angle in degrees.
  * 
  * @param  {Object} point
  * @param  {Number} point.x Point coordinates - axe x
  * @param  {Number} point.y Point coordinates - axe y
  * @param  {Object} vector
  * @param  {Number} vector.x Point coordinates - axe x
  * @param  {Number} vector.y Point coordinates - axe y
  * @param  {Number} [angle] Angle in degrees for vector rotation CW
  * @member $math
  */
	this.movePointByVector = function (point, vector, angle) {
		// because overwrite reference object
		var vectorSave = {
			x: vector.x,
			y: vector.y
		};
		this.movePointByAngle(vectorSave, angle || 0);
		point.x += vectorSave.x;
		point.y += vectorSave.y;
	};
	/**
  * Set value in selected range.
  * 
  * @param {Number} value Input value
  * @param {Number} min Min value
  * @param {Number} max Max value
  * @return {Number}
  * @member $math
  */
	this.setRange = function (value, min, max) {
		if (value < min) {
			return min;
		} else if (value > max) {
			return max;
		} else {
			return value;
		}
	};
});
var _typeof = typeof Symbol === "function" && _typeof2(Symbol.iterator) === "symbol" ? function (obj) {
	return typeof obj === "undefined" ? "undefined" : _typeof2(obj);
} : function (obj) {
	return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof2(obj);
};
function _classCallCheck(instance, Constructor) {
	if (!(instance instanceof Constructor)) {
		throw new TypeError("Cannot call a class as a function");
	}
}
onix.factory("$myQuery", ["$common", function ($common) {
	/**
  * DOM manipulation in the style of jquery.
  * 
  * @class $myQuery
  * @chainable
  * @param {String|HTMLElement|Array} value
  * @param {$myQuery|HTMLElement} [parent]
  * @member $myQuery
  */
	var $myQuery = function () {
		function $myQuery(value, parent) {
			_classCallCheck(this, $myQuery);
			this._els = this._getElementsFromValue(value, parent);
			return this;
		}
		/**
   * Get elements from value [parent].
   * 
   * @param {String|HTMLElement|Array} value
   * @param {$myQuery|HTMLElement} [parent]
   * @return {Array}
   * @member $myQuery
   * @method _getElementsFromValue
   * @private
   */
		$myQuery.prototype._getElementsFromValue = function _getElementsFromValue(value, parent) {
			value = Array.isArray(value) ? value : [value];
			var els = [];
			value.forEach(function (val) {
				if (typeof val === "string") {
					if (val.match(/<[a-zA-Z]+>/)) {
						// create el
						var el = document.createElement("div");
						el.innerHTML = val;
						els.push(el);
					} else {
						// selector
						if (parent instanceof $myQuery) {
							parent = parent.getEl();
						}
						parent = parent instanceof Element || parent == window || parent == document ? parent : document;
						var selValues = parent.querySelectorAll(val);
						if (selValues) {
							els = els.concat(Array.prototype.slice.call(selValues));
						}
					}
					return;
				} else if (val instanceof $myQuery) {
					val = val.getEl();
				}
				if (val instanceof Element || val == document || val == window) {
					els.push(val);
				}
			});
			return els;
		};
		/**
   * Operation on elements.
   * 
   * @param  {Function} cb
   * @param  {Function} [scope]
   * @member $myQuery
   * @private
   * @method _operation
   */
		$myQuery.prototype._operation = function _operation(cb, scope) {
			// NodeList -> Array
			if (!Array.isArray(this._els)) {
				this._els = Array.prototype.slice.call(this._els);
			}
			this._els.forEach(function (item, ind) {
				cb.apply(scope || cb, [item, ind]);
			});
		};
		/**
   * Set or get all - cover function.
   * 
   * @chainable
   * @param  {String} attr
   * @param  {String} [newValue]
   * @member $myQuery
   * @private
   * @method _setGetAll
   */
		$myQuery.prototype._setGetAll = function _setGetAll(attr, newValue) {
			var _this = this;
			if (typeof attr !== "undefined") {
				if (typeof newValue !== "undefined") {
					this._operation(function (item) {
						item[attr] = newValue;
					});
					return this;
				} else {
					var _ret = function () {
						var values = [];
						_this._operation(function (item) {
							values.push(item[attr]);
						});
						if (!values.length) {
							return {
								v: null
							};
						} else if (values.length == 1) {
							return {
								v: values[0]
							};
						} else {
							return {
								v: values
							};
						}
					}();
					if ((typeof _ret === "undefined" ? "undefined" : _typeof(_ret)) === "object") return _ret.v;
				}
			} else {
				return this;
			}
		};
		/**
   * Bind event.
   *
   * @param {String} eventName Event name
   * @param {Function} cb Callback function
   * @param {Object} [scope] cb function scope
   * @chainable
   * @private
   * @method _bindEvent
   */
		$myQuery.prototype._bindEvent = function _bindEvent(eventName, cb, scope) {
			this._operation(function (item) {
				item.addEventListener(eventName, function (event) {
					cb.apply(scope || cb, [event, item]);
				});
			});
			return this;
		};
		/**
   * Get original element.
   *
   * @param  {Number} [ind]
   * @return {HTMLElement}
   * @member $myQuery
   * @method get
   */
		$myQuery.prototype.get = function get(ind) {
			ind = ind || 0;
			if (ind > this._els.length) {
				return null;
			} else {
				return this._els[ind];
			}
		};
		/**
   * Get original element.
   *
   * @param  {Number} [ind]
   * @return {HTMLElement}
   * @member $myQuery
   * @method getEl
   */
		$myQuery.prototype.getEl = function getEl(ind) {
			return this.get(ind);
		};
		/**
   * Get or set attribute.
   *
   * @chainable
   * @param  {String} name
   * @param  {String} [newValue]
   * @return {String|Array}
   * @member $myQuery
   * @method attr
   */
		$myQuery.prototype.attr = function attr(name, newValue) {
			var _this2 = this;
			if (typeof name !== "undefined") {
				if (typeof newValue !== "undefined") {
					this._operation(function (item) {
						item.setAttribute(name, newValue);
					});
					return this;
				} else {
					var _ret2 = function () {
						var values = [];
						_this2._operation(function (item) {
							values.push(item.getAttribute(name));
						});
						if (!values.length) {
							return {
								v: null
							};
						} else if (values.length == 1) {
							return {
								v: values[0]
							};
						} else {
							return {
								v: values
							};
						}
					}();
					if ((typeof _ret2 === "undefined" ? "undefined" : _typeof(_ret2)) === "object") return _ret2.v;
				}
			} else {
				return this;
			}
		};
		/**
   * Get or set css value.
   *
   * @chainable
   * @param  {String|Object} name
   * @param  {String} [newValue]
   * @return {String}
   * @member $myQuery
   * @method css
   */
		$myQuery.prototype.css = function css(name, newValue) {
			var _this3 = this;
			if (typeof name !== "undefined") {
				if (typeof newValue !== "undefined") {
					this._operation(function (item) {
						item.style[$common.cssNameToJS(name)] = newValue;
					});
					return this;
				} else if ((typeof name === "undefined" ? "undefined" : _typeof(name)) === "object" && !Array.isArray(name)) {
					Object.keys(name).forEach(function (key) {
						_this3._operation(function (item) {
							item.style[$common.cssNameToJS(key)] = name[key];
						});
					});
					return this;
				} else {
					var el = this.getEl();
					return el ? el.style[$common.cssNameToJS(name)] : null;
				}
			} else {
				return this;
			}
		};
		/**
   * Get or set src.
   * 
   * @param  {String} [newValue]
   * @return {String}
   * @member $myQuery
   * @method src
   */
		$myQuery.prototype.src = function src(newValue) {
			return this._setGetAll("src", newValue);
		};
		/**
   * Hide element.
   * 
   * @chainable
   * @member $myQuery
   * @method hide
   */
		$myQuery.prototype.hide = function hide() {
			return this.css("display", "none");
		};
		/**
   * Show element.
   *
   * @chainable
   * @param  {String} [displayStyle]
   * @member $myQuery
   * @method show
   */
		$myQuery.prototype.show = function show(displayStyle) {
			return this.css("display", displayStyle || "");
		};
		/**
   * Get or set value.
   *
   * @chainable
   * @param  {String} [newValue]
   * @return {String}
   * @member $myQuery
   * @method val
   */
		$myQuery.prototype.val = function val(newValue) {
			return this._setGetAll("value", newValue);
		};
		/**
   * Get or set HTML.
   * 
   * @param  {String} [newValue]
   * @return {String}
   * @member $myQuery
   * @method html
   */
		$myQuery.prototype.html = function html(newValue) {
			return this._setGetAll("innerHTML", newValue);
		};
		/**
   * Add CSS class.
   *
   * @chainable
   * @param  {String} className
   * @member $myQuery
   * @method addClass
   */
		$myQuery.prototype.addClass = function addClass(className) {
			this._operation(function (item) {
				item.classList.add(className);
			});
			return this;
		};
		/**
   * Remove CSS class.
   *
   * @chainable
   * @param  {String} className
   * @member $myQuery
   * @method removeClass
   */
		$myQuery.prototype.removeClass = function removeClass(className) {
			this._operation(function (item) {
				item.classList.remove(className);
			});
			return this;
		};
		/**
   * Toggle CSS class.
   *
   * @chainable
   * @param  {String} className
   * @member $myQuery
   * @method toggleClass
   */
		$myQuery.prototype.toggleClass = function toggleClass(className) {
			this._operation(function (item) {
				item.classList.toggle(className);
			});
			return this;
		};
		/**
   * Get width.
   * 
   * @return {Number}
   * @member $myQuery
   * @method width
   */
		$myQuery.prototype.width = function width() {
			var width = 0;
			this._operation(function (item) {
				width += item.offsetWidth;
			});
			return width;
		};
		/**
   * Get height.
   * 
   * @return {Number}
   * @member $myQuery
   * @method height
   */
		$myQuery.prototype.height = function height() {
			var height = 0;
			this._operation(function (item) {
				height += item.offsetHeight;
			});
			return height;
		};
		/**
   * Click event.
   *
   * @chainable
   * @param  {Function} cb
   * @param  {Function} [scope]
   * @member $myQuery
   * @method click
   */
		$myQuery.prototype.click = function click(cb, scope) {
			return this._bindEvent("click", cb, scope);
		};
		/**
   * Change event.
   *
   * @chainable
   * @param  {Function} cb
   * @param  {Function} [scope]
   * @member $myQuery
   * @method change
   */
		$myQuery.prototype.change = function change(cb, scope) {
			return this._bindEvent("change", cb, scope);
		};
		/**
   * Mouse enter event.
   *
   * @chainable
   * @param  {Function} cb
   * @param  {Function} [scope]
   * @member $myQuery
   * @method mouseenter
   */
		$myQuery.prototype.mouseenter = function mouseenter(cb, scope) {
			return this._bindEvent("mouseenter", cb, scope);
		};
		/**
   * Mouse leave event.
   *
   * @chainable
   * @param  {Function} cb
   * @param  {Function} [scope]
   * @member $myQuery
   * @method mouseleave
   */
		$myQuery.prototype.mouseleave = function mouseleave(cb, scope) {
			return this._bindEvent("mouseleave", cb, scope);
		};
		/**
   * Mouse move event.
   *
   * @chainable
   * @param  {Function} cb
   * @param  {Function} [scope]
   * @member $myQuery
   * @method mouseleave
   */
		$myQuery.prototype.mousemove = function mousemove(cb, scope) {
			return this._bindEvent("mousemove", cb, scope);
		};
		/**
   * Key down event.
   *
   * @chainable
   * @param  {Function} cb
   * @param  {Function} [scope]
   * @member $myQuery
   * @method keydown
   */
		$myQuery.prototype.keydown = function keydown(cb, scope) {
			return this._bindEvent("keydown", cb, scope);
		};
		/**
   * Key up event.
   *
   * @chainable
   * @param  {Function} cb
   * @param  {Function} [scope]
   * @member $myQuery
   * @method keyup
   */
		$myQuery.prototype.keyup = function keyup(cb, scope) {
			return this._bindEvent("keyup", cb, scope);
		};
		/**
   * Key press event.
   *
   * @chainable
   * @param  {Function} cb
   * @param  {Function} [scope]
   * @member $myQuery
   * @method keypress
   */
		$myQuery.prototype.keypress = function keypress(cb, scope) {
			return this._bindEvent("keypress", cb, scope);
		};
		/**
   * Blur event.
   *
   * @chainable
   * @param  {Function} cb
   * @param  {Function} [scope]
   * @member $myQuery
   * @method blur
   */
		$myQuery.prototype.blur = function blur(cb, scope) {
			return this._bindEvent("blur", cb, scope);
		};
		/**
   * Focus event.
   *
   * @chainable
   * @param  {Function} cb
   * @param  {Function} [scope]
   * @member $myQuery
   * @method focus
   */
		$myQuery.prototype.focus = function focus(cb, scope) {
			return this._bindEvent("focus", cb, scope);
		};
		/**
   * Each.
   *
   * @chainable
   * @param  {Function} cb
   * @param  {Function} [scope]
   * @member $myQuery
   * @method each
   */
		$myQuery.prototype.each = function each(cb, scope) {
			this._operation(function (item, ind) {
				cb.apply(scope || cb, [item, ind]);
			});
			return this;
		};
		/**
   * Foreach.
   *
   * @chainable
   * @param  {Function} cb
   * @param  {Function} [scope]
   * @member $myQuery
   * @method forEach
   */
		$myQuery.prototype.forEach = function forEach(cb, scope) {
			return this.each(cb, scope);
		};
		/**
   * Remove element.
   *
   * @chainable
   * @member $myQuery
   * @method remove
   */
		$myQuery.prototype.remove = function remove() {
			this._operation(function (item) {
				item.parentNode.removeChild(item);
			});
			return this;
		};
		/**
   * Append another element to this one.
   *
   * @chainable
   * @param {HTMLElement|$myQuery|String} child
   * @member $myQuery
   * @method  append
   */
		$myQuery.prototype.append = function append(child) {
			child = this._getElementsFromValue(child);
			if (child.length) {
				this._operation(function (item, ind) {
					var appChild = ind ? child[0].cloneNode(true) : child[0];
					item.appendChild(appChild);
				});
			}
			return this;
		};
		/**
   * Prepend element.
   *
   * @chainable
   * @param {HTMLElement|$myQuery|string} child
   * @member $myQuery
   * @method prepend
   */
		$myQuery.prototype.prepend = function prepend(child) {
			child = this._getElementsFromValue(child);
			if (child.length) {
				this._operation(function (item, ind) {
					var prepChild = ind ? child[0].cloneNode(true) : child[0];
					item.insertBefore(prepChild, item.firstChild);
				});
			}
			return this;
		};
		/**
   * Insert current element before element.
   *
   * @chainable
   * @param {HTMLElement|$myQuery|string} beforeEl
   * @member $myQuery
   * @method prepend
   */
		$myQuery.prototype.insertBefore = function insertBefore(beforeEl) {
			beforeEl = this._getElementsFromValue(beforeEl);
			var el = this.getEl();
			if (el && beforeEl.length) {
				beforeEl[0].parentNode.insertBefore(el, beforeEl[0]);
			}
			return this;
		};
		/**
   * Empty element - clear all its children.
   * Much faster than innerHTML = "".
   * 
   * @chainable
   * @member $myQuery
   * @method empty
   */
		$myQuery.prototype.empty = function empty() {
			this._operation(function (item) {
				while (item.firstChild) {
					item.removeChild(item.firstChild);
				}
			});
			return this;
		};
		/**
   * Get all elements length.
   * 
   * @return {Number}
   * @member $myQuery
   * @method len
   */
		$myQuery.prototype.len = function len() {
			return this._els.length;
		};
		/**
   * Get parent node.
   * 
   * @return {$myQuery} new instance with parent node
   * @member $myQuery
   * @method parent
   */
		$myQuery.prototype.parent = function parent() {
			var el = this.getEl();
			return el ? new this(el) : null;
		};
		/**
   * Get children.
   * 
   * @return {Array} Children array
   * @member $myQuery
   * @method children
   */
		$myQuery.prototype.children = function children() {
			var el = this.getEl();
			return el ? el.children : [];
		};
		/**
   * Get scroll top offset.
   * 
   * @return {Number} Scroll top in [px]
   * @member $myQuery
   * @method scrollTop
   */
		$myQuery.prototype.scrollTop = function scrollTop() {
			var el = this.getEl();
			var docOffset = document.body.scrollTop;
			return el ? el.scrollTop + docOffset : docOffset + 0;
		};
		/**
   * Get scroll left offset.
   * 
   * @return {Number} Scroll left in [px]
   * @member $myQuery
   * @method scrollLeft
   */
		$myQuery.prototype.scrollLeft = function scrollLeft() {
			var el = this.getEl();
			var docOffset = document.body.scrollLeft;
			return el ? el.scrollLeft + docOffset : docOffset + 0;
		};
		return $myQuery;
	}();
	;
	/**
  * Quick acces to myQuery and DOM manipulation.
  *
  * @param  {String|HTMLElement|Array} value
  * @param {HTMLElement|$myQuery} [parent] Parent node
  * @return {$myQuery}
  * @member onix
  * @property {Function}
  */
	onix.element = function (value, parent) {
		return new $myQuery(value, parent);
	};
	return {
		/**
  * Main cover function.
  * 
  * @param  {String|HTMLElement|Array} value
  * @param {HTMLElement} [parent]
  * @return {$myQuery}
  * @member $myQuery
  */
		get: function get(value, parent) {
			return new $myQuery(value, parent);
		}
	};
}]);
/**
 * Run for cache $myQuery object.
 */
onix.run(["$myQuery", function () {
	// empty
}]);
function _classCallCheck(instance, Constructor) {
	if (!(instance instanceof Constructor)) {
		throw new TypeError("Cannot call a class as a function");
	}
}
onix.factory("$promise", function () {
	/**
  * ES6 promise implementation.
  * Handle function(resolve, reject) object
  *
  * @param  {Function} cbFn Handle function
  * @class $promise
  */
	var $promise = function () {
		function $promise(cbFn) {
			_classCallCheck(this, $promise);
			/**
    * Promise states.
    *
    * @member $promise
    * @private
    */
			this._STATES = {
				IDLE: 0,
				RESOLVED: 1,
				REJECTED: 2
			};
			// current state
			this._state = this._STATES.IDLE;
			// all funcs
			this._thens = [];
			// fulfill data
			this._fulfillData = null;
			// call promise cb function
			if (cbFn && typeof cbFn === "function") {
				try {
					cbFn.apply(cbFn, [this._resolve.bind(this), this._reject.bind(this)]);
				} catch (err) {
					console.error("$promise exception " + err);
				}
			}
		}
		/**
   * Resolve promise using obj.
   *
   * @private
   * @param  {Object} obj
   * @member $promise
   * @method _resolve
   */
		$promise.prototype._resolve = function _resolve(obj) {
			this._fulfillData = obj;
			this._state = this._STATES.RESOLVED;
			this._resolveFuncs();
		};
		/**
   * Reject promise using obj.
   *
   * @private
   * @param  {Object} obj
   * @member $promise
   * @method _reject
   */
		$promise.prototype._reject = function _reject(obj) {
			this._fulfillData = obj;
			this._state = this._STATES.REJECTED;
			this._resolveFuncs();
		};
		/**
   * Resolve all functions.
   *
   * @member $promise
   * @private
   * @method _resolveFuncs
   */
		$promise.prototype._resolveFuncs = function _resolveFuncs() {
			var _this = this;
			var len = this._thens.length;
			var isCatch = this._state == this._STATES.REJECTED;
			for (var i = 0; i < len; i++) {
				var thenItem = this._thens[i];
				var fn = isCatch && thenItem.rejectCb ? thenItem.rejectCb : !isCatch && thenItem.resolveCb ? thenItem.resolveCb : null;
				if (!fn) continue;
				try {
					var output = fn(this._fulfillData);
					// promise flattening
					if (output) {
						if (i != len - 1) {
							var _ret = function () {
								var resolveCb = null;
								var rest = _this._thens.slice(i + 1);
								var prom = void 0;
								if (output instanceof $promise) {
									prom = output;
								} else {
									prom = new $promise(function (resolve) {
										resolveCb = resolve;
									});
								}
								rest.forEach(function (restItem) {
									prom.then(restItem.resolveCb, restItem.rejectCb);
								});
								if (resolveCb) {
									resolveCb(output);
								}
								return "break";
							}();
							if (_ret === "break") break;
						}
					}
				} catch (err) {
					console.error(err);
				}
			}
			// clear array
			this._thens.length = 0;
		};
		/**
   * Is promise already finished?
   *
   * @return {Boolean}
   * @member $promise
   * @private
   * @method _isAlreadyFinished
   */
		$promise.prototype._isAlreadyFinished = function _isAlreadyFinished() {
			if (this._state != this._STATES.IDLE) {
				this._resolveFuncs();
			}
		};
		/**
   * After promise resolve/reject call then (okFn, errorFn).
   *
   * @chainable
   * @param {Function} [resolveCb] Resolve function
   * @param {Function} [rejectCb] Reject function
   * @member $promise
   * @method then
   */
		$promise.prototype.then = function then(resolveCb, rejectCb) {
			this._thens.push({
				resolveCb: resolveCb && typeof resolveCb === "function" ? resolveCb : null,
				rejectCb: rejectCb && typeof rejectCb === "function" ? rejectCb : null
			});
			this._isAlreadyFinished();
			return this;
		};
		/**
   * After promise reject call then rejectCb.
   *
   * @chainable
   * @param  {Function} rejectCb Reject function
   * @member $promise
   * @method catch
   */
		$promise.prototype["catch"] = function _catch(rejectCb) {
			this._thens.push({
				resolveCb: null,
				rejectCb: rejectCb && typeof rejectCb === "function" ? rejectCb : null
			});
			this._isAlreadyFinished();
			return this;
		};
		/**
   * Resolve multiple promises.
   * 
   * @param {$promise[]} promises
   * @param  {Boolean} isRace Is race?
   * @return {Boolean}
   * @member $promise
   * @private
   * @static
   * @method _multiplePromises
   */
		$promise._multiplePromises = function _multiplePromises(promises, isRace) {
			return new $promise(function (resolve) {
				if (Array.isArray(promises) && promises.length) {
					(function () {
						var count = isRace ? 1 : promises.length;
						var test = function test(data) {
							count--;
							if (count == 0) {
								resolve(isRace ? data : null);
							}
						};
						promises.forEach(function (item) {
							item.then(function (okData) {
								test(okData);
							}, function (errorData) {
								test(errorData);
							});
						});
					})();
				} else {
					resolve();
				}
			});
		};
		/**
   * Resolve all promises in the array.
   *
   * @param {$promise[]} promises
   * @return {$promise}
   * @member $promise
   * @static
   * @method all
   */
		$promise.all = function all(promises) {
			return $promise._multiplePromises(promises);
		};
		/**
   * Race all promises in the array - first one resolves promise.
   *
   * @param {$promise[]} promises
   * @return {$promise} With the value from the first resolved promise.
   * @member $promise
   * @static
   * @method race
   */
		$promise.race = function race(promises) {
			return $promise._multiplePromises(promises, true);
		};
		/**
   * Resolve promise with variable object.
   *
   * @param {Object} [obj] Resolved object
   * @return {$promise}
   * @member $promise
   * @static
   * @method resolve
   */
		$promise.resolve = function resolve(obj) {
			return new $promise(function (resolve) {
				resolve(obj);
			});
		};
		/**
   * Reject promise with variable object.
   *
   * @param {Object} [obj] Rejected object
   * @return {$promise}
   * @member $promise
   * @static
   * @method reject
   */
		$promise.reject = function reject(obj) {
			return new $promise(function (resolve, reject) {
				reject(obj);
			});
		};
		return $promise;
	}();
	;
	return $promise;
});
/**
 * Simple router for the application.
 * 
 * @class $route
 */
onix.service("$route", ["$location", "$template", "$di", "$routeParams", function ($location, $template, $di, $routeParams) {
	/**
  * All routes.
  *
  * @private
  * @type {Array}
  * @member $route
  */
	this._routes = [];
	/**
  * Otherwise route.
  *
  * @private
  * @type {Object}
  * @member $route
  */
	this._otherwise = null;
	/**
  * Set $routeParams object. First clear all old keys and add new ones, if the available.
  *
  * @private
  * @param {Object} [routeParams] Route params object
  * @type {Object}
  * @member $route
  */
	this._setRouteParams = function (routeParams) {
		Object.keys($routeParams).forEach(function (key) {
			delete $routeParams[key];
		});
		routeParams = routeParams || {};
		Object.keys(routeParams).forEach(function (key) {
			$routeParams[key] = routeParams[key];
		});
	};
	/**
  * Add route to the router.
  *
  * @chainable
  * @param  {String} url 
  * @param  {Object} config
  * @param  {String} [config.templateId] Template ID which will be used for templateUrl
  * @param  {String} [config.templateUrl] Template URL which will be loaded and cached in the $template
  * @param  {String} [config.controller] Run this function if the route is used
  * @param  {Object} [config.xyz] Rest parameters goes to the $routeParams
  * @member $route
  */
	this.when = function (url, config) {
		this._routes.push({
			url: url,
			config: config
		});
		return this;
	};
	/**
  * Otherwise.
  *
  * @chainable
  * @param  {String} page
  * @param  {Object} config
  * @param  {String} [config.templateId] Template ID which will be used for templateUrl
  * @param  {String} [config.templateUrl] Template URL which will be loaded and cached in the $template
  * @param  {String} [config.controller] Run this function if the route is used
  * @param  {Object} [config.xyz] Rest parameters goes to the $routeParams
  * @member $route
  */
	this.otherwise = function (config) {
		this._otherwise = {
			config: config
		};
		return this;
	};
	/**
  * Run controller from route path.
  *
  * @private
  * @param  {Array|Function} contr
  * @param  {Object} [routeParams] Additonal data
  * @member $route
  */
	this._runController = function (contr, routeParams) {
		var pp = $di.parseParam(contr);
		this._setRouteParams(routeParams);
		$di.run({
			fn: pp.fn,
			inject: pp.inject
		});
	};
	/**
  * Route GO. Walk through all routes, if there is match, route controller will be called.
  *
  * @member $route
  */
	this.go = function () {
		var _this = this;
		var path = $location.get();
		var find = false;
		var config = null;
		var data = {};
		this._routes.every(function (item) {
			if (path.match(new RegExp(item.url))) {
				config = item.config;
				find = true;
				return false;
			} else {
				return true;
			}
		});
		if (!find && this._otherwise) {
			config = this._otherwise.config;
		}
		if (config) {
			(function () {
				var templateId = "";
				var templateUrl = null;
				var contr = null;
				var routeParams = {};
				Object.keys(config).forEach(function (key) {
					var value = config[key];
					switch (key) {
						case "templateId":
							templateId = value;
							break;
						case "templateUrl":
							templateUrl = value;
							break;
						case "controller":
							contr = value;
							break;
						default:
							routeParams[key] = value;
					}
				});
				// run controller function
				var runController = function runController() {
					if (contr) {
						_this._runController(contr, routeParams);
					}
				};
				if (templateUrl) {
					$template.load(config.templateId || config.templateUrl, config.templateUrl).then(runController);
				} else {
					runController();
				}
			})();
		}
	};
}]);
/**
 * Data for controllers in the $route.
 * 
 * @class $routeParams
 */
onix.factory("$routeParams", function () {
	return {};
});
var _typeof = typeof Symbol === "function" && _typeof2(Symbol.iterator) === "symbol" ? function (obj) {
	return typeof obj === "undefined" ? "undefined" : _typeof2(obj);
} : function (obj) {
	return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof2(obj);
};
function _classCallCheck(instance, Constructor) {
	if (!(instance instanceof Constructor)) {
		throw new TypeError("Cannot call a class as a function");
	}
}
onix.provider("$template", function () {
	/**
  * Configuration for template delimeters.
  *
  * @type {Object}
  * @member $templateProvider
  * @private
  */
	var _conf = {
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
	this.setConfig = function (confParam) {
		Object.keys(confParam).forEach(function (confParamKey) {
			_conf[confParamKey] = confParam[confParamKey];
		});
	};
	/**
  * Function that creates $template.
  * 
  * @member $templateProvider
  * @return {Array}
  */
	this.$get = ["$common", "$promise", "$http", "$filter", function ($common, $promise, $http, $filter) {
		/**
   * Handle templates, binds events - syntax similar to moustache and angular template system.
   * $myQuery is used for cache record.
   *
   * @class $template
   */
		var $template = function () {
			function $template() {
				_classCallCheck(this, $template);
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
			$template.prototype._parseFnName = function _parseFnName(value) {
				value = value || "";
				return value.match(/[a-zA-Z0-9_]+/)[0];
			};
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
			$template.prototype._parseArgs = function _parseArgs(value, config) {
				var _this = this;
				var argsValue = value ? value.replace(/^[^(]+./, "").replace(/\).*$/, "") : "";
				var args = [];
				var matches = argsValue.match(this._RE.ALL);
				if (matches) {
					(function () {
						var all = [];
						matches.forEach(function (item) {
							var value = void 0;
							if (item.match(_this._RE.STRINGS)) {
								value = item.substr(1, item.length - 2);
							} else if (item.match(_this._RE.NUMBERS)) {
								value = parseFloat(item);
							} else if (item.match(_this._RE.JSONS)) {
								value = JSON.parse(item);
							} else if (item.match(_this._RE.VARIABLE)) {
								var variable = item.match(_this._RE.VARIABLE)[0];
								if (variable == "$event") {
									value = config.event;
								} else if (variable == "$element") {
									value = config.el;
								} else {
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
							all.sort(function (a, b) {
								return a.pos - b.pos;
							}).forEach(function (item) {
								args.push(item.value);
							});
						}
					})();
				}
				return args;
			};
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
			$template.prototype._bindEvent = function _bindEvent(el, attr, scope) {
				var _this2 = this;
				if (!el || !attr || !scope) return;
				var eventName = attr.name.replace(_conf.elPrefix, "");
				var fnName = this._parseFnName(attr.value);
				if (eventName && fnName in scope) {
					el.addEventListener(eventName, function (event) {
						var args = _this2._parseArgs(attr.value, {
							el: el,
							event: event
						});
						scope[fnName].apply(scope, args);
					});
				}
			};
			/**
    * Get element prefixed attributes.
    * 
    * @param  {HTMLElement} el
    * @return {Array}
    * @member $template
    * @private
    * @method _getAttributes
    */
			$template.prototype._getAttributes = function _getAttributes(el) {
				var output = [];
				if (el && "attributes" in el) {
					Object.keys(el.attributes).forEach(function (attr) {
						var item = el.attributes[attr];
						// ie8 fix
						if (!item || (typeof item === "undefined" ? "undefined" : _typeof(item)) !== "object" || !item.name) return;
						if (item.name.indexOf(_conf.elPrefix) != -1) {
							output.push({
								name: item.name,
								value: item.value
							});
						}
					});
				}
				return output;
			};
			/**
    * Init - get all templates from the page. Uses 'text/template' script with template data.
    * Each script has to have id and specifi type="text/template".
    *
    * @private
    * @member $template
    * @method _init
    */
			$template.prototype._init = function _init() {
				var _this3 = this;
				onix.element(this._CONST.TEMPLATE_SCRIPT_SELECTOR).forEach(function (item) {
					_this3.add(item.id || "", item.innerHTML);
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
			$template.prototype.add = function add(key, data) {
				this._cache[key] = data;
			};
			/**
    * Compile one template - replaces all ocurances of {{ xxx }} by model.
    *
    * @param  {String} key Template key/name
    * @param  {Object} data Model
    * @return {String}
    * @member $template
    * @method compile
    */
			$template.prototype.compile = function compile(key, data) {
				var _this4 = this;
				var tmpl = this.get(key);
				if (data) {
					var all = tmpl.match(new RegExp(_conf.left + "(.*?)" + _conf.right, "g")) || [];
					all.forEach(function (item) {
						var itemSave = item;
						item = item.replace(new RegExp("^" + _conf.left), "").replace(new RegExp(_conf.right + "$"), "");
						if (item.indexOf(_this4._CONST.FILTER_DELIMETER) != -1) {
							(function () {
								var filterValue = void 0;
								// filters
								item.split(_this4._CONST.FILTER_DELIMETER).forEach(function (filterItem, ind) {
									filterItem = filterItem.trim();
									if (!ind) {
										// value
										if (filterItem in data) {
											filterValue = data[filterItem];
										}
									} else {
										(function () {
											// preprocessing by filter
											var args = [filterValue];
											var filterParts = filterItem.split(_this4._CONST.FILTER_PARAM_DELIMETER);
											var filterName = "";
											if (filterParts.length == 1) {
												filterName = filterParts[0].trim();
											} else {
												filterParts.forEach(function (filterPartItem, filterPartInd) {
													filterPartItem = filterPartItem.trim();
													if (!filterPartInd) {
														filterName = filterPartItem;
													} else {
														args.push(filterPartItem);
													}
												});
											}
											var filter = $filter(filterName);
											filterValue = filter.apply(filter, args);
										})();
									}
								});
								tmpl = tmpl.replace(itemSave, filterValue || "");
							})();
						} else {
							// standard
							var replaceValue = "";
							item = item.trim();
							if (item in data) {
								replaceValue = data[item];
							}
							tmpl = tmpl.replace(itemSave, replaceValue);
						}
					});
				}
				return tmpl;
			};
			/**
    * Get template from the cache.
    *
    * @param  {String} key Template key/name
    * @return {String}
    * @member $template
    * @method get
    */
			$template.prototype.get = function get(key) {
				return this._cache[key] || "";
			};
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
			$template.prototype.bindTemplate = function bindTemplate(root, scope, addElsCb) {
				var _this5 = this;
				var allElements = onix.element("*", root);
				if (allElements.len()) {
					(function () {
						var newEls = {};
						allElements.forEach(function (item) {
							var attrs = _this5._getAttributes(item);
							attrs.forEach(function (attr) {
								if (attr.name == _conf.elDataBind) {
									newEls[attr.value] = item;
								} else {
									_this5._bindEvent(item, attr, scope);
								}
							});
						});
						if (addElsCb && typeof addElsCb === "function") {
							addElsCb(newEls);
						}
					})();
				}
			};
			/**
    * Load template from the path, returns promise after load.
    *
    * @param  {String} key
    * @param  {String} path
    * @return {$promise}
    * @member $template
    * @method load
    */
			$template.prototype.load = function load(key, path) {
				var _this6 = this;
				return new $promise(function (resolve, reject) {
					$http.createRequest({
						url: path
					}).then(function (okData) {
						_this6.add(key, okData.data);
						resolve();
					}, function (errorData) {
						reject(errorData);
					});
				});
			};
			return $template;
		}();
		;
		return new $template();
	}];
});
/**
 * Browser features.
 * 
 * @class $features
 */
onix.service("$features", function () {
	// ------------------------ public ----------------------------------------
	/**
  * FileReader is available.
  *
  * @member $features
  * @type {Boolean}
  */
	this.FILE_READER = "FileReader" in window;
	/**
  * Canvas is available.
  *
  * @member $features
  * @type {Boolean}
  */
	this.CANVAS = !!document.createElement("canvas").getContext;
	// local storage
	var locStor = true;
	try {
		window.localStorage;
	} catch (err) {
		locStor = false;
	}
	/**
  * Local storage is available.
  *
  * @member $features
  * @type {Boolean}
  */
	this.LOCAL_STORAGE = locStor;
});
function _classCallCheck(instance, Constructor) {
	if (!(instance instanceof Constructor)) {
		throw new TypeError("Cannot call a class as a function");
	}
}
function _possibleConstructorReturn(self, call) {
	if (!self) {
		throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
	}return call && ((typeof call === "undefined" ? "undefined" : _typeof2(call)) === "object" || typeof call === "function") ? call : self;
}
function _inherits(subClass, superClass) {
	if (typeof superClass !== "function" && superClass !== null) {
		throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : _typeof2(superClass)));
	}subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}
onix.factory("$anonymizer", ["$math", "$event", "$loader", "$promise", "$common", "$features", function ($math, $event, $loader, $promise, $common, $features) {
	/**
  * Anonymizer - canvas for image preview with posibility for add geometries.
  *
  * @param {HTMLElement} parent Where is canvas appended
  * @param {Object} [optsArg] Configuration
  * @param {Number} [optsArg.canWidth] Canvas width
  * @param {Number} [optsArg.canHeight] Canvas height
  * @param {Number} [optsArg.zoom = 100] start zoom in [%]
  * @param {Number} [optsArg.minZoom = 20] min zoom in [%]
  * @param {Number} [optsArg.maxZoom = 100] max zoom in [%]
  * @param {Number} [optsArg.zoomStep = 10] How many [%] add/dec with zoom change
  * @param {Number} [optsArg.zoomMoveStep = 1] Under 100% multiplier for faster image movement
  * @param {Object} [optsArg.curEntity = $anonymizer.ENTITES.CIRCLE] Start entity from $anonymizer.ENTITES
  * @param {Number} [optsArg.showPreview = true] Show preview - image overview
  * @param {Number} [optsArg.previewLeft = 17] Preview location from left top corner, axe x [px]
  * @param {Number} [optsArg.previewTop = 17] Preview location from left top corner, axe y [px]
  * @param {Number} [optsArg.previewWidth = 200] Preview image width [px]
  * @param {HTMLElement} [optsArg.entityPreview = null] Create entity preview? Parent for append.
  * @class $anonymizer
  */
	var $anonymizer = function (_$event) {
		_inherits($anonymizer, _$event);
		function $anonymizer(parent, optsArg) {
			_classCallCheck(this, $anonymizer);
			// event init
			var _this = _possibleConstructorReturn(this, _$event.call(this));
			_this._eventInit();
			// is canvas available?
			if (!$features.CANVAS) {
				console.error("Canvas is not available!");
				return _possibleConstructorReturn(_this);
			}
			// parent reference
			_this._parent = parent;
			_this._parent.classList.add("anonymizer");
			_this._opts = {
				canWidth: parent.offsetWidth || 0,
				canHeight: parent.offsetHeight || 0,
				zoom: 100,
				minZoom: 20,
				maxZoom: 100,
				zoomStep: 10,
				zoomMoveStep: 1,
				curEntity: $anonymizer.ENTITES.CIRCLE,
				showPreview: true,
				previewLeft: 17,
				previewTop: 17,
				previewWidth: 200,
				entityPreview: null
			};
			for (var key in optsArg) {
				_this._opts[key] = optsArg[key];
			}
			// canvas width & height
			_this._canWidth = _this._opts.canWidth;
			_this._canHeight = _this._opts.canHeight;
			// zoom
			_this._zoom = _this._opts.zoom;
			// zoom step
			_this._zoomStep = _this._opts.zoomStep;
			// step for zoom move
			_this._zoomMoveStep = 0;
			// act. image width
			_this._curWidth = 0;
			// act. image height
			_this._curHeight = 0;
			// create main canvas
			_this._canvas = document.createElement("canvas");
			_this._canvas.width = _this._canWidth;
			_this._canvas.height = _this._canHeight;
			// ctx of main canvas
			_this._ctx = _this._canvas.getContext("2d");
			// loaded image
			_this._img = null;
			// original image width
			_this._imgWidth = 0;
			// original image height
			_this._imgHeight = 0;
			// canvas & ctx for create line
			_this._lineCanvas = null;
			_this._lineCanvasCtx = null;
			// canvas & ctx for preview of a entity
			_this._entityCanvas = null;
			_this._entityCanvasCtx = null;
			// entites to draw
			_this._entites = [];
			// image draw offset axe x
			_this._x = 0;
			// image draw offset axe y
			_this._y = 0;
			// threshold for click
			_this._THRESHOLD = {
				MIN: -1,
				MAX: 1
			};
			// helper for mouse event
			_this._mouse = {
				startXSave: 0,
				startYSave: 0,
				startX: 0,
				startY: 0,
				bcr: null
			};
			_this._flags = {
				wasRightClick: false,
				wasMove: false,
				wasPreview: false,
				wasLine: false,
				wasImgMove: false
			};
			// binds
			_this._binds = {
				mouseWheel: _this._mouseWheel.bind(_this),
				mouseDown: _this._mouseDown.bind(_this),
				mouseMove: _this._mouseMove.bind(_this),
				mouseUp: _this._mouseUp.bind(_this),
				mouseMoveLine: _this._mouseMoveLine.bind(_this),
				mouseUpLine: _this._mouseUpLine.bind(_this),
				contextMenu: _this._cancelEvents.bind(_this)
			};
			// firefox
			_this._canvas.addEventListener("DOMMouseScroll", _this._binds.mouseWheel);
			// others
			_this._canvas.addEventListener("mousewheel", _this._binds.mouseWheel);
			_this._canvas.addEventListener("mousedown", _this._binds.mouseDown);
			_this._canvas.addEventListener("contextmenu", _this._binds.contextMenu);
			// spinner - progress for image load
			_this._spinner = $loader.getSpinner();
			parent.appendChild(_this._spinner);
			parent.appendChild(_this._canvas);
			// preview canvas
			if (_this._opts.entityPreview) {
				_this._entityCanvas = document.createElement("canvas");
				_this._entityCanvas.width = 300;
				_this._entityCanvas.height = 150;
				_this._entityCanvasCtx = _this._entityCanvas.getContext("2d");
				_this._opts.entityPreview.appendChild(_this._entityCanvas);
			}
			return _this;
		}
		/**
   * Scene redraw - clear, picture, entites.
   *
   * @private
   * @method _redraw
   * @member $anonymizer
   */
		$anonymizer.prototype._redraw = function _redraw() {
			var _this2 = this;
			// pictue
			this._ctx.clearRect(0, 0, this._canWidth, this._canHeight);
			this._ctx.drawImage(this._img, this._x, this._y, this._img.width, this._img.height, 0, 0, this._curWidth, this._curHeight);
			// entites
			if (this._entites.length) {
				(function () {
					var zc = _this2._zoom / 100;
					var xc = _this2._x * zc;
					var yc = _this2._y * zc;
					_this2._entites.forEach(function (entity) {
						var x = void 0;
						var y = void 0;
						switch (entity.id) {
							case $anonymizer.ENTITES.CIRCLE.id:
								var radius = Math.round(entity.value * zc);
								x = Math.round(_this2._curWidth * entity.xRatio - xc);
								y = Math.round(_this2._curHeight * entity.yRatio - yc);
								_this2._drawCircle(_this2._ctx, x, y, radius);
								break;
							case $anonymizer.ENTITES.LINE.id:
								var lineWidth = Math.round(entity.value * zc);
								x = Math.round(_this2._curWidth * entity.xRatio - xc);
								y = Math.round(_this2._curHeight * entity.yRatio - yc);
								var x2 = Math.round(_this2._curWidth * entity.x2Ratio - xc);
								var y2 = Math.round(_this2._curHeight * entity.y2Ratio - yc);
								_this2._drawLine(_this2._ctx, x, y, x2, y2, lineWidth);
								break;
						}
					});
				})();
			}
			// image preview
			this._drawPreview();
		};
		/**
   * Draw white canvas.
   * 
   * @private
   * @method _setWhiteCanvas
   * @member $anonymizer
   */
		$anonymizer.prototype._setWhiteCanvas = function _setWhiteCanvas() {
			this._ctx.clearRect(0, 0, this._canWidth, this._canHeight);
			this._drawFillRect(this._ctx, 0, 0, this._canWidth, this._canHeight, "#fff");
		};
		/**
   * Draw a circle.
   * 
   * @param  {Canvas} ctx Canvas context
   * @param  {Number} x Center coordinates axe x
   * @param  {Number} y Center coordinates axe y
   * @param  {Number} radius Circle radius
   * @private
   * @method _drawCircle
   * @member $anonymizer
   */
		$anonymizer.prototype._drawCircle = function _drawCircle(ctx, x, y, radius) {
			ctx.beginPath();
			ctx.arc(x, y, radius, 0, 2 * Math.PI);
			ctx.fillStyle = $anonymizer.ENTITES.CIRCLE.fillStyle;
			ctx.closePath();
			ctx.fill();
		};
		/**
   * Draw a line.
   * 
   * @param  {Canvas} ctx Canvas context
   * @param  {Number} x Line start coordinates axe x
   * @param  {Number} y Line start coordinates axe y
   * @param  {Number} x2 Line end coordinates axe x
   * @param  {Number} y2 Line end coordinates axe y
   * @param  {Number} lineWidth Line width [px]
   * @private
   * @method _drawLine
   * @member $anonymizer
   */
		$anonymizer.prototype._drawLine = function _drawLine(ctx, x, y, x2, y2, lineWidth) {
			ctx.beginPath();
			ctx.moveTo(x, y);
			ctx.lineTo(x2, y2);
			ctx.lineWidth = lineWidth;
			ctx.strokeStyle = $anonymizer.ENTITES.LINE.strokeStyle;
			ctx.closePath();
			ctx.stroke();
		};
		/**
   * Draw a filled rectangle.
   * 
   * @param  {Canvas} ctx Canvas context
   * @param  {Number} x Start coordinates axe x
   * @param  {Number} y Start coordinates axe y
   * @param  {Number} width Rectangle width
   * @param  {Number} height Rectangle height
   * @param  {String} fillStyle Fill style
   * @private
   * @method _drawFillRect
   * @member $anonymizer
   */
		$anonymizer.prototype._drawFillRect = function _drawFillRect(ctx, x, y, width, height, fillStyle) {
			ctx.beginPath();
			ctx.fillStyle = fillStyle || "";
			ctx.fillRect(x, y, width, height);
			ctx.closePath();
		};
		/**
   * Draw a rectangle, only border.
   * 
   * @param  {Canvas} ctx Canvas context
   * @param  {Number} x Start coordinates axe x
   * @param  {Number} y Start coordinates axe y
   * @param  {Number} width Rectangle width
   * @param  {Number} height Rectangle height
   * @param  {String} strokeStyle Border style
   * @param  {Number} lineWidth Border width
   * @private
   * @method _drawRect
   * @member $anonymizer
   */
		$anonymizer.prototype._drawRect = function _drawRect(ctx, x, y, width, height, strokeStyle, lineWidth) {
			ctx.beginPath();
			ctx.rect(x, y, width, height);
			ctx.lineWidth = lineWidth || 1;
			ctx.strokeStyle = strokeStyle || "";
			ctx.closePath();
			ctx.stroke();
		};
		/**
   * Draw a image preview.
   *
   * @private
   * @method _drawPreview
   * @member $anonymizer
   */
		$anonymizer.prototype._drawPreview = function _drawPreview() {
			if (!this._opts.showPreview) return;
			var ratio = this._imgWidth / this._imgHeight;
			var height = Math.round(this._opts.previewWidth / ratio);
			// background
			this._drawFillRect(this._ctx, this._opts.previewLeft - 1, this._opts.previewTop - 1, this._opts.previewWidth + 2, height + 2, "rgba(255, 255, 255, 0.5)");
			// picture
			this._ctx.drawImage(this._img, 0, 0, this._img.width, this._img.height, this._opts.previewLeft, this._opts.previewTop, this._opts.previewWidth, height);
			// red border - current view
			var zc = this._zoom / 100;
			var xc = this._x * zc;
			var yc = this._y * zc;
			var xRatio = xc / this._curWidth;
			var yRatio = yc / this._curHeight;
			var x2Ratio = (xc + this._canWidth) / this._curWidth;
			var y2Ratio = (yc + this._canHeight) / this._curHeight;
			// restrictions
			xRatio = $math.setRange(xRatio, 0, 1);
			yRatio = $math.setRange(yRatio, 0, 1);
			x2Ratio = $math.setRange(x2Ratio, 0, 1);
			y2Ratio = $math.setRange(y2Ratio, 0, 1);
			var x1 = Math.round(this._opts.previewLeft + xRatio * this._opts.previewWidth);
			var y1 = Math.round(this._opts.previewTop + yRatio * height);
			var x2 = Math.round(this._opts.previewLeft + x2Ratio * this._opts.previewWidth);
			var y2 = Math.round(this._opts.previewTop + y2Ratio * height);
			// red border
			this._drawRect(this._ctx, x1, y1, x2 - x1, y2 - y1, "#C01", 1);
		};
		/**
   * Draw a entity preview for circle/line.
   *
   * @private
   * @method _drawEntityPreview
   * @member $anonymizer
   */
		$anonymizer.prototype._drawEntityPreview = function _drawEntityPreview() {
			if (!this._opts.entityPreview) return;
			var width = this._entityCanvas.width;
			var height = this._entityCanvas.height;
			this._entityCanvasCtx.clearRect(0, 0, width, height);
			this._drawFillRect(this._entityCanvasCtx, 0, 0, width, height, "#f9f9f9");
			var curEnt = this._opts.curEntity;
			var zc = this._zoom / 100;
			switch (curEnt.id) {
				case $anonymizer.ENTITES.CIRCLE.id:
					var radius = Math.round(curEnt.value * zc);
					var x = Math.round(width / 2);
					var y = Math.round(height / 2);
					this._drawCircle(this._entityCanvasCtx, x, y, radius);
					break;
				case $anonymizer.ENTITES.LINE.id:
					var x1 = Math.round(width * 0.2);
					var y1 = Math.round(height / 2);
					var x2 = Math.round(width * 0.8);
					// y2 = y1
					var lineWidth = Math.round(curEnt.value * zc);
					this._drawLine(this._entityCanvasCtx, x1, y1, x2, y1, lineWidth);
					break;
			}
		};
		/**
   * Get center point for zoom, otherwise is used point with mouse wheel and cursor position.
   *
   * @param {Number} [x] Coordinates on canvas axe x, otherwise is used center point on axe x
   * @param {Number} [y] Coordinates on canvas axe y, otherwise is used center point on axe y
   * @return {Object}
   * @private
   * @method _getFromPoint
   * @member $anonymizer
   */
		$anonymizer.prototype._getFromPoint = function _getFromPoint(x, y) {
			var fromPoint = {
				x: x || Math.round(this._canWidth / 2),
				y: y || Math.round(this._canHeight / 2)
			};
			var zc = this._zoom / 100;
			var newX = Math.round(this._x * zc) + fromPoint.x;
			var newY = Math.round(this._y * zc) + fromPoint.y;
			fromPoint.xRatio = newX / this._curWidth;
			fromPoint.yRatio = newY / this._curHeight;
			return fromPoint;
		};
		/**
   * Post zoom operation - new image dimenstions, new move zoom step.
   * 
   * @private
   * @method _postZoom
   * @member $anonymizer
   */
		$anonymizer.prototype._postZoom = function _postZoom() {
			var zc = this._zoom / 100;
			this._curWidth = Math.round(this._img.width * zc);
			this._curHeight = Math.round(this._img.height * zc);
			if (this._zoom < 100) {
				// function for zoom and mouse move
				this._zoomMoveStep = Math.max((100 - this._zoom) / 10 * this._opts.zoomMoveStep / 2, 1);
			}
		};
		/**
   * Set image center on the canvas center.
   *
   * @private
   * @method _setCenter
   * @member $anonymizer
   */
		$anonymizer.prototype._setCenter = function _setCenter() {
			this._setPosition(0.5, 0.5);
		};
		/**
   * Set image offset position.
   * 
   * @param {Number} xRatio <0;1> Point position on the image
   * @param {Number} yRatio <0;1> Point position on the image
   * @param {Number} [x] Screen offset, otherwise center [px], axe x
   * @param {Number} [y] Screen offset, otherwise center [px], axe y
   * @private
   * @method _setPosition
   * @member $anonymizer
   */
		$anonymizer.prototype._setPosition = function _setPosition(xRatio, yRatio, x, y) {
			x = x || this._canWidth / 2;
			y = y || this._canHeight / 2;
			xRatio = $math.setRange(xRatio, 0, 1);
			yRatio = $math.setRange(yRatio, 0, 1);
			var zc = this._zoom / 100;
			var xc = this._curWidth * xRatio - x;
			var yc = this._curHeight * yRatio - y;
			this._x = Math.max(Math.round(xc / zc), 0);
			this._y = Math.max(Math.round(yc / zc), 0);
		};
		/**
   * Align image to the canvas - left top corner and bottom right corner.
   *
   * @private
   * @method _alignImgToCanvas
   * @member $anonymizer
   */
		$anonymizer.prototype._alignImgToCanvas = function _alignImgToCanvas() {
			var maxX = Math.max(this._curWidth - this._canWidth, 0);
			var currX = Math.round(this._x * this._zoom / 100);
			if (this._x < 0) {
				this._x = 0;
			} else if (currX > maxX) {
				this._x = Math.round(maxX * 100 / this._zoom);
			}
			var maxY = Math.max(this._curHeight - this._canHeight, 0);
			var currY = Math.round(this._y * this._zoom / 100);
			if (this._y < 0) {
				this._y = 0;
			} else if (currY > maxY) {
				this._y = Math.round(maxY * 100 / this._zoom);
			}
		};
		/**
   * It event contains right mouse click?
   *
   * @param {Event} e Mouse event
   * @return {Boolean}
   * @private
   * @method _isRightClick
   * @member $anonymizer
   */
		$anonymizer.prototype._isRightClick = function _isRightClick(e) {
			if (e && (e.which && e.which == 3 || e.button && e.button == 2)) {
				return true;
			} else {
				return false;
			}
		};
		/**
   * Cancel events.
   * 
   * @param  {Event} e Mouse event
   * @private
   * @method _cancelEvents
   * @member $anonymizer
   */
		$anonymizer.prototype._cancelEvents = function _cancelEvents(e) {
			$common.cancelEvents(e);
		};
		/**
   * Mouse wheel event.
   *
   * @param {Event} e Mouse event
   * @private
   * @method  _mouseWheel
   * @member $anonymizer
   */
		$anonymizer.prototype._mouseWheel = function _mouseWheel(e) {
			if (!this._imgWidth && !this._imgHeight) return;
			var delta = e.wheelDelta || -e.detail;
			if (!delta) {
				return;
			}
			this._cancelEvents(e);
			this._setBCR();
			var data = this._getMouseXY(e);
			var fromPoint = this._getFromPoint(data.x, data.y);
			if (delta > 0) {
				this._setZoom(this._zoom + this._zoomStep, fromPoint);
			} else {
				this._setZoom(this._zoom - this._zoomStep, fromPoint);
			}
		};
		/**
   * Get mouse coordinates.
   * 
   * @param  {Event} e
   * @return {Object}
   * @private
   * @method _getMouseXY
   * @member $anonymizer
   */
		$anonymizer.prototype._getMouseXY = function _getMouseXY(e) {
			return {
				x: e.clientX - this._mouse.bcr.left,
				y: e.clientY - this._mouse.bcr.top
			};
		};
		/**
   * Set mouse bounding client rect from canvas el.
   * 
   * @private
   * @method _setCBR
   * @member $anonymizer
   */
		$anonymizer.prototype._setBCR = function _setBCR() {
			this._mouse.bcr = this._canvas.getBoundingClientRect();
		};
		/**
   * Mouse down - create a circle, start of the line, start of move.
   *
   * @param {Event} e Mouse event
   * @private
   * @method _mouseDown
   * @member $anonymizer
   */
		$anonymizer.prototype._mouseDown = function _mouseDown(e) {
			if (!this._imgWidth && !this._imgHeight) return;
			this._cancelEvents(e);
			this._setBCR();
			var data = this._getMouseXY(e);
			this._mouse.startXSave = data.x;
			this._mouse.startYSave = data.y;
			this._mouse.startX = this._mouse.startXSave;
			this._mouse.startY = this._mouse.startYSave;
			this._flags.wasMove = false;
			this._flags.wasRightClick = this._isRightClick(e);
			// circle
			if (this._opts.curEntity == $anonymizer.ENTITES.CIRCLE) {
				this._flags.wasImgMove = false;
				this._flags.wasPreview = false;
				document.addEventListener("mousemove", this._binds.mouseMove);
				document.addEventListener("mouseup", this._binds.mouseUp);
			}
			// line
			else if (this._opts.curEntity == $anonymizer.ENTITES.LINE) {
					// add canvas
					var lineCanvas = document.createElement("canvas");
					lineCanvas.width = this._canWidth;
					lineCanvas.height = this._canHeight;
					lineCanvas.classList.add("line-canvas");
					this._flags.wasPreview = false;
					this._flags.wasLine = false;
					this._lineCanvas = lineCanvas;
					this._lineCanvas.addEventListener("contextmenu", this._binds.contextMenu);
					document.addEventListener("mousemove", this._binds.mouseMoveLine);
					document.addEventListener("mouseup", this._binds.mouseUpLine);
					if (this._flags.wasRightClick) {
						this._lineCanvas.classList.add("is-dragged");
					}
					this._lineCanvasCtx = this._lineCanvas.getContext("2d");
					this._parent.appendChild(lineCanvas);
				}
		};
		/**
   * Image move - according to the coordinates of the mouse.
   * 
   * @param  {Number} newX New value on the axe x
   * @param  {Number} newY New value on the axe y
   * @private
   * @method _imgMove
   * @member $anonymizer
   */
		$anonymizer.prototype._imgMove = function _imgMove(newX, newY) {
			var diffX = this._mouse.startX - newX;
			var diffY = this._mouse.startY - newY;
			if (diffX == 0 && diffY == 0) {
				return;
			}
			// image movement constant
			var zms = this._zoomMoveStep > 0 ? this._zoomMoveStep : 1;
			// move image to the new coordinates
			this._x = diffX * zms + this._x;
			this._y = diffY * zms + this._y;
			this._alignImgToCanvas();
			this._redraw();
		};
		/**
   * Mouse move over the canvas.
   *
   * @param {Event} e Mouse event
   * @private
   * @method _mouseMove
   * @member $anonymizer
   */
		$anonymizer.prototype._mouseMove = function _mouseMove(e) {
			var data = this._getMouseXY(e);
			// mouse cursor
			if (!this._flags.wasMove) {
				this._canvas.classList.add("is-dragged");
			}
			// mouse move flag
			this._flags.wasMove = true;
			// mouse move over the preview?
			var isPreview = this._isPreview(data.x, data.y);
			if (!this._flags.wasRightClick && !this._flags.wasImgMove && isPreview) {
				// set preview flag
				this._flags.wasPreview = true;
				// image move over the preview
				this._setPosition(isPreview.xRatio, isPreview.yRatio);
				this._alignImgToCanvas();
				this._redraw();
			} else if (!this._flags.wasPreview) {
				// image move - flag
				this._flags.wasImgMove = true;
				// image move
				this._imgMove(data.x, data.y);
			}
			// save
			this._mouse.startX = data.x;
			this._mouse.startY = data.y;
		};
		/**
   * Is there a preview on coordinates x, y?
   * 
   * @param  {Number} x Click position on canvas, axe x
   * @param  {Number} y Click position on canvas, axe y
   * @return {Object} Object with percent ration or null
   * @private
   * @method _isPreview
   * @member $anonymizer
   */
		$anonymizer.prototype._isPreview = function _isPreview(x, y) {
			if (!this._opts.showPreview) return null;
			var ratio = this._imgWidth / this._imgHeight;
			// sirka a vyska nahledu
			var width = this._opts.previewWidth;
			var height = Math.round(this._opts.previewWidth / ratio);
			var left = this._opts.previewLeft;
			var top = this._opts.previewTop;
			var zc = this._zoom / 100;
			x = x || 0;
			y = y || 0;
			if (x >= left && x <= left + width && y >= top && y <= top + height) {
				return {
					xRatio: (x - left) / width,
					yRatio: (y - top) / height
				};
			} else {
				return null;
			}
		};
		/**
   * Mouse up - draw a circle, end of move, preview click.
   *
   * @param {Event} e Mouse event
   * @private
   * @method _mouseUp
   * @member $anonymizer
   */
		$anonymizer.prototype._mouseUp = function _mouseUp(e) {
			var data = this._getMouseXY(e);
			var thresholdTest = false;
			// only it was move
			if (this._flags.wasMove) {
				// difference towards start click
				var diffX = this._mouse.startXSave - data.x;
				var diffY = this._mouse.startYSave - data.y;
				if (diffX >= this._THRESHOLD.MIN && diffX <= this._THRESHOLD.MAX && diffY >= this._THRESHOLD.MIN && diffY <= this._THRESHOLD.MAX) {
					// we are in the range
					thresholdTest = true;
				}
			}
			// click - there was no move, threshold test, it is disabled for right mouse click
			if (!this._flags.wasRightClick && (!this._flags.wasMove || thresholdTest)) {
				var isPreview = this._isPreview(data.x, data.y);
				if (isPreview) {
					// preview click - click coordinates on the canvas center
					this._setPosition(isPreview.xRatio, isPreview.yRatio);
					this._alignImgToCanvas();
					this._redraw();
				} else {
					// add circle
					var zc = this._zoom / 100;
					var x = Math.round(this._x * zc) + data.x;
					var y = Math.round(this._y * zc) + data.y;
					this._entites.push({
						id: this._opts.curEntity.id,
						value: this._opts.curEntity.value,
						xRatio: x / this._curWidth,
						yRatio: y / this._curHeight
					});
					this._redraw();
				}
			}
			this._canvas.classList.remove("is-dragged");
			document.removeEventListener("mousemove", this._binds.mouseMove);
			document.removeEventListener("mouseup", this._binds.mouseUp);
		};
		/**
   * Mouse move over canvas - line draw.
   *
   * @param {Event} e Mouse event
   * @private
   * @method _mouseMoveLine
   * @member $anonymizer
   */
		$anonymizer.prototype._mouseMoveLine = function _mouseMoveLine(e) {
			var data = this._getMouseXY(e);
			// mouse move
			this._flags.wasMove = true;
			// right mouse click
			if (this._flags.wasRightClick) {
				// image move
				this._imgMove(data.x, data.y);
				// save
				this._mouse.startX = data.x;
				this._mouse.startY = data.y;
			}
			// left mouse click
			else {
					var isPreview = this._isPreview(data.x, data.y);
					var wasPreview = this._flags.wasPreview;
					if (!this._flags.wasLine && isPreview) {
						this._flags.wasPreview = true;
						// move over preview
						this._setPosition(isPreview.xRatio, isPreview.yRatio);
						this._alignImgToCanvas();
						this._redraw();
					} else if (!this._flags.wasPreview) {
						this._flags.wasLine = true;
						// line width
						var lineWidth = Math.round(this._opts.curEntity.value * this._zoom / 100);
						// clear
						this._lineCanvasCtx.clearRect(0, 0, this._canWidth, this._canHeight);
						// draw a line
						this._drawLine(this._lineCanvasCtx, this._mouse.startX, this._mouse.startY, data.x, data.y, lineWidth);
					}
					// change of state
					if (!wasPreview && this._flags.wasPreview) {
						this._lineCanvas.classList.add("is-dragged");
					}
				}
		};
		/**
   * End of move over canvas - create line, image move.
   * Draw a line in main canvas.
   *
   * @param {Event} e Mouse event
   * @private
   * @method _mouseUpLine
   * @member $anonymizer
   */
		$anonymizer.prototype._mouseUpLine = function _mouseUpLine(e) {
			var data = this._getMouseXY(e);
			var isPreview = null;
			if (!this._flags.wasMove) {
				isPreview = this._isPreview(data.x, data.y);
			}
			// only for left mouse click
			if (!this._flags.wasRightClick) {
				if (isPreview) {
					// preview click - click coordinates on the canvas center
					this._setPosition(isPreview.xRatio, isPreview.yRatio);
					this._alignImgToCanvas();
					this._redraw();
				} else if (this._flags.wasLine) {
					// create a line
					var zc = this._zoom / 100;
					var xc = Math.round(this._x * zc);
					var yc = Math.round(this._y * zc);
					var x = xc + this._mouse.startX;
					var y = yc + this._mouse.startY;
					var x2 = xc + data.x;
					var y2 = yc + data.y;
					this._entites.push({
						id: this._opts.curEntity.id,
						value: this._opts.curEntity.value,
						xRatio: x / this._curWidth,
						yRatio: y / this._curHeight,
						x2Ratio: x2 / this._curWidth,
						y2Ratio: y2 / this._curHeight
					});
					this._redraw();
				}
			}
			this._lineCanvas.classList.remove("is-dragged");
			this._lineCanvas.removeEventListener("contextmenu", this._binds.contextMenu);
			document.removeEventListener("mousemove", this._binds.mouseMoveLine);
			document.removeEventListener("mouseup", this._binds.mouseUpLine);
			this._parent.removeChild(this._lineCanvas);
			this._lineCanvas = null;
		};
		/**
   * Set new value for zoom.
   * 
   * @param  {Number} value New value
   * @param  {Object} [fromPoint] Center of the screen or data from mouse wheel
   * @private
   * @method _setZoom
   * @member $anonymizer
   */
		$anonymizer.prototype._setZoom = function _setZoom(value, fromPoint) {
			fromPoint = fromPoint || this._getFromPoint();
			var oldZoom = this._zoom;
			var newZoom = $math.setRange(value, this._opts.minZoom, this._opts.maxZoom);
			if (newZoom == oldZoom) return;
			this._zoom = newZoom;
			this.trigger("zoom", this._zoom);
			this._postZoom();
			this._setPosition(fromPoint.xRatio, fromPoint.yRatio, fromPoint.x, fromPoint.y);
			this._alignImgToCanvas();
			this._drawEntityPreview();
			this._redraw();
		};
		/**
   * Load and show image in canvas. Returns promise after load.
   * 
   * @param  {String} url Path to image
   * @return {$promise} Promise
   * @method loadImage
   * @member $anonymizer
   */
		$anonymizer.prototype.loadImage = function loadImage(url) {
			var _this3 = this;
			return new $promise(function (resolve, reject) {
				_this3._setWhiteCanvas();
				_this3._spinner.classList.remove("hide");
				var img = new Image();
				img.addEventListener("load", function () {
					_this3._spinner.classList.add("hide");
					_this3._img = img;
					_this3._imgWidth = img.width;
					_this3._imgHeight = img.height;
					_this3._zoom = _this3._opts.zoom;
					_this3.trigger("zoom", _this3._zoom);
					_this3._postZoom();
					_this3._setCenter();
					_this3._alignImgToCanvas();
					_this3._drawEntityPreview();
					_this3._redraw();
					resolve();
				});
				img.addEventListener("error", function () {
					_this3._spinner.classList.add("hide");
					_this3._img = null;
					_this3._imgWidth = 0;
					_this3._imgHeight = 0;
					reject();
				});
				img.src = url || "";
			});
		};
		/**
   * Increase zoom by one step, fires signal "zoom".
   * 
   * @member $anonymizer
   * @method zoomPlus
   */
		$anonymizer.prototype.zoomPlus = function zoomPlus() {
			this._setZoom(this._zoom + this._zoomStep);
		};
		/**
   * Decrease zoom by one step, fires signal "zoom".
   * 
   * @member $anonymizer
   * @method zoomMinus
   */
		$anonymizer.prototype.zoomMinus = function zoomMinus() {
			this._setZoom(this._zoom - this._zoomStep);
		};
		/**
   * Set new value for zoom.
   * 
   * @param  {Number} value New value
   * @member $anonymizer
   * @method setZoom
   */
		$anonymizer.prototype.setZoom = function setZoom(value) {
			this._setZoom(value);
		};
		/**
   * Get current draw entity ID.
   * 
   * @return {String}
   * @member $anonymizer
   * @method getEntityId
   */
		$anonymizer.prototype.getEntityId = function getEntityId() {
			return this._opts.curEntity.id;
		};
		/**
   * Switch to other entity, uses priority.
   *
   * @member $anonymizer
   * @method switchEntity
   */
		$anonymizer.prototype.switchEntity = function switchEntity() {
			var _this4 = this;
			var variants = Object.keys($anonymizer.ENTITES);
			var priority = this._opts.curEntity.priority;
			var selVariant = null;
			var lowestVariant = null;
			variants.forEach(function (variant) {
				var varObj = $anonymizer.ENTITES[variant];
				if (!selVariant && varObj.priority > _this4._opts.curEntity.priority) {
					selVariant = varObj;
				}
				if (!lowestVariant || varObj.priority < lowestVariant.priority) {
					lowestVariant = varObj;
				}
			});
			if (!selVariant) {
				selVariant = lowestVariant;
			}
			this._opts.curEntity = selVariant;
			this._drawEntityPreview();
		};
		/**
   * Get current entity object.
   * 
   * @return {Object}
   * @member $anonymizer
   * @method getEntity
   */
		$anonymizer.prototype.getEntity = function getEntity() {
			return this._opts.curEntity;
		};
		/**
   * Set value for current entity.
   * 
   * @param {Number} val New value
   * @return {Boolean} If there was an error -> it returns false
   * @member $anonymizer
   * @method setEntityValue
   */
		$anonymizer.prototype.setEntityValue = function setEntityValue(val) {
			val = val || 0;
			if (val >= this._opts.curEntity.min && val <= this._opts.curEntity.max) {
				this._opts.curEntity.value = val;
				this._drawEntityPreview();
				return true;
			} else {
				return false;
			}
		};
		/**
   * Set circle as a selected entity.
   *
   * @member $anonymizer
   * @method setCircleEntity
   */
		$anonymizer.prototype.setCircleEntity = function setCircleEntity() {
			this._opts.curEntity = $anonymizer.ENTITES.CIRCLE;
			this._drawEntityPreview();
		};
		/**
   * Set line as a selected entity.
   *
   * @member $anonymizer
   * @method setLineEntity
   */
		$anonymizer.prototype.setLineEntity = function setLineEntity() {
			this._opts.curEntity = $anonymizer.ENTITES.LINE;
			this._drawEntityPreview();
		};
		/**
   * Take last entity and redraw a scene.
   * 
   * @member $anonymizer
   * @method stepBack
   */
		$anonymizer.prototype.stepBack = function stepBack() {
			if (!this._imgWidth && !this._imgHeight) return;
			this._entites.pop();
			this._redraw();
		};
		/**
   * Remove all entites and redraw a scene.
   * 
   * @member $anonymizer
   * @method removeAll
   */
		$anonymizer.prototype.removeAll = function removeAll() {
			if (!this._imgWidth && !this._imgHeight) return;
			this._entites = [];
			this._redraw();
		};
		/**
   * Export all entites on the screen and count them towards original image size.
   * 
   * @return {Object}
   * @member $anonymizer
   * @method exportEntites
   */
		$anonymizer.prototype.exportEntites = function exportEntites() {
			var _this5 = this;
			var output = {
				actions: [],
				image: {
					width: this._imgWidth,
					height: this._imgHeight
				}
			};
			this._entites.forEach(function (entity) {
				switch (entity.id) {
					case $anonymizer.ENTITES.CIRCLE.id:
						output.actions.push({
							type: entity.id.toLowerCase(),
							x: $math.setRange(Math.round(_this5._imgWidth * entity.xRatio), 0, _this5._imgWidth),
							y: $math.setRange(Math.round(_this5._imgHeight * entity.yRatio), 0, _this5._imgHeight),
							r: entity.value
						});
						break;
					case $anonymizer.ENTITES.LINE.id:
						output.actions.push({
							type: entity.id.toLowerCase(),
							x1: $math.setRange(Math.round(_this5._imgWidth * entity.xRatio), 0, _this5._imgWidth),
							y1: $math.setRange(Math.round(_this5._imgHeight * entity.yRatio), 0, _this5._imgHeight),
							x2: $math.setRange(Math.round(_this5._imgWidth * entity.x2Ratio), 0, _this5._imgWidth),
							y2: $math.setRange(Math.round(_this5._imgHeight * entity.y2Ratio), 0, _this5._imgHeight),
							width: entity.value
						});
						break;
				}
			});
			return output;
		};
		/**
   * Resize canvas with new width and height.
   * 
   * @param  {Number} [width] New width in [px]
   * @param  {Number} [height] New height in [px]
   * @member $anonymizer
   * @method syncPort
   */
		$anonymizer.prototype.syncPort = function syncPort(width, height) {
			width = width || this._parent.offsetWidth;
			height = height || this._parent.offsetHeight;
			this._canWidth = width;
			this._canHeight = height;
			this._canvas.width = width;
			this._canvas.height = height;
			if (this._img) {
				this._postZoom();
				this._setCenter();
				this._alignImgToCanvas();
				this._drawEntityPreview();
				this._redraw();
			}
		};
		return $anonymizer;
	}($event);
	;
	/**
  * List of entites.
  * 
  * @type {Object}
  * @param {Object} CIRCLE Circle entity
  * @param {Object} LINE Line entity
  * @member $anonymizer
  * @static
  */
	$anonymizer.ENTITES = {
		CIRCLE: {
			min: 10,
			value: 50,
			max: 100,
			id: "CIRCLE",
			fillStyle: "rgba(0, 0, 255, 0.5)",
			priority: 1
		},
		LINE: {
			min: 10,
			value: 20,
			max: 100,
			id: "LINE",
			strokeStyle: "rgba(0, 255, 0, 0.5)",
			priority: 2
		}
	};
	return $anonymizer;
}]);
function _classCallCheck(instance, Constructor) {
	if (!(instance instanceof Constructor)) {
		throw new TypeError("Cannot call a class as a function");
	}
}
onix.factory("$loader", ["$dom", function ($dom) {
	/**
  * Progress loader in the application.
  * 
  * @class $loader
  */
	var $loader = function () {
		function $loader() {
			_classCallCheck(this, $loader);
			// loader init
			this._create();
		}
		/**
   * Create loader.
   *
   * @private
   * @member $loader
   * @method _create
   */
		$loader.prototype._create = function _create() {
			this._el = $dom.create({
				el: "div",
				"class": "loader"
			});
			// insert into the body on first position
			document.body.insertBefore(this._el, document.body.firstChild);
		};
		/**
   * Start loader.
   *
   * @member $loader
   * @method start
   */
		$loader.prototype.start = function start() {
			this._el.classList.add("start");
		};
		/**
   * End loader.
   *
   * @member $loader
   * @method end
   */
		$loader.prototype.end = function end() {
			var _this = this;
			this._el.classList.remove("start");
			this._el.classList.add("end");
			setTimeout(function () {
				_this._el.classList.remove("end");
				_this._el.classList.add("hide");
				setTimeout(function () {
					_this._el.classList.remove("hide");
				}, 350);
			}, 150);
		};
		/**
   * Get spinner - DOM or object.
   *
   * @param {Boolean} [getObject] True for object DOM configuration for $dom; default HTML node
   * @return {HTMLElement|Object}
   * @member $loader
   * @method getSpinner
   */
		$loader.prototype.getSpinner = function getSpinner(getObject) {
			var children = [];
			for (var i = 1; i < 6; i++) {
				children.push({
					el: "div",
					"class": "rect" + i
				});
			}
			var domConf = {
				el: "div",
				"class": "spinner",
				child: children
			};
			return getObject ? domConf : $dom.create(domConf);
		};
		return $loader;
	}();
	;
	return new $loader();
}]);
function _classCallCheck(instance, Constructor) {
	if (!(instance instanceof Constructor)) {
		throw new TypeError("Cannot call a class as a function");
	}
}
onix.service("$notify", ["$common", "$promise", function ($common, $promise) {
	/**
  * $notify uses bootstrap alerts and provides additional functionality.
  * Create notification object from the element.
  *
  * @param {HTMLElement} el
  * @class $notify
  */
	var $notify = function () {
		function $notify(el) {
			_classCallCheck(this, $notify);
			this._el = el;
			this._HIDE_TIMEOUT = 1500; // [ms]
			this._options = {
				"ok": "alert-success",
				"error": "alert-danger",
				"info": "alert-info",
				"warn": "alert-warning"
			};
			return this;
		}
		/**
   * Set value to the notify element.
   *
   * @param  {String|HTMLElement} txt
   * @member $notify
   * @method _setValue
   * @private
   */
		$notify.prototype._setValue = function _setValue(txt) {
			if ($common.isElement(txt)) {
				onix.element(this._el).empty().append(txt);
			} else if (typeof txt === "string") {
				this._el.innerHTML = txt;
			}
		};
		/**
   * Reset CSS classes.
   *
   * @method reset
   * @member $notify
   */
		$notify.prototype.reset = function reset() {
			var _this = this;
			Object.keys(this._options).forEach(function (key) {
				_this._el.classList.remove(_this._options[key]);
			});
			return this;
		};
		/**
   * Show OK state.
   * 
   * @param  {String|HTMLElement} txt
   * @method ok
   * @member $notify
   */
		$notify.prototype.ok = function ok(txt) {
			this._el.classList.add(this._options.ok);
			this._setValue(txt);
			return this;
		};
		/**
   * Show ERROR state.
   * 
   * @param  {String|HTMLElement} txt
   * @method error
   * @member $notify
   */
		$notify.prototype.error = function error(txt) {
			this._el.classList.add(this._options.error);
			this._setValue(txt);
			return this;
		};
		/**
   * Show INFO state.
   *
   * @param  {String|HTMLElement} txt
   * @method info
   * @member $notify
   */
		$notify.prototype.info = function info(txt) {
			this._el.classList.add(this._options.info);
			this._setValue(txt);
			return this;
		};
		/**
   * Show WARNING state.
   *
   * @param  {String|HTMLElement} txt
   * @method warn
   * @member $notify
   */
		$notify.prototype.warn = function warn(txt) {
			this._el.classList.add(this._options.warn);
			this._setValue(txt);
			return this;
		};
		/**
   * Hide alert after timeout and returns promise at the end of operation.
   * Default timeout is 1500 ms.
   *
   * @param {Number} [timeout] Hide timeout in [ms]
   * @return {$promise}
   * @method hide
   * @member $notify
   */
		$notify.prototype.hide = function hide(timeout) {
			var _this2 = this;
			return new $promise(function (resolve) {
				setTimeout(function () {
					_this2.reset();
					resolve();
				}, timeout || _this2._HIDE_TIMEOUT);
			});
		};
		return $notify;
	}();
	;
	/**
  * Main public access to the notify obj.
  *
  * @param  {HTMLElement} el
  * @return {$notify}
  * @member $notify
  */
	this.get = function (el) {
		return new $notify(el);
	};
}]);
/**
 * Class for creating img previews from File[] variable.
 * 
 * @class $previewImages
 */
onix.service("$previewImages", ["$image", "$dom", "$job", "$loader", function ($image, $dom, $job, $loader) {
	/**
  * Create one image preview.
  *
  * @private
  * @param  {File} file
  * @param  {Number} [maxSize] Max image size
  * @return {Object} dom references
  * @member $previewImages
  */
	this._createPreview = function (file, maxSize) {
		var exported = {};
		var cont = $dom.create({
			el: "span",
			"class": ["preview-item", "preview-loading"],
			child: [{
				el: "span",
				"class": "canvas-cover",
				child: [$loader.getSpinner(true)],
				style: "height: " + (maxSize || 100) + "px",
				_exported: "canvasCover"
			}, {
				el: "span",
				"class": "title",
				innerHTML: file.name.replace(/\..*/g, "")
			}]
		}, exported);
		return {
			cont: cont,
			canvasCover: exported.canvasCover
		};
	};
	/**
  * Create preview holders. Only for images count 4 and 7.
  * Four images are in the one row, seven images has the last one above them.
  *
  * @private
  * @param {HTMLElement} el
  * @param {Number} count
  * @member $previewImages
  */
	this._createPreviewHolders = function (el, count) {
		if (!el || count != 4 && count != 7) return;
		var exported = {};
		// placeholder for 7 images
		if (count == 7) {
			// ceiling line
			el.appendChild($dom.create({
				el: "div",
				child: [{
					el: "span",
					_exported: "img_06"
				}]
			}, exported));
		}
		var child = [];
		var childCount = count == 7 ? 6 : 4;
		for (var i = 0; i < childCount; i++) {
			child.push({
				el: "span",
				_exported: "img_0" + i
			});
		}
		// rest line
		el.appendChild($dom.create({
			el: "div",
			child: child
		}, exported));
		for (var _i = 0; _i < count; _i++) {
			this._dom["img_0" + _i] = exported["img_0" + _i];
		}
	};
	/**
  * One job task
  *
  * @private
  * @param  {Object} previewObj Object with file and preview ID
  * @param  {Number} maxSize Max image size in px
  * @param  {Function} jobDone Function which indicates that job is done
  * @member $previewImages
  */
	this._jobTask = function (previewObj, maxSize, jobDone) {
		var file = previewObj.file;
		var previewID = previewObj.previewID;
		var preview = this._createPreview(file, maxSize);
		// append
		if (previewID in this._dom) {
			this._dom[previewID].appendChild(preview.cont);
		} else {
			this._dom.previewItems.appendChild(preview.cont);
		}
		$image.readFromFile(file, maxSize).then(function (readFileObj) {
			preview.cont.classList.remove("preview-loading");
			preview.canvasCover.innerHTML = "";
			preview.canvasCover.appendChild(readFileObj.canvas);
			jobDone();
		});
	};
	/**
  * Main function for showing img previews.
  * 
  * @param  {HTMLElement} el Placeholder element
  * @param  {File[]} files
  * @param  {Object} [opts] Configuration
  * @param  {Number} [opts.maxSize = 0] Max image size in px; the size is used for image scale
  * @param  {Number} [opts.count = 0] How many images are processed simultinously
  * @param  {Boolean} [opts.createHolder = false] Create placeholder, see _createPreviewHolders function
  * @member $previewImages
  */
	this.show = function (el, files, optsArg) {
		var _this = this;
		// clear previous
		el.innerHTML = "";
		// add class
		el.classList.add("preview-images");
		var opts = {
			maxSize: 0,
			count: 0,
			createHolder: false
		};
		for (var key in optsArg) {
			opts[key] = optsArg[key];
		}
		this._dom = {
			previewItems: el
		};
		var pictureFiles = $image.getPictureFiles(files);
		var count = pictureFiles.length;
		if (count) {
			(function () {
				// create placeholder?
				if (opts.createHolder) {
					_this._createPreviewHolders(el, count);
				}
				var jobsArray = [];
				// sort by name, make previewID - only for 7 pictures
				pictureFiles = pictureFiles.sort(function (a, b) {
					if (a.name < b.name) return -1;else if (a.name > b.name) return 1;else return 0;
				}).forEach(function (pf, ind) {
					jobsArray.push({
						task: _this._jobTask,
						scope: _this,
						args: [{
							file: pf,
							previewID: "img_0" + ind
						}, opts.maxSize]
					});
				});
				// run jobs array
				$job.multipleJobs(jobsArray, opts.count);
			})();
		}
	};
}]);
function _classCallCheck(instance, Constructor) {
	if (!(instance instanceof Constructor)) {
		throw new TypeError("Cannot call a class as a function");
	}
}
function _possibleConstructorReturn(self, call) {
	if (!self) {
		throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
	}return call && ((typeof call === "undefined" ? "undefined" : _typeof2(call)) === "object" || typeof call === "function") ? call : self;
}
function _inherits(subClass, superClass) {
	if (typeof superClass !== "function" && superClass !== null) {
		throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : _typeof2(superClass)));
	}subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}
onix.factory("$select", ["$common", "$event", "$dom", function ($common, $event, $dom) {
	/**
  * $select uses bootstrap dropdown and provides additional functionality.
  *
  * @class $select
  * @param {HTMLElement} el Where element has class "dropdown"
  * @param {Object} [opts]
  * @param {Boolean} [opts.addCaption = false] Add caption to select
  */
	var $select = function (_$event) {
		_inherits($select, _$event);
		function $select(el, opts) {
			_classCallCheck(this, $select);
			// event init
			var _this = _possibleConstructorReturn(this, _$event.call(this));
			_this._eventInit();
			_this._opts = {
				addCaption: false
			};
			for (var key in opts) {
				_this._opts[key] = opts[key];
			}
			_this._CONST = {
				CAPTION_SEL: ".dropdown-toggle",
				OPTIONS_SEL: ".dropdown-menu a",
				CARET_SEL: ".caret",
				OPEN_DROPDOWN_SEL: ".dropdown.open",
				OPEN_CLASS: "open",
				ACTIVE_CLASS: "active"
			};
			_this._el = el;
			_this._optinsRef = [];
			_this._captionEl = null;
			_this.captionTextEl = null;
			_this._binds = {
				captionClick: _this._captionClick.bind(_this),
				choiceClick: _this._choiceClick.bind(_this),
				removeAllOpened: _this._removeAllOpened.bind(_this),
				click: _this._click.bind(_this)
			};
			_this._bind();
			return _this;
		}
		/**
   * Bind clicks on the select.
   *
   * @member $select
   * @private
   * @method _bind
   */
		$select.prototype._bind = function _bind() {
			this._bindCaption();
			this._bindChoices();
		};
		/**
   * Bind caption el.
   * 
   * @member $select
   * @private
   * @method _bindCaption
   */
		$select.prototype._bindCaption = function _bindCaption() {
			var captionEl = this._el.querySelector(this._CONST.CAPTION_SEL);
			if (captionEl) {
				// click on the caption
				captionEl.addEventListener("click", this._binds.captionClick);
				// insert span placeholder for caption
				if (this._opts.addCaption) {
					var caretEl = captionEl.querySelector(this._CONST.CARET_SEL);
					if (caretEl) {
						var captionTextEl = $dom.create({
							el: "span",
							"class": "add-caption"
						});
						captionEl.insertBefore(captionTextEl, caretEl);
						this._captionTextEl = captionTextEl;
					}
				}
			}
			this._captionEl = captionEl;
		};
		/**
   * Remove all opened selectors -> close all.
   *
   * @member $select
   * @private
   * @method _removeAllOpened
   */
		$select.prototype._removeAllOpened = function _removeAllOpened() {
			var _this2 = this;
			// remove all
			onix.element(this._CONST.OPEN_DROPDOWN_SEL).forEach(function (item) {
				item.classList.remove(_this2._CONST.OPEN_CLASS);
			});
		};
		/**
   * Outside click.
   * 
   * @member $select
   * @private
   * @method _click
   */
		$select.prototype._click = function _click() {
			this._removeAllOpened();
			document.removeEventListener("click", this._binds.click);
		};
		/**
   * Event - click on caption.
   * 
   * @param  {Event} e 
   * @member $select
   * @private
   * @method _captionClick
   */
		$select.prototype._captionClick = function _captionClick(e) {
			e.stopPropagation();
			var isOpen = this._el.classList.contains(this._CONST.OPEN_CLASS);
			this._binds.removeAllOpened();
			if (isOpen) {
				// outside click
				document.removeEventListener("click", this._binds.click);
			} else {
				// outside click
				document.addEventListener("click", this._binds.click);
				this._el.classList.add(this._CONST.OPEN_CLASS);
			}
		};
		/**
   * Bind choices inside select.
   *
   * @member $select
   * @private
   * @method _bindChoices
   */
		$select.prototype._bindChoices = function _bindChoices() {
			var _this3 = this;
			onix.element(this._CONST.OPTIONS_SEL, this._el).forEach(function (option) {
				option.addEventListener("click", _this3._binds.choiceClick);
				// event ref
				_this3._optinsRef.push({
					el: option,
					event: "click",
					fn: _this3._binds.choiceClick
				});
			});
		};
		/**
   * Event - click on option.
   * 
   * @param  {Event} e 
   * @member $select
   * @private
   * @method _choiceClick
   */
		$select.prototype._choiceClick = function _choiceClick(e) {
			e.stopPropagation();
			var el = e.target || e.srcElement;
			if (el && !el.parentNode.classList.contains(this._CONST.ACTIVE_CLASS)) {
				// remove previously selected
				var active = el.parentNode.parentNode.querySelector("." + this._CONST.ACTIVE_CLASS);
				if (active) {
					active.classList.remove(this._CONST.ACTIVE_CLASS);
				}
				// add to the current
				el.parentNode.classList.add(this._CONST.ACTIVE_CLASS);
				this._el.classList.remove(this._CONST.OPEN_CLASS);
				if (this._opts.addCaption && this._captionTextEl) {
					this._captionTextEl.innerHTML = el.innerHTML;
				}
				// trigger click
				var value = el.getAttribute("data-value") || "";
				this.trigger("change", value);
			}
		};
		/**
   * Unbind choices.
   *
   * @member $select
   * @method unbindChoices
   */
		$select.prototype.unbindChoices = function unbindChoices() {
			if (this._optinsRef.length) {
				this._optinsRef.forEach(function (option) {
					option.el.removeEventListener(option.event, option.fn);
				});
				this._optinsRef = [];
			}
		};
		/**
   * Rebind choices.
   *
   * @member $select
   * @method rebindChoices
   */
		$select.prototype.rebindChoices = function rebindChoices() {
			this.unbindChoices();
			this._bindChoices();
		};
		/**
   * Select option from the select.
   * 
   * @param {Number} ind Position 0..n
   * @member $select
   * @method selectOption
   */
		$select.prototype.selectOption = function selectOption(ind) {
			ind = ind || 0;
			var optionsCount = this._optinsRef.length;
			if (optionsCount > 0 && ind >= 0 && ind < optionsCount) {
				var el = this._optinsRef[ind].el;
				var parent = this._optinsRef[ind].el.parentNode;
				if (!parent.classList.contains(this._CONST.ACTIVE_CLASS)) {
					parent.classList.add(this._CONST.ACTIVE_CLASS);
					if (this._opts.addCaption && this._captionTextEl) {
						this._captionTextEl.innerHTML = el.innerHTML;
					}
					// trigger click
					var value = el.getAttribute("data-value") || "";
					this.trigger("change", value);
				}
			}
		};
		/**
   * Set add caption from the current value.
   *
   * @member $select
   * @method setAddCaption
   */
		$select.prototype.setAddCaption = function setAddCaption() {
			var _this4 = this;
			if (!this._opts.addCaption) return;
			this._optinsRef.every(function (item) {
				var parent = item.el.parentNode;
				if (parent.classList.contains(_this4._CONST.ACTIVE_CLASS)) {
					_this4._captionTextEl.innerHTML = item.el.innerHTML;
					return false;
				} else {
					return true;
				}
			});
		};
		return $select;
	}($event);
	;
	return $select;
}]);
function _classCallCheck(instance, Constructor) {
	if (!(instance instanceof Constructor)) {
		throw new TypeError("Cannot call a class as a function");
	}
}
function _possibleConstructorReturn(self, call) {
	if (!self) {
		throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
	}return call && ((typeof call === "undefined" ? "undefined" : _typeof2(call)) === "object" || typeof call === "function") ? call : self;
}
function _inherits(subClass, superClass) {
	if (typeof superClass !== "function" && superClass !== null) {
		throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : _typeof2(superClass)));
	}subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}
onix.factory("$slider", ["$dom", "$event", "$common", "$math", function ($dom, $event, $common, $math) {
	/**
  * Slider - slider with input for selecting numbers from the range.
  * 
  * @param {HTMLElement} parent Where is canvas appended
  * @param {Object} [optsArg] Configuration
  * @param {Number} [optsArg.min=0] Min value
  * @param {Number} [optsArg.max=100] Max value
  * @param {Number} [optsArg.wheelStep=1] Mouse wheel step value
  * @param {Number} [optsArg.timeout=333] Timeout for signal fire (keydown, move)
  * @class $slider
  */
	var $slider = function (_$event) {
		_inherits($slider, _$event);
		function $slider(parent, optsArg) {
			_classCallCheck(this, $slider);
			// event init
			var _this = _possibleConstructorReturn(this, _$event.call(this));
			_this._eventInit();
			_this._parent = parent;
			_this._root = _this._create();
			_this._opts = {
				min: 0,
				max: 100,
				wheelStep: 1,
				timeout: 333
			};
			for (var key in optsArg) {
				_this._opts[key] = optsArg[key];
			}
			// selected value
			_this._value = null;
			// signal change - helper
			_this._signalObj = {
				id: null,
				lastValue: null
			};
			parent.appendChild(_this._root);
			_this._binds = {
				keyUp: _this._keyUp.bind(_this),
				click: _this._click.bind(_this),
				mouseDownCaret: _this._mouseDownCaret.bind(_this),
				mouseMove: _this._mouseMove.bind(_this),
				mouseWheel: _this._mouseWheel.bind(_this),
				mouseUp: _this._mouseUp.bind(_this),
				sendSignalInner: _this._sendSignalInner.bind(_this)
			};
			_this._mouse = {
				bcr: null
			};
			_this._els.input.addEventListener("keyup", _this._binds.keyUp);
			_this._els.tube.addEventListener("click", _this._binds.click);
			_this._els.caret.addEventListener("mousedown", _this._binds.mouseDownCaret);
			// firefox
			_this._els.lineHolder.addEventListener("DOMMouseScroll", _this._binds.mouseWheel);
			// others
			_this._els.lineHolder.addEventListener("mousewheel", _this._binds.mouseWheel);
			// def. max value
			_this.setValue(_this._opts.max);
			return _this;
		}
		/**
   * Create slider and his children.
   *
   * @member $slider
   * @private
   * @method _create
   */
		$slider.prototype._create = function _create() {
			this._els = {};
			return $dom.create({
				el: "div",
				"class": "slider",
				child: [{
					el: "input",
					type: "text",
					value: "",
					_exported: "input"
				}, {
					el: "span",
					"class": "line-holder",
					_exported: "lineHolder",
					child: [{
						el: "span",
						"class": "lh-tube",
						_exported: "tube"
					}, {
						el: "span",
						"class": "lh-caret",
						_exported: "caret"
					}]
				}]
			}, this._els);
		};
		/**
   * Set caret position.
   * 
   * @param {Number} posX Value [px] caret offset accord to the start
   * @member $slider
   * @private
   * @method _setCaret
   */
		$slider.prototype._setCaret = function _setCaret(posX) {
			var width = this._els.lineHolder.offsetWidth;
			if (posX < 0) {
				posX = 0;
			} else if (posX > width) {
				posX = width;
			}
			this._els.caret.style.left = posX.toFixed(2) + "px";
		};
		/**
   * Get mouse coordinates.
   * 
   * @param  {Event} e
   * @return {Object}
   * @private
   * @member $slider
   * @method _getMouseXY
   */
		$slider.prototype._getMouseXY = function _getMouseXY(e) {
			return {
				x: e.clientX - this._mouse.bcr.left,
				y: e.clientY - this._mouse.bcr.top
			};
		};
		/**
   * Set mouse bounding client rect from canvas el.
   * 
   * @private
   * @member $slider
   * @method _setBCR
   */
		$slider.prototype._setBCR = function _setBCR() {
			this._mouse.bcr = this._els.lineHolder.getBoundingClientRect();
		};
		/**
   * Key up event from the input.
   *
   * @member $slider
   * @private
   * @method _keyUp
   */
		$slider.prototype._keyUp = function _keyUp() {
			var inputEl = this._els.input;
			var value = parseFloat(inputEl.value);
			var errors = false;
			if (isNaN(value) || value < this._opts.min || value > this._opts.max) {
				errors = true;
			} else {
				// set new value
				this.setValue(value);
				this._sendSignal(true);
			}
			inputEl.classList[errors ? "add" : "remove"]("error");
		};
		/**
   * Click on tube event.
   *
   * @param {Event} e
   * @member $slider
   * @private
   * @method _click
   */
		$slider.prototype._click = function _click(e) {
			$common.cancelEvents(e);
			this._setBCR();
			var width = this._els.lineHolder.offsetWidth;
			var value = this._getMouseXY(e).x;
			var ratio = value / width;
			// increate click range
			if (ratio <= 0.05) {
				value = 0;
			} else if (ratio >= 0.95) {
				value = width;
			}
			this._setCaret(value);
			this._setValue(value, true);
		};
		/**
   * Click on the caret event, binds mouse up over the document.
   *
   * @param {Event} e
   * @member $slider
   * @private
   * @method _mouseDownCaret
   */
		$slider.prototype._mouseDownCaret = function _mouseDownCaret(e) {
			$common.cancelEvents(e);
			this._setBCR();
			document.addEventListener("mousemove", this._binds.mouseMove);
			document.addEventListener("mouseup", this._binds.mouseUp);
		};
		/**
   * Mouse move event over line holder - only if was clicked on the caret.
   *
   * @param {Event} e
   * @member $slider
   * @private
   * @method _mouseMove
   */
		$slider.prototype._mouseMove = function _mouseMove(e) {
			var caretEl = this._els.caret;
			var posX = this._getMouseXY(e).x;
			this._setCaret(posX);
			this._setValue(posX);
		};
		/**
   * Mouse up event over the document.
   * 
   * @member $slider
   * @private
   * @method _mouseUp
   */
		$slider.prototype._mouseUp = function _mouseUp() {
			document.removeEventListener("mousemove", this._binds.mouseMove);
			document.removeEventListener("mouseup", this._binds.mouseUp);
		};
		/**
   * Mouse wheel event.
   *
   * @param {Event} e Mouse event
   * @private
   * @member $slider
   * @method _mouseWheel
   */
		$slider.prototype._mouseWheel = function _mouseWheel(e) {
			var delta = e.wheelDelta || -e.detail;
			if (!delta) {
				return;
			}
			$common.cancelEvents(e);
			if (delta > 0) {
				this.setValue(this._value + this._opts.wheelStep);
				this._sendSignal();
			} else {
				this.setValue(this._value - this._opts.wheelStep);
				this._sendSignal();
			}
		};
		/**
   * Get value -> position convert.
   *
   * @param {Number} value Value in the range --> [px] position for the caret.
   * @return {Number}
   * @member $slider
   * @private
   * @method _getPosFromValue
   */
		$slider.prototype._getPosFromValue = function _getPosFromValue(value) {
			value = value || this._value;
			var width = this._els.lineHolder.offsetWidth;
			var range = this._opts.max - this._opts.min;
			var posX = (value - this._opts.min) / range * width;
			return posX;
		};
		/**
   * Set value using caret position. Fires signal "change".
   *
   * @param {Number} posX Value on the axe x
   * @param {Boolean} [fromClick] It was called from click method?
   * @member $slider
   * @private
   * @method _setValue
   */
		$slider.prototype._setValue = function _setValue(posX, fromClick) {
			posX = posX || 0;
			var width = this._els.lineHolder.offsetWidth;
			var range = this._opts.max - this._opts.min;
			if (posX < 0) {
				posX = 0;
			} else if (posX > width) {
				posX = width;
			}
			var value = Math.round(posX / width * range + this._opts.min);
			this._value = value;
			this._els.input.value = value;
			this._els.input.classList.remove("error");
			this._sendSignal(!fromClick);
		};
		/**
   * Delayed sending of signal.
   *
   * @param {Boolean} [withTimeout] Send with timeout?
   * @member $slider
   * @private
   * @method _sendSignal
   */
		$slider.prototype._sendSignal = function _sendSignal(withTimeout) {
			if (this._signalObj.id) {
				clearTimeout(this._signalObj.id);
				this._signalObj.id = null;
			}
			if (withTimeout) {
				this._signalObj.id = setTimeout(this._binds.sendSignalInner, this._opts.timeout);
			} else {
				this._sendSignalInner();
			}
		};
		/**
   * Delayed sending of signal - inner method.
   *
   * @member $slider
   * @private
   * @method _sendSignalInner
   */
		$slider.prototype._sendSignalInner = function _sendSignalInner() {
			if (this._value == this._signalObj.lastValue) return;
			this._signalObj.lastValue = this._value;
			this.trigger("change", this._value);
		};
		/**
   * Set slider value.
   * 
   * @param {Number} value New value
   * @return {Boolean} If there was error, it returns false
   * @member $slider
   * @method setValue
   */
		$slider.prototype.setValue = function setValue(value) {
			if (typeof value === "number") {
				value = $math.setRange(value, this._opts.min, this._opts.max);
				this._value = value;
				this._els.input.value = value;
				this._els.input.classList.remove("error");
				this._setCaret(this._getPosFromValue(value));
				return true;
			} else {
				return false;
			}
		};
		/**
   * Get slider value.
   * 
   * @return {Number}
   * @member $slider
   * @method getValue
   */
		$slider.prototype.getValue = function getValue() {
			return this._value;
		};
		/**
   * Overwrite configuration object.
   *
   * @param {Object} optsArg See constructor.
   * @member $slider
   * @method rewriteOpts
   */
		$slider.prototype.rewriteOpts = function rewriteOpts(optsArg) {
			for (var key in optsArg) {
				this._opts[key] = optsArg[key];
			}
			this._value = $math.setRange(this._value, this._opts.min, this._opts.max);
			this.setValue(this._value);
		};
		return $slider;
	}($event);
	;
	return $slider;
}]);
function _classCallCheck(instance, Constructor) {
	if (!(instance instanceof Constructor)) {
		throw new TypeError("Cannot call a class as a function");
	}
}
onix.factory("$crop", ["$dom", "$math", "$common", function ($dom, $math, $common) {
	/**
  *
  * Crop - this class is used for selection crop above the image/element.
  * 
  * @param {Object} [options] Configuration
  * @param {Number} [options.width = 250] Crop width
  * @param {Number} [options.height = 250] Crop height
  * @param {Number} [options.minWidth = 10] Crop min width, always higher than 0!
  * @param {Number} [options.minHeight = 10] Crop min height, always higher than 0!
  * @param {Number} [options.maxWidth = Infinity] Crop max width
  * @param {Number} [options.maxHeight = Infinity] Crop max height
  * @param {Boolean} [options.resizable = true] Crop can be resizabled by points
  * @param {Number} [options.aspectRatio = 0] Crop aspect ratio for width / height
  * @class $crop
  */
	var $crop = function () {
		function $crop(options) {
			_classCallCheck(this, $crop);
			this._CONST = {
				HIDE_CLASS: "hide"
			};
			this._options = {
				width: 250, // initial size
				height: 250,
				minWidth: 10,
				minHeight: 10, //  if resizable=true
				maxWidth: Infinity,
				maxHeight: Infinity,
				resizable: true,
				aspectRatio: 0
			};
			for (var op in options) {
				this._options[op] = options[op];
			}
			// areas dimensions
			this._dim = {
				areaWidth: 0,
				areaHeight: 0,
				width: this._options.width,
				height: this._options.height
			};
			this._changed = false;
			this._backupData = null;
			this._groups = {
				"point-nw": [{ type: "nw", x: true, y: true }, { type: "sw", x: true }, { type: "ne", y: true }],
				"point-ne": [{ type: "ne", x: true, y: true }, { type: "se", x: true }, { type: "nw", y: true }],
				"point-sw": [{ type: "sw", x: true, y: true }, { type: "nw", x: true }, { type: "se", y: true }],
				"point-se": [{ type: "se", x: true, y: true }, { type: "ne", x: true }, { type: "sw", y: true }]
			};
			this._points = { nw: { x: 0, y: 0 }, ne: { x: 0, y: 0 }, sw: { x: 0, y: 0 }, se: { x: 0, y: 0 } };
			this._type = null;
			this._mouse = {
				startXSave: 0,
				startYSave: 0,
				startX: 0,
				startY: 0
			};
			this._binds = {
				mouseDown: this._mouseDown.bind(this),
				mouseMove: this._mouseMove.bind(this),
				mouseUp: this._mouseUp.bind(this)
			};
			this._dom = {};
			this._create();
			this._dom.container.addEventListener("mousedown", this._binds.mouseDown);
			// crop is by default hidden
			this.hide();
		}
		/**
   * Create crop element.
   * 
   * @return {Element}
   * @member $crop
   * @private
   * @method _create
   */
		$crop.prototype._create = function _create() {
			var cropClass = ["crop"];
			if (this._options.resizable) {
				cropClass.push("resizable");
			}
			$dom.create({
				el: "div",
				"class": cropClass,
				child: [{
					el: "div",
					"class": "crop-top",
					child: [{
						el: "span",
						"class": "point-nw"
					}, {
						el: "span",
						"class": "point-ne"
					}],
					_exported: "cropTop"
				}, {
					el: "div",
					"class": "crop-bottom",
					child: [{
						el: "span",
						"class": "point-sw"
					}, {
						el: "span",
						"class": "point-se"
					}],
					_exported: "cropBottom"
				}, {
					el: "div",
					"class": "crop-left",
					_exported: "cropLeft"
				}, {
					el: "div",
					"class": "crop-right",
					_exported: "cropRight"
				}, {
					el: "div",
					"class": "crop-middle",
					_exported: "cropMiddle"
				}],
				_exported: "container"
			}, this._dom);
		};
		/**
   * Set crop center above his area.
   *
   * @private
   * @member $crop
   * @method _setCenter
   */
		$crop.prototype._setCenter = function _setCenter() {
			var width = this._dim.width;
			var height = this._dim.height;
			var leftDiff = Math.round((this._dim.areaWidth - width) / 2);
			var topDiff = Math.round((this._dim.areaHeight - height) / 2);
			var p = this._points;
			p.nw.x = leftDiff;
			p.nw.y = topDiff;
			p.ne.x = p.nw.x + width;
			p.ne.y = p.nw.y + height;
			p.sw.x = this._dim.areaWidth - leftDiff;
			p.sw.y = this._dim.areaHeight - topDiff;
			p.se.x = p.ne.x;
			p.se.y = p.ne.y;
		};
		/**
   * Align crop points inside his area.
   * 
   * @private
   * @member $crop
   * @method _alignPoints
   */
		$crop.prototype._alignPoints = function _alignPoints() {
			var p = this._points;
			var w = this._dim.areaWidth - this._dim.width;
			var h = this._dim.areaHeight - this._dim.height;
			p.nw.x = $math.setRange(p.nw.x, 0, w);
			p.sw.x = $math.setRange(p.sw.x, 0, w);
			p.ne.x = $math.setRange(p.ne.x, this._dim.width, this._dim.areaWidth);
			p.se.x = $math.setRange(p.se.x, this._dim.width, this._dim.areaWidth);
			p.nw.y = $math.setRange(p.nw.y, 0, h);
			p.ne.y = $math.setRange(p.ne.y, 0, h);
			p.sw.y = $math.setRange(p.sw.y, this._dim.height, this._dim.areaHeight);
			p.se.y = $math.setRange(p.se.y, this._dim.height, this._dim.areaHeight);
		};
		/**
   * Redraw crop - calculate all his points and set them in dom objects.
   * 
   * @private
   * @member $crop
   * @method _redraw
   */
		$crop.prototype._redraw = function _redraw() {
			var p = this._points;
			var leftX = p.nw.x;
			var leftY = p.nw.y;
			var size = this._getSize();
			this._dom.cropTop.style.left = leftX + "px";
			this._dom.cropTop.style.width = size.width + "px";
			this._dom.cropTop.style.height = leftY + "px";
			this._dom.cropBottom.style.left = leftX + "px";
			this._dom.cropBottom.style.width = size.width + "px";
			this._dom.cropBottom.style.height = this._dim.areaHeight - p.sw.y + "px";
			this._dom.cropLeft.style.width = leftX + "px";
			this._dom.cropLeft.style.height = this._dim.areaHeight + "px";
			this._dom.cropRight.style.width = this._dim.areaWidth - p.ne.x + "px";
			this._dom.cropRight.style.height = this._dim.areaHeight + "px";
			this._dom.cropMiddle.style.width = size.width + "px";
			this._dom.cropMiddle.style.height = size.height + "px";
			this._dom.cropMiddle.style.left = leftX + "px";
			this._dom.cropMiddle.style.top = leftY + "px";
		};
		/**
   * Mouse down - move/resize crop.
   * 
   * @param  {Event} e
   * @private
   * @member $crop
   * @method _mouseDown
   */
		$crop.prototype._mouseDown = function _mouseDown(e) {
			$common.cancelEvents(e);
			// ie8
			var target = e.target || e.srcElement;
			this._type = target.getAttribute("class");
			switch (this._type) {
				case "crop-top":
				case "crop-bottom":
				case "crop-left":
				case "crop-right":
					return;
			}
			// save values during click
			this._mouse.startX = e.clientX;
			this._mouse.startY = e.clientY;
			this._mouse.startXSave = e.clientX;
			this._mouse.startYSave = e.clientY;
			document.addEventListener("mousemove", this._binds.mouseMove);
			document.addEventListener("mouseup", this._binds.mouseUp);
		};
		/**
   * Mouse move - move/resize crop.
   * 
   * @param  {Event} e
   * @private
   * @member $crop
   * @method _mouseMove
   */
		$crop.prototype._mouseMove = function _mouseMove(e) {
			var _this = this;
			$common.cancelEvents(e);
			var diffX = e.clientX - this._mouse.startX;
			var diffY = e.clientY - this._mouse.startY;
			if (this._type == "crop-middle") {
				// move
				Object.keys(this._points).forEach(function (key) {
					_this._points[key].x += diffX;
					_this._points[key].y += diffY;
				});
				this._alignPoints();
				this._redraw();
			} else {
				// resize - which group?
				var group = this._groups[this._type];
				if (this._options.aspectRatio) {
					diffY = diffX / this._options.aspectRatio * (this._type == "point-nw" || this._type == "point-se" ? 1 : -1);
				}
				if (this._resizeTest(diffX, diffY, group)) {
					group.forEach(function (i) {
						var point = _this._points[i.type];
						// add diffx, diffy to all group members
						point.x += i.x ? diffX : 0;
						point.y += i.y ? diffY : 0;
					});
					// update size
					var size = this._getSize();
					this._dim.width = size.width;
					this._dim.height = size.height;
					this._redraw();
				}
			}
			// overwrite
			this._mouse.startX = e.clientX;
			this._mouse.startY = e.clientY;
		};
		/**
   * Mouse up - end of move/resize crop.
   * 
   * @param  {Event} e
   * @private
   * @member $crop
   * @method _mouseUp
   */
		$crop.prototype._mouseUp = function _mouseUp(e) {
			$common.cancelEvents(e);
			document.removeEventListener("mousemove", this._binds.mouseMove);
			document.removeEventListener("mouseup", this._binds.mouseUp);
			if (this._mouse.startXSave != e.clientX || this._mouse.startYSave != e.clientY) {
				// crop was changed
				this._changed = true;
			}
		};
		/**
   * Get size of crop.
   * 
   * @param  {Object} [points] Points object, default is used crop points.
   * @return {Object}
   * @member $crop
   * @method _getSize
   */
		$crop.prototype._getSize = function _getSize(points) {
			points = points || this._points;
			return {
				width: Math.abs(points.ne.x - points.nw.x),
				height: Math.abs(points.sw.y - points.nw.y)
			};
		};
		/**
   * Resize test - if returns false, crop size is on the edge of the area.
   * 
   * @param  {Number} diffX Increment on axe X
   * @param  {Number} diffY Increment on axe Y
   * @param  {Array[Object]} group Selected group from mouse down
   * @return {Boolean} false - error
   * @member $crop
   * @method _resizeTest
   */
		$crop.prototype._resizeTest = function _resizeTest(diffX, diffY, group) {
			var _this2 = this;
			if (!this._options.aspectRatio) {
				return false;
			}
			var points = {
				nw: {
					x: this._points.nw.x,
					y: this._points.nw.y
				},
				ne: {
					x: this._points.ne.x,
					y: this._points.ne.y
				},
				sw: {
					x: this._points.sw.x,
					y: this._points.sw.y
				},
				se: {
					x: this._points.se.x,
					y: this._points.se.y
				}
			};
			group.forEach(function (i) {
				var point = points[i.type];
				// add diffx, diffy to all group members
				point.x = _this2._points[i.type].x + (i.x ? diffX : 0);
				point.y = _this2._points[i.type].y + (i.y ? diffY : 0);
			});
			// min. and max. value
			var size = this._getSize(points);
			// test
			if (size.width < this._options.minWidth || size.width > this._options.maxWidth || size.height < this._options.minHeight || size.height > this._options.maxHeight || points.nw.x < 0 || points.se.x > this._dim.areaWidth || points.nw.y < 0 || points.sw.y > this._dim.areaHeight) {
				return false;
			} else {
				return true;
			}
		};
		/**
   * Set crop center above his area.
   * 
   * @member $crop
   * @method setCenter
   */
		$crop.prototype.setCenter = function setCenter() {
			this._setCenter();
			this._redraw();
		};
		/**
   * Fit crop to whole area and center him on the screen.
   * 
   * @member $crop
   * @method fitToArea
   */
		$crop.prototype.fitToArea = function fitToArea() {
			var width = void 0;
			var height = void 0;
			if (this._options.aspectRatio) {
				var ratio = this._options.aspectRatio;
				// try width
				width = this._dim.areaWidth;
				height = Math.round(width / ratio);
				// try height
				if (height > this._dim.areaHeight) {
					height = this._dim.areaHeight;
					width = Math.round(height * ratio);
				}
			} else {
				width = Math.min(this._options.maxWidth, this._dim.areaWidth);
				height = Math.min(this._options.maxHeight, this._dim.areaHeight);
			}
			// update dimensions
			this._dim.width = width;
			this._dim.height = height;
			// center and redraw
			this.setCenter();
		};
		/**
   * Remove crop from DOM.
   * 
   * @member $crop
   * @method destroy
   */
		$crop.prototype.destroy = function destroy() {
			var c = this.getContainer();
			if (c.parentNode) {
				c.parentNode.removeChild(c);
			}
			this._dom.container.removeEventListener("mousedown", this._binds.mouseDown);
		};
		/**
   * Get crop root el.
   * 
   * @return {HTMLElement}
   * @member $crop
   * @method getContainer
   */
		$crop.prototype.getContainer = function getContainer() {
			return this._dom.container;
		};
		/**
   * Set crop area dimensions.
   * 
   * @param {Object} [dim]
   * @param {Number} [dim.areaWidth] Area width
   * @param {Number} [dim.areaHeight] Area height
   * @member $crop
   * @method setDim
   */
		$crop.prototype.setDim = function setDim(dim) {
			dim = dim || {};
			if (dim.areaWidth) {
				this._dim.areaWidth = dim.areaWidth;
				this._dom.container.style.width = this._dim.areaWidth + "px";
			}
			if (dim.areaHeight) {
				this._dim.areaHeight = dim.areaHeight;
				this._dom.container.style.height = this._dim.areaHeight + "px";
			}
		};
		/**
   * Show crop.
   *
   * @member $crop
   * @method show
   */
		$crop.prototype.show = function show() {
			this._dom.container.classList.remove(this._CONST.HIDE_CLASS);
		};
		/**
   * Hide crop.
   *
   * @member $crop
   * @method hide
   */
		$crop.prototype.hide = function hide() {
			this._dom.container.classList.add(this._CONST.HIDE_CLASS);
		};
		/**
   * Is crop visible?
   * 
   * @return {Boolean}
   * @member $crop
   * @method isVisible
   */
		$crop.prototype.isVisible = function isVisible() {
			return !this._dom.container.classList.contains(this._CONST.HIDE_CLASS);
		};
		/**
   * Is crop changed?
   * 
   * @return {Boolean}
   * @member $crop
   * @method isChanged
   */
		$crop.prototype.isChanged = function isChanged() {
			return this._changed;
		};
		/**
   * Backup current crop state - his position and change state.
   * 
   * @member $crop
   * @method backup
   */
		$crop.prototype.backup = function backup() {
			this._backupData = {
				changed: this._changed,
				aabb: this.getAABB()
			};
		};
		/**
   * Restore crop saved state - his position and change state.
   * 
   * @member $crop
   * @method restore
   */
		$crop.prototype.restore = function restore() {
			if (this._backupData) {
				this._changed = this._backupData.changed;
				var aabb = this._backupData.aabb;
				var nw = this._points["nw"];
				var ne = this._points["ne"];
				var sw = this._points["sw"];
				var se = this._points["se"];
				// restore
				nw.x = aabb[0];
				nw.y = aabb[1];
				se.x = aabb[2];
				se.y = aabb[3];
				ne.x = se.x;
				ne.y = nw.y;
				sw.x = nw.x;
				sw.y = se.y;
				this._redraw();
				this._backupData = null;
			}
		};
		/**
   * Get crop bounding box.
   * 
   * @param {Number} [scale=1] Recalculate all positions using scale constants, def. is 1
   * @return {Array} [x1, y1, x2, y2] 2 points coordinates from top left corner
   * @member $crop
   * @method getAABB
   */
		$crop.prototype.getAABB = function getAABB(scale) {
			var nw = this._points["nw"];
			var se = this._points["se"];
			scale = scale || 1.0;
			return [Math.round(nw.x * scale), Math.round(nw.y * scale), Math.round(se.x * scale), Math.round(se.y * scale)];
		};
		return $crop;
	}();
	;
	return $crop;
}]);