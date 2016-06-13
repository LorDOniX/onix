/**
 * XMLHttpRequest cover class.
 * 
 * @class $http
 */
onix.service("$http", [
	"$promise",
	"$common",
function(
	$promise,
	$common
) {
	/**
	 * https://developer.mozilla.org/en-US/docs/Web/Guide/Using_FormData_Objects.
	 * Prepare post data.
	 *
	 * @param  {Object|Array} data { name, value }
	 * @return {Object}
	 * @member $http
	 * @private
	 */
	this._preparePostData = function(data) {
		var formData = new FormData();

		if (data) {
			if (Array.isArray(data)) {
				data.forEach(function(item) {
					formData.append(item.name, item.value);
				});
			}
			else {
				Object.keys(data).forEach(function(key) {
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
	this._updateURL = function(url, data) {
		if (data) {
			var add = [];

			if (Array.isArray(data)) {
				data.forEach(function(item) {
					add.push(item.name + "=" + encodeURIComponent(item.value));
				});

				url += (url.indexOf("?") == -1 ? "?" : "") + add.join("&");
			}
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
	 * @param  {Array} [config.getData] Data, which will be send in the url (GET)
	 * @param  {Object|FormData} [config.postData] Post data
	 * @param  {Object} [config.headers] Additional headers
	 * @return {$promise}
	 * @member $http
	 */
	this.createRequest = function(config) {
		return new $promise(function(resolve, reject) {
			var request = new XMLHttpRequest();

			config = config || {};

			var method = config.method || this.METHOD.GET;
			var url = config.url || "";

			if (!url) {
				reject();
				return;
			}

			url = this._updateURL(url, config.getData);

			request.onerror = function () { reject(); };
			request.open(method, url, true);
			request.onreadystatechange = function() {
				if (request.readyState == 4) {
					var responseData = request.responseText || "";
					var responseType = request.getResponseHeader("Content-Type");
					var promiseData = null;

					if (responseType == "application/json") {
						promiseData = responseData.length ? JSON.parse(responseData) : {};
					}
					else {
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
					}
					else {
						reject(promiseObj);
					}
				}
			};

			try {
				// add headers
				var headers = config.headers;
				
				if ($common.isObject(headers)) {
					Object.keys(headers).forEach(function(headerName) {
						request.setRequestHeader(headerName, headers[headerName]);
					});
				}

				if (method == this.METHOD.GET) {
					request.setRequestHeader('Accept', 'application/json');
				}

				var type = config.postType || this.POST_TYPES.JSON;

				if (config.postData && type == this.POST_TYPES.JSON) {
					request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
					request.send(JSON.stringify(config.postData));
				}
				else if (config.postData && type == this.POST_TYPES.FORM_DATA) {
					request.send(this._preparePostData(config.postData));
				}
				else {
					request.send();
				}
			}
			catch (err) {
				reject();
			}
		}.bind(this));
	};
}]);
