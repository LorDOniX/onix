/**
 * @namespace Http
 * @description DI: Promise;
 */
Onix.service("Http", [
	"Promise",
function(
	Promise
) {
	/**
	 * https://developer.mozilla.org/en-US/docs/Web/Guide/Using_FormData_Objects
	 * Prepare post data
	 *
	 * @private
	 * @param  {Object|Array} data { name, value }
	 * @return {FormData}
	 * @memberof Http
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
	 * Update URL by get data.
	 *
	 * @private
	 * @param  {String} url
	 * @param  {Array} data { name, value }
	 * @return {String}    
	 * @memberof Http
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
	 * Request types
	 *
	 * @public
	 * @const
	 * @memberof Http
	 */
	this.POST_TYPES = {
		JSON: 1,
		FORM_DATA: 2
	};

	/**
	 * Http methods.
	 *
	 * @public
	 * @const
	 * @memberof Http
	 */
	this.METHOD = {
		POST: "POST",
		GET: "GET",
		DELETE: "DELETE",
		PATCH: "PATCH"
	};

	/**
	 * Create new XHR request.
	 *
	 * @public
	 * @param  {Object} config { url, method, [getData], [postData], [headers {type, value}] }
	 * @return {Promise}
	 * @memberof Http
	 */
	this.createRequest = function(config) {
		var promise = Promise.defer();
		var request = new XMLHttpRequest();

		config = config || {};

		var method = config.method || this.METHOD.GET;
		var url = config.url || "";

		if (!url) {
			promise.reject();
			return promise;
		}

		url = this._updateURL(url, config.getData);

		request.onerror = function () { promise.reject(); };
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

				// 200 ok
				// 201 created
				// 204 succesfully deleted
				// 403 unautorized
				promise[request.status >= 200 && request.status < 300 ? "resolve" : "reject"]({
					status: request.status,
					data: promiseData,
					url: url,
					method: method
				});
			}
		};

		try {
			// add headers
			var headers = config.headers;
			if (headers && Array.isArray(headers)) {
				headers.forEach(function(header) {
					request.setRequestHeader(header.type, header.value);
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
			promise.reject();
		}

		return promise;
	};
}]);
