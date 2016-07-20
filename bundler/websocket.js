"use strict";

var webSocketServer = require('ws').Server;

var Common = require("./common");

class Websocket {
	constructor() {
		this._wss = null;
		this._enable = true;
	}

	/**
	 * Send obj to client.
	 * @param  {Object} obj
	 */
	send(obj) {
		if (this._wss) {
			obj = obj || {};

			Common.col("Send obj {0}, id {1}", obj.operation, obj.id);

			if (Object.keys(obj.data || {}).length) {
				Common.col("Data: {0}", JSON.stringify(obj.data));
			}

			this._wss.broadcast(JSON.stringify(obj));
		}
	}

	/**
	 * Disable start and send functionality.
	 */
	disable() {
		this._enable = false;
	}

	/**
	 * Set port.
	 * @param {Number} port
	 */
	setPort(port) {
		this._port = port || 8200;
	}

	/**
	 * Start server watching.
	 */
	start() {
		if (!this._enable || !this._port) return;

		Common.col("Websocket on {0} is starting...", this._port);

		let wss = new webSocketServer({ 
			port: this._port
		});

		wss.broadcast = data => {
			wss.clients.forEach(client => {
				client.send(data);
			});
		};

		this._wss = wss;
	}
};

module.exports = Websocket;
