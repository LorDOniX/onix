#!/usr/bin/env node
var express = require('express');
var path = require('path');
var app = express();
var port = process.env.PORT || 8001;

var MAIN_PATH = "static";

// paths
app.use("/css", express.static(path.join(__dirname, MAIN_PATH + '/css')));
app.use("/js", express.static(path.join(__dirname, MAIN_PATH + '/js')));
app.use("/dist", express.static(path.join(__dirname, 'dist')));

// test api
app.get("/api/home/", function(req, res) {
	res.json({
		name: "test API item",
		value: 42
	});
});

// default
app.get('/*', function(req, res) {
	res.sendfile(MAIN_PATH + '/index.html');
}); 

console.log("Server running on the port " + port);
app.listen(port);
