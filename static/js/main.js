(function () {
'use strict';

/**
 * Commom functions used in whole application.
 *
 * @class $common
 */

/**
 * Confirm window, returns promise.
 *
 * @param  {String} txt
 * @return {Promise}
 * @member $common
 */
function confirm(txt) {
	return new Promise((resolve, reject) => {
		if (window.confirm(txt)) {
			resolve();
		}
		else {
			reject();
		}
	});
}

/**
 * Merge multiple objects into the single one.
 *
 * @return {Object}
 * @member $common
 */


/**
 * Extend one object by other; from source to dest.
 *
 * @param  {Object} dest
 * @param  {Object} source
 * @member $common
 */
function extend(dest, source) {
	dest = dest || {};
	source = source || {};

	_objCopy(dest, source);
}

/**
 * Clone value without references.
 * 
 * @param  {Object} value Input value
 * @return {Object} cloned value
 * @member $common
 */
function cloneValue(value) {
	return _cloneValue(value, 0);
}

/**
 * Inherit function with another function/s.
 * First argument is source function, others are for inheritance.
 * Last parameters have higher priority than the previous ones.
 *
 * @member $common
 */


/**
 * Bind function arguments without scope.
 *
 * @param  {Function} cb
 * @return {Function}
 * @member $common
 */


/**
 * Missing for each for Node array.
 *
 * @param  {Object[]} nodes
 * @param  {Function} cb
 * @param  {Object|Function} scope
 * @member $common
 */


/**
 * Reverse for each.
 *
 * @param {Array} arr
 * @param {Function} cb
 * @param {Function} [scope]
 * @member $common
 */


/**
 * HEX value to DEC.
 *
 * @param  {String} hex
 * @return {Number}
 * @member $common
 */


/**
 * HEX value to RGB.
 *
 * @param  {String} hexColor
 * @return {Object}
 * @member $common
 */


/**
 * Is value element?
 *
 * @param  {Object} val
 * @return {Boolean}
 * @member $common
 */
function isElement(val) {
	return (val && val instanceof Element);
}

/**
 * Is item object?
 * 
 * @param  {Object} item
 * @return {Boolean}
 * @member $common
 */
function isObject(item) {
	return (typeof item === "object" && !Array.isArray(item) && item !== null);
}


/**
 * Cover function for console.log, which allows to replace {0..n} occurences inside string.
 * First argument is string, other arguments are for replace objects by key.
 * 
 * @member $common
 */
function col() {
	let args = arguments;

	if (args.length) {
		let str = args[0];

		console.log(str.format.apply(str, Array.prototype.slice.call(args, 1)));
	}
}

/**
 * Format size in bytes.
 * 
 * @param  {Number} size
 * @return {String}
 * @member $common
 */
function formatSize(size) {
	if (typeof size !== "number") {
		return "null";
	}

	let lv = size > 0 ? Math.floor(Math.log(size) / Math.log(1024)) : 0;
	let sizes = ["", "K", "M", "G", "T"];

	lv = Math.min(sizes.length, lv);
	
	let value = lv > 0 ? (size / Math.pow(1024, lv)).toFixed(2) : size;

	return value + " " + sizes[lv] + "B";
}

/**
 * Chaining multiple methods with promises, returns promise.
 * 
 * @param  {Object[]} opts
 * @param  {String|Function} opts.method Function or method name inside scope
 * @param  {Object} opts.scope Scope for method function
 * @param  {Array} opts.args Additional arguments for function
 * @return {Promise} Resolve with object { outArray: [promise outputs], rejected: 0..n count of rejected promise }
 * @member $common
 */
function chainPromises(opts) {
	return new Promise(resolve => {
		_chainPromisesInner(opts, resolve, [], 0);
	});
}

/**
 * Cancel event and his propagation.
 * 
 * @param  {Event} e
 * @member $common
 */
function cancelEvents(e) {
	if (e) {
		e.stopPropagation();
		e.preventDefault();
	}
}

/**
 * Converts css name to javascript style interpretation.
 * 
 * @param {String} value
 * @return {String} "z-index" -> zIndex
 * @member $common
 */
function cssNameToJS(value) {
	let parts = value.split("-");
	let output = "";

	parts.forEach((part, ind) => {
		output += !ind ? part : part[0].toUpperCase() + part.substr(1);
	});

	return output;
}

/**
 * Get value from object using JSON path.
 * 
 * @param  {Object} obj
 * @param  {String} path "key.subkey.keyxy", "key.subkey.key[5].keyYZ"
 * @param  {Object} [defValue] Default value if path does not exist
 * @return {Object} value from path|default value|null
 * @member $common
 */
function valueFromObject(obj, path, defValue) {
	if (arguments.length < 2) {
		return null;
	}

	let curObj = obj;
	let parts = path.split(".");

	parts.every(part => {
		part = part.trim();
		
		let arrayMatch = part.match(/\[\s*(\d+)\s*\]/);
		let isOk = false;

		if (arrayMatch) {
			let arrayObj = curObj[part.replace(arrayMatch[0], "")];
			let ind = parseFloat(arrayMatch[1]);

			if (Array.isArray(arrayObj) && ind >= 0 && ind < arrayObj.length) {
				curObj = arrayObj[ind];
				isOk = true;
			}
		}
		else if (isObject(curObj)) {
			curObj = curObj[part];
			isOk = true;
		}

		if (!isOk || typeof curObj === "undefined") {
			curObj = defValue || null;

			return false;
		}
		else {
			return true;
		}
	});

	return curObj;
}

/**
 * Format time duration in secods.
 * Output in format: hours:minutes:seconds.
 * 
 * @param  {Number} seconds Number of seconds
 * @return {String}
 * @member $common
 */
function timeDuration(seconds) {
	seconds = seconds || 0;

	let output = "";
	let days = Math.floor(seconds / (3600 * 24));
	seconds -= days * 3600 * 24;

	if (days) {
		output += days + "d ";
	}

	let hours = Math.floor(seconds / 3600);
	seconds -= hours * 3600;
	output += (hours < 10 ? "0" + hours : hours) + ":";

	let minutes = Math.floor(seconds / 60);
	output += (minutes < 10 ? "0" + minutes : minutes) + ":";
	seconds -= minutes * 60;

	output += (seconds < 10 ? "0" + seconds : seconds);
	
	return output;
}

/**
 * Compare two objects - returns array of differences between left -> right object.
 * If length is 0 -> there is no difference.
 * 
 * @param  {Object} leftObj
 * @param  {Object} rightObj
 * @return {Array}
 * @member $common
 */


/**
 * Return all occurences between left and right delimeter inside string value.
 * 
 * @param  {String} txt Input string
 * @param  {String} leftDelimeter  one or more characters
 * @param  {String} rightDelimeter one or more characters
 * @method match
 * @static
 * @return {Array}
 */
function match(txt, leftDelimeter, rightDelimeter) {
	let matches = [];
	let open = 0;
	let ldl = leftDelimeter.length;
	let rdl = rightDelimeter.length;
	let match = "";

	for (let i = 0; i < txt.length; i++) {
		let item = txt[i];
		let lpos = i - ldl + 1;
		let rpos = i - rdl + 1;

		// one sign - only check; more - check current + prev items to match leftDelimeter
		if ((ldl == 1 && item == leftDelimeter) || (ldl > 1 && (lpos >= 0 ? txt.substr(lpos, ldl) : "") == leftDelimeter)) {
			open++;

			if (open == 1) {
				continue;
			}
		}

		// same as left + remove
		if ((rdl == 1 && item == rightDelimeter) || (rdl > 1 && (rpos >= 0 ? txt.substr(rpos, rdl) : "") == rightDelimeter)) {
			open--;

			if (rdl > 1) {
				// remove rightDelimeter rest parts
				match = match.substr(0, match.length - rdl + 1);
			}
		}

		if (open > 0) {
			match += item;
		}

		if (!open && match.length) {
			matches.push(match);
			match = "";
		}
	}

	return matches;
}

/**
 * Split string with delimeter. Similar to string.split(), but keeps opening strings/brackets in the memory.
 * "5, {x:5, c: 6}, 'Roman, Peter'".split(",") => ["5", " {x:5", " c: 6}", " 'Roman", " Peter'"]
 * onix.split("5, {x:5, c: 6}, 'Roman, Peter'", ",") => ["5", "{x:5, c: 6}", "'Roman, Peter"]
 * 
 * @param  {String} txt Input string
 * @param  {String} delimeter one character splitter
 * @method match
 * @static
 * @return {Array}
 */
function split(txt, delimeter) {
	txt = txt || "";
	delimeter = delimeter || ",";

	let open = 0;
	let matches = [];
	let match = "";
	let strStart = false;
	let len = txt.length;

	for (let i = 0; i < len; i++) {
		let item = txt[i];

		switch (item) {
			case "'":
			case '"':
				if (strStart) {
					strStart = false;
					open--;
				}
				else {
					strStart = true;
					open++;
				}
				break;

			case "{":
			case "[":
				open++;
				break;

			case "}":
			case "]":
				open--;
				break;
		}

		// delimeter
		if (item == delimeter && !open) {
			if (match.length) {
				matches.push(match);
			}

			match = "";
		}
		else {
			match += item;
		}

		// end
		if (i == len - 1 && match.length) {
			matches.push(match);
		}
	}

	return matches;
}

/**
 * Object copy, from source to dest.
 *
 * @param  {Object} dest
 * @param  {Object} source
 * @member $common
 * @private
 */
function _objCopy(dest, source) {
	Object.keys(source).forEach(prop => {
		if (source.hasOwnProperty(prop)) {
			dest[prop] = cloneValue(source[prop]);
		}
	});
}

/**
 * Inner method for chaining promises.
 * 
 * @param  {Object[]} opts
 * @param  {String|Function} opts.method Function or method name inside scope
 * @param  {Object} opts.scope Scope for method function
 * @param  {Array} opts.args Additional arguments for function
 * @param  {Function} resolve Resolve callback for $promise
 * @param  {Array} outArray Array for output from all executed promises
 * @param  {Number} rejected Number of rejected promises
 * @private
 * @member $common
 */
function _chainPromisesInner(opts, resolve, outArray, rejected) {
	let firstItem = opts.shift();

	if (firstItem) {
		// string or function itself
		let fn;
		let error = false;

		switch (typeof firstItem.method) {
			case "string":
				if (!firstItem.scope || !(firstItem.method in firstItem.scope)) {
					error = true;
				}
				else {
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
			fn.apply(firstItem.scope || fn, firstItem.args || []).then((data) => {
				outArray.push(data);

				_chainPromisesInner(opts, resolve, outArray, rejected);
			}, (err) => {
				outArray.push(err);

				_chainPromisesInner(opts, resolve, outArray, rejected + 1);
			});
		}
		else {
			resolve({
				output: outArray,
				rejected: rejected
			});
		}
	}
	else {
		resolve({
			output: outArray,
			rejected: rejected
		});
	}
}

/**
 * Clone value without references.
 * 
 * @param  {Object} value Input value
 * @param  {Number} [lvl] Recursive threshold
 * @return {Object} cloned value
 * @private
 * @member $common
 */
function _cloneValue(value, lvl) {
	lvl = lvl || 0;

	// recursive call threshold
	if (lvl > 100) return null;

	switch (typeof value) {
		case "object":
			if (Array.isArray(value)) {
				// array
				let newArray = [];

				value.forEach(item => {
					newArray.push(_cloneValue(item, lvl + 1));
				});

				return newArray;
			}
			else if (value && value instanceof Date) {
				// date
				return new Date(value.getTime());
			}
			else if (isElement(value)) {
				// element
				return value;
			}
			else if (value) {
				// object
				let newObj = {};

				Object.keys(value).forEach(prop => {
					if (value.hasOwnProperty(prop)) {
						newObj[prop] = _cloneValue(value[prop], lvl + 1);
					}
				});

				return newObj;
			}
			else {
				// null
				return null;
			}

		case "undefined":
		case "boolean":
		case "function":
		case "number":
		case "string":
			return value;
	}
}

/**
 * Class for creating DOM elements and getting their references.
 * 
 * @class $dom
 */

/**
 * Create $dom from the configuration.
 *
 * @param  {Object} config
 * @param  {String} config.el Element name, default creates "div", for text node use "text"
 * @param  {Object} [config.attrs] Atributes
 * @param  {Object} [config.css] Object with css styles
 * @param  {Array|Object} [config.events] Bind events {event, fn}
 * @param  {Array|Object} [config.child] Child nodes
 * @param  {String|Array} [config.class] Add CSS class/es
 * @param  {Object} [exported] to this object will be exported all marked elements (_exported attr.)
 * @return {Element}
 * @member $dom
 */
function create(config, exported) {
	let elName = config.el || "div";
	let el;

	if (elName == "text") {
		el = document.createTextNode("");
	}
	else {
		el = document.createElement(elName);
	}

	Object.keys(config).forEach(key => {
		let value;

		switch (key) {
			case "el":
				break;

			case "attrs":
				value = config.attrs;

				if (value && typeof value === "object" && !Array.isArray(value)) {
					Object.keys(value).forEach(attr => {
						el.setAttribute(attr, value[attr]);
					});
				}
				break;

			case "css":
				value = config.css;

				if (value && typeof value === "object" && !Array.isArray(value)) {
					Object.keys(value).forEach(name => {
						el.style[cssNameToJS(name)] = value[name];
					});
				}
				break;

			case "events":
				value = config.events;

				if (!Array.isArray(value)) {
					value = [value];
				}
				
				value.forEach(item => {
					el.addEventListener(item.event, item.fn);
				});
				break;

			case "child":
				value = config.child;

				if (!Array.isArray(value)) {
					value = [value];
				}
				
				value.forEach(child => {
					el.appendChild(create(child, exported));
				});
				break;

			case "_exported":
				exported[config._exported] = el;
				break;

			case "class":
				value = config.class;

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
}

/**
 * Get element from the document.
 *
 * @param  {String|Array} els Els = "" -> element; [x, y] -> { x: el, y: el }; [{sel: "div", name: "xyz"}] -> { "xyz": div el }
 * @param  {Object} [parent]
 * @return {Object|Element}
 * @member $dom
 */


function load(cb) {
	if (typeof cb !== "function") return;

	if (document.readyState == "loading") {
		document.addEventListener("DOMContentLoaded", () => {
			cb();
		});
	}
	else {
		cb();
	}
}

/**
 * Support class for location operations.
 * 
 * @class $location
 */

/**
 * Page refresh.
 *
 * @member $location
 */


/**
 * Create a new search url. This method appends ? to the start of the url.
 * 
 * @param  {Object} obj
 * @return {String}
 * @member $location
 */


/**
 * Object to url.
 * 
 * @param  {Array|Object} { name: x, value: y} | obj Mapping key -> name, value -> value.
 * @return {String}
 * @member $location
 */
function objToURL(obj) {
	let url = [];

	if (Array.isArray(obj)) {
		obj.forEach(item => {
			url.push(encodeURIComponent(item.name) + "=" + encodeURIComponent(item.value));
		});
	}
	else if (typeof obj === "object") {
		Object.keys(obj).forEach(key => {
			url.push(encodeURIComponent(key) + "=" + encodeURIComponent(obj[key]));
		});
	}

	return url.join("&");
}

/**
 * Get or set new url search. obj -> set new url from obj; !obj -> create obj from search part of url.
 *
 * @param  {Object} [obj]
 * @return {Object}
 * @member $location
 */


/**
 * Get current location - path + search (without hash).
 *
 * @return {String}
 * @member $location
 */
function get$1() {
	return location.pathname + location.search;
}

/**
 * Decode value from URL.
 * 
 * @param  {String} value Input value
 * @return {String}
 * @member $location
 */
function decodeSearchValue(value) {
	return decodeURIComponent(value.replace(/\+/g, " "));
}

/**
 * Parse search part of the URL.
 * 
 * @param  {String} [query] Optinal query, default is location.search
 * @return {Object} Object with keys and values from the search
 * @member $location
 */
function parseSearch(query) {
	// read
	query = query || location.search.substring(1);

	let match;
	let search = /([^&=]+)=?([^&]*)/g;
	let output = {};

	while (match = search.exec(query)) {
		let key = decodeSearchValue(match[1]);
		let value = decodeSearchValue(match[2]);

		if (key in output) {
			if (!Array.isArray(output[key])) {
				output[key] = [output[key]];
			}

			output[key].push(value);
		}
		else {
			output[key] = value;
		}
	}

	return output;
}

/**
 * Parse URL to object.
 * 
 * @param {String} url Input URL
 * @param {Object} [optsArg] optional configuration
 * @param {Boolean} [optsArg.autoNumber = false] find number in string and convert it
 * @param {Object} [optsArg.hints = {}] { key name : convert operation }, operations: "json" value -> object, "number" -> value -> number, fn(value) -> value
 * @return {Object} parse url to object with keys like host, protocol etc.
 * @member $location
 */
function parseURL(url, optsArg) {
	let opts = {
		autoNumber: false,
		hints: {}
	};

	let obj = {
		protocol: "",
		host: "",
		port: null,
		path: "",
		search: null,
		hash: ""
	};

	for (let key in optsArg) {
		opts[key] = optsArg[key];
	}

	url = (url || "").trim();

	// protocol
	let test = url.match(/([a-zA-Z0-9]+):\/\//);

	if (test) {
		obj.protocol = test[1];
		url = url.replace(test[0], "");
	}

	// host
	test = url.match(/^[^?:#\/]+/);

	if (test) {
		obj.host = test[0];
		url = url.replace(obj.host, "");
	}

	// port
	test = url.match(/^:([0-9]+)[\/?#]?/);

	if (test) {
		obj.port = parseFloat(test[1]);
		url = url.replace(":" + test[1], "");
	}

	// path
	test = url.match(/^[^?#]+/);

	if (test) {
		obj.path = test[0];
		url = url.replace(obj.path, "");
	}

	// search
	test = url.match(/\?([^#]+)/);

	if (test) {
		let searchObj = parseSearch(test[1]);

		// update
		Object.keys(searchObj).forEach(key => {
			let value = searchObj[key];

			if (key in opts.hints) {
				let hintValue = opts.hints[key];

				if (typeof hintValue === "string") {
					switch (opts.hints[key]) {
						case "json":
							try {
								searchObj[key] = JSON.parse(value);
							}
							catch (err) {
								console.error(err);
							}
							break;

						case "number":
							searchObj[key] = parseFloat(value);
							break;
					}
				}
				else if (typeof hintValue === "function") {
					searchObj[key] = hintValue(value);
				}
			}
			else if (opts.autoNumber) {
				let numTest = value.match(/^[-]?[0-9]+\.?[0-9e]*$/);

				if (numTest) {
					let num = parseFloat(numTest[0]);

					searchObj[key] = isNaN(num) ? value : num;
				}
			}
		});

		obj.search = searchObj;

		url = url.replace(test[0], "");
	}

	// hash
	test = url.match(/#(.*)$/);

	if (test) {
		obj.hash = test[1];
	}

	return obj;
}

/**
 * XMLHttpRequest cover class.
 * 
 * @class $http
 */

/**
 * Request types.
 *
 * @property {Object}
 * @param {Number} JSON
 * @param {Number} FORM_DATA
 * @member $http
 */
const POST_TYPES = {
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
const METHOD = {
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
 * @return {Promise}
 * @member $http
 */
function createRequest(config) {
	return new Promise((resolve, reject) => {
		config = config || {};

		let request = new XMLHttpRequest();
		let method = config.method || METHOD.GET;
		let url = config.url || "";

		if (!url) {
			reject();
			return;
		}

		url = _updateURL(url, config.getData);

		request.onerror = (err) => { reject(err); };
		request.open(method, url, true);
		request.onreadystatechange = () => {
			if (request.readyState == 4) {
				let responseData = request.responseText || "";
				let responseType = request.getResponseHeader("Content-Type") || "";
				let promiseData = null;

				if (responseType.indexOf("application/json") != -1) {
					promiseData = responseData.length ? JSON.parse(responseData) : {};
				}
				else {
					promiseData = responseData;
				}
				
				let promiseObj = {
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
				}
				else {
					reject(promiseObj);
				}
			}
		};

		try {
			// add headers
			let headers = config.headers;
			
			if (isObject(headers)) {
				Object.keys(headers).forEach(headerName => {
					request.setRequestHeader(headerName, headers[headerName]);
				});
			}

			if (method == METHOD.GET) {
				request.setRequestHeader('Accept', 'application/json');
			}

			let type = config.postType || POST_TYPES.JSON;

			if (config.postData && type == POST_TYPES.JSON) {
				request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
				request.send(JSON.stringify(config.postData));
			}
			else if (config.postData && type == POST_TYPES.FORM_DATA) {
				request.send(_preparePostData(config.postData));
			}
			else {
				request.send();
			}
		}
		catch (err) {
			reject(err);
		}
	});
}

/**
 * https://developer.mozilla.org/en-US/docs/Web/Guide/Using_FormData_Objects.
 * Prepare post data.
 *
 * @param  {Object|Array} data { name, value }
 * @return {Object}
 * @member $http
 * @private
 */
function _preparePostData(data) {
	let formData = new FormData();

	if (data) {
		if (Array.isArray(data)) {
			data.forEach(item => {
				formData.append(item.name, item.value);
			});
		}
		else {
			Object.keys(data).forEach(key => {
				formData.append(key, data[key]);
			});
		}
	}

	return formData;
}

/**
 * Update URL using get data.
 *
 * @param  {String} url
 * @param  {Array} data { name, value }
 * @return {String}
 * @member $http
 * @private
 */
function _updateURL(url, data) {
	let getURL = objToURL(data);

	if (getURL) {
		url += (url.indexOf("?") == -1 ? "?" : "") + getURL;
	}

	return url;
}

/**
 * Language support, string translation with support for message format syntax.
 * 
 * @class $i18n
 */

/**
 * Czech alphabet with diacritic.
 * 
 * @type {String}
 */
const CZECH_ALPHABET = "aábcččdďeěéfghiíjklmnoópqrřtsštťuůúvwxyz";

class $i18n {
	constructor(conf) {
		/**
		 * Conf with delimeters.
		 * 
		 * @type {Object}
		 */
		this._conf = Object.assign({
			leftDelimeter: "{",
			rightDelimeter: "}"
		}, conf);

		/**
		 * All langs data.
		 *
		 * @type {Object}
		 * @member $i18n
		 * @private
		 */
		this._langs = {};

		/**
		 * Current language-
		 *
		 * @type {String}
		 * @member $i18n
		 * @private
		 */
		this._currentLang = "";
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
	_(key, replace) {
		let lObj = this._langs[this._currentLang];
		let translate = key || "";

		if (lObj) {
			let parts = key.split(".");
			let len = parts.length;

			parts.every((item, ind) => {
				if (item in lObj) {
					lObj = lObj[item];

					if (ind == len - 1) {
						translate = lObj;

						return false;
					}
				}
				else {
					return false;
				}

				// go on
				return true;
			});
		}

		return this._transReplace(translate, replace);
	}

	/**
	 * Add a new language.
	 *
	 * @param {String} lang Language key
	 * @param {Object} data
	 * @member $i18n
	 * @method addLanguage
	 */
	addLanguage(lang, data) {
		if (!lang || !data) return;

		if (!this._langs[lang]) {
			this._langs[lang] = {};
		}

		// merge
		Object.keys(data).forEach(key => {
			this._langs[lang][key] = data[key];
		});
	};

	/**
	 * Set new language by his key.
	 *
	 * @param {String} lang Language key
	 * @member $i18n
	 * @method setLanguage
	 */
	setLanguage(lang) {
		this._currentLang = lang || "";
	}

	/**
	 * Get current language key.
	 *
	 * @return {String} Language key
	 * @member $i18n
	 * @method getLanguage
	 */
	getLanguage(lang) {
		return this._currentLang;
	}

	/**
	 * Get all languages keys.
	 *
	 * @return {Array[String]} Languages keys
	 * @member $i18n
	 * @method getAllLanguages
	 */
	getAllLanguages(lang) {
		return Object.keys(this._langs);
	}

	/**
	 * Load language from the file.
	 *
	 * @param  {String} lang Language key
	 * @param  {String} url  Path to the file
	 * @return {Promise}
	 * @member $i18n
	 * @method loadLanguage
	 */
	loadLanguage(lang, url) {
		return new Promise((resolve, reject) => {
			createRequest({
				url: url
			}).then(okData => {
				this.addLanguage(lang, okData.data);

				resolve();
			}, errorData => {
				reject(errorData);
			});
		});
	}

	/**
	 * Compare two strings with czech diacritic.
	 * 
	 * @param  {String} a String to compare
	 * @param  {String} b String to compare
	 * @return {Number} Results
	 */
	compareCzech(a, b) {
		a = a.toLowerCase();
		b = b.toLowerCase();

		let short = Math.min(a.length, b.length);
		let output = 0;

		for (let i = 0; i < short; i++) {
			let as = CZECH_ALPHABET.indexOf(a[i]);
			let bs = CZECH_ALPHABET.indexOf(b[i]);

			if (as < bs) {
				return -1;
			}
			else if (as > bs) {
				return 1;
			}
		}

		return output;
	}

	/**
	 * Replace translated text by object. This functions is implementation of message format object replace inside the string.
	 *
	 * @param  {String} translate
	 * @param  {Object} [replace] Replace all {} in the string
	 * @return {String}
	 * @member $i18n
	 * @private
	 */
	_transReplace(translate, replace) {
		translate = translate || "";
		replace = replace || {};

		// message format delimeters
		let replaceParts = match(translate, this._conf.leftDelimeter, this._conf.rightDelimeter);

		if (replaceParts.length) {
			let finalReplace = {};

			replaceParts.forEach(part => {
				let parts = part.split(",");

				if (!parts.length) return;

				// first is variable name
				let name = parts.shift().trim();
				let multiPartsObj = {};
				let multiParts = parts.join(" ").match(/[a-zA-Z0-9_]+{[^}]*}/g);

				if (multiParts) {
					multiParts.forEach(mpart => {
						let mpartSplits = mpart.match(/([a-zA-Z0-9_]+){([^}]*)/);

						multiPartsObj[mpartSplits[1].trim()] = mpartSplits[2].trim();
					});
				}

				let replaceValue = name in replace ? replace[name] : "";

				if (typeof replaceValue === "number" && Object.keys(multiPartsObj).length) {
					let multiKey;

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

				finalReplace[this._conf.leftDelimeter + part + this._conf.rightDelimeter] = replaceValue;
			});

			Object.keys(finalReplace).forEach(key => {
				translate = translate.replaceAll(key, finalReplace[key]);
			});
		}

		return translate;
	}
}

/**
 * Browser features.
 * 
 * @class $features
 */

/**
 * FileReader is available.
 *
 * @member $features
 * @type {Boolean}
 */
const FILE_READER = "FileReader" in window;

/**
 * Canvas is available.
 *
 * @member $features
 * @type {Boolean}
 */
const CANVAS = !!document.createElement("canvas").getContext;

// local storage
let locStor = true;

try {
	window.localStorage;
}
catch (err) {
	locStor = false;
}

/**
 * Local storage is available.
 *
 * @member $features
 * @type {Boolean}
 */
const LOCAL_STORAGE = locStor;

/**
 * Media queries are available.
 *
 * @member $features
 * @type {Boolean}
 */
const MEDIA_QUERY = "matchMedia" in window && "matches" in window.matchMedia("(min-width: 500px)");

// mouse wheel event name
let mouseWheel = "DOMMouseScroll";

if ("onwheel" in window) {
	mouseWheel = "wheel";
}
else if ("onmousewheel" in window) {
	mouseWheel = "mousewheel";
}

/**
 * Event name for mouse wheel.
 *
 * @member $features
 * @type {String}
 */
const MOUSE_WHEEL_EVENT_NAME = mouseWheel;


var $features = Object.freeze({
	FILE_READER: FILE_READER,
	CANVAS: CANVAS,
	LOCAL_STORAGE: LOCAL_STORAGE,
	MEDIA_QUERY: MEDIA_QUERY,
	MOUSE_WHEEL_EVENT_NAME: MOUSE_WHEEL_EVENT_NAME
});

const PAGES = [
	{
		id: "home",
		name: "Home page",
		url: "/"
	},
	{
		id: "anonymizer",
		name: "Anonymizer",
		url: "/anonymizer"
	},
	{
		id: "crop",
		name: "Crop",
		url: "/crop"
	},
	{
		id: "utils",
		name: "Utils",
		url: "/utils"
	},
	{
		id: "test",
		name: "Test",
		url: "/test"
	},
	{
		id: "docs",
		name: "Documentation",
		url: "/docs"
	}
];

class Menu {
	constructor(activePage) {
		this._create(activePage);
	}

	_create(activePage) {
		let pagesLi = [];

		PAGES.forEach((page, ind) => {
			let pageObj = {
				el: "li",
				child: [{
					el: "a",
					href: page.url,
					innerHTML: page.name
				}]
			};

			if ((!activePage && !ind) || (page.id == activePage)) {
				pageObj["class"] = "active";
				pageObj.child[0].href = "javascript:void(0)";
			}

			pagesLi.push(pageObj);
		});

		let menuEl = this._createFromObj({
			el: "div",
			"class": ["navbar", "navbar-default"],
			child: [{
				el: "div",
				"class": "container",
				child: [{
					el: "div",
					"class": "navbar-header",
					child: [{
						el: "a",
						"class": "navbar-brand",
						href: "/",
						innerHTML: "Onix test website"
					}]
				}, {
					el: "div",
					"class": ["navbar-collapse", "collapse"],
					id: "navbar",
					child: [{
						el: "ul",
						"class": ["nav", "navbar-nav"],
						child: pagesLi
					}]
				}]
			}]
		});

		document.body.insertBefore(menuEl, document.body.firstChild);

		// old browsers menu fix
		let hasMediaQuery = $features ? MEDIA_QUERY : "matchMedia" in window && "matches" in window.matchMedia("(min-width: 500px)");
		
		if (!hasMediaQuery) {
			document.body.classList.add("no-media-query");
		}
	}

	_createFromObj(config) {
		let el = document.createElement(config.el);

		Object.keys(config).forEach(key => {
			let value;

			switch (key) {
				case "el":
					break;

				case "child":
					value = config.child;

					if (!Array.isArray(value)) {
						value = [value];
					}
					
					value.forEach(child => {
						el.appendChild(this._createFromObj(child));
					}, this);
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
	}
}

/**
 * DOM manipulation in the style of jquery.
 * 
 * @class $myQuery
 * @chainable
 * @param {String|HTMLElement|Array} value
 * @param {$myQuery|HTMLElement} [parent]
 * @member $myQuery
 */
class $myQuery {
	constructor(value, parent) {
		this._els = this._getElementsFromValue(value, parent);
		this._eventsCache = {};

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
	_getElementsFromValue(value, parent) {
		value = Array.isArray(value) ? value : [value];

		let els = [];

		value.forEach(val => {
			if (typeof val === "string") {
				if (val.match(/[<]\s*[a-zA-Z0-9]+[^>]*[>]/)) {
					let df = document.createDocumentFragment();
					let divEl = document.createElement("div");

					divEl.insertAdjacentHTML("afterbegin", val);

					// copy child from div -> fragment
					while (divEl.firstChild) {
						df.appendChild(divEl.firstChild);
					}

					els.push(df);
				}
				else {
					// selector
					if (parent && parent instanceof $myQuery) {
						parent = parent.getEl();
					}

					parent = (parent && parent instanceof Element) || parent == window || parent == document ? parent : document;

					let selValues = parent.querySelectorAll(val);

					if (selValues) {
						els = els.concat(Array.prototype.slice.call(selValues));
					}
				}

				return;
			}
			else if (val && val instanceof $myQuery) {
				val = val.getEl();
			}

			if (isElement(val) || val == document || val == window) {
				els.push(val);
			}
		});

		return els;
	}

	/**
	 * Operation on elements.
	 * 
	 * @param  {Function} cb
	 * @param  {Function} [scope]
	 * @member $myQuery
	 * @private
	 * @method _operation
	 */
	_operation(cb, scope) {
		// NodeList -> Array
		if (!Array.isArray(this._els)) {
			this._els = Array.prototype.slice.call(this._els);
		}

		this._els.forEach((item, ind) => {
			cb.apply(scope || cb, [item, ind]);
		});
	}

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
	_setGetAll(attr, newValue) {
		if (typeof attr !== "undefined") {
			if (typeof newValue !== "undefined") {
				this._operation(item => {
					item[attr] = newValue;
				});

				return this;
			}
			else {
				let values = [];

				this._operation(item => {
					values.push(item[attr]);
				});

				if (!values.length) {
					return null;
				}
				else if (values.length == 1) {
					return values[0];
				}
				else {
					return values;
				}
			}
		}
		else {
			return this;
		}
	}

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
	_bindEvent(eventName, cb, scope) {
		this._operation(item => {
			// create new item in events cache
			if (!this._eventsCache[eventName]) {
				this._eventsCache[eventName] = [];
			}

			let eventObj = {
				item: item,
				cb: cb,
				bindFn: event => {
					cb.apply(scope || item, [event, item, this]);
				}
			};

			this._eventsCache[eventName].push(eventObj);

			item.addEventListener(eventName, eventObj.bindFn);
		});

		return this;
	}

	/**
	 * Get original element.
	 *
	 * @param  {Number} [ind]
	 * @return {HTMLElement}
	 * @member $myQuery
	 * @method get
	 */
	get(ind) {
		ind = ind || 0;

		if (ind > this._els.length) {
			return null;
		}
		else {
			return this._els[ind];
		}
	}

	/**
	 * Get original element.
	 *
	 * @param  {Number} [ind]
	 * @return {HTMLElement}
	 * @member $myQuery
	 * @method getEl
	 */
	getEl(ind) {
		return this.get(ind);
	}

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
	attr(name, newValue) {
		if (typeof name !== "undefined") {
			if (typeof newValue !== "undefined") {
				this._operation(item => {
					item.setAttribute(name, newValue);
				});

				return this;
			}
			else {
				let values = [];

				this._operation(item => {
					values.push(item.getAttribute(name));
				});

				if (!values.length) {
					return null;
				}
				else if (values.length == 1) {
					return values[0];
				}
				else {
					return values;
				}
			}
		}
		else {
			return this;
		}
	}

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
	css(name, newValue) {
		if (typeof name !== "undefined") {
			if (typeof newValue !== "undefined") {
				this._operation(item => {
					item.style[cssNameToJS(name)] = newValue;
				});

				return this;
			}
			else if (typeof name === "object" && !Array.isArray(name)) {
				Object.keys(name).forEach(key => {
					this._operation(item => {
						item.style[cssNameToJS(key)] = name[key];
					});
				});

				return this;
			}
			else {
				let el = this.getEl();

				return el ? el.style[cssNameToJS(name)] : null;
			}
		}
		else {
			return this;
		}
	}

	/**
	 * Get or set src.
	 * 
	 * @param  {String} [newValue]
	 * @return {String}
	 * @member $myQuery
	 * @method src
	 */
	src(newValue) {
		return this._setGetAll("src", newValue);
	}

	/**
	 * Hide element.
	 * 
	 * @chainable
	 * @member $myQuery
	 * @method hide
	 */
	hide() {
		return this.css("display", "none");
	}

	/**
	 * Show element.
	 *
	 * @chainable
	 * @param  {String} [displayStyle]
	 * @member $myQuery
	 * @method show
	 */
	show(displayStyle) {
		return this.css("display", displayStyle || "");
	}

	/**
	 * Get or set value.
	 *
	 * @chainable
	 * @param  {String} [newValue]
	 * @return {String}
	 * @member $myQuery
	 * @method val
	 */
	val(newValue) {
		return this._setGetAll("value", newValue);
	}

	/**
	 * Get or set HTML.
	 * 
	 * @param  {String} [newValue]
	 * @return {String}
	 * @member $myQuery
	 * @method html
	 */
	html(newValue) {
		return this._setGetAll("innerHTML", newValue);
	}

	/**
	 * Add CSS class.
	 *
	 * @chainable
	 * @param  {String} className
	 * @member $myQuery
	 * @method addClass
	 */
	addClass(className) {
		this._operation(item => {
			item.classList.add(className);
		});

		return this;
	}

	/**
	 * Remove CSS class.
	 *
	 * @chainable
	 * @param  {String} className
	 * @member $myQuery
	 * @method removeClass
	 */
	removeClass(className) {
		this._operation(item => {
			item.classList.remove(className);
		});

		return this;
	}

	/**
	 * Toggle CSS class.
	 *
	 * @chainable
	 * @param  {String} className
	 * @member $myQuery
	 * @method toggleClass
	 */
	toggleClass(className) {
		this._operation(item => {
			item.classList.toggle(className);
		});

		return this;
	}

	/**
	 * Get width.
	 * 
	 * @return {Number}
	 * @member $myQuery
	 * @method width
	 */
	width() {
		let width = 0;

		this._operation(item => {
			width += item.offsetWidth;
		});

		return width;
	}

	/**
	 * Get height.
	 * 
	 * @return {Number}
	 * @member $myQuery
	 * @method height
	 */
	height() {
		let height = 0;

		this._operation(item => {
			height += item.offsetHeight;
		});

		return height;
	}

	/**
	 * Click event.
	 *
	 * @chainable
	 * @param  {Function} cb
	 * @param  {Function} [scope]
	 * @member $myQuery
	 * @method click
	 */
	click(cb, scope) {
		return this._bindEvent("click", cb, scope);
	}

	/**
	 * Change event.
	 *
	 * @chainable
	 * @param  {Function} cb
	 * @param  {Function} [scope]
	 * @member $myQuery
	 * @method change
	 */
	change(cb, scope) {
		return this._bindEvent("change", cb, scope);
	}

	/**
	 * Mouse enter event.
	 *
	 * @chainable
	 * @param  {Function} cb
	 * @param  {Function} [scope]
	 * @member $myQuery
	 * @method mouseenter
	 */
	mouseenter(cb, scope) {
		return this._bindEvent("mouseenter", cb, scope);
	}

	/**
	 * Mouse leave event.
	 *
	 * @chainable
	 * @param  {Function} cb
	 * @param  {Function} [scope]
	 * @member $myQuery
	 * @method mouseleave
	 */
	mouseleave(cb, scope) {
		return this._bindEvent("mouseleave", cb, scope);
	}

	/**
	 * Mouse move event.
	 *
	 * @chainable
	 * @param  {Function} cb
	 * @param  {Function} [scope]
	 * @member $myQuery
	 * @method mouseleave
	 */
	mousemove(cb, scope) {
		return this._bindEvent("mousemove", cb, scope);
	}

	/**
	 * Mouse move event.
	 *
	 * @chainable
	 * @param  {Function} cb
	 * @param  {Function} [scope]
	 * @member $myQuery
	 * @method mouseleave
	 */
	mousewheel(cb, scope) {
		return this._bindEvent("DOMMouseScroll", cb, scope)._bindEvent("mousewheel", cb, scope);
	}

	/**
	 * Key down event.
	 *
	 * @chainable
	 * @param  {Function} cb
	 * @param  {Function} [scope]
	 * @member $myQuery
	 * @method keydown
	 */
	keydown(cb, scope) {
		return this._bindEvent("keydown", cb, scope);
	}

	/**
	 * Key up event.
	 *
	 * @chainable
	 * @param  {Function} cb
	 * @param  {Function} [scope]
	 * @member $myQuery
	 * @method keyup
	 */
	keyup(cb, scope) {
		return this._bindEvent("keyup", cb, scope);
	}

	/**
	 * Key press event.
	 *
	 * @chainable
	 * @param  {Function} cb
	 * @param  {Function} [scope]
	 * @member $myQuery
	 * @method keypress
	 */
	keypress(cb, scope) {
		return this._bindEvent("keypress", cb, scope);
	}

	/**
	 * Blur event.
	 *
	 * @chainable
	 * @param  {Function} cb
	 * @param  {Function} [scope]
	 * @member $myQuery
	 * @method blur
	 */
	blur(cb, scope) {
		return this._bindEvent("blur", cb, scope);
	}

	/**
	 * Focus event.
	 *
	 * @chainable
	 * @param  {Function} cb
	 * @param  {Function} [scope]
	 * @member $myQuery
	 * @method focus
	 */
	focus(cb, scope) {
		return this._bindEvent("focus", cb, scope);
	}

	/**
	 * Each.
	 *
	 * @chainable
	 * @param  {Function} cb
	 * @param  {Function} [scope]
	 * @member $myQuery
	 * @method each
	 */
	each(cb, scope) {
		this._operation((item, ind) => {
			cb.apply(scope || cb, [item, ind]);
		});

		return this;
	}

	/**
	 * Foreach.
	 *
	 * @chainable
	 * @param  {Function} cb
	 * @param  {Function} [scope]
	 * @member $myQuery
	 * @method forEach
	 */
	forEach(cb, scope) {
		return this.each(cb, scope);
	}

	/**
	 * Remove element.
	 *
	 * @chainable
	 * @member $myQuery
	 * @method remove
	 */
	remove() {
		this._operation(item => {
			item.parentNode.removeChild(item);
		});

		return this;
	}

	/**
	 * Append another element to this one.
	 *
	 * @chainable
	 * @param {HTMLElement|$myQuery|String} child
	 * @member $myQuery
	 * @method  append
	 */
	append(child) {
		child = this._getElementsFromValue(child);

		if (child.length) {
			this._operation((item, ind) => {
				let appChild = ind ? child[0].cloneNode(true) : child[0];

				item.appendChild(appChild);
			});
		}

		return this;
	}

	/**
	 * Prepend element.
	 *
	 * @chainable
	 * @param {HTMLElement|$myQuery|string} child
	 * @member $myQuery
	 * @method prepend
	 */
	prepend(child) {
		child = this._getElementsFromValue(child);

		if (child.length) {
			this._operation((item, ind) => {
				let prepChild = ind ? child[0].cloneNode(true) : child[0];

				item.insertBefore(prepChild, item.firstChild);
			});
		}

		return this;
	}

	/**
	 * Insert current element before element.
	 *
	 * @chainable
	 * @param {HTMLElement|$myQuery|string} beforeEl
	 * @member $myQuery
	 * @method prepend
	 */
	insertBefore(beforeEl) {
		beforeEl = this._getElementsFromValue(beforeEl);

		let el = this.getEl();

		if (el && beforeEl.length) {
			beforeEl[0].parentNode.insertBefore(el, beforeEl[0]);
		}

		return this;
	}

	/**
	 * Empty element - clear all its children.
	 * Much faster than innerHTML = "".
	 * 
	 * @chainable
	 * @member $myQuery
	 * @method empty
	 */
	empty() {
		this._operation(item => {
			while (item.firstChild) {
				item.removeChild(item.firstChild);
			}
		});

		return this;
	}

	/**
	 * Get all elements length.
	 * 
	 * @return {Number}
	 * @member $myQuery
	 * @method len
	 */
	len() {
		return this._els.length;
	}

	/**
	 * Get parent node.
	 * 
	 * @return {$myQuery} new instance with parent node
	 * @member $myQuery
	 * @method parent
	 */
	parent() {
		let el = this.getEl();

		return el ? new this(el) : null;
	}

	/**
	 * Get children.
	 * 
	 * @return {Array} Children array
	 * @member $myQuery
	 * @method children
	 */
	children() {
		let el = this.getEl();

		return el ? el.children : [];
	}

	/**
	 * Get scroll top offset.
	 * 
	 * @return {Number} Scroll top in [px]
	 * @member $myQuery
	 * @method scrollTop
	 */
	scrollTop() {
		let el = this.getEl();
		let docOffset = document.body.scrollTop;

		return el ? el.scrollTop + docOffset : docOffset + 0;
	}

	/**
	 * Get scroll left offset.
	 * 
	 * @return {Number} Scroll left in [px]
	 * @member $myQuery
	 * @method scrollLeft
	 */
	scrollLeft() {
		let el = this.getEl();
		let docOffset = document.body.scrollLeft;

		return el ? el.scrollLeft + docOffset : docOffset + 0;
	}

	/**
	 * Bind event to the element.
	 * 
	 * @param {String} eventType click, mousedown etc.
	 * @param {Function} handler Event callback function
	 * @param {Object} [scope] Handler scope
	 * @chainable
	 * @member $myQuery
	 * @method bind
	 */
	bind(eventType, handler, scope) {
		if (eventType && typeof handler === "function") {
			this._bindEvent(eventType, handler, scope);
		}

		return this;
	}

	/**
	 * Unbind events.
	 * 
	 * @param {String} eventType click, mousedown etc.
	 * @param {Function} [handler] Event callback function
	 * @chainable
	 * @member $myQuery
	 * @method unbind
	 */
	unbind(eventType, handler) {
		if (eventType) {
			let all = this._eventsCache[eventType] || [];
			let len = all.length - 1;

			for (let i = len; i >= 0; i--) {
				let eventItem = all[i];

				if (!handler || (typeof handler === "function" && eventItem.cb == handler)) {
					eventItem.item.removeEventListener(eventType, eventItem.bindFn);

					// remove
					all.splice(i, 1);
				}
			}
		}

		return this;
	}
}

/**
 * Quick acces to myQuery and DOM manipulation.
 *
 * @param  {String|HTMLElement|Array} value
 * @param {HTMLElement|$myQuery} [parent] Parent node
 * @return {$myQuery}
 * @member onix
 * @property {Function}
 */
function element(value, parent) {
	return new $myQuery(value, parent);
}

/**
 * Filter - for template and JS.
 *
 * @class $filter
 */
class $filter {
	constructor() {
		this._filters = [];
	}

	/**
	 * Main function - get/set.
	 * 
	 * @param  {String} name Filter name
	 * @param  {Function} [fn] Filter cb function
	 * @return {String|Function}
	 */
	filter(name, fn) {
		if (typeof name === "string" && typeof fn === "function") {
			this._filters.push({
				name,
				fn: fn()
			});
		}
		else if (typeof name === "string" && arguments.length == 1) {
			let findFilter = this._filters.filter(i => i.name == name);
			
			return (findFilter.length ? findFilter[0].fn : value => value);
		}
	}
}

let filter = new $filter();

/**
 * Filter - lowercase functionality.
 */
filter.filter("lowercase", () => {
	/**
	 * Input is transformatted to lowercase.
	 *
	 * @method lowercase
	 * @param  {String} input
	 * @return {String|Object}
	 * @member $filterLowercase
	 */
	return (input) => {
		if (typeof input === "string") {
			return input.toLowerCase();
		}
		else {
			return input;
		}
	};
});

/**
 * Filter - uppercase functionality.
 */
filter.filter("uppercase", () => {
	/**
	 * Input is transformatted to uppercase.
	 *
	 * @method uppercase
	 * @param  {String} input
	 * @return {String|Object}
	 * @member $filterUppercase
	 */
	return (input) => {
		if (typeof input === "string") {
			return input.toUpperCase();
		}
		else {
			return input;
		}
	};
});

/**
 * Filter - json stringify functionality.
 *
 * @class $filterJson
 */
filter.filter("json", () => {
	/**
	 * Input object is stringfied.
	 *
	 * @method json
	 * @param {Object} obj Input object
	 * @param {Number} [spacing] Number of spaces per indetation
	 * @return {String}
	 * @member $filterJson
	 */
	return (obj, spacing) => {
		if (typeof obj === "object") {
			let space = null;

			if (spacing) {
				spacing = parseInt(spacing, 10);
				space = isNaN(spacing) ? null : spacing;
			}

			return JSON.stringify(obj, null, space);
		}
		else {
			return obj;
		}
	};
});

/**
 * Get filter function by filter name.
 * 
 * @param  {String} name Filter name
 * @return {Function}
 */
var filter$1 = function(name) {
	return filter.filter(name);
};

/**
 * Handle templates, binds events - syntax similar to moustache and angular template system.
 * $myQuery is used for cache record.
 *
 * @class $template
 */

class $template {
	constructor(conf) {
		/**
		 * Template conf.
		 *
		 * @type {Object}
		 * @member $template
		 * @private
		 */
		this._conf = {
			left: "{{",
			right: "}}",
			elEventPrefix: "data-event-",
			elDataBind: "data-bind"
		};

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
			VARIABLE: /^[$_a-zA-Z][$_a-zA-Z0-9]+$/,
			NUMBERS: /^[-]?[0-9]+[.]?([0-9e]+)?$/,
			STRINGS: /^["'][^"']+[\"']$/
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
	 * Update template conf.
	 * 
	 * @param  {Object} conf New conf
	 */
	updateConf(conf) {
		this._conf = Object.assign(this._conf, conf);
	}
	
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
		if (!key || !data) return "";

		let tmpl = this.get(key);
		let all = match(tmpl, this._conf.left, this._conf.right);

		all.forEach(item => {
			let itemSave = this._conf.left + item + this._conf.right;

			// filter
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

						let filterCb = filter$1(filterName);
						filterValue = filterCb.apply(filterCb, args);
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
		let allElements = element("*", root);

		if (allElements.len()) {
			let newEls = {};

			allElements.forEach(item => {
				let attrs = this._getAttributes(item);

				attrs.forEach(attr => {
					if (attr.isBind) {
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
	 * @return {Promise}
	 * @member $template
	 * @method load
	 */
	load(key, path) {
		return new Promise((resolve, reject) => {
			createRequest({
				url: path
			}).then(okData => {
				this.add(key, okData.data);

				resolve();
			}, errorData => {
				reject(errorData);
			});
		});
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

		let match$$1 = value.match(/^\s*([a-zA-Z0-9_$]+)/);

		if (match$$1) {
			return match$$1[1];
		}
		else {
			return "";
		}
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
		value = value || "";
		config = config || {};

		let bracketsData = match(value, "(", ")");
		let argsValue = bracketsData.length ? bracketsData[0] : "";
		let parts = split(argsValue);
		let args = [];
		let all = [];

		parts.forEach(item => {
			let origItem = item;
			let value = null;

			item = item.trim();

			if (item.match(this._RE.VARIABLE)) {
				//console.log("variable");
				switch (item) {
					case "$event":
						value = config.event;
						break;

					case "$element":
						value = config.el;
						break;

					case "undefined":
						value = undefined;
						break;

					case "null":
					default:
						value = null;
				}
			}
			else if (item.match(this._RE.STRINGS)) {
				value = item.substr(1, item.length - 2);
			}
			else if (item.match(this._RE.NUMBERS)) {
				value = parseFloat(item);
			}
			else {
				// array 
				let array = match(item, "[", "]");
				// expr
				let expr = match(item, "{", "}");

				if (array.length) {
					try {
						value = JSON.parse("[" + array[0] + "]");
					}
					catch (err) {
						console.error(err);
					}
				}
				else if (expr.length) {
					value = () => {
						return new Function(expr[0]);
					};
				}
			}

			all.push({
				value: value,
				pos: argsValue.indexOf(origItem)
			});
		});

		if (all.length) {
			all.sort((a, b) => {
				return a.pos - b.pos
			}).forEach(item => {
				args.push(item.value);
			});
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

		let fnName = this._parseFnName(attr.value);

		if (attr.name && fnName in scope) {
			el.addEventListener(attr.name, event => {
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

				let isBind = item.name == this._conf.elDataBind;
				let isPrefix = item.name.indexOf(this._conf.elEventPrefix) != -1;

				if (isBind || isPrefix) {
					output.push({
						isBind: isBind,
						name: isPrefix ? item.name.replace(this._conf.elEventPrefix, "") : item.name,
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
		element(this._CONST.TEMPLATE_SCRIPT_SELECTOR).forEach(item => {
			this.add(item.id || "", item.innerHTML);
		});
	}
}

var $template$1 = new $template();

/**
 * Simple router for the application.
 * 
 * @class $route
 */

class $route {
	constructor() {
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
	}

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
	when(url, config) {
		this._routes.push({
			url: url,
			config: config
		});

		return this;
	}

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
	otherwise(config) {
		this._otherwise = {
			config: config
		};

		return this;
	}

	/**
	 * Route GO. Walk through all routes, if there is match, route controller will be called.
	 *
	 * @member $route
	 */
	go() {
		let path = get$1();
		let find = false;
		let config = null;

		this._routes.every(item => {
			// exact match or regular expression
			if (path == item.url || path.match(new RegExp(item.url))) {
				config = item.config;
				find = true;
				
				return false;
			}
			else {
				return true;
			}
		});

		if (!find && this._otherwise) {
			config = this._otherwise.config;
		}

		if (config) {
			let templateId = "";
			let templateUrl = null;
			let contr = null;
			let routeParams = {};

			Object.keys(config).forEach(key => {
				let value = config[key];

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
			let runController = () => {
				if (typeof contr === "function") {
					contr(routeParams);
				}
			};

			if (templateUrl) {
				$template$1.load(config.templateId || config.templateUrl, config.templateUrl).then(runController);
			}
			else {
				runController();
			}
		}
	}
}

var $route$1 = new $route();

/**
 * This class is used for extending existing objects and brings signal functionality.
 * 
 * @class $event
 */
class $event {
	constructor() {
		/**
		 * All events. { name: name, event: function, scope, [once] }
		 * 
		 * @type {Array}
		 * @member $event
		 * @private
		 */
		this._allEvents = [];
	}

	/**
	 * Add new event to the stack.
	 * 
	 * @param  {String} name 
	 * @param  {Function} fn
	 * @param  {Object|Function} [scope]
	 * @member $event
	 * @method on
	 */
	on(name, fn, scope) {
		if (!name || !fn) return;

		this._allEvents.push({ 
			name: name,
			fn: fn,
			scope: scope
		});
	}

	/**
	 * Remove event from the stack.
	 * 
	 * @param  {String} name 
	 * @param  {Function} [fn]
	 * @param  {Object|Function} [scope]
	 * @member $event
	 * @method off
	 */
	off(name, fn, scope) {
		if (!name) return;

		let len = this._allEvents.length - 1;

		for (let i = len; i >= 0; i--) {
			let item = this._allEvents[i];

			if (item.name != name) continue;

			if ((!fn || fn == item.fn) && (!scope || scope == item.scope)) {
				this._allEvents.splice(i, 1);
			}
		}
	}

	/**
	 * Add one time event to the stack.
	 * 
	 * @param  {String} name
	 * @param  {Function} [fn]
	 * @param  {Object|Function} [scope]
	 * @member $event
	 * @method once
	 */
	once(name, fn, scope) {
		if (!name || !fn) return;

		this._allEvents.push({ 
			name: name,
			fn: fn,
			scope: scope,
			once: true
		});
	}

	/**
	 * Trigger event with arguments 0..n.
	 * 
	 * @param  {String} name
	 * @member $event
	 * @method trigger
	 */
	trigger(name) {
		if (!name) return;
		
		let args = Array.prototype.slice.call(arguments, 1);
		let len = this._allEvents.length - 1;

		for (let i = len; i >= 0; i--) {
			let item = this._allEvents[i];

			if (item.name != name) continue;

			// call fn
			item.fn.apply(item.scope || this, args);

			// once event
			if (item.once) {
				this._allEvents.splice(i, 1);
			}
		}
	}
}

/**
 * Handle window resize event, triggers signal "resize".
 *
 * @class $resize
 */
class $resize extends $event {
	constructor() {
		super();

		/**
		 * Is active?
		 *
		 * @member $resize
		 * @private
		 */
		this._active = false;
		
		/**
		 * Resize object.
		 *
		 * @member $resize
		 * @private
		 */
		this._resizeObj = {
			id: null,
			timeout: 333
		};

		/**
		 * Binds for functions.
		 *
		 * @member $resize
		 * @private
		 */
		this._binds = {
			resize: this._resize.bind(this),
			resizeInner: this._resizeInner.bind(this)
		};
	}

	/**
	 * Window resize event.
	 *
	 * @member $resize
	 * @private
	 * @method _resize
	 */
	_resize() {
		if (this._resizeObj.id) {
			clearTimeout(this._resizeObj.id);
			this._resizeObj.id = null;
		}

		this._resizeObj.id = setTimeout(this._binds.resizeInner, this._resizeObj.timeout);
	}

	/**
	 * Window resize event - trigger signal "resize".
	 *
	 * @member $resize
	 * @private
	 * @method _resizeInner
	 */
	_resizeInner() {
		this.trigger("resize");
	}
	
	// ------------------------ public ----------------------------------------

	/**
	 * Bind resize event to window object.
	 *
	 * @member $resize
	 * @method start
	 */
	start() {
		if (this._active) return;

		window.addEventListener("resize", this._binds.resize);

		this._active = true;
	}

	/**
	 * Unbind resize event from window object.
	 *
	 * @member $resize
	 * @method end
	 */
	end() {
		if (!this._active) return;

		window.removeEventListener("resize", this._binds.resize);
		
		this._active = false;
	}

	/**
	 * Is resize event captured?
	 *
	 * @return {Boolean}
	 * @member $resize
	 * @method isActive
	 */
	isActive() {
		return this._active;
	}
}

var $resize$1 = new $resize();

/**
 * $select uses bootstrap dropdown and provides additional functionality.
 *
 * @class $select
 * @param {HTMLElement} el Where element has class "dropdown"
 * @param {Object} [opts]
 * @param {Boolean} [opts.addCaption = false] Add caption to select
 */

class $select extends $event {
	constructor(el, opts) {
		super();
		
		this._opts = {
			addCaption: false
		};

		for (let key in opts) {
			this._opts[key] = opts[key];
		}

		this._CONST = {
			CAPTION_SEL: ".dropdown-toggle",
			OPTIONS_SEL: ".dropdown-menu a",
			CARET_SEL: ".caret",
			OPEN_DROPDOWN_SEL: ".dropdown.open",
			OPEN_CLASS: "open",
			ACTIVE_CLASS: "active"
		};

		this._el = el;

		this._optinsRef = [];
		this._captionEl = null;
		this.captionTextEl = null;

		this._binds = {
			captionClick: this._captionClick.bind(this),
			choiceClick: this._choiceClick.bind(this),
			removeAllOpened: this._removeAllOpened.bind(this),
			click: this._click.bind(this)
		};

		this._bind();
	}

	/**
	 * Unbind choices.
	 *
	 * @member $select
	 * @method unbindChoices
	 */
	unbindChoices() {
		if (this._optinsRef.length) {
			this._optinsRef.forEach(option => {
				option.el.removeEventListener(option.event, option.fn);
			});

			this._optinsRef = [];
		}
	}

	/**
	 * Rebind choices.
	 *
	 * @member $select
	 * @method rebindChoices
	 */
	rebindChoices() {
		this.unbindChoices();
		this._bindChoices();
	}

	/**
	 * Select option from the select.
	 * 
	 * @param {Number} ind Position 0..n
	 * @member $select
	 * @method selectOption
	 */
	selectOption(ind) {
		ind = ind || 0;

		let optionsCount = this._optinsRef.length;

		if (optionsCount > 0 && ind >= 0 && ind < optionsCount) {
			let el = this._optinsRef[ind].el;
			let parent = this._optinsRef[ind].el.parentNode;

			if (!parent.classList.contains(this._CONST.ACTIVE_CLASS)) {
				parent.classList.add(this._CONST.ACTIVE_CLASS);

				if (this._opts.addCaption && this._captionTextEl) {
					this._captionTextEl.innerHTML = el.innerHTML;
				}

				// trigger click
				let value = el.getAttribute("data-value") || "";

				this.trigger("change", value);
			}
		}
	}

	/**
	 * Set add caption from the current value.
	 *
	 * @member $select
	 * @method setAddCaption
	 */
	setAddCaption() {
		if (!this._opts.addCaption) return;

		this._optinsRef.every((item) => {
			let parent = item.el.parentNode;

			if (parent.classList.contains(this._CONST.ACTIVE_CLASS)) {
				this._captionTextEl.innerHTML = item.el.innerHTML;

				return false;
			}
			else {
				return true;
			}
		});
	}

	/**
	 * Bind clicks on the select.
	 *
	 * @member $select
	 * @private
	 * @method _bind
	 */
	_bind() {
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
	_bindCaption() {
		let captionEl = this._el.querySelector(this._CONST.CAPTION_SEL);

		if (captionEl) {
			// click on the caption
			captionEl.addEventListener("click", this._binds.captionClick);

			// insert span placeholder for caption
			if (this._opts.addCaption) {
				let caretEl = captionEl.querySelector(this._CONST.CARET_SEL);

				if (caretEl) {
					let captionTextEl = create({
						el: "span",
						class: "add-caption"
					});

					captionEl.insertBefore(captionTextEl, caretEl);

					this._captionTextEl = captionTextEl;
				}
			}
		}

		this._captionEl = captionEl;
	}

	/**
	 * Remove all opened selectors -> close all.
	 *
	 * @member $select
	 * @private
	 * @method _removeAllOpened
	 */
	_removeAllOpened() {
		// remove all
		element(this._CONST.OPEN_DROPDOWN_SEL).forEach(item => {
			item.classList.remove(this._CONST.OPEN_CLASS);
		});
	}

	/**
	 * Outside click.
	 * 
	 * @member $select
	 * @private
	 * @method _click
	 */
	_click() {
		this._removeAllOpened();

		document.removeEventListener("click", this._binds.click);
	}

	/**
	 * Event - click on caption.
	 * 
	 * @param  {Event} e 
	 * @member $select
	 * @private
	 * @method _captionClick
	 */
	_captionClick(e) {
		e.stopPropagation();

		let isOpen = this._el.classList.contains(this._CONST.OPEN_CLASS);

		this._binds.removeAllOpened();

		if (isOpen) {
			// outside click
			document.removeEventListener("click", this._binds.click);
		}
		else {
			// outside click
			document.addEventListener("click", this._binds.click);

			this._el.classList.add(this._CONST.OPEN_CLASS);
		}
	}

	/**
	 * Bind choices inside select.
	 *
	 * @member $select
	 * @private
	 * @method _bindChoices
	 */
	_bindChoices() {
		element(this._CONST.OPTIONS_SEL, this._el).forEach(option => {
			option.addEventListener("click", this._binds.choiceClick);

			// event ref
			this._optinsRef.push({
				el: option,
				event: "click",
				fn: this._binds.choiceClick
			});
		});
	}

	/**
	 * Event - click on option.
	 * 
	 * @param  {Event} e 
	 * @member $select
	 * @private
	 * @method _choiceClick
	 */
	_choiceClick(e) {
		e.stopPropagation();

		var el = e.target || e.srcElement;

		if (el && !el.parentNode.classList.contains(this._CONST.ACTIVE_CLASS)) {
			// remove previously selected
			let active = el.parentNode.parentNode.querySelector("." + this._CONST.ACTIVE_CLASS);
			
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
			let value = el.getAttribute("data-value") || "";

			this.trigger("change", value);
		}
	}
}

/**
 * Progress loader in the application.
 * 
 * @class $loader
 */

class $loader {
	constructor() {
		// loader init
		this._create();
	}
	
	/**
	 * Start loader.
	 *
	 * @member $loader
	 * @method start
	 */
	start() {
		this._el.classList.add("start");
	}

	/**
	 * End loader.
	 *
	 * @member $loader
	 * @method end
	 */
	end() {
		this._el.classList.remove("start");
		this._el.classList.add("end");

		setTimeout(() => {
			this._el.classList.remove("end");
			this._el.classList.add("hide");

			setTimeout(() => {
				this._el.classList.remove("hide");
			}, 350);
		}, 150);
	}

	/**
	 * Get spinner - DOM or object.
	 *
	 * @param {Boolean} [getObject] True for object DOM configuration for $dom; default HTML node
	 * @return {HTMLElement|Object}
	 * @member $loader
	 * @method getSpinner
	 */
	getSpinner(getObject) {
		let children = [];

		for (let i = 1; i < 6; i++) {
			children.push({
				el: "div",
				class: "rect" + i
			});
		}

		let domConf = {
			el: "div",
			class: "spinner",
			child: children
		};

		return (getObject ? domConf : create(domConf));
	}

	/**
	 * Create loader.
	 *
	 * @private
	 * @member $loader
	 * @method _create
	 */
	_create() {
		this._el = create({
			el: "div",
			class: "loader"
		});

		load(() => {
			// insert into the body on first position
			document.body.insertBefore(this._el, document.body.firstChild);
		});
	}
}

var $loader$1 = new $loader();

/**
 * Date operations.
 * 
 * @class $date
 */

/**
 * Parse EN date to CS format.
 * year-month-day -> day. month. year
 * 2016-06-31 -> 31. 6. 2016
 * 
 * @param {String} enDate
 * @return {String}
 * @member $date
 */
function dateENtoCS(enDate) {
	enDate = enDate || "";

	let parts = enDate.split("-");

	if (parts.length == 3) {
		// delete first 0
		return [parts[2].replace(/^0/, ""), parts[1].replace(/^0/, ""), parts[0]].join(". ");
	}
	else {
		return "";
	}
}

/**
 * Parse CS date to EN format.
 * day. month. year -> year-month-day
 * 31. 6. 2016 -> 2016-06-31
 * 
 * @param {String} csDate
 * @return {String}
 * @member $date
 */



/**
 * Is string contains CS date format?
 * 
 * @param  {String} csDate
 * @return {Boolean}
 * @member $date
 */
function isCSdate(csDate) {
	csDate = csDate || "";

	return !!(csDate.match(/([1-9]|[1-3][0-9])\.[ ]*([1-9]|1[0-2])\.[ ]*[1-9][0-9]{3}/));
}

/**
 * Add days to date.
 * 
 * @param  {Date} date
 * @param  {Number} days
 * @return {Date}
 * @member $date
 */
function addDays(date, days) {
	days = days || 0;

	let addTime = 1000 * 60 * 60 * 24 * days;

	return new Date(date.getTime() + addTime);
}

/**
 * Date - string format.
 * yyyy - full year; m - month; d - day; s - secods; M - minutes; h - hours;
 * double: dd, ss, MM, hh - left pad with zero.
 * 
 * @param  {Date} date Input date
 * @param  {String} format Format string
 * @return {String}
 */
function format(date, format) {
	format = format || "d. m. yyyy hh:MM:ss";

	let day = date.getDate();
	let month = date.getMonth() + 1;
	let year = date.getFullYear();

	let seconds = date.getSeconds();
	let minutes = date.getMinutes();
	let hours = date.getHours();

	let dateObj = {
		"yyyy": year,
		"m": month,
		"mm": month < 10 ? "0" + month : month,
		"d": day,
		"dd": day < 10 ? "0" + day : day,
		"s": seconds,
		"ss": seconds < 10 ? "0" + seconds : seconds,
		"M": minutes,
		"MM": minutes < 10 ? "0" + minutes : minutes,
		"h": hours,
		"hh": hours < 10 ? "0" + hours : hours,
	};

	let keys = Object.keys(dateObj).sort((a, b) => {
		return b.length - a.length;
	});

	keys.forEach(key => {
		format = format.replace(new RegExp(key, "g"), dateObj[key]);
	});

	return format;
}

/**
 * Many useful alghoritms.
 * 
 * @class $math
 */

/**
 * Math constants.
 *
 * @private
 * @type {Object}
 * @member $math
 */
const _CONST = {
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


/**
 * Get BBox from points.
 * 
 * @param  {Object[]} points
 * @param  {Number} points.x Coordinate on axe x
 * @param  {Number} points.y Coordinate on axe y
 * @return {Object} Output bbox with x, y, width and height variables
 * @member $math
 */


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
function det2(x1, x2, y1, y2) {
	return (x1 * y2 - y1 * x2);
}

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
function linesIntersection(firstLine, secondLine) {
	let TOLERANCE = 0.000001;

	let a = det2(firstLine.x1 - firstLine.x2, firstLine.y1 - firstLine.y2, secondLine.x1 - secondLine.x2, secondLine.y1 - secondLine.y2);
	
	// lines are parallel
	if (Math.abs(a) < TOLERANCE) { return null; }

	let d1 = det2(firstLine.x1, firstLine.y1, firstLine.x2, firstLine.y2);
	let d2 = det2(secondLine.x1, secondLine.y1, secondLine.x2, secondLine.y2);
	let x = det2(d1, firstLine.x1 - firstLine.x2, d2, secondLine.x1 - secondLine.x2) / a;
	let y = det2(d1, firstLine.y1 - firstLine.y2, d2, secondLine.y1 - secondLine.y2) / a;

	if (x < Math.min(firstLine.x1, firstLine.x2) - TOLERANCE || x > Math.max(firstLine.x1, firstLine.x2) + TOLERANCE) { return null; }
	if (y < Math.min(firstLine.y1, firstLine.y2) - TOLERANCE || y > Math.max(firstLine.y1, firstLine.y2) + TOLERANCE) { return null; }
	if (x < Math.min(secondLine.x1, secondLine.x2) - TOLERANCE || x > Math.max(secondLine.x1, secondLine.x2) + TOLERANCE) { return null; }
	if (y < Math.min(secondLine.y1, secondLine.y2) - TOLERANCE || y > Math.max(secondLine.y1, secondLine.y2) + TOLERANCE) { return null; }

	return {
		x: Math.round(x),
		y: Math.round(y)
	};
}

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


/**
 * Logarithm - base 2.
 * 
 * @param  {Number} val Input value
 * @return {Number}
 * @member $math
 */


/**
 * Map zoom in mercator projection to distance in meters.
 * 
 * @param  {Number} zoom   Mercator zoom - 2..n
 * @param  {Number} horFOV Horizontal field of view
 * @param  {Number} height Screen height size
 * @return {Number} Distance in meters
 * @member $math
 */
function zoomToDistance(zoom, horFOV, height) {
	let resolution = _CONST.ZOOM / Math.pow(2, zoom); // m/px
	let halfHeight = height / 2;
	let y = Math.floor(resolution * halfHeight);

	// we need a half - its in degrees - thats why / 2 * / 180 for radians [rad]; vertical fov -> we need height
	let alfa = horFOV / 360 * Math.PI;

	return Math.floor(y / Math.tan(alfa));
}

/**
 * Reverse function for zoomToDistance - distance in meters to zoom in mercator projection.
 * 
 * @param  {Number} distance Distance in meters
 * @param  {Number} horFOV Horizontal field of view
 * @param  {Number} height Screen height size
 * @return {Number} Mercator zoom
 * @member $math
 */


/**
 * Move point coordinates by angle in degrees.
 * 
 * @param  {Object} point
 * @param  {Number} point.x Point coordinates - axe x
 * @param  {Number} point.y Point coordinates - axe y
 * @param  {Number} angle Angle in degrees CW
 * @member $math
 */
function movePointByAngle(point, angle) {
	let rad = (360 - angle) / 180 * Math.PI;
	let x = point.x;
	let y = point.y;

	point.x = x * Math.cos(rad) - y * Math.sin(rad);
	point.y = x * Math.sin(rad) + y * Math.cos(rad);
}

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


/**
 * Set value in selected range.
 * 
 * @param {Number} value Input value
 * @param {Number} min Min value
 * @param {Number} max Max value
 * @return {Number}
 * @member $math
 */
function setRange(value, min, max) {
	if (value < min) {
		return min;
	}
	else if (value > max) {
		return max;
	}
	else {
		return value;
	}
}

/**
 * Get middle angle between start and end angle.
 * Negative angle is computed like 360 + negative angle.
 * 
 * @param {Number} startAngle
 * @param {Number} endAngle
 * @return {Number}
 * @member $math
 */


/**
 * Get angle between center <0;0> and point <x;y>.
 * 
 * @param {Number} x Position on axe X
 * @param {Number} y Position on axe Y
 * @return {Number}
 * @member $math
 */

/**
 * Cover class for localStorage.
 * 
 * @class $localStorage
 */

// localStorage provider
let provider = LOCAL_STORAGE ? window.localStorage : {
	_data: {},

	setItem: function(key, value) {
		if (!key) return;

		this._data[key] = value;
	},

	getItem: function(key) {
		if (!key) return null;

		return this._data[key];
	},

	removeItem: function(key) {
		if (!key) return;

		if (key in this._data) {
			delete this._data[key];
		}
	}
};

/**
 * Set value to localStorage.
 *
 * @param {String} key
 * @param {String} [value]
 * @member $localStorage
 */
function set(key, value) {
	provider.setItem(key, value);
}

/**
 * Get value from localStorage.
 *
 * @param {String} key
 * @return {String}
 * @member $localStorage
 */
function get$2(key) {
	return provider.getItem(key);
}

/**
 * Remove key from localStorage.
 *
 * @param {String} key
 * @return {Boolean}
 * @member $localStorage
 */
function remove(key) {
	provider.removeItem(key);
}

/**
 * Class for creating img previews from File[] variable.
 * 
 * @class $image
 */

/**
 * Read one image file - gets canvas with it. EXIF is readed, you can specific max size for image scale.
 *
 * @param  {Object} file Input file
 * @param  {Number} [maxSize] If image width/height is higher than this value, image will be scaled to this dimension
 * @return {Promise} Promise with output object
 * @member $image
 */
function readFromFile(file, maxSize) {
	return new Promise((resolve, reject) => {
		if (!FILE_READER) {
			reject();

			return;
		}

		let reader = new FileReader();
		let output = {
			img: null,
			exif: null,
			canvas: null
		};

		reader.onload = e => {
			let binaryData = reader.result;
			let binaryDataArray = new Uint8Array(binaryData);
			let exif = null;

			// exif only for jpeg
			if (file.type == "image/jpeg" || file.type == "image/pjpeg") {
				exif = getEXIF(binaryData);
			}

			let img = new Image();

			img.onload = () => {
				let imd = getImageDim(img, maxSize);
				
				let canvas = getCanvas(img, {
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

			img.src = fileToBase64(file.type, binaryDataArray);
		};

		reader.readAsArrayBuffer(file);
	});
}

/**
 * Counts image dimension; if maxSize is available, new dimension is calculated.
 *
 * @param  {Image} img
 * @param  {Number} [maxSize] If image width/height is higher than this value, image will be scaled to this dimension
 * @return {Object}
 * @member $image
 */
function getImageDim(img, maxSize) {
	maxSize = maxSize || 0;
	
	let largeWidth = maxSize > 0 && img.width > maxSize;
	let largeHeight = maxSize > 0 && img.height > maxSize;

	let output = {
		width: img.width,
		height: img.height,
		scale: 1
	};

	if (largeWidth || largeHeight) {
		// resize picture
		let imgWidth = img.width;
		let imgHeight = img.height;

		// portrait x landscape
		if (img.width > img.height) {
			// landscape
			imgHeight = maxSize * imgHeight / imgWidth;
			imgWidth = maxSize;
		}
		else {
			// portrait
			imgWidth = maxSize * imgWidth / imgHeight;
			imgHeight = maxSize;
		}

		output.scale = img.width / imgWidth; // ratio between original x scaled image
		output.width = imgWidth;
		output.height = imgHeight;
	}

	return output;
}

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
function getCanvas(imgData, optsArg) {
	let opts = {
		width: imgData.width || 0,
		height: imgData.height || 0,
		orientation: 0,
		scaled: false,
		canvas: null
	};

	for (let key in optsArg) {
		opts[key] = optsArg[key];
	}

	if (!CANVAS) {
		return null;
	}

	let canvas = opts.canvas || document.createElement("canvas");
	canvas.width = opts.width;
	canvas.height = opts.height;

	let ctx = canvas.getContext("2d");
	let draw = true;

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
		}
		else {
			ctx.drawImage(imgData, 0, 0);
		}
	}

	return canvas;
}

/**
 * Binary data to base64.
 *
 * @param  {String} fileType
 * @param  {Array} binaryData
 * @return {String}
 * @member $image
 */
function fileToBase64(fileType, binaryData) {
	let length = binaryData.length;
	let output = "";

	for (let i = 0; i < length; i += 1) {
		output += String.fromCharCode(binaryData[i]);
	}

	return 'data:' + fileType + ';base64,' + btoa(output);
}

/**
 * Is file a picture?
 *
 * @param  {File}  file
 * @return {Boolean}
 * @member $image
 */
function isPicture(file) {
	return file && (file.type == "image/jpeg" || file.type == "image/pjpeg" || file.type == "image/png");
}

/**
 * Get picture files from array of files.
 * 
 * @param  {Array} array of files
 * @return {Array}
 * @member $image
 */
function getPictureFiles(files) {
	let pictureFiles = [];

	if (files && files.length) {
		for (let i = 0; i < files.length; i++) {
			let item = files[i];

			if (isPicture(item)) {
				pictureFiles.push(item);
			}
		}
	}

	return pictureFiles;
}

/**
 * Get picture files count from the array of Files. This function uses 'getPictureFiles'.
 * 
 * @param  {Array} array of files
 * @return {Boolean}
 * @member $image
 */


/**
 * Get image EXIF information.
 * 
 * @param  {Binary[]} imgData Binary img data
 * @return {Object}
 * @member $image
 */
function getEXIF(imgData) {
	if ("EXIF" in window) {
		return EXIF.readFromBinaryFile(imgData);
	}
	else {
		return {};
	}
}

/**
 * Factory for manage multiple tasks.
 * 
 * @class $job
 */

class $job {
	constructor() {
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
	add(task, scope, args) {
		args = args || [];

		if (!Array.isArray(args)) {
			args = [args];
		}

		this._tasks.push({
			task: task,
			scope: scope,
			args: args
		});
	}

	/**
	 * Start job.
	 *
	 * @return {Promise} Returns promise for whole job
	 * @member $job
	 * @method start
	 */
	start() {
		return new Promise((resolve, reject) => {
			if (this._isRunning || !this._tasks.length) {
				reject();

				return;
			}

			// job is running
			this._isRunning = true;

			// because of pop
			this._tasks.reverse();

			this._doJob(resolve);
		});
	}

	/**
	 * Clear all job taks.
	 *
	 * @member $job
	 * @method clear
	 */
	clear() {
		this._tasks = [];
	}

	/**
	 * Set progress function, which will be called after each task will be done.
	 * 
	 * @param {Function} cb
	 * @param {Function|Object} [scope]
	 * @member $job
	 * @method setTaskDone
	 */
	setTaskDone(cb, scope) {
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
	_doJob(resolve) {
		let rest = this._tasks.length;

		if (rest == 0) {
			this._isRunning = false;
			
			resolve();
		}
		else {
			let job = this._tasks.pop();

			job.task.apply(job.scope || job.task, job.args.concat(function() {
				if (this._taskDone.cb) {
					let doneFnArgs = Array.prototype.slice.call(arguments, 0);

					this._taskDone.cb.apply(this._taskDone.scope || this._taskDone.cb, doneFnArgs);
				}

				this._doJob(resolve);
			}.bind(this)));
		}
	}
}

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
 * @return {Promise} Callback after all jobs are done
 * @member $job
 * @method multipleJobs
 */
function multipleJobs(jobsArray, count, taskDoneObj) {
	let len = jobsArray.length;
	let jobs = [];

	for (let i = 0; i < len; i++) {
		let jp = count > 0 ? i % count : i;
		let jobItem = jobsArray[i];

		if (!jobs[jp]) {
			jobs[jp] = new $job();

			if (taskDoneObj) {
				jobs[jp].setTaskDone(taskDoneObj.cb, taskDoneObj.scope);
			}
		}

		// add one job
		jobs[jp].add(jobItem.task, jobItem.scope, jobItem.args);
	}

	let jobPromises = [];

	jobs.forEach(job => {
		jobPromises.push(job.start());
	});

	return Promise.all(jobPromises);
}

/**
 * Class for creating img previews from File[] variable.
 * 
 * @class $previewImages
 */

/**
 * Main function for showing img previews.
 * 
 * @param  {HTMLElement} el Placeholder element
 * @param  {File[]} files
 * @param  {Object} [opts] Configuration
 * @param  {Number} [opts.maxSize = 0] Max image size in px; the size is used for image scale
 * @param  {Number} [opts.count = 0] How many images are processed simultinously
 * @param  {Boolean} [opts.createHolder = false] Create placeholder, see _createPreviewHolders function
 * @return  {Boolean} Images will be shown?
 * @member $previewImages
 */
var $previewImages = function(el, files, optsArg) {
	// clear previous
	el.innerHTML = "";

	// add class
	el.classList.add("preview-images");

	let opts = {
		maxSize: 0,
		count: 0,
		createHolder: false
	};

	let dom = {
		previewItems: el
	};

	for (let key in optsArg) {
		opts[key] = optsArg[key];
	}

	let pictureFiles = getPictureFiles(files);
	let count = pictureFiles.length;

	if (count) {
		// create placeholder?
		if (opts.createHolder) {
			_createPreviewHolders(el, count, dom);
		}

		let jobsArray = [];

		// sort by name, make previewID - only for 7 pictures
		pictureFiles = pictureFiles.sort((a, b) => {
			if (a.name < b.name)
				return -1;
			else if (a.name > b.name)
				return 1;
			else 
				return 0;
		}).forEach((pf, ind) => {
			jobsArray.push({
				task: _jobTask,
				args: [{
					file: pf,
					previewID: "img_0" + ind
				}, opts.maxSize, dom]
			});
		});

		// run jobs array
		multipleJobs(jobsArray, opts.count);

		return true;
	}
	else {
		return false;
	}
};

/**
 * Create one image preview.
 *
 * @private
 * @param  {File} file
 * @param  {Number} [maxSize] Max image size
 * @return {Object} dom references
 * @member $previewImages
 */
function _createPreview(file, maxSize) {
	let exported = {};

	let cont = create({
		el: "span",
		class: ["preview-item", "preview-loading"],
		child: [{
			el: "span",
			class: "canvas-cover",
			child: $loader$1.getSpinner(true),
			style: "height: " + (maxSize || 100) + "px",
			_exported: "canvasCover"
		}, {
			el: "span",
			class: "title",
			innerHTML: file.name.replace(/\..*/g, "")
		}]
	}, exported);

	return {
		cont: cont,
		canvasCover: exported.canvasCover
	};
}

/**
 * Create preview holders. Only for images count 4 and 7.
 * Four images are in the one row, seven images has the last one above them.
 *
 * @private
 * @param {HTMLElement} el
 * @param {Number} count
 * @param {Object} dom
 * @member $previewImages
 */
function _createPreviewHolders(el, count, dom) {
	if (!el || (count != 4 && count != 7)) return;

	let exported = {};

	// placeholder for 7 images
	if (count == 7) {
		// ceiling line
		el.appendChild(create({
			el: "div",
			child: {
				el: "span",
				_exported: "img_06"
			}
		}, exported));
	}

	let child = [];
	let childCount = count == 7 ? 6 : 4;

	for (let i = 0; i < childCount; i++) {
		child.push({
			el: "span",
			_exported: "img_0" + i
		});
	}

	// rest line
	el.appendChild(create({
		el: "div",
		child: child
	}, exported));

	for (let i = 0; i < count; i++) {
		dom["img_0" + i] = exported["img_0" + i];
	}
}

/**
 * One job task
 *
 * @private
 * @param  {Object} previewObj Object with file and preview ID
 * @param  {Number} maxSize Max image size in px
 * @param  {Function} jobDone Function which indicates that job is done
 * @param  {Object} dom Object with DOM elements
 * @member $previewImages
 */
function _jobTask(previewObj, maxSize, dom, jobDone) {
	let file = previewObj.file;
	let previewID = previewObj.previewID;
	let preview = _createPreview(file, maxSize);
	
	// append
	if (previewID in dom) {
		dom[previewID].appendChild(preview.cont);
	}
	else {
		dom.previewItems.appendChild(preview.cont);
	}

	readFromFile(file, maxSize).then(readFileObj => {
		preview.cont.classList.remove("preview-loading");
		preview.canvasCover.innerHTML = "";
		preview.canvasCover.appendChild(readFileObj.canvas);

		jobDone();
	});
}

/**
 * Page
 */
class Page$1 extends $event {
	/**
	 * Constructor for page.
	 *
	 * @param {Object} Page config
	 */
	constructor(config) {
		super();

		let root = element("body").append($template$1.compile(config.templ || "", this));

		// Object for data-bind elements references
		this._els = {};
		this._config = config;

		// each page contanins only one page div
		$template$1.bindTemplate(root, this, this._addEls.bind(this));

		this._show();
	}

	/**
	 * Add new els to this._els; this function can be called from $template
	 *
	 * @param {Object} newEls { key, value - node element}
	 */
	_addEls(newEls) {
		extend(this._els, newEls || {});
	}

	/**
	 * Get page config.
	 *
	 * @return {Object}
	 */
	_getConfig() {
		return this._config;
	}

	/**
	 * Get page element.
	 *
	 * @param  {String} name
	 * @return {NodeElement}
	 */
	_getEl(name) {
		return this._els[name];
	}

	/**
	 * Abstract method.
	 */
	_show() {
	}
}

/**
 * Snippet
 */
class Snippet extends $event {
	/**
	 * Constructor for snippet.
	 *
	 * @param {Object} config Config for snippet
	 * @param {Object} parent Parent object
	 */
	constructor(config, parent) {
		super();

		// Object for data-bind elements references
		this._els = {};

		this._config = config || {};
		this._parent = parent;
		this._root = this._create(config);

		$template$1.bindTemplate(this._root, this, this._addEls.bind(this));

		this._show();
	}

	/**
	 * Add new els to this._els; this function can be called from $template
	 *
	 * @param {Object} newEls { key, value - node element}
	 */
	_addEls(newEls) {
		extend(this._els, newEls || {});
	}

	/**
	 * Get Snippet config.
	 *
	 * @return {Object}
	 */
	_getConfig() {
		return this._config;
	}

	/**
	 * Get snippet element.
	 *
	 * @param  {String} name
	 * @return {NodeElement}
	 */
	_getEl(name) {
		return this._els[name];
	}

	/**
	 * Get snippet parent.
	 *
	 * @return {NodeElement}
	 */
	_getParent() {
		return this._parent;
	}

	/**
	 * Abstract method. Create root element.
	 *
	 * @param  {Object} config
	 */
	_create(config) {
		return null;
	}

	/**
	 * Abstract method.
	 */
	_show() {
	}

	/**
	 * Is snippet locked for change?
	 *
	 * @return {Boolean}
	 */
	isLocked() {
		return false;
	}

	/**
	 * Return root el.
	 *
	 * @return {HTMLElement}
	 */
	getRoot() {
		return this._root;
	}

	/**
	 * Destroy snippet.
	 */
	destructor() {
	}
}

const CONFIG = {
	// homeApp localization
	LOCALIZATION: {
		LANG: "en",
		PATH: "/locale/en.json"
	},

	// homeApp resource URLs
	URLS: {
		HOME: "/api/home/"
	}
};

class HomeSnippet extends Snippet {
	constructor(config, parent) {
		super(config, parent);
	}

	dirTest() {
		console.log("HomeDir dirTest function()");
	}
}

class HomeResource {
	constructor() {
		this._baseURL = CONFIG.URLS.HOME;
	}

	get() {
		return createRequest({
			url: this._baseURL
		});
	}
}

class HomePage extends Page$1 {
	constructor(config) {
		super(config);
	}

	// ------------------------ private ---------------------------------------
	_show() {
		// set title - using i18n get text _ function
		this._getEl("title").innerHTML = _("home_page.title");

		$resize$1.start();
		$resize$1.on("resize", () => {
			console.log("resize event");
		});

		this._loadTemplate();

		// dropdowns
		let dropdown = new $select(this._getEl("dropdown"));
		let dropdown2 = new $select(this._getEl("dropdown2"), {
			addCaption: true
		});

		dropdown.on("change", value => {
			console.log("dropdown change - " + value);
		}, this);

		// events
		this.once("onceEvent", () => {
			console.log("onceEvent");
		});

		this.on("anotherEvent", () => {
			console.log("anotherEvent");
		});

		this.once("onceEvent", () => {
			console.log("onceEvent - another function");
		});
	}

	_testPromise1(val) {
		return new Promise(resolve => {
			setTimeout(() => {
				resolve("test promise 1 - " + val);
			}, 1000);
		});
	}

	_testPromise2(val) {
		return new Promise(resolve => {
			setTimeout(() => {
				resolve("test promise 2 - " + val);
			}, 800);
		});
	}

	/**
	 * Load template to main template in index.html
	 * Compile against data object; bind to HomePage page
	 */
	_loadTemplate() {
		let el = element(".placeholder").html($template$1.compile("testTempl", {
			name: "Name from HP",
			testObj: {
				a: 5,
				b: 6
			}
		}));

		let langTest = () => {
			this._config.i18n.setLanguage("cs");
			this._getEl("title").innerHTML = _("home_page.title");
			this._config.i18n.setLanguage("en");
			console.log("Website title has changed!");
		};

		$template$1.bindTemplate(el.getEl(), {
			onkd: () => {
				console.log("On key down");
			},

			/**
			 * Bind click from the dynamic template to our page.
			 */
			tmplBtn: () => {
				console.log("Dynamic template button click");
			},

			langTest
		});
	}

	// ------------------------ public ----------------------------------------
	
	/**
	 * Test button click
	 * All arguments are parsed from the template
	 * @param  {ButtonElement} el
	 * @param  {MouseEvent} event
	 */
	buttonClick(el, event) {
		let args = arguments;
		
		console.log(args);

		if (args.length == 8) {
			let fn = args[7];

			col("fnTest {0}", fn());
		}

		// loader
		$loader$1.start();

		// test for once events
		this.trigger("onceEvent");
		this.trigger("anotherEvent");

		// test for off event
		this.off("anotherEvent");

		setTimeout(function() {
			$loader$1.end();
		}, 500);
	}

	filterTest() {
		console.log("Test of filter 'lowercase' : HI, HOW ARE YOU? -> " + filter$1("lowercase", "HI, HOW ARE YOU?"));
	}

	snippetTest() {
		var homeSnippet = new HomeSnippet();
		homeSnippet.dirTest();
	}

	/**
	 * Test request to API on express server.
	 */
	apiTest() {
		let homeResource = new HomeResource();

		homeResource.get().then(data => {
			console.log(data);
		});
	}

	chp() {
		// test for chaining promises
		console.log("chainPromises start...");

		chainPromises([{
			method: "_testPromise1",
			scope: this,
			args: [5]
		}, {
			method: "_testPromise2",
			scope: this,
			args: [10]
		}, {
			method: () => {
				return new Promise(resolve => {
					setTimeout(() => {
						resolve("test promise 3 - " + formatSize(123456789));
					}, 1000);
				});
			}
		}]).then(output => {
			console.log("All done, rejected {0}".format(output.rejected));

			output.output.forEach(i => {
				console.log(i);
			});
		});
	}

	promiseTest() {
		let promise1 = new Promise(resolve => {
			setTimeout(() => {
				resolve();
			}, 500);
		});

		let promise2 = new Promise((resolve, reject) => {
			setTimeout(() => {
				reject();
			}, 300);
		});

		Promise.all([promise1, promise2]).then(() => {
			console.log("Promise all done");
		});

		let race1 = new Promise(resolve => {
			setTimeout(() => {
				resolve({ a: 10 });
			}, 500);
		});

		let race2 = new Promise(resolve => {
			setTimeout(() => {
				resolve({ a: 25 });
			}, 300);
		});

		Promise.race([race1, race2]).then(data => {
			console.log("$race is done");
			console.log(data);
		});

		Promise.reject().then(() => {}, () => {
			console.log("Promise rejected");
		});
	}

	uploadChange() {
		let uploadPreview = this._getEl("uploadPreview");
		let filesInput = this._getEl("uploadInput");
		let showState = $previewImages(uploadPreview, filesInput.files, {
			maxSize: 180,
			count: 2,
			createHolder: true
		});

		if (!showState) {
			uploadPreview.innerHTML = "SELECT IMAGES FOR THEIRS PREVIEWS";
		}

		// clear value
		filesInput.value = null;
	}

	mathAndDate() {
		col("2016-06-31 to CS date = {0}", dateENtoCS("2016-06-31"));
		col("2016-06-31 is CS date? {0}",  isCSdate("2016-06-31") ? "yes" : "no");
		col("zoomToDistance = {0}", zoomToDistance(15, 45, 1024));

		let p = { 
			x: 0,
			y: 10
		};

		movePointByAngle(p, 90);

		col("movePointByAngle <0,10> by angle 90 degrees: x = {0}, y = {1}", Math.round(p.x), Math.round(p.y));

		let line1 = {
			x1: 0,
			y1: 0,
			x2: 10,
			y2: 0
		};

		let line2 = {
			x1: 5,
			y1: -5,
			x2: 5,
			y2: 5
		};

		let line3 = {
			x1: 0,
			y1: 1,
			x2: 10,
			y2: 1
		};

		let inter = linesIntersection(line1, line2);

		if (inter) {
			col("linesIntersection in point: x = {0}, y = {1}", Math.round(inter.x), Math.round(inter.y));
		}

		// parallel
		inter = linesIntersection(line1, line3);

		if (!inter) {
			col("there is no intersection!");
		}
	}

	promiseFlattening() {
		this._promiseFlatteningTest1();
	}

	_promiseFlatteningTest1() {
		console.log("pp test 1");

		new Promise(resolve => {
			setTimeout(() => {
				resolve({ a: 5 });
			}, 450);
		}).then(val => {
			console.log("val1");
			console.log(val);

			return { b: 6 };
		}).then(val2 => {
			console.log("val2");
			console.log(val2);

			return { c: 6 };
		}, error2 => {
			console.log(error2);
		}).then(val3 => {
			console.log("val3");
			console.log(val3);

			this._promiseFlatteningTest2();
		});
	}

	_promiseFlatteningTest2() {
		console.log("pp test 2");

		new Promise(resolve => {
			setTimeout(() => {
				resolve({ a: 5 });
			}, 450);
		}).then(val => {
			console.log("val1");
			console.log(val);

			return new Promise(rr => {
				setTimeout(() => {
					rr({ roman: true });
				}, 500);
			});
		}).then(val2 => {
			console.log("val2");
			console.log(val2);
		}).then(val3 => {
			console.log("val3");
			console.log(val3);
		});
	}

	_testReq() {
		return createRequest({
			url: Config.URLS.HOME
		});
	}

	locStor() {
		let LS_KEY = "myLocalStorage";
		let value = "xyz";

		col("Set localStorage {0} with value {1}", LS_KEY, value);
		set(LS_KEY, value);
		col("Get localStorage {0} = {1}", LS_KEY, get$2(LS_KEY));
		col("Remove localStorage {0}", LS_KEY);
		remove(LS_KEY);
		col("Get localStorage {0} = {1}", LS_KEY, get$2(LS_KEY));
	}

	myQueryTest() {
		let el = create({
			el: "div",
			innerHTML: "data",
			css: {
				color: "red",
				"background-color": "white",
				border: "1px solid black"
			}
		});

		let ref = element(".myquery-cont").empty().append(el).append("<div>data2</div>").prepend("<div>data prepend</div>");

		col("Style is {0}", ref.css("display", "none").css("display"));

		ref.css("display", "");

		let colors = ["green", "red", "blue"];
		let bgColors = ["#f5f5f5", "#ccc", "#666"];

		element(".myquery-cont > div").each((el, ind) => {
			element(el).css("color", colors[ind]).css("z-index", 12).css({
				"background-color": bgColors[ind]
			}).click(e => {
				console.log("click on div");
			});
		});

		let doc = element(document).keydown((event, el, mqRef) => {
			console.log("document keydown");
			console.log(arguments);
			console.log(this);

			mqRef.unbind("keydown");
		});

		let clickFn = (e, el, mqRef) => {
			console.log("document click");
		};

		doc.bind("click", clickFn);
		doc.unbind("click", clickFn);
	}

	others() {
		col("$common.col with string only");
		col("i18n trans {0}, missing {1}", _("home_page.testData"), _("home_page.notExists"));
		//$common.col("i18n plural: 0 => {0}, 1 => {1}, 10 => {2}", _("home_page.plural", { COUNT: 0 }), _("home_page.plural", { COUNT: 1 }), _("home_page.plural", { COUNT: 10 }));
		col("i18n plural: 0 => {0}", _("home_page.plural", { COUNT: 0 }));

		let s2 = "There was {   COUNT , plural, one{car} few{cars} other{ cars  }    } {hi} aa    {   daads }   ";
		console.log(s2);
		console.log(_(s2));

		col('valueFromObject({a:{data: 5}}, "a.data") -> {0}', valueFromObject({a:{data: 5}}, "a.data"));
		col('valueFromObject({a:{data: 5}}, "a.x") -> {0}', valueFromObject({a:{data: 5}}, "a.x"));
		col('valueFromObject({a:{data: 5}}, "a.data.x2.y2", 100) -> {0}', valueFromObject({a:{data: 5}}, "a.data.x2.y2", 100));
		col('valueFromObject({a: [{data: 5}, {data: 6}]}, "a[1].data") -> {0}', valueFromObject({a: [{data: 5}, {data: 6}]}, "a[1].data"));

		console.log(cloneValue("string"));
		console.log(cloneValue([]));
		console.log(cloneValue({ a: 5, r: [1, "assda", false]}));
		console.log(cloneValue(new Date()));
		console.log(cloneValue(10.85));
		console.log(cloneValue(null));
		console.log(cloneValue(false));
		console.log(cloneValue(document.createElement("div")));

		console.log("Date format day.month.year hours:minutes -> {0}".format(format(new Date(), "dd.mm.yyyy hh:MM")));
		console.log("Time duration 54321 seconds -> {0}".format(timeDuration(54321)));
	}

	allTests() {
		console.log("Running all tests...");

		this.others();
		this.buttonClick();
		this.filterTest();
		this.snippetTest();
		this.apiTest();
		this.chp();
		this.promiseTest();
		this.mathAndDate();
		this.promiseFlattening();
		this.locStor();
		this.myQueryTest();
	}
}

class Home {
	constructor() {
		this._i18n = new $i18n();
		window._ = this._i18n._.bind(this._i18n);
		this._i18n.setLanguage("en");
		this._i18n.addLanguage("cs", {
		"home_page": {
			"title": "Onix framework - testovací stránka"
		}});

		console.log("app run - test for provider during run");

		// route for home page
		let templateId = "detail";
		let homePageCtrl = {
			controller: params => {
				new HomePage({
					templ: templateId,
					i18n: this._i18n
				});
			},
			templateId,
			templateUrl: "/templ/detail.html",
			id: "HomePage"
		};

		// application routes
		$route$1
			.when("/", homePageCtrl)
			.otherwise(homePageCtrl);

		this._run();
	}

	async _run() {
		await $template$1.load("testTempl", "/templ/test-templ.html"),
		await this._i18n.loadLanguage(CONFIG.LOCALIZATION.LANG, CONFIG.LOCALIZATION.PATH);
		$route$1.go();
	}
}

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

class $slider extends $event {
	constructor(parent, optsArg) {
		super();
		
		this._parent = parent;
		this._root = this._create();

		this._opts = {
			min: 0,
			max: 100,
			wheelStep: 1,
			timeout: 333
		};

		for (let key in optsArg) {
			this._opts[key] = optsArg[key];
		}

		// selected value
		this._value = null;

		// signal change - helper
		this._signalObj = {
			id: null,
			lastValue: null
		};

		parent.appendChild(this._root);

		this._binds = {
			keyUp: this._keyUp.bind(this),
			click: this._click.bind(this),
			mouseDownCaret: this._mouseDownCaret.bind(this),
			mouseMove: this._mouseMove.bind(this),
			mouseWheel: this._mouseWheel.bind(this),
			mouseUp: this._mouseUp.bind(this),
			sendSignalInner: this._sendSignalInner.bind(this)
		};

		this._mouse = {
			bcr: null
		};

		this._els.input.addEventListener("keyup", this._binds.keyUp);
		this._els.tube.addEventListener("click", this._binds.click);
		this._els.caret.addEventListener("mousedown", this._binds.mouseDownCaret);
		// firefox
		this._els.lineHolder.addEventListener("DOMMouseScroll", this._binds.mouseWheel);
		// others
		this._els.lineHolder.addEventListener("mousewheel", this._binds.mouseWheel);
		
		// def. max value
		this.setValue(this._opts.max);
	}

	/**
	 * Set slider value.
	 * 
	 * @param {Number} value New value
	 * @return {Boolean} If there was error, it returns false
	 * @member $slider
	 * @method setValue
	 */
	setValue(value) {
		if (typeof value === "number") {
			value = setRange(value, this._opts.min, this._opts.max);

			this._value = value;
			this._els.input.value = value;
			this._els.input.classList.remove("error");

			this._setCaret(this._getPosFromValue(value));

			return true;
		}
		else {
			return false;
		}
	}

	/**
	 * Get slider value.
	 * 
	 * @return {Number}
	 * @member $slider
	 * @method getValue
	 */
	getValue() {
		return this._value;
	}

	/**
	 * Overwrite configuration object.
	 *
	 * @param {Object} optsArg See constructor.
	 * @member $slider
	 * @method rewriteOpts
	 */
	rewriteOpts(optsArg) {
		for (let key in optsArg) {
			this._opts[key] = optsArg[key];
		}

		this._value = setRange(this._value, this._opts.min, this._opts.max);

		this.setValue(this._value);
	}

	/**
	 * Create slider and his children.
	 *
	 * @member $slider
	 * @private
	 * @method _create
	 */
	_create() {
		this._els = {};

		return create({
			el: "div",
			class: "slider",
			child: [{
				el: "input",
				type: "text",
				value: "",
				_exported: "input"
			}, {
				el: "span",
				class: "line-holder",
				_exported: "lineHolder",
				child: [{
					el: "span",
					class: "lh-tube",
					_exported: "tube"
				}, {
					el: "span",
					class: "lh-caret",
					_exported: "caret"
				}]
			}]
		}, this._els);
	}

	/**
	 * Set caret position.
	 * 
	 * @param {Number} posX Value [px] caret offset accord to the start
	 * @member $slider
	 * @private
	 * @method _setCaret
	 */
	_setCaret(posX) {
		let width = this._els.lineHolder.offsetWidth;

		if (posX < 0) {
			posX = 0;
		}
		else if (posX > width) {
			posX = width;
		}

		this._els.caret.style.left = posX.toFixed(2) + "px";
	}

	/**
	 * Get mouse coordinates.
	 * 
	 * @param  {Event} e
	 * @return {Object}
	 * @private
	 * @member $slider
	 * @method _getMouseXY
	 */
	_getMouseXY(e) {
		return {
			x: e.clientX - this._mouse.bcr.left,
			y: e.clientY - this._mouse.bcr.top
		}
	}

	/**
	 * Set mouse bounding client rect from canvas el.
	 * 
	 * @private
	 * @member $slider
	 * @method _setBCR
	 */
	_setBCR() {
		this._mouse.bcr = this._els.lineHolder.getBoundingClientRect();
	}

	/**
	 * Key up event from the input.
	 *
	 * @member $slider
	 * @private
	 * @method _keyUp
	 */
	_keyUp() {
		var inputEl = this._els.input;
		var value = parseFloat(inputEl.value);
		var errors = false;

		if (isNaN(value) || value < this._opts.min || value > this._opts.max) {
			errors = true;
		}
		else {
			// set new value
			this.setValue(value);
			this._sendSignal(true);
		}

		inputEl.classList[errors ? "add" : "remove"]("error");
	}

	/**
	 * Click on tube event.
	 *
	 * @param {Event} e
	 * @member $slider
	 * @private
	 * @method _click
	 */
	_click(e) {
		cancelEvents(e);
		this._setBCR();

		let width = this._els.lineHolder.offsetWidth;
		let value = this._getMouseXY(e).x;
		let ratio = value / width;

		// increate click range
		if (ratio <= 0.05) {
			value = 0;
		}
		else if (ratio >= 0.95) {
			value = width;
		}

		this._setCaret(value);
		this._setValue(value, true);
	}

	/**
	 * Click on the caret event, binds mouse up over the document.
	 *
	 * @param {Event} e
	 * @member $slider
	 * @private
	 * @method _mouseDownCaret
	 */
	_mouseDownCaret(e) {
		cancelEvents(e);
		this._setBCR();

		document.addEventListener("mousemove", this._binds.mouseMove);
		document.addEventListener("mouseup", this._binds.mouseUp);
	}

	/**
	 * Mouse move event over line holder - only if was clicked on the caret.
	 *
	 * @param {Event} e
	 * @member $slider
	 * @private
	 * @method _mouseMove
	 */
	_mouseMove(e) {
		let caretEl = this._els.caret;
		let posX = this._getMouseXY(e).x;

		this._setCaret(posX);
		this._setValue(posX);
	}

	/**
	 * Mouse up event over the document.
	 * 
	 * @member $slider
	 * @private
	 * @method _mouseUp
	 */
	_mouseUp() {
		document.removeEventListener("mousemove", this._binds.mouseMove);
		document.removeEventListener("mouseup", this._binds.mouseUp);
	}

	/**
	 * Mouse wheel event.
	 *
	 * @param {Event} e Mouse event
	 * @private
	 * @member $slider
	 * @method _mouseWheel
	 */
	_mouseWheel(e) {
		let delta = e.wheelDelta || -e.detail;

		if (!delta) { return; }

		cancelEvents(e);

		if (delta > 0) {
			this.setValue(this._value + this._opts.wheelStep);
			this._sendSignal();
		}
		else {
			this.setValue(this._value - this._opts.wheelStep);
			this._sendSignal();
		}
	}

	/**
	 * Get value -> position convert.
	 *
	 * @param {Number} value Value in the range --> [px] position for the caret.
	 * @return {Number}
	 * @member $slider
	 * @private
	 * @method _getPosFromValue
	 */
	_getPosFromValue(value) {
		value = value || this._value;

		let width = this._els.lineHolder.offsetWidth;
		let range = this._opts.max - this._opts.min;
		let posX = (value - this._opts.min) / range * width;

		return posX;
	}

	/**
	 * Set value using caret position. Fires signal "change".
	 *
	 * @param {Number} posX Value on the axe x
	 * @param {Boolean} [fromClick] It was called from click method?
	 * @member $slider
	 * @private
	 * @method _setValue
	 */
	_setValue(posX, fromClick) {
		posX = posX || 0;

		let width = this._els.lineHolder.offsetWidth;
		let range = this._opts.max - this._opts.min;

		if (posX < 0) {
			posX = 0;
		}
		else if (posX > width) {
			posX = width;
		}

		let value = Math.round(posX / width * range + this._opts.min);

		this._value = value;
		this._els.input.value = value;
		this._els.input.classList.remove("error");

		this._sendSignal(!fromClick);
	}

	/**
	 * Delayed sending of signal.
	 *
	 * @param {Boolean} [withTimeout] Send with timeout?
	 * @member $slider
	 * @private
	 * @method _sendSignal
	 */
	_sendSignal(withTimeout) {
		if (this._signalObj.id) {
			clearTimeout(this._signalObj.id);
			this._signalObj.id = null;
		}

		if (withTimeout) {
			this._signalObj.id = setTimeout(this._binds.sendSignalInner, this._opts.timeout);
		}
		else {
			this._sendSignalInner();
		}
	}

	/**
	 * Delayed sending of signal - inner method.
	 *
	 * @member $slider
	 * @private
	 * @method _sendSignalInner
	 */
	_sendSignalInner() {
		if (this._value == this._signalObj.lastValue) return;

		this._signalObj.lastValue = this._value;
		this.trigger("change", this._value);
	}
}

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
 * @param {Object} [optsArg.curEntity = ENTITES.CIRCLE] Start entity from ENTITES
 * @param {Number} [optsArg.showPreview = true] Show preview - image overview
 * @param {Number} [optsArg.previewLeft = 17] Preview location from left top corner, axe x [px]
 * @param {Number} [optsArg.previewTop = 17] Preview location from left top corner, axe y [px]
 * @param {Number} [optsArg.previewWidth = 200] Preview image width [px]
 * @param {HTMLElement} [optsArg.entityPreview = null] Create entity preview? Parent for append.
 * @class $anonymizer
 */

/**
 * List of entites.
 * 
 * @type {Object}
 * @param {Object} CIRCLE Circle entity
 * @param {Object} LINE Line entity
 * @member $anonymizer
 * @static
 */
const ENTITES = {
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

class $anonymizer extends $event {
	constructor(parent, optsArg) {
		super();

		// is canvas available?
		if (!CANVAS) {
			console.error("Canvas is not available!");
			return;
		}
		
		// parent reference
		this._parent = parent;
		this._parent.classList.add("anonymizer");

		this._opts = {
			canWidth: parent.offsetWidth || 0,
			canHeight: parent.offsetHeight || 0,
			zoom: 100,
			minZoom: 20,
			maxZoom: 100,
			zoomStep: 10,
			zoomMoveStep: 1,
			curEntity: ENTITES.CIRCLE,
			showPreview: true,
			previewLeft: 17,
			previewTop: 17,
			previewWidth: 200,
			entityPreview: null
		};

		for (var key in optsArg) {
			this._opts[key] = optsArg[key];
		}

		// canvas width & height
		this._canWidth = this._opts.canWidth;
		this._canHeight = this._opts.canHeight;

		// zoom
		this._zoom = this._opts.zoom;
		// zoom step
		this._zoomStep = this._opts.zoomStep;
		// step for zoom move
		this._zoomMoveStep = 0;

		// act. image width
		this._curWidth = 0;
		// act. image height
		this._curHeight = 0;

		// create main canvas
		this._canvas = document.createElement("canvas");
		this._canvas.width = this._canWidth;
		this._canvas.height = this._canHeight;

		// ctx of main canvas
		this._ctx = this._canvas.getContext("2d");
		// loaded image
		this._img = null;

		// original image width
		this._imgWidth = 0;
		// original image height
		this._imgHeight = 0;

		// canvas & ctx for create line
		this._lineCanvas = null;
		this._lineCanvasCtx = null;

		// canvas & ctx for preview of a entity
		this._entityCanvas = null;
		this._entityCanvasCtx = null;

		// entites to draw
		this._entites = [];

		// image draw offset axe x
		this._x = 0;

		// image draw offset axe y
		this._y = 0;

		// threshold for click
		this._THRESHOLD = {
			MIN: -1,
			MAX: 1
		};

		// helper for mouse event
		this._mouse = {
			startXSave: 0,
			startYSave: 0,
			startX: 0,
			startY: 0,
			bcr: null
		};

		this._flags = {
			wasRightClick: false,
			wasMove: false,
			wasPreview: false,
			wasLine: false,
			wasImgMove: false
		};

		// binds
		this._binds = {
			mouseWheel: this._mouseWheel.bind(this),
			mouseDown: this._mouseDown.bind(this),
			mouseMove: this._mouseMove.bind(this),
			mouseUp: this._mouseUp.bind(this),
			mouseMoveLine: this._mouseMoveLine.bind(this),
			mouseUpLine: this._mouseUpLine.bind(this),
			contextMenu: this._cancelEvents.bind(this)
		};

		// firefox
		this._canvas.addEventListener("DOMMouseScroll", this._binds.mouseWheel);
		// others
		this._canvas.addEventListener("mousewheel", this._binds.mouseWheel);
		this._canvas.addEventListener("mousedown", this._binds.mouseDown);
		this._canvas.addEventListener("contextmenu", this._binds.contextMenu);

		// spinner - progress for image load
		this._spinner = $loader$1.getSpinner();
		parent.appendChild(this._spinner);
		parent.appendChild(this._canvas);

		// preview canvas
		if (this._opts.entityPreview) {
			this._entityCanvas = document.createElement("canvas");
			this._entityCanvas.width = 300;
			this._entityCanvas.height = 150;
			this._entityCanvasCtx = this._entityCanvas.getContext("2d");

			this._opts.entityPreview.appendChild(this._entityCanvas);
		}
	}

	/**
	 * Load and show image in canvas. Returns promise after load.
	 * 
	 * @param  {String} url Path to image
	 * @return {Promise} Promise
	 * @method loadImage
	 * @member $anonymizer
	 */
	loadImage(url) {
		return new Promise((resolve, reject) => {
			this._setWhiteCanvas();

			this._spinner.classList.remove("hide");

			var img = new Image();

			img.addEventListener("load", () => {
				this._spinner.classList.add("hide");
				this._img = img;
				this._imgWidth = img.width;
				this._imgHeight = img.height;
				this._zoom = this._opts.zoom;

				this.trigger("zoom", this._zoom);

				this._postZoom();
				this._setCenter();
				this._alignImgToCanvas();
				this._drawEntityPreview();
				this._redraw();

				resolve();
			});

			img.addEventListener("error", () => {
				this._spinner.classList.add("hide");

				this._img = null;
				this._imgWidth = 0;
				this._imgHeight = 0;

				reject();
			});

			img.src = url || "";
		});
	}

	/**
	 * Increase zoom by one step, fires signal "zoom".
	 * 
	 * @member $anonymizer
	 * @method zoomPlus
	 */
	zoomPlus() {
		this._setZoom(this._zoom + this._zoomStep);
	}

	/**
	 * Decrease zoom by one step, fires signal "zoom".
	 * 
	 * @member $anonymizer
	 * @method zoomMinus
	 */
	zoomMinus() {
		this._setZoom(this._zoom - this._zoomStep);
	}

	/**
	 * Set new value for zoom.
	 * 
	 * @param  {Number} value New value
	 * @member $anonymizer
	 * @method setZoom
	 */
	setZoom(value) {
		this._setZoom(value);
	}

	/**
	 * Get current draw entity ID.
	 * 
	 * @return {String}
	 * @member $anonymizer
	 * @method getEntityId
	 */
	getEntityId() {
		return this._opts.curEntity.id;
	}

	/**
	 * Switch to other entity, uses priority.
	 *
	 * @member $anonymizer
	 * @method switchEntity
	 */
	switchEntity() {
		let variants = Object.keys(ENTITES);
		let priority = this._opts.curEntity.priority;
		let selVariant = null;
		let lowestVariant = null;

		variants.forEach(variant => {
			let varObj = ENTITES[variant];

			if (!selVariant && varObj.priority > this._opts.curEntity.priority) {
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
	}

	/**
	 * Get current entity object.
	 * 
	 * @return {Object}
	 * @member $anonymizer
	 * @method getEntity
	 */
	getEntity() {
		return this._opts.curEntity;
	}

	/**
	 * Set value for current entity.
	 * 
	 * @param {Number} val New value
	 * @return {Boolean} If there was an error -> it returns false
	 * @member $anonymizer
	 * @method setEntityValue
	 */
	setEntityValue(val) {
		val = val || 0;

		if (val >= this._opts.curEntity.min && val <= this._opts.curEntity.max) {
			this._opts.curEntity.value = val;

			this._drawEntityPreview();

			return true;
		}
		else {
			return false;
		}
	}

	/**
	 * Set circle as a selected entity.
	 *
	 * @member $anonymizer
	 * @method setCircleEntity
	 */
	setCircleEntity() {
		this._opts.curEntity = ENTITES.CIRCLE;

		this._drawEntityPreview();
	}

	/**
	 * Set line as a selected entity.
	 *
	 * @member $anonymizer
	 * @method setLineEntity
	 */
	setLineEntity() {
		this._opts.curEntity = ENTITES.LINE;

		this._drawEntityPreview();
	}

	/**
	 * Take last entity and redraw a scene.
	 * 
	 * @member $anonymizer
	 * @method stepBack
	 */
	stepBack() {
		if (!this._imgWidth && !this._imgHeight) return;
		
		this._entites.pop();

		this._redraw();
	}

	/**
	 * Remove all entites and redraw a scene.
	 * 
	 * @member $anonymizer
	 * @method removeAll
	 */
	removeAll() {
		if (!this._imgWidth && !this._imgHeight) return;

		this._entites = [];

		this._redraw();
	}

	/**
	 * Export all entites on the screen and count them towards original image size.
	 * 
	 * @return {Object}
	 * @member $anonymizer
	 * @method exportEntites
	 */
	exportEntites() {
		let output = {
			actions: [],
			image: {
				width: this._imgWidth,
				height: this._imgHeight
			}
		};

		this._entites.forEach(entity => {
			switch (entity.id) {
				case ENTITES.CIRCLE.id:
					output.actions.push({
						type: entity.id.toLowerCase(),
						x: setRange(Math.round(this._imgWidth * entity.xRatio), 0, this._imgWidth),
						y: setRange(Math.round(this._imgHeight * entity.yRatio), 0, this._imgHeight),
						r: entity.value
					});
					break;

				case ENTITES.LINE.id:
					output.actions.push({
						type: entity.id.toLowerCase(),
						x1: setRange(Math.round(this._imgWidth * entity.xRatio), 0, this._imgWidth),
						y1: setRange(Math.round(this._imgHeight * entity.yRatio), 0, this._imgHeight),
						x2: setRange(Math.round(this._imgWidth * entity.x2Ratio), 0, this._imgWidth),
						y2: setRange(Math.round(this._imgHeight * entity.y2Ratio), 0, this._imgHeight),
						width: entity.value
					});
					break;
			}
		});

		return output;
	}

	/**
	 * Resize canvas with new width and height.
	 * 
	 * @param  {Number} [width] New width in [px]
	 * @param  {Number} [height] New height in [px]
	 * @member $anonymizer
	 * @method syncPort
	 */
	syncPort(width, height) {
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
	}

	/**
	 * Scene redraw - clear, picture, entites.
	 *
	 * @private
	 * @method _redraw
	 * @member $anonymizer
	 */
	_redraw() {
		// pictue
		this._ctx.clearRect(0, 0, this._canWidth, this._canHeight);
		this._ctx.drawImage(this._img, this._x, this._y, this._img.width, this._img.height, 0, 0, this._curWidth, this._curHeight);

		// entites
		if (this._entites.length) {
			let zc = this._zoom / 100;
			let xc = this._x * zc;
			let yc = this._y * zc;

			this._entites.forEach(entity => {
				let x;
				let y;

				switch (entity.id) {
					case ENTITES.CIRCLE.id:
						let radius = Math.round(entity.value * zc);
						x = Math.round(this._curWidth * entity.xRatio - xc);
						y = Math.round(this._curHeight * entity.yRatio - yc);

						this._drawCircle(this._ctx, x, y, radius);
						break;

					case ENTITES.LINE.id:
						let lineWidth = Math.round(entity.value * zc);
						x = Math.round(this._curWidth * entity.xRatio - xc);
						y = Math.round(this._curHeight * entity.yRatio - yc);
						let x2 = Math.round(this._curWidth * entity.x2Ratio - xc);
						let y2 = Math.round(this._curHeight * entity.y2Ratio - yc);

						this._drawLine(this._ctx, x, y, x2, y2, lineWidth);
						break;
				}
			});
		}

		// image preview
		this._drawPreview();
	}

	/**
	 * Draw white canvas.
	 * 
	 * @private
	 * @method _setWhiteCanvas
	 * @member $anonymizer
	 */
	_setWhiteCanvas() {
		this._ctx.clearRect(0, 0, this._canWidth, this._canHeight);
		this._drawFillRect(this._ctx, 0, 0, this._canWidth, this._canHeight, "#fff");
	}

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
	_drawCircle(ctx, x, y, radius) {
		ctx.beginPath();
		ctx.arc(x, y, radius, 0, 2*Math.PI);
		ctx.fillStyle = ENTITES.CIRCLE.fillStyle;
		ctx.closePath();
		ctx.fill();
	}

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
	_drawLine(ctx, x, y, x2, y2, lineWidth) {
		ctx.beginPath();
		ctx.moveTo(x, y);
		ctx.lineTo(x2, y2);
		ctx.lineWidth = lineWidth;
		ctx.strokeStyle = ENTITES.LINE.strokeStyle;
		ctx.closePath();
		ctx.stroke();
	}

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
	_drawFillRect(ctx, x, y, width, height, fillStyle) {
		ctx.beginPath();
		ctx.fillStyle = fillStyle || "";
		ctx.fillRect(x, y, width, height);
		ctx.closePath();
	}

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
	_drawRect(ctx, x, y, width, height, strokeStyle, lineWidth) {
		ctx.beginPath();
		ctx.rect(x, y, width, height);
		ctx.lineWidth = lineWidth || 1;
		ctx.strokeStyle = strokeStyle || "";
		ctx.closePath();
		ctx.stroke();
	}

	/**
	 * Draw a image preview.
	 *
	 * @private
	 * @method _drawPreview
	 * @member $anonymizer
	 */
	_drawPreview() {
		if (!this._opts.showPreview) return;

		let ratio = this._imgWidth / this._imgHeight;
		let height = Math.round(this._opts.previewWidth / ratio);

		// background
		this._drawFillRect(this._ctx, this._opts.previewLeft - 1, this._opts.previewTop - 1, this._opts.previewWidth + 2, height + 2, "rgba(255, 255, 255, 0.5)");

		// picture
		this._ctx.drawImage(this._img, 0, 0, this._img.width, this._img.height, this._opts.previewLeft, this._opts.previewTop, this._opts.previewWidth, height);

		// red border - current view
		let zc = this._zoom / 100;
		let xc = this._x * zc;
		let yc = this._y * zc;

		let xRatio = xc / this._curWidth;
		let yRatio = yc / this._curHeight;
		let x2Ratio = (xc + this._canWidth) / this._curWidth;
		let y2Ratio = (yc + this._canHeight) / this._curHeight;

		// restrictions
		xRatio = setRange(xRatio, 0, 1);
		yRatio = setRange(yRatio, 0, 1);
		x2Ratio = setRange(x2Ratio, 0, 1);
		y2Ratio = setRange(y2Ratio, 0, 1);

		let x1 = Math.round(this._opts.previewLeft + xRatio * this._opts.previewWidth);
		let y1 = Math.round(this._opts.previewTop + yRatio * height);
		let x2 = Math.round(this._opts.previewLeft + x2Ratio * this._opts.previewWidth);
		let y2 = Math.round(this._opts.previewTop + y2Ratio * height);

		// red border
		this._drawRect(this._ctx, x1, y1, x2 - x1, y2 - y1, "#C01", 1);
	}

	/**
	 * Draw a entity preview for circle/line.
	 *
	 * @private
	 * @method _drawEntityPreview
	 * @member $anonymizer
	 */
	_drawEntityPreview() {
		if (!this._opts.entityPreview) return;

		let width = this._entityCanvas.width;
		let height = this._entityCanvas.height;

		this._entityCanvasCtx.clearRect(0, 0, width, height);
		this._drawFillRect(this._entityCanvasCtx, 0, 0, width, height, "#f9f9f9");

		let curEnt = this._opts.curEntity;
		let zc = this._zoom / 100;

		switch (curEnt.id) {
			case ENTITES.CIRCLE.id:
				let radius = Math.round(curEnt.value * zc);
				let x = Math.round(width / 2);
				let y = Math.round(height / 2);

				this._drawCircle(this._entityCanvasCtx, x, y, radius);
				break;

			case ENTITES.LINE.id:
				let x1 = Math.round(width * 0.2);
				let y1 = Math.round(height / 2);
				let x2 = Math.round(width * 0.8);
				// y2 = y1
				let lineWidth = Math.round(curEnt.value * zc);

				this._drawLine(this._entityCanvasCtx, x1, y1, x2, y1, lineWidth);
				break;
		}
	}

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
	_getFromPoint(x, y) {
		let fromPoint = {
			x: x || Math.round(this._canWidth / 2),
			y: y || Math.round(this._canHeight / 2)
		};

		let zc = this._zoom / 100;
		let newX = Math.round(this._x * zc) + fromPoint.x;
		let newY = Math.round(this._y * zc) + fromPoint.y;

		fromPoint.xRatio = newX / this._curWidth;
		fromPoint.yRatio = newY / this._curHeight;

		return fromPoint;
	}

	/**
	 * Post zoom operation - new image dimenstions, new move zoom step.
	 * 
	 * @private
	 * @method _postZoom
	 * @member $anonymizer
	 */
	_postZoom() {
		var zc = this._zoom / 100;

		this._curWidth = Math.round(this._img.width * zc);
		this._curHeight = Math.round(this._img.height * zc);

		if (this._zoom < 100) {
			// function for zoom and mouse move
			this._zoomMoveStep = Math.max(((100 - this._zoom) / 10 * this._opts.zoomMoveStep) / 2, 1);
		}
	}

	/**
	 * Set image center on the canvas center.
	 *
	 * @private
	 * @method _setCenter
	 * @member $anonymizer
	 */
	_setCenter() {
		this._setPosition(0.5, 0.5);
	}
	
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
	_setPosition(xRatio, yRatio, x, y) {
		x = x || this._canWidth / 2;
		y = y || this._canHeight / 2;

		xRatio = setRange(xRatio, 0, 1);
		yRatio = setRange(yRatio, 0, 1);

		let zc = this._zoom / 100;
		let xc = (this._curWidth * xRatio) - x;
		let yc = (this._curHeight * yRatio) - y;

		this._x = Math.max(Math.round(xc / zc), 0);
		this._y = Math.max(Math.round(yc / zc), 0);
	}

	/**
	 * Align image to the canvas - left top corner and bottom right corner.
	 *
	 * @private
	 * @method _alignImgToCanvas
	 * @member $anonymizer
	 */
	_alignImgToCanvas() {
		let maxX = Math.max(this._curWidth - this._canWidth, 0);
		let currX = Math.round(this._x * this._zoom / 100);

		if (this._x < 0) {
			this._x = 0;
		}
		else if (currX > maxX) {
			this._x = Math.round(maxX * 100 / this._zoom);
		}

		let maxY = Math.max(this._curHeight - this._canHeight, 0);
		let currY = Math.round(this._y * this._zoom / 100);

		if (this._y < 0) {
			this._y = 0;
		}
		else if (currY > maxY) {
			this._y = Math.round(maxY * 100 / this._zoom);
		}
	}

	/**
	 * It event contains right mouse click?
	 *
	 * @param {Event} e Mouse event
	 * @return {Boolean}
	 * @private
	 * @method _isRightClick
	 * @member $anonymizer
	 */
	_isRightClick(e) {
		if (e && ((e.which && e.which == 3) || (e.button && e.button == 2))) {
			return true;
		}
		else {
			return false;
		}
	}

	/**
	 * Cancel events.
	 * 
	 * @param  {Event} e Mouse event
	 * @private
	 * @method _cancelEvents
	 * @member $anonymizer
	 */
	_cancelEvents(e) {
		cancelEvents(e);
	}

	/**
	 * Mouse wheel event.
	 *
	 * @param {Event} e Mouse event
	 * @private
	 * @method  _mouseWheel
	 * @member $anonymizer
	 */
	_mouseWheel(e) {
		if (!this._imgWidth && !this._imgHeight) return;

		let delta = e.wheelDelta || -e.detail;
		if (!delta) { return; }

		this._cancelEvents(e);
		this._setBCR();

		let data = this._getMouseXY(e);
		let fromPoint = this._getFromPoint(data.x, data.y);

		if (delta > 0) {
			this._setZoom(this._zoom + this._zoomStep, fromPoint);
		}
		else {
			this._setZoom(this._zoom - this._zoomStep, fromPoint);
		}
	}

	/**
	 * Get mouse coordinates.
	 * 
	 * @param  {Event} e
	 * @return {Object}
	 * @private
	 * @method _getMouseXY
	 * @member $anonymizer
	 */
	_getMouseXY(e) {
		return {
			x: e.clientX - this._mouse.bcr.left,
			y: e.clientY - this._mouse.bcr.top
		}
	}

	/**
	 * Set mouse bounding client rect from canvas el.
	 * 
	 * @private
	 * @method _setCBR
	 * @member $anonymizer
	 */
	_setBCR() {
		this._mouse.bcr = this._canvas.getBoundingClientRect();
	}

	/**
	 * Mouse down - create a circle, start of the line, start of move.
	 *
	 * @param {Event} e Mouse event
	 * @private
	 * @method _mouseDown
	 * @member $anonymizer
	 */
	_mouseDown(e) {
		if (!this._imgWidth && !this._imgHeight) return;

		this._cancelEvents(e);
		this._setBCR();

		let data = this._getMouseXY(e);

		this._mouse.startXSave = data.x;
		this._mouse.startYSave = data.y;
		this._mouse.startX = this._mouse.startXSave;
		this._mouse.startY = this._mouse.startYSave;

		this._flags.wasMove = false;
		this._flags.wasRightClick = this._isRightClick(e);

		// circle
		if (this._opts.curEntity == ENTITES.CIRCLE) {
			this._flags.wasImgMove = false;
			this._flags.wasPreview = false;

			document.addEventListener("mousemove", this._binds.mouseMove);
			document.addEventListener("mouseup", this._binds.mouseUp);
		}
		// line
		else if (this._opts.curEntity == ENTITES.LINE) {
			// add canvas
			let lineCanvas = document.createElement("canvas");
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
	}

	/**
	 * Image move - according to the coordinates of the mouse.
	 * 
	 * @param  {Number} newX New value on the axe x
	 * @param  {Number} newY New value on the axe y
	 * @private
	 * @method _imgMove
	 * @member $anonymizer
	 */
	_imgMove(newX, newY) {
		let diffX = this._mouse.startX - newX;
		let diffY = this._mouse.startY - newY;

		if (diffX == 0 && diffY == 0) {
			return;
		}

		// image movement constant
		let zms = this._zoomMoveStep > 0 ? this._zoomMoveStep : 1;

		// move image to the new coordinates
		this._x = diffX * zms + this._x;
		this._y = diffY * zms + this._y;

		this._alignImgToCanvas();

		this._redraw();
	}

	/**
	 * Mouse move over the canvas.
	 *
	 * @param {Event} e Mouse event
	 * @private
	 * @method _mouseMove
	 * @member $anonymizer
	 */
	_mouseMove(e) {
		let data = this._getMouseXY(e);

		// mouse cursor
		if (!this._flags.wasMove) {
			this._canvas.classList.add("is-dragged");
		}

		// mouse move flag
		this._flags.wasMove = true;

		// mouse move over the preview?
		let isPreview = this._isPreview(data.x, data.y);

		if (!this._flags.wasRightClick && !this._flags.wasImgMove && isPreview) {
			// set preview flag
			this._flags.wasPreview = true;

			// image move over the preview
			this._setPosition(isPreview.xRatio, isPreview.yRatio);

			this._alignImgToCanvas();

			this._redraw();
		}
		else if (!this._flags.wasPreview) {
			// image move - flag
			this._flags.wasImgMove = true;

			// image move
			this._imgMove(data.x, data.y);
		}

		// save
		this._mouse.startX = data.x;
		this._mouse.startY = data.y;
	}

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
	_isPreview(x, y) {
		if (!this._opts.showPreview) return null;

		let ratio = this._imgWidth / this._imgHeight;

		// sirka a vyska nahledu
		let width = this._opts.previewWidth;
		let height = Math.round(this._opts.previewWidth / ratio);

		let left = this._opts.previewLeft;
		let top = this._opts.previewTop;
		let zc = this._zoom / 100;

		x = x || 0;
		y = y || 0;

		if (x >= left && x <= left + width && y >= top && y <= top + height) {
			return {
				xRatio: (x - left) / width,
				yRatio: (y - top) / height
			};
		}
		else {
			return null;
		}
	}

	/**
	 * Mouse up - draw a circle, end of move, preview click.
	 *
	 * @param {Event} e Mouse event
	 * @private
	 * @method _mouseUp
	 * @member $anonymizer
	 */
	_mouseUp(e) {
		let data = this._getMouseXY(e);
		let thresholdTest = false;

		// only it was move
		if (this._flags.wasMove) {
			// difference towards start click
			let diffX = this._mouse.startXSave - data.x;
			let diffY = this._mouse.startYSave - data.y;

			if (diffX >= this._THRESHOLD.MIN && diffX <= this._THRESHOLD.MAX && diffY >= this._THRESHOLD.MIN && diffY <= this._THRESHOLD.MAX) {
				// we are in the range
				thresholdTest = true;
			}
		}

		// click - there was no move, threshold test, it is disabled for right mouse click
		if (!this._flags.wasRightClick && (!this._flags.wasMove || thresholdTest)) {
			let isPreview = this._isPreview(data.x, data.y);

			if (isPreview) {
				// preview click - click coordinates on the canvas center
				this._setPosition(isPreview.xRatio, isPreview.yRatio);
				this._alignImgToCanvas();
				this._redraw();
			}
			else {
				// add circle
				let zc = this._zoom / 100;
				let x = Math.round(this._x * zc) + data.x;
				let y = Math.round(this._y * zc) + data.y;

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
	}

	/**
	 * Mouse move over canvas - line draw.
	 *
	 * @param {Event} e Mouse event
	 * @private
	 * @method _mouseMoveLine
	 * @member $anonymizer
	 */
	_mouseMoveLine(e) {
		let data = this._getMouseXY(e);

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
			let isPreview = this._isPreview(data.x, data.y);
			let wasPreview = this._flags.wasPreview;

			if (!this._flags.wasLine && isPreview) {
				this._flags.wasPreview = true;

				// move over preview
				this._setPosition(isPreview.xRatio, isPreview.yRatio);

				this._alignImgToCanvas();

				this._redraw();
			}
			else if (!this._flags.wasPreview) {
				this._flags.wasLine = true;

				// line width
				let lineWidth = Math.round(this._opts.curEntity.value * this._zoom / 100);

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
	}

	/**
	 * End of move over canvas - create line, image move.
	 * Draw a line in main canvas.
	 *
	 * @param {Event} e Mouse event
	 * @private
	 * @method _mouseUpLine
	 * @member $anonymizer
	 */
	_mouseUpLine(e) {
		let data = this._getMouseXY(e);
		let isPreview = null;

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
			}
			else if (this._flags.wasLine) {
				// create a line
				let zc = this._zoom / 100;
				let xc = Math.round(this._x * zc);
				let yc = Math.round(this._y * zc);

				let x = xc + this._mouse.startX;
				let y = yc + this._mouse.startY;
				let x2 = xc + data.x;
				let y2 = yc + data.y;

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
	}

	/**
	 * Set new value for zoom.
	 * 
	 * @param  {Number} value New value
	 * @param  {Object} [fromPoint] Center of the screen or data from mouse wheel
	 * @private
	 * @method _setZoom
	 * @member $anonymizer
	 */
	_setZoom(value, fromPoint) {
		fromPoint = fromPoint || this._getFromPoint();

		var oldZoom = this._zoom;
		var newZoom = setRange(value, this._opts.minZoom, this._opts.maxZoom);

		if (newZoom == oldZoom) return;

		this._zoom = newZoom;

		this.trigger("zoom", this._zoom);

		this._postZoom();
		this._setPosition(fromPoint.xRatio, fromPoint.yRatio, fromPoint.x, fromPoint.y);
		this._alignImgToCanvas();
		this._drawEntityPreview();
		this._redraw();
	}
}

class Anonymizer {
	constructor() {
		this._els = null;
		this._anonymizer = null;

		$template$1.bindTemplate(document.querySelector(".main-cont"), this, elsObj => {
			this._els = elsObj;
		});

		this._slider = new $slider(this._els.sliderHolder, {
			timeout: 0,
			wheelStep: 3
		});

		this._slider.on("change", value => {
			this._anonymizer.setEntityValue(value);
		});

		this._anonymizer = new $anonymizer(this._els.canvasHolder, {
			zoom: 20,
			zoomMoveStep: 1,
			maxZoom: 140,
			minZoom: 20,
			entityPreview: this._els.canvasEntityHolder,
			canWidth: 1024,
			canHeight: 512
		});

		if (!CANVAS) {
			alert("Canvas is not available!");
			return;
		}

		//this._anonymizer.loadImage("/img-test/test-photo.jpg");
		this._anonymizer.loadImage("/img-test/pano.jpg");

		this._anonymizer.on("zoom", value => {
			let zoomEl = this._els.zoom;
			zoomEl.innerHTML = "Zoom " + value;
		});

		this._setEntity();
	}

	zoomPlus() {
		this._anonymizer.zoomPlus();
	}

	zoomMinus() {
		this._anonymizer.zoomMinus();
	}

	switchEntity() {
		this._anonymizer.switchEntity();

		this._setEntity();
	}

	_setEntity() {
		let switcher = this._els.switcher;
		switcher.innerHTML = "Current: " + this._anonymizer.getEntityId();

		let entityObj = this._anonymizer.getEntity();

		this._slider.rewriteOpts({
			min: entityObj.min,
			max: entityObj.max
		});

		this._slider.setValue(entityObj.value);
	}

	stepBack() {
		this._anonymizer.stepBack();
	}
	
	removeAll() {
		this._anonymizer.removeAll();
	}

	"export"() {
		console.log(this._anonymizer.exportEntites());
	}
}

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

class $crop {
	constructor(options) {
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

		for (let op in options) {
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

		this._points = { nw: { x: 0, y: 0 }, ne: { x: 0, y: 0 }, sw: { x: 0, y: 0 }, se: { x: 0, y: 0 }};
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
	 * Set crop center above his area.
	 * 
	 * @member $crop
	 * @method setCenter
	 */
	setCenter() {
		this._setCenter();

		this._redraw();
	}

	/**
	 * Fit crop to whole area and center him on the screen.
	 * 
	 * @member $crop
	 * @method fitToArea
	 */
	fitToArea() {
		let width;
		let height;

		if (this._options.aspectRatio) {
			let ratio = this._options.aspectRatio;

			// try width
			width = this._dim.areaWidth;
			height = Math.round(width / ratio);

			// try height
			if (height > this._dim.areaHeight) {
				height = this._dim.areaHeight;
				width = Math.round(height * ratio);
			}
		}
		else {
			width = Math.min(this._options.maxWidth, this._dim.areaWidth);
			height = Math.min(this._options.maxHeight, this._dim.areaHeight);
		}
		
		// update dimensions
		this._dim.width = width;
		this._dim.height = height;

		// center and redraw
		this.setCenter();
	}

	/**
	 * Remove crop from DOM.
	 * 
	 * @member $crop
	 * @method destroy
	 */
	destroy() {
		let c = this.getContainer();

		if (c.parentNode) {
			c.parentNode.removeChild(c);
		}

		this._dom.container.removeEventListener("mousedown", this._binds.mouseDown);
	}

	/**
	 * Get crop root el.
	 * 
	 * @return {HTMLElement}
	 * @member $crop
	 * @method getContainer
	 */
	getContainer() {
		return this._dom.container;
	}

	/**
	 * Set crop area dimensions.
	 * 
	 * @param {Object} [dim]
	 * @param {Number} [dim.areaWidth] Area width
	 * @param {Number} [dim.areaHeight] Area height
	 * @member $crop
	 * @method setDim
	 */
	setDim(dim) {
		dim = dim || {};

		if (dim.areaWidth) {
			this._dim.areaWidth = dim.areaWidth;

			this._dom.container.style.width = this._dim.areaWidth + "px";
		}

		if (dim.areaHeight) {
			this._dim.areaHeight = dim.areaHeight;

			this._dom.container.style.height = this._dim.areaHeight + "px";
		}
	}

	/**
	 * Show crop.
	 *
	 * @member $crop
	 * @method show
	 */
	show() {
		this._dom.container.classList.remove(this._CONST.HIDE_CLASS);
	}

	/**
	 * Hide crop.
	 *
	 * @member $crop
	 * @method hide
	 */
	hide() {
		this._dom.container.classList.add(this._CONST.HIDE_CLASS);
	}

	/**
	 * Is crop visible?
	 * 
	 * @return {Boolean}
	 * @member $crop
	 * @method isVisible
	 */
	isVisible() {
		return !(this._dom.container.classList.contains(this._CONST.HIDE_CLASS));
	}

	/**
	 * Is crop changed?
	 * 
	 * @return {Boolean}
	 * @member $crop
	 * @method isChanged
	 */
	isChanged() {
		return this._changed;
	}

	/**
	 * Backup current crop state - his position and change state.
	 * 
	 * @member $crop
	 * @method backup
	 */
	backup() {
		this._backupData = {
			changed: this._changed,
			aabb: this.getAABB()
		};
	}

	/**
	 * Restore crop saved state - his position and change state.
	 * 
	 * @member $crop
	 * @method restore
	 */
	restore() {
		if (this._backupData) {
			this._changed = this._backupData.changed;

			let aabb = this._backupData.aabb;

			let nw = this._points["nw"];
			let ne = this._points["ne"];
			let sw = this._points["sw"];
			let se = this._points["se"];

			// restore
			nw.x = aabb[0];
			nw.y = aabb[1];
			se.x = aabb[2];
			se.y = aabb[3];

			ne.x = se.x;
			ne.y = nw.y;
			sw.x = nw.x;
			sw.y = se.y;

			let size = this._getSize();

			this._dim.width = size.width;
			this._dim.height = size.height;

			this._redraw();

			this._backupData = null;
		}
	}

	/**
	 * Get crop bounding box.
	 * 
	 * @param {Number} [scale=1] Recalculate all positions using scale constants, def. is 1
	 * @return {Array} [x1, y1, x2, y2] 2 points coordinates from top left corner
	 * @member $crop
	 * @method getAABB
	 */
	getAABB(scale) {
		let nw = this._points["nw"];
		let se = this._points["se"];

		scale = scale || 1.0;

		return [
			Math.round(nw.x * scale),
			Math.round(nw.y * scale),
			Math.round(se.x * scale),
			Math.round(se.y * scale)
		];
	}

	/**
	 * Create crop element.
	 * 
	 * @return {Element}
	 * @member $crop
	 * @private
	 * @method _create
	 */
	_create() {
		let cropClass = ["crop"];

		if (this._options.resizable) {
			cropClass.push("resizable");
		}

		create({
			el: "div",
			class: cropClass,
			child: [{
				el: "div",
				class: "crop-top",
				child: [{
					el: "span",
					class: "point-nw"
				}, {
					el: "span",
					class: "point-ne"
				}],
				_exported: "cropTop"
			}, {
				el: "div",
				class: "crop-bottom",
				child: [{
					el: "span",
					class: "point-sw"
				}, {
					el: "span",
					class: "point-se"
				}],
				_exported: "cropBottom"
			}, {
				el: "div",
				class: "crop-left",
				_exported: "cropLeft"
			}, {
				el: "div",
				class: "crop-right",
				_exported: "cropRight"
			}, {
				el: "div",
				class: "crop-middle",
				_exported: "cropMiddle"
			}],
			_exported: "container"
		}, this._dom);
	}

	/**
	 * Set crop center above his area.
	 *
	 * @private
	 * @member $crop
	 * @method _setCenter
	 */
	_setCenter() {
		let width = this._dim.width;
		let height = this._dim.height;

		let leftDiff = Math.round((this._dim.areaWidth - width) / 2);
		let topDiff = Math.round((this._dim.areaHeight - height) / 2);

		let p = this._points;

		p.nw.x = leftDiff;
		p.nw.y = topDiff;

		p.ne.x = p.nw.x + width;
		p.ne.y = p.nw.y + height;

		p.sw.x = this._dim.areaWidth - leftDiff;
		p.sw.y = this._dim.areaHeight - topDiff;

		p.se.x = p.ne.x;
		p.se.y = p.ne.y;
	}

	/**
	 * Align crop points inside his area.
	 * 
	 * @private
	 * @member $crop
	 * @method _alignPoints
	 */
	_alignPoints() {
		let p = this._points;
		let w = this._dim.areaWidth - this._dim.width;
		let h = this._dim.areaHeight - this._dim.height;

		p.nw.x = setRange(p.nw.x, 0, w);
		p.sw.x = setRange(p.sw.x, 0, w);
		p.ne.x = setRange(p.ne.x, this._dim.width, this._dim.areaWidth);
		p.se.x = setRange(p.se.x, this._dim.width, this._dim.areaWidth);

		p.nw.y = setRange(p.nw.y, 0, h);
		p.ne.y = setRange(p.ne.y, 0, h);
		p.sw.y = setRange(p.sw.y, this._dim.height, this._dim.areaHeight);
		p.se.y = setRange(p.se.y, this._dim.height, this._dim.areaHeight);
	}

	/**
	 * Redraw crop - calculate all his points and set them in dom objects.
	 * 
	 * @private
	 * @member $crop
	 * @method _redraw
	 */
	_redraw() {
		let p = this._points;

		let leftX = p.nw.x;
		let leftY = p.nw.y;
		let size = this._getSize();

		this._dom.cropTop.style.left = leftX + "px";
		this._dom.cropTop.style.width = size.width + "px";
		this._dom.cropTop.style.height = leftY + "px";

		this._dom.cropBottom.style.left = leftX + "px";
		this._dom.cropBottom.style.width = size.width + "px";
		this._dom.cropBottom.style.height = (this._dim.areaHeight - p.sw.y) + "px";

		this._dom.cropLeft.style.width = leftX + "px";
		this._dom.cropLeft.style.height = this._dim.areaHeight + "px";

		this._dom.cropRight.style.width = (this._dim.areaWidth - p.ne.x) + "px";
		this._dom.cropRight.style.height = this._dim.areaHeight + "px";

		this._dom.cropMiddle.style.width = size.width + "px";
		this._dom.cropMiddle.style.height = size.height + "px";
		this._dom.cropMiddle.style.left = leftX + "px";
		this._dom.cropMiddle.style.top = leftY + "px";
	}

	/**
	 * Mouse down - move/resize crop.
	 * 
	 * @param  {Event} e
	 * @private
	 * @member $crop
	 * @method _mouseDown
	 */
	_mouseDown(e) {
		cancelEvents(e);

		// ie8
		let target = e.target || e.srcElement;

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
	}

	/**
	 * Mouse move - move/resize crop.
	 * 
	 * @param  {Event} e
	 * @private
	 * @member $crop
	 * @method _mouseMove
	 */
	_mouseMove(e) {
		cancelEvents(e);

		let diffX =  e.clientX - this._mouse.startX;
		let diffY = e.clientY - this._mouse.startY;

		if (this._type == "crop-middle") {
			// move
			Object.keys(this._points).forEach(key => {
				this._points[key].x += diffX;
				this._points[key].y += diffY;
			});

			this._alignPoints();
			this._redraw();
		}
		else {
			// resize - which group?
			let group = this._groups[this._type];

			if (this._options.aspectRatio) {
				diffY = diffX / this._options.aspectRatio * (this._type == "point-nw" || this._type == "point-se" ? 1 : -1);
			}

			if (this._resizeTest(diffX, diffY, group)) {
				group.forEach(i => {
					let point = this._points[i.type];

					// add diffx, diffy to all group members
					point.x += i.x ? diffX : 0;
					point.y += i.y ? diffY : 0;
				});

				// update size
				let size = this._getSize();

				this._dim.width = size.width;
				this._dim.height = size.height;

				this._redraw();
			}
		}

		// overwrite
		this._mouse.startX = e.clientX;
		this._mouse.startY = e.clientY;
	}

	/**
	 * Mouse up - end of move/resize crop.
	 * 
	 * @param  {Event} e
	 * @private
	 * @member $crop
	 * @method _mouseUp
	 */
	_mouseUp(e) {
		cancelEvents(e);

		document.removeEventListener("mousemove", this._binds.mouseMove);
		document.removeEventListener("mouseup", this._binds.mouseUp);

		if (this._mouse.startXSave != e.clientX || this._mouse.startYSave != e.clientY) {
			// crop was changed
			this._changed = true;
		}
	}

	/**
	 * Get size of crop.
	 * 
	 * @param  {Object} [points] Points object, default is used crop points.
	 * @return {Object}
	 * @member $crop
	 * @method _getSize
	 */
	_getSize(points) {
		points = points || this._points;

		return {
			width: Math.abs(points.ne.x - points.nw.x),
			height: Math.abs(points.sw.y - points.nw.y)
		};
	}

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
	_resizeTest(diffX, diffY, group) {
		if (!this._options.aspectRatio) {
			return false;
		}

		let points = {
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

		group.forEach(i => {
			let point = points[i.type];

			// add diffx, diffy to all group members
			point.x = this._points[i.type].x + (i.x ? diffX : 0);
			point.y = this._points[i.type].y + (i.y ? diffY : 0);
		});

		// min. and max. value
		let size = this._getSize(points);

		// test
		if (
			size.width < this._options.minWidth || size.width > this._options.maxWidth ||
			size.height < this._options.minHeight || size.height > this._options.maxHeight ||
			points.nw.x < 0 || points.se.x > this._dim.areaWidth ||
			points.nw.y < 0 || points.sw.y > this._dim.areaHeight
		) {
			return false;
		}
		else {
			return true;
		}
	}
}

class Cropper {
	constructor() {
		this._els = null;
		this._anonymizer = null;

		$template$1.bindTemplate(document.querySelector(".main-cont"), this, elsObj => {
			this._els = elsObj;
		});

		this._cropper = new $crop({
			minWidth: 40,
			minHeight: 40,
			aspectRatio: 1
		});

		let cont = this._cropper.getContainer();
		let parEl = document.querySelector(".crop-area");
		parEl.appendChild(cont);

		this._cropper.setDim({
			areaWidth: parEl.offsetWidth,
			areaHeight: parEl.offsetHeight
		});

		this.setCenter();
		this._cropper.show();
	}

	setCenter() {
		this._cropper.setCenter();
	}

	fitToArea() {
		this._cropper.fitToArea();
	}

	backup() {
		this._cropper.backup();
	}

	restore() {
		this._cropper.restore();
	}

	aabb() {
		console.log(this._cropper.getAABB());
	}
}

/**
 * Functionality over browser cookies.
 *
 * @class $cookie
 */

/**
 * $cookie constants.
 * 
 * @member $cookie
 * @private
 */
const _CONST$1 = {
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
function set$1(name, value, optsArg) {
	if (!name || /^(?:expires|max\-age|path|domain|secure)$/i.test(name)) { return false; }

	let opts = {
		expiration: addDays(new Date(), 30),
		path: "",
		domain: "",
		secure: ""
	};

	let expires = "";
	
	if (opts.expiration) {
		switch (opts.expiration.constructor) {
			case Number:
				expires = opts.expiration === Infinity ? "; expires=" + _CONST$1.EXPIRES.MAX : "; max-age=" + opts.expiration;
				break;

			case String:
				expires = "; expires=" + opts.expiration;
				break;

			case Date:
				expires = "; expires=" + opts.expiration.toUTCString();
				break;
		}
	}

	document.cookie = encodeURIComponent(name) + "=" + encodeURIComponent(value) + expires + (opts.domain ? "; domain=" + opts.domain : "") 
					+ (opts.path ? "; path=" + opts.path : "") + (opts.secure ? "; secure" : "");
	return true;
}

/**
 * Get cookies by her name.
 *
 * @param  {String} name
 * @return {String}
 * @member $cookie
 * @private
 */
function get$3(name) {
	name = name || "";

	let cookieValue = null;

	if (document.cookie && document.cookie != '') {
		let cookies = document.cookie.split(';');

		cookies.every(cookie => {
			cookie = cookie.trim();

			if (cookie.substring(0, name.length + 1) == (name + '=')) {
				cookieValue = decodeURIComponent(cookie.substring(name.length + 1));

				return false;
			}
			else return true;
		});
	}

	return cookieValue;
}

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
function remove$1(name, domain, path) {
	if (!contains(name)) {
		return false;
	}

	document.cookie = encodeURIComponent(name) + "=; expires=" + _CONST$1.EXPIRES.MIN + (domain ? "; domain=" + domain : "") + (path ? "; path=" + path : "");

	return true;
}

/**
 * Document contains cookie?
 *
 * @param  {String} name Cookie name
 * @return {Boolean}
 * @member $cookie
 * @private
 */
function contains(name) {
	if (!name) return false;

	return (new RegExp("(?:^|;\\s*)" + encodeURIComponent(name).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=")).test(document.cookie);
}

const COOKIE_NAME = "testCookie";

class Test {
	constructor() {
		this._els = null;

		$template$1.bindTemplate(document.querySelector(".main-cont"), this, function(elsObj) {
			this._els = elsObj;
		}.bind(this));

		this._mouse = {
			bcr: null,
			x: 0,
			y: 0,
			startX: 0,
			startY: 0
		};

		this._binds = {
			mouseDown: this._mouseDown.bind(this),
			mouseMove: this._mouseMove.bind(this),
			mouseUp: this._mouseUp.bind(this)
		};

		this._els.testArea.addEventListener("mousedown", this._binds.mouseDown);
	}

	_mouseDown(e) {
		this._mouse.bcr = this._els.testArea.getBoundingClientRect();
		
		let data = this._getXY(e);
		
		this._mouse.x = data.x;
		this._mouse.y = data.y;
		this._mouse.startX = this._mouse.x;
		this._mouse.startY = this._mouse.y;

		document.addEventListener("mousemove", this._binds.mouseMove);
		document.addEventListener("mouseup", this._binds.mouseUp);
	}

	_mouseMove(e) {
		let data = this._getXY(e);
		let diffX = data.x - this._mouse.x;
		let diffY = data.y - this._mouse.y;

		console.log(diffX + ":" + diffY);

		this._mouse.x = data.x;
		this._mouse.y = data.y;
	}

	_mouseUp(e) {
		let data = this._getXY(e);

		if (data.x == this._mouse.startX && data.y == this._mouse.startY) {
			console.log("click");
		}

		document.removeEventListener("mousemove", this._binds.mouseMove);
		document.removeEventListener("mouseup", this._binds.mouseUp);
	}

	_getXY(e) {
		return {
			x: e.clientX - this._mouse.bcr.left,
			y: e.clientY - this._mouse.bcr.top
		};
	}

	mouseenter() {
		console.log("mouseenter");
	}

	mouseleave(e) {
		console.log("mouseleave");
		console.log(e);
	}

	setCookie() {
		let value = "my val";

		col("Set cookie {0} with value {1}", COOKIE_NAME, value);
		set$1(COOKIE_NAME, value);

		this.getCookie();
	}

	getCookie() {
		col("Get cookie {0} = {1}", COOKIE_NAME, get$3(COOKIE_NAME));
	}

	removeCookie() {
		col("Remove cookie {0}", COOKIE_NAME);
		remove$1(COOKIE_NAME);

		this.getCookie();

		confirm("Confirm test").then(() => {
			console.log("yes");
		}, () => {
			console.log("no");
		});
	}
}

/**
 * JSON object visualiser.
 * 
 * @class $jsonViewer
 */

class $jsonViewer {
	constructor() {
		this._const = {
			HIDE_CLASS: "hide"
		};

		this._dom = {
			container: create({
				el: "pre",
				class: "json-viewer"
			})
		};
	}

	/**
	 * Visualise JSON object.
	 * 
	 * @param {Object|Array} json Input value
	 * @param {Number} [maxLvl] Process only to max level, where 0..n, -1 unlimited
	 * @param {Number} [colAt] Collapse at level, where 0..n, -1 unlimited
	 * @param {Array} [cutArray] Cuted arrays list
	 * @member $jsonViewer
	 * @method showJSON
	 * 
	 */
	showJSON (json, maxLvl, colAt, cutArray) {
		maxLvl = typeof maxLvl === "number" ? maxLvl : -1; // max level
		colAt = typeof colAt === "number" ? colAt : -1; // collapse at
		cutArray = cutArray || [];

		let jsonData = this._processInput(json);
		let walkEl = this._walk(jsonData, maxLvl, colAt, 0, cutArray);

		this._dom.container.innerHTML = "";
		this._dom.container.appendChild(walkEl);
	}

	/**
	 * Get container with pre object - this container is used for visualise JSON data.
	 * 
	 * @return {Element}
	 * @member $jsonViewer
	 * @method getContainer
	 */
	getContainer() {
		return this._dom.container;
	}

	/**
	 * Process input JSON - throws exception for unrecognized input.
	 * 
	 * @param {Object|Array} json Input value
	 * @return {Object|Array}
	 * @member $jsonViewer
	 * @method _processInput
	 * @private
	 */
	_processInput(json) {
		if (json && typeof json === "object") {
			return json;
		}
		else {
			throw "Input value is not object or array!";
		}
	}

	/**
	 * Recursive walk for input value.
	 * 
	 * @param {Object|Array} value Input value
	 * @param {Number} maxLvl Process only to max level, where 0..n, -1 unlimited
	 * @param {Number} colAt Collapse at level, where 0..n, -1 unlimited
	 * @param {Number} lvl Current level
	 * @member $jsonViewer
	 * @method _walk
	 * @private
	 */
	_walk(value, maxLvl, colAt, lvl, cutArray) {
		let frag = document.createDocumentFragment();
		let isMaxLvl = maxLvl >= 0 && lvl >= maxLvl;
		let isCollapse = colAt >= 0 && lvl >= colAt;

		switch (typeof value) {
			case "object":
				if (value) {
					let isArray = Array.isArray(value);
					let items = isArray ? value : Object.keys(value);

					if (lvl === 0) {
						// root level
						let rootCount = this._createItemsCount(items.length);
						// hide/show
						let rootLink = this._createLink(isArray ? "[" : "{");

						if (items.length) {
							rootLink.addEventListener("click", e => {
								if (isMaxLvl) return;

								rootLink.classList.toggle("collapsed");
								rootCount.classList.toggle("hide");

								// main list
								this._dom.container.querySelector("ul").classList.toggle("hide");
							});

							if (isCollapse) {
								rootLink.classList.add("collapsed");
								rootCount.classList.remove("hide");
							}
						}
						else {
							rootLink.classList.add("empty");
						}

						rootLink.appendChild(rootCount);
						frag.appendChild(rootLink);
					}

					if (items.length && !isMaxLvl) {
						let len = items.length - 1;
						let ulList = create({
							el: "ul",
							class: "type-" + (isArray ? "array" : "object"),
							attrs: {
								"data-level": lvl
							}
						});

						items.forEach((key, ind) => {
							let item = isArray ? key : value[key];
							let li = create({
								el: "li"
							});

							if (typeof item === "object") {
								let isEmpty = false;

								// null && date
								if (!item || item instanceof Date) {
									li.appendChild(this._createText(isArray ? "" : key + ": "));
									li.appendChild(this._createSimple(item ? item : null));
								}
								// array & object
								else {
									let itemIsArray = Array.isArray(item);
									let itemLen = itemIsArray ? item.length : Object.keys(item).length;

									// empty
									if (!itemLen) {
										li.appendChild(this._createText((typeof key === "string"? key + ": " : "") + (itemIsArray ? "[]" : "{}")));
									}
									else {
										// 1+ items
										let itemTitle = (typeof key === "string" ? key + ": " : "") + (itemIsArray ? "[" : "{");
										let itemLink = this._createLink(itemTitle);
										let origCount = null;

										if (itemIsArray) {
											cutArray.every(cutItem => {
												if (cutItem.array == item) {
													origCount = cutItem.len;
													return false;
												}
												else {
													return true;
												}
											});
										}

										let itemsCount = this._createItemsCount(itemLen, origCount);

										// maxLvl - only text, no link
										if (maxLvl >= 0 && lvl + 1 >= maxLvl) {
											li.appendChild(this._createText(itemTitle));
										}
										else {
											itemLink.appendChild(itemsCount);
											li.appendChild(itemLink);
										}

										li.appendChild(this._walk(item, maxLvl, colAt, lvl + 1, cutArray));
										li.appendChild(this._createText(itemIsArray ? "]" : "}"));
										
										let list = li.querySelector("ul");
										let itemLinkCb = () => {
											itemLink.classList.toggle("collapsed");
											itemsCount.classList.toggle("hide");
											list.classList.toggle("hide");
										};

										// hide/show
										itemLink.addEventListener("click", itemLinkCb);

										// collapse lower level
										if (colAt >= 0 && lvl + 1 >= colAt) {
											itemLinkCb();
										}
									}
								}
							}
							// simple values
							else {
								// object keys with key:
								if (!isArray) {
									li.appendChild(this._createText(key + ": "));
								}

								// recursive
								li.appendChild(this._walk(item, maxLvl, colAt, lvl + 1, cutArray));
							}

							// add comma to the end
							if (ind < len) {
								li.appendChild(this._createText(","));
							}

							ulList.appendChild(li);
						}, this);

						frag.appendChild(ulList);
					}
					else if (items.length && isMaxLvl) {
						let itemsCount = this._createItemsCount(items.length);
						itemsCount.classList.remove("hide");

						frag.appendChild(itemsCount);
					}

					if (lvl === 0) {
						// empty root
						if (!items.length) {
							let itemsCount = this._createItemsCount(0);
							itemsCount.classList.remove("hide");

							frag.appendChild(itemsCount);
						}

						// root cover
						frag.appendChild(this._createText(isArray ? "]" : "}"));

						// collapse
						if (isCollapse) {
							frag.querySelector("ul").classList.add("hide");
						}
					}
					break;
				}

			default:
				// simple values
				frag.appendChild(this._createSimple(value));
				break;
		}

		return frag;
	}

	/**
	 * Create text node.
	 * 
	 * @param  {String} value Text content
	 * @return {Element}
	 * @member $jsonViewer
	 * @method _createText
	 * @private
	 */
	_createText(value) {
		return create({
			el: "text",
			textContent: value || ""
		});
	}

	/**
	 * Create simple value (no object|array).
	 * 
	 * @param  {Number|String|null|undefined|Date} value Input value
	 * @return {Element}
	 * @member $jsonViewer
	 * @method _createSimple
	 * @private
	 */
	_createSimple(value) {
		let type = typeof value;
		let txt = value;

		if (type === "string") {
			txt = '"' + value + '"';
		}
		else if (value === null) {
			type = "null";
			txt = "null";
		}
		else if (value === undefined) {
			txt = "undefined";
		}
		else if (value instanceof Date) {
			type = "date";
			txt = value.toString();
		}

		return create({
			el: "span",
			class: "type-" + type,
			innerHTML: txt
		});
	}

	/**
	 * Create items count element.
	 * 
	 * @param  {Number} count Items count
	 * @param  {Number} [origCount] Original count
	 * @return {Element}
	 * @member $jsonViewer
	 * @method _createItemsCount
	 * @private
	 */
	_createItemsCount(count, origCount) {
		return create({
			el: "span",
			class: ["items-ph", this._const.HIDE_CLASS],
			href: "javascript:void(0)",
			innerHTML: this._getItemsTitle(count, origCount)
		});
	}

	/**
	 * Create clickable link.
	 * 
	 * @param  {String} title Link title
	 * @return {Element}
	 * @member $jsonViewer
	 * @method _createLink
	 * @private
	 */
	_createLink(title) {
		return create({
			el: "a",
			class: "list-link",
			href: "javascript:void(0)",
			innerHTML: title || ""
		});
	}

	/**
	 * Get correct item|s title for count.
	 * 
	 * @param  {Number} count Items count
	 * @param  {Number} [origCount] Original count
	 * @return {String}
	 * @member $jsonViewer
	 * @method _getItemsTitle
	 * @private
	 */
	_getItemsTitle(count, origCount) {
		let itemsTxt = count > 1 || count === 0 ? "items" : "item";
		var orig = typeof origCount === "number" ? "/" + origCount : "";

		return (count + orig + " " + itemsTxt);
	}
}

/**
 * Create $lightbox window.
 * 
 * @param {Object} [options] Configuration
 * @param {Number} [options.fadeTime = 20] Fade time between image switch
 * @param {Boolean} [options.loop = true] Loop all images
 * @param {Object} [options.dict] Optional translations, keys: close, noDesc, prev, next
 * @param {String} [options.hideClass = "hide"] hide class for CSS
 * @param {Number} [options.firstRunClass = "first-run"] first run class for CSS
 * @class $lightbox
 */

class $lightbox extends $event {
	constructor(options) {
		super();
		
		this._opts = {
			fadeTime: 20,
			loop: true,
			dict: {
				close: "Close",
				noDesc: "Empty description",
				prev: "Prev",
				next: "Next"
			},
			hideClass: "hide",
			firstRunClass: "first-run"
		};

		for (let opt in options) {
			this._opts[opt] = options[opt];
		}

		this._data = [];
		this._ind = 0;
		this._dom = {};
		this._disableMouse = true;
		this._binds = {
			keyDown: this._keyDown.bind(this),
			mouseMove: this._mouseMove.bind(this)
		};
		this._firstOpen = false;
		this._wasMove = false;
		this._opened = false;
		this._fadeId = null;
		this._firstRunId = null;
		this._width = 0;
		this._height = 0;
	}

	/**
	 * Add image to the lightbox.
	 *
	 * @param {String} url Image path
	 * @param {String} preview Preview image path
	 * @param {String} [desc] Image description
	 * @member $lightbox
	 * @method add
	 */
	add(url, preview, desc) {
		if (!url || !preview) return;

		this._data.push({
			url: url,
			preview: preview,
			desc: desc || this._opts.dict.noDesc
		});
	}

	/**
	 * Open lightbox, you can also choose open index.
	 *
	 * @param {Number} [ind] Open index
	 * @member $lightbox
	 * @method open
	 */
	open(ind) {
		if (this._opened) {
			this._show(ind);
			return;
		}

		this._opened = true;
		this._firstOpen = true;

		this._createCover();
		this._create();

		this._show(ind);

		document.addEventListener("keydown", this._binds.keyDown);
		document.addEventListener("mousemove", this._binds.mouseMove);

		$resize$1.on("resize", this._resize, this);
		
		this.trigger("open");
	}

	/**
	 * Close lightbox window.
	 *
	 * @param {Number} [ind] Open index
	 * @member $lightbox
	 * @method close
	 */
	close() {
		if (!this._opened) {
			return;
		}

		this._opened = false;
		this._firstOpen = false;

		// remove
		if (this._dom.cover) {
			document.body.removeChild(this._dom.cover);
		}

		if (this._dom.container) {
			document.body.removeChild(this._dom.container);
		}

		if (!this._wasMove) {
			document.removeEventListener("mousemove", this._binds.mouseMove);
		}

		// clear
		this._dom = {};
		this._ind = 0;
		this._disableMouse = true;
		this._wasMove = false;

		document.removeEventListener("keydown", this._binds.keyDown);

		$resize$1.off("resize", this._resize, this);

		this._clearFade();
		this._clearFirstRun();

		this.trigger("close");
	}

	/**
	 * Jump to prev photo, you can also set visibility for step button.
	 *
	 * @param {Boolean} [showBtn] Show prev button
	 * @member $lightbox
	 * @method prev
	 */
	prev(showBtn) {
		this._show(this._ind, -1);

		if (showBtn) {
			this._showPrevBtn();
		}
	}

	/**
	 * Jump to next photo, you can also set visibility for step button.
	 *
	 * @param {Boolean} [showBtn] Show next button
	 * @member $lightbox
	 * @method next
	 */
	next(showBtn) {
		this._show(this._ind, 1);

		if (showBtn) {
			this._showNextBtn();
		}
	}

	/**
	 * Set language object.
	 *
	 * @param {Object} obj Object with translations
	 * @member $lightbox
	 * @method setDict
	 */
	setDict(obj) {
		for (let key in obj) {
			this._opts.dict[key] = obj[key];
		}
	}

	/**
	 * Show prev button.
	 *
	 * @private
	 * @member $lightbox
	 * @method _showPrevBtn
	 */
	_showPrevBtn() {
		this._dom.prevBtn.classList.remove(this._opts.hideClass);
		this._dom.nextBtn.classList.add(this._opts.hideClass);
	}

	/**
	 * Show next button.
	 *
	 * @private
	 * @member $lightbox
	 * @method _showNextBtn
	 */
	_showNextBtn() {
		this._dom.prevBtn.classList.add(this._opts.hideClass);
		this._dom.nextBtn.classList.remove(this._opts.hideClass);
	}

	/**
	 * Lightbox cover DOM create.
	 *
	 * @private
	 * @member $lightbox
	 * @method _createCover
	 */
	_createCover() {
		this._dom.cover = create({
			el: "div",
			class: "lightbox-cover",
			events: [{
				event: "click",
				fn: e => {
					this.close();
				}
			}, {
				event: "DOMMouseScroll",
				fn: e => {
					this._mouseScroll(e);
				}
			}, {
				event: "mousewheel",
				fn: e => {
					this._mouseScroll(e);
				}
			}]
		});

		document.body.appendChild(this._dom.cover);
	}

	/**
	 * Lightbox DOM create.
	 *
	 * @private
	 * @member $lightbox
	 * @method _create
	 */
	_create() {
		let exported = {};

		this._dom.container = create({
			el: "div",
			class: ["lightbox", this._opts.firstRunClass],
			events: [{
				event: "DOMMouseScroll",
				fn: e => {
					this._mouseScroll(e);
				}
			}, {
				event: "mousewheel",
				fn: e => {
					this._mouseScroll(e);
				}
			}],
			child: [{
				el: "div",
				class: "close-holder",
				child: {
					el: "button",
					class: "exit-btn",
					attrs: {
						type: "button",
						title: this._opts.dict.close
					},
					events: {
						event: "click",
						fn: e => {
							this.close();
						}
					}
				},
				_exported: "closeHolder"
			}, {
				el: "div",
				class: "img-holder",
				child: [{
					el: "div",
					class: "left-part",
					events: [{
						event: "click",
						fn: e => {
							this.prev();
						}
					}, {
						event: "mouseenter",
						fn: e => {
							if (this._disableMouse) return;

							this._dom.prevBtn.classList.remove(this._opts.hideClass);
						}
					}, {
						event: "mouseleave",
						fn: e => {
							if (this._disableMouse) return;

							this._dom.prevBtn.classList.add(this._opts.hideClass);
						}
					}],
					child: {
						el: "button",
						attrs: {
							type: "button"
						},
						class: ["prev-btn", this._opts.hideClass],
						innerHTML: this._opts.dict.prev,
						_exported: "prevBtn"
					},
					_exported: "leftPart"
				}, {
					el: "div",
					class: "right-part",
					events: [{
						event: "click",
						fn: e => {
							this.next();
						}
					}, {
						event: "mouseenter",
						fn: e => {
							if (this._disableMouse) return;

							this._dom.nextBtn.classList.remove(this._opts.hideClass);
						}
					}, {
						event: "mouseleave",
						fn: e => {
							if (this._disableMouse) return;

							this._dom.nextBtn.classList.add(this._opts.hideClass);
						}
					}],
					child: {
						el: "button",
						attrs: {
							type: "button"
						},
						class: ["next-btn", this._opts.hideClass],
						innerHTML: this._opts.dict.next,
						_exported: "nextBtn"
					},
					_exported: "rightPart"
				}],
				_exported: "imgHolder"
			}, {
				el: "div",
				class: "footer",
				child: [{
					el: "p",
					class: "desc",
					_exported: "desc"
				}, {
					el: "p",
					class: "pos",
					_exported: "pos"
				}],
				_exported: "footer"
			}]
		}, exported);

		extend(this._dom, exported);
		document.body.appendChild(this._dom.container);
	}

	/**
	 * Show lightbox at index.
	 *
	 * @param {Number} [ind] Photo number
	 * @param {Number|String} [dir] View direction (-1 left, 1 right)
	 * @private
	 * @member $lightbox
	 * @method _show
	 */
	_show(ind, dir) {
		if (typeof ind === "string") {
			ind = parseFloat(ind);
		}

		let count = this._data.length;
		if (!count) return;

		dir = dir || 0;
		ind = (ind || 0) + dir;

		if (ind < 0) {
			if (this._opts.loop) {
				ind = count - 1;
			}
			else {
				return;
			}
		}
		else if (ind > count - 1) {
			if (this._opts.loop) {
				ind = 0;
			}
			else {
				return;
			}
		}

		// save index
		this._ind = ind;

		let data = this._data[ind];

		// cleart timeouts
		this._clearFade();
		this._clearFirstRun();

		// img
		let oldImg = this._dom.img;
		if (oldImg) {
			this._dom.imgHolder.removeChild(oldImg);
			this._dom.img = null;
		}

		if (this._firstOpen) {
			this._dom.loader = $loader$1.getSpinner();
			this._dom.imgHolder.appendChild(this._dom.loader);
		}

		let start = Date.now();
		let img = new Image();
		let makeFade = this._opts.fadeTime > 0;

		if (makeFade) {
			img.setAttribute("data-src", "");
		}
		img.alt = data.desc;
		img.onload = e => {
			this._width = img.width;
			this._height = img.height;

			if (this._firstOpen) {
				this._firstOpen = false;

				if (this._dom.loader) {
					this._dom.imgHolder.removeChild(this._dom.loader);
				}

				this._firstRunId = setTimeout(() => {
					this._dom.container.classList.remove(this._opts.firstRunClass);
				}, 200);
			}

			this._dom.imgHolder.appendChild(img);
			this._dom.img = img;
			
			this._resize();
			
			if (makeFade) {
				let diff = Date.now() - start;
				let time = diff < this._opts.fadeTime ? this._opts.fadeTime - diff : 0;

				this._fadeId = setTimeout(() => {
					img.removeAttribute("data-src");
					this._fadeId = null;
				}, time);
			}
		};
		img.src = data.url;

		// desc
		this._dom.desc.innerHTML = data.desc;
		this._dom.pos.innerHTML = (ind + 1) + " / " + count;
	}

	/**
	 * Mouse scroll event - disable scroll lightbox -> parent propagation.
	 *
	 * @param {Event} e Mouse scroll event
	 * @private
	 * @member $lightbox
	 * @method _mouseScroll
	 */
	_mouseScroll(e) {
		e.preventDefault();
	}

	/**
	 * Key down event - image switch, close lightbox.
	 *
	 * @param {Event} e Keyboard event
	 * @private
	 * @member $lightbox
	 * @method _keyDown
	 */
	_keyDown(e) {
		let keyCode = e.which || e.keyCode;

		// left, up
		if (keyCode == 37 || keyCode == 38) {
			this.prev(true);

			if (keyCode == 38) {
				e.preventDefault();
			}
		}
		// right, down
		else if (keyCode == 39 || keyCode == 40) {
			this.next(true);

			if (keyCode == 40) {
				e.preventDefault();
			}
		}
		else if (keyCode == 27) {
			// esc
			this.close();
		}
	}

	/**
	 * Mouse move event - hide prev/next buttons.
	 *
	 * @param {Event} e Mouse event
	 * @private
	 * @member $lightbox
	 * @method _mouseMove
	 */
	_mouseMove(e) {
		if (!this._wasMove) {
			this._wasMove = true;
			return;
		}

		this._disableMouse = false;

		let target = e.target || e.srcElement;

		if (target == this._dom.leftPart) {
			this._showPrevBtn();
		}
		else if (target == this._dom.rightPart) {
			this._showNextBtn();
		}

		document.removeEventListener("mousemove", this._binds.mouseMove);
	}

	/**
	 * Resize event - resize lightbox.
	 * 
	 * @private
	 * @member $lightbox
	 * @method _resize
	 */
	_resize() {
		if (!this._width || !this._height) return;

		let top = this._dom.container.offsetTop;
		let availWidth = document.body.offsetWidth - 2*top;
		let availHeight = window.innerHeight - 2 * top - this._dom.closeHolder.offsetHeight - this._dom.footer.offsetHeight;
		let width = 0;
		let height = 0;
		let ratio = this._width / this._height;

		if (this._width > this._height) {
			// landscape
			width = Math.min(this._width, availWidth);
			height = width / ratio;

			if (height > availHeight) {
				height = availHeight;
				width = height * ratio;
			}
		}
		else {
			// portrait
			height = Math.min(this._height, availHeight);
			width = height * ratio;

			if (width > availWidth) {
				width = availWidth;
				height = width / ratio;
			}
		}

		this._dom.imgHolder.style.width = width + "px";
		this._dom.imgHolder.style.height = height + "px";
	}

	/**
	 * Clear fade timeout.
	 *
	 * @member $lightbox
	 * @method _clearFade
	 */
	_clearFade() {
		if (this._fadeId) {
			clearTimeout(this._fadeId);
			this._fadeId = null;
		}
	}

	/**
	 * Clear first run timeout.
	 *
	 * @member $lightbox
	 * @method _clearFirstRun
	 */
	_clearFirstRun() {
		if (this._firstRunId) {
			clearTimeout(this._firstRunId);
			this._firstRunId = null;
		}
	}
}

/**
 * Create $popup window.
 * Signals:
 * popup-close - popup is closed
 *
 * Signal listeners:
 * window-resize - window was resized
 * 
 * @param {Object} [opts] Configuration
 * @param {Number} [opt.maxWidth] max. width [px]
 * @param {Boolean} [opt.draggable] can be popup moved on the screen?
 * @param {String} [opt.className] optinal css class name
 * @param {POSITIONS} [opt.position] default popup position on the screen
 * @param {Number} [opt.padding] except all centers, add padding to position
 * @class $popup
 */

/**
 * $popup available positions.
 * 
 * @type {Object}
 * @member $popup
 * @static
 */
const POSITIONS = {
	TOP_LEFT: 0,
	TOP_CENTER: 1,
	TOP_RIGHT: 2,
	CENTER_LEFT: 3,
	CENTER_CENTER: 4,
	CENTER_RIGHT: 5,
	BOTTOM_LEFT: 6,
	BOTTOM_CENTER: 7,
	BOTTOM_RIGHT: 8
};

class $popup extends $event {
	constructor(opts) {
		super();

		this._const = {
			ROOT_CLASS: "popup",
			CONTENT_CLASS: "content",
			CLOSE_BTN_CLASS: "close-btn",
			MOVE_COVER_CLASS: "popup-move-cover",
			DRAGGABLE_CLASS: "draggable",
			// responsive mode - popup width is smaller than screen width
			RESPONSIVE_CLASS: "responsive-mode",
			// popup height is smaller the screen height
			OVERFLOW_Y_CLASS: "overflow-y"
		};
		
		this._opts = {
			maxWidth: null,
			draggable: true,
			className: "",
			position: POSITIONS.CENTER_CENTER,
			padding: 0
		};

		for (let opt in opts) {
			this._opts[opt] = opts[opt];
		}

		this._binds = {};
		this._binds.mouseDown = this._mouseDown.bind(this);
		this._binds.mouseUp = this._mouseUp.bind(this);
		this._binds.mouseMove = this._mouseMove.bind(this);
		this._binds.click = this._click.bind(this);

		this._dom = this._create();

		this._appendNode = document.body;
		this._isDraggedOut = false;
		
		this._saved = {
			width: 0,
			height: 0,
			x: 0,
			y: 0
		};
		this._screen = {
			width: 0,
			height: 0
		};

		this._setScreenSize();

		// signals
		this.on("window-resize", this._resize, this);

		// append - open popup
		this._appendNode.appendChild(this._dom.root);

		this.setPosition();
	}

	/**
	 * Get $popup root element.
	 *
	 * @return {Element}
	 * @member $popup
	 * @method getContainer
	 */
	getContainer() {
		return this._dom.root;
	}

	/**
	 * Get $popup content.
	 *
	 * @return {Element}
	 * @member $popup
	 * @method getContent
	 */
	getContent() {
		return this._dom.content;
	}

	/**
	 * Close popup.
	 *
	 * @member $popup
	 * @method close
	 */
	close() {
		if (this._dom.root) {
			this._dom.root.parentNode.removeChild(this._dom.root);

			this._isDraggedOut = false;
			this._dom.root = null;
			
			this.trigger("popup-close");
		}
	}

	/**
	 * Set position.
	 * 
	 * @param {Object} [pos] optinal position; otherwise startup position is used
	 * @member $popup
	 * @method setPosition
	 */
	setPosition(pos) {
		if (!this._isDraggedOut) {
			this._setPosition(pos);
		}
		else {
			this._setPositionAfterDragged();
		}
	}

	/**
	 * Window resize event.
	 * 
	 * @member $popup
	 * @method _resize
	 * @private
	 */
	_resize() {
		this._setScreenSize();
		this.setPosition();
	}

	/**
	 * Save screen dimensions.
	 * 
	 * @member $popup
	 * @method _setScreenSize
	 * @private
	 */
	_setScreenSize() {
		this._screen.width = Math.min(window.innerWidth, document.body.offsetWidth);
		this._screen.height = window.innerHeight;
	}

	/**
	 * Calculate position according to the selected position from the enum POSITIONS.
	 * 
	 * @param {Object} pos Position
	 * @member $popup
	 * @method _calculatePosition
	 * @private
	 */
	_calculatePosition(pos) {
		let width = this._dom.root.offsetWidth;
		let height = this._dom.root.offsetHeight;

		// default center - center
		let left = Math.floor((this._screen.width - width) / 2);
		let top = Math.floor((this._screen.height - height) / 2);

		switch (pos) {
			case POSITIONS.TOP_LEFT:
				left = 0 + this._opts.padding;
				top = 0 + this._opts.padding;
				break;

			case POSITIONS.TOP_CENTER:
				left = Math.floor((this._screen.width - width) / 2);
				top = 0 + this._opts.padding;
				break;

			case POSITIONS.TOP_RIGHT:
				left = this._screen.width - width - this._opts.padding;
				top = 0 + this._opts.padding;
				break;

			case POSITIONS.CENTER_LEFT:
				left = 0 + this._opts.padding;
				top = Math.floor((this._screen.height - height) / 2);
				break;

			case POSITIONS.CENTER_RIGHT:
				left = this._screen.width - width - this._opts.padding;
				top = Math.floor((this._screen.height - height) / 2);
				break;

			case POSITIONS.BOTTOM_LEFT:
				left = 0 + this._opts.padding;
				top = this._screen.height - height - this._opts.padding;
				break;

			case POSITIONS.BOTTOM_CENTER:
				left = Math.floor((this._screen.width - width) / 2);
				top = this._screen.height - height - this._opts.padding;
				break;

			case POSITIONS.BOTTOM_RIGHT:
				left = this._screen.width - width - this._opts.padding;
				top = this._screen.height - height - this._opts.padding;
				break;
		}

		return {
			left: left,
			top: top
		};
	}

	/**
	 * Set position.
	 * 
	 * @param {Object} [pos] optinal position; otherwise startup position is used
	 * @member $popup
	 * @method _setPosition
	 * @private
	 */
	_setPosition(pos) {
		let left = 0;
		let top = 0;

		if (!pos) {
			pos = this._opts.position;
		}

		if (typeof pos === "number") {
			let cp = this._calculatePosition(pos);

			left = cp.left;
			top = cp.top;
		}
		else if (typeof pos === "object") {
			left = pos.left || 0;
			top = pos.top || 0;
		}

		this._setRootPosition(left, top);
	}

	/**
	 * Set position after $popup was dragged.
	 *
	 * @member $popup
	 * @method _setPositionAfterDragged
	 * @private
	 */
	_setPositionAfterDragged() {
		// dragged popup - is visible in the viewport?
		let width = this._dom.root.offsetWidth;
		let height = this._dom.root.offsetHeight;
		let left = this._dom.root.offsetLeft;
		let top = this._dom.root.offsetTop;

		if ((width + left > this._screen.width) || (height + top > this._screen.height)) {
			// center
			let cp = this._calculatePosition();
			// def.
			let def = this._calculatePosition(this._opts.position);

			// set
			if (cp.left != def.left && cp.top != def.top) {
				this._setRootPosition(def.left, def.top);
			}
			else {
				this._setRootPosition(cp.left, cp.top);
			}

			this._isDraggedOut = false;
		}
	}

	/**
	 * Set root position.
	 *
	 * @param {Number} x Axe X
	 * @param {Number} y Axe Y
	 * @member $popup
	 * @method _setRootPosition
	 * @private
	 */
	_setRootPosition(x, y) {
		let left = x || 0;
		let top = y || 0;
		let width = this._dom.root.offsetWidth;
		let height = this._dom.root.offsetHeight;

		// x, y modifications
		if (left < 0) {
			left = 0;
		}
		else if (left + width > this._screen.width) {
			left = this._screen.width - width;
		}

		if (top < 0) {
			top = 0;
		}
		else if (top + height > this._screen.height) {
			top = this._screen.height - height;
		}

		// height overflow
		if (!this._saved.height && height > this._screen.height) {
			this._dom.root.classList.add(this._const.OVERFLOW_Y_CLASS);
			this._saved.height = height;
		}
		else if (this._saved.height && this._saved.height < this._screen.height) {
			this._saved.height = 0;

			// ok
			this._dom.root.classList.remove(this._const.OVERFLOW_Y_CLASS);
		}

		// width modification
		if (!this._saved.width && width > this._screen.width) {
			if ("getComputedStyle" in window) {
				let style = window.getComputedStyle(this._dom.root);
				width = parseFloat(style.width);
			}

			this._saved.width = this._opts.maxWidth ? Math.min(width, this._opts.maxWidth) : width;
			this._dom.root.style.width = (this._opts.maxWidth ? Math.min(this._screen.width, this._opts.maxWidth) : this._screen.width) + "px";

			// responsive mode
			this._dom.root.classList.add(this._const.RESPONSIVE_CLASS);
		}
		else if (this._saved.width) {
			if (this._saved.width < this._screen.width) {
				// leave responsive mode
				this._dom.root.classList.remove(this._const.RESPONSIVE_CLASS);

				this._dom.root.style.width = this._saved.width + "px";
				this._saved.width = 0;
			}
			else {
				// smaller - we are still in responsive mode
				this._dom.root.style.width = this._screen.width + "px";
			}

			let cp = this._calculatePosition();
			left = cp.left >= 0 ? cp.left : 0;
			top = cp.top >= 0 ? cp.top : 0;
		}

		// position
		this._dom.root.style.left = left + "px";
		this._dom.root.style.top = top + "px";
	}

	/**
	 * Mouse down event - only for draggable.
	 *
	 * @param {Event} e
	 * @member $popup
	 * @method _mouseDown
	 * @private
	 */
	_mouseDown(e) {
		if (e.target.classList.contains(this._const.ROOT_CLASS)) {
			e.preventDefault();
			e.stopPropagation();

			this._saved.x = parseFloat(this._dom.root.style.left) - e.clientX;
			this._saved.y = parseFloat(this._dom.root.style.top) - e.clientY;

			this._dom.moveCover = this._createMoveCover();
			this._dom.moveCover.addEventListener("mousemove", this._binds.mouseMove);
			this._dom.moveCover.addEventListener("mouseup", this._binds.mouseUp);

			this._appendNode.appendChild(this._dom.moveCover);
		}
	}

	/**
	 * Mouse move event - draggable.
	 *
	 * @param {Event} e
	 * @member $popup
	 * @method _mouseMove
	 * @private
	 */
	_mouseMove(e) {
		this._isDraggedOut = true;

		let left = e.clientX + this._saved.x;
		let top = e.clientY + this._saved.y;

		this._setRootPosition(left, top);
	}

	/**
	 * Mouse up event.
	 *
	 * @param {Event} e
	 * @member $popup
	 * @method _mouseUp
	 * @private
	 */
	_mouseUp(e) {
		this._dom.moveCover.removeEventListener("mousemove", this._binds.mouseMove);
		this._dom.moveCover.removeEventListener("mouseup", this._binds.mouseUp);

		this._appendNode.removeChild(this._dom.moveCover);

		this._dom.moveCover = null;
	}

	/**
	 * Close button click event.
	 *
	 * @param {Event} e
	 * @member $popup
	 * @method _click
	 * @private
	 */
	_click(e) {
		this.close();
	}

	/**
	 * Create whole $popup.
	 *
	 * @return {Element}
	 * @member $popup
	 * @method _create
	 * @private
	 */
	_create() {
		let exported = {};
		let events = [];
		let className = [this._const.ROOT_CLASS];

		if (this._opts.className) {
			className.push(this._opts.className);
		}

		if (this._opts.draggable) {
			className.push(this._const.DRAGGABLE_CLASS);

			events = {
				event: "mousedown",
				fn: this._binds.mouseDown
			};
		}

		create({
			el: "div",
			class: className,
			events: events,
			_exported: "root",
			child: [{
				el: "button",
				attrs: {
					type: "button"
				},
				class: [this._const.CLOSE_BTN_CLASS, "notranslate"],
				innerHTML: "x",
				events: {
					event: "click",
					fn: e => {
						this._click(e);
					}
				}
			}, {
				el: "div",
				class: this._const.CONTENT_CLASS,
				_exported: "content"
			}]
		}, exported);

		return exported;
	}

	/**
	 * Create move cover - iframe fix.
	 *
	 * @return {Element}
	 * @member $popup
	 * @method _createMoveCover
	 * @private
	 */
	_createMoveCover() {
		return create({
			el: "div",
			class: this._const.MOVE_COVER_CLASS
		});
	}
}

/**
 * Cover class for manage $popup - esc bindings, window resize events.

 * @class $popupManager
 */
class $popupManager {
	constructor() {
		this._popupList = [];
		this._binds = {};
		this._binds.keyDown = this._keyDown.bind(this);

		this.captureResize();

		$resize$1.on("resize", this._resize, this);
	}

	/**
	 * Capture resize event for all $popup windows.
	 *
	 * @member $popupManager
	 * @method captureResize
	 */
	captureResize() {
		$resize$1.start();
	}

	/**
	 * Create $popup window.
	 * Signals:
	 * popup-close - popup is closed
	 * 
	 * @param {Object} [opts] Configuration
	 * @param {Number} [opt.maxWidth] max. width [px]
	 * @param {Boolean} [opt.draggable] can be popup moved on the screen?
	 * @param {String} [opt.className] optinal css class name
	 * @param {POSITIONS} [opt.position] default popup position on the screen
	 * @param {Number} [opt.padding] except all centers, add padding to position
	 * @method create
	 * @member $popupManager
	 */
	create(opts) {
		let inst = new $popup(opts);

		this._register(inst);

		return inst;
	}

	/**
	 * Alert message - not draggable.
	 * 
	 * @param  {String} msg Alert message
	 * @return {$popup} instance of the $popup
	 * @member $popupManager
	 * @method alert
	 */
	alert(msg) {
		let inst = new $popup({
			className: "alert",
			draggable: false
		});

		let cont = inst.getContent();
		cont.appendChild(create({
			el: "p",
			innerHTML: msg || ""
		}));

		this._register(inst);

		return inst;
	}

	/**
	 * Resize event for all $popups.
	 *
	 * @member $popupManager
	 * @method _resize
	 * @private
	 */
	_resize() {
		this._popupList.forEach(popup => {
			popup.trigger("window-resize");
		});
	}

	/**
	 * Keydown - ESC for $popup close.
	 *
	 * @param {Event} e
	 * @member $popupManager
	 * @method _keyDown
	 * @private
	 */
	_keyDown(e) {
		let keyCode = e.which || e.keyCode;

		if (keyCode == 27) {
			e.preventDefault();
			e.stopPropagation();

			let last = this._popupList[this._popupList.length - 1];
			last.close();
		}
	}

	/**
	 * Register new $popup. If $popup length is equal == 1, bind keydown
	 *
	 * @param {$popup} inst Instance of the new $popup
	 * @member $popupManager
	 * @method _register
	 * @private
	 */
	_register(inst) {
		this._popupList.push(inst);
		inst.on("popup-close", () => {
			this._unRegister(inst);
		});

		if (this._popupList.length == 1) {
			document.addEventListener("keydown", this._binds.keyDown);
		}
	}

	/**
	 * Unregister $popup. If there is no $popup, unbind keydown.
	 * This method is automatically called after $popup window is closed.
	 *
	 * @param {$popup} inst Instance of the new $popup
	 * @member $popupManager
	 * @method _register
	 * @private
	 */
	_unRegister(inst) {
		this._popupList.every((popup, ind) => {
			if (popup == inst) {
				this._popupList.splice(ind, 1);
				return false;
			}
			else {
				return true;
			}
		});

		if (!this._popupList.length) {
			document.removeEventListener("keydown", this._binds.keyDown);
		}
	}
}

var $popup$1 = new $popupManager();

class Utils {
	constructor() {
		this._dom = {};
		this._const = {
			URL_VALUE: "https://mapy.cz/zakladni?planovani-trasy&x=14.4667000&y=50.0833000&z=11&rc=9gx36xY2Jf9hrr6mKh9h6k6xXiak&rs=muni&rs=muni&rs=muni&ri=3468&ri=4186&ri=3468&mrp=%7B%22c%22%3A1%2C%22tt%22%3A1%7D&mrp=%7B%22c%22%3A1%2C%22tt%22%3A1%7D&mrp=%7B%22c%22%3A1%2C%22tt%22%3A1%7D&rt=&rt=&rt="
		};

		$template$1.bindTemplate(document.getElementById("utils"), this, function(dom) {
			this._dom = dom || {};
		}.bind(this));

		this._dom.urlInput.value = this._const.URL_VALUE;
	}

	popup() {
		$popup$1.alert("alert msg");

		var other = $popup$1.create({
			position: POSITIONS.TOP_RIGHT,
			padding: 25
		});
	}

	lightbox() {
		var lightbox = new $lightbox();
		lightbox.add("/img-test/pano.jpg", "/img-test/pano.jpg", "pano");
		lightbox.add("/img-test/test-photo.jpg", "/img-test/test-photo.jpg");
		lightbox.open();
	}

	jsonViewer() {
		var parsedUrl = parseURL(this._dom.urlInput.value.trim());
		var jsonViewer = new $jsonViewer();

		this._dom.jsonOutput.innerHTML = "";
		this._dom.jsonOutput.appendChild(jsonViewer.getContainer());

		jsonViewer.showJSON(parsedUrl);
	}
}

class Page {
	constructor() {
		this._type = "";

		load(() => {
			this._run();
		});
	}
	
	home() {
		this._type = "home";
	}

	anonymizer() {
		this._type = "anonymizer";
	}

	crop() {
		this._type = "crop";
	}

	test() {
		this._type = "test";
		
	}

	utils() {
		this._type = "utils";
	}

	_run() {
		switch (this._type) {
			case "home":
				new Menu(this._type);
				new Home();
				break;

			case "anonymizer":
				new Menu(this._type);
				new Anonymizer();
				break;

			case "crop":
				new Menu(this._type);
				new Cropper();
				break;

			case "test":
				new Menu(this._type);
				new Test();
				break;

			case "utils":
				new Menu(this._type);
				new Utils();
				break;
		}
	}
}

window.Page = new Page();

}());
