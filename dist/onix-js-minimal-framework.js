/**
 * OnixJS framework
 * 2.7.4/8. 7. 2016
 * source: https://gitlab.com/LorDOniX/onix
 * documentation: https://gitlab.com/LorDOniX/onix/tree/master/docs
 * minimal version: contains [src/libs/polyfills.js, src/libs/es5-sham.js, src/onix/onix.js, src/onix/filter.js]
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
var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
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
  * version: 2.7.4
  * date: 8. 7. 2016
  * @member onix
  * @static
  */
	onix.info = function () {
		console.log('OnixJS framework\n'+
'2.7.4/8. 7. 2016\n'+
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