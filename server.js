#!/usr/bin/env node
var express = require('express');
var path = require('path');
var app = express();
var port = process.env.PORT || 8001;

var MAIN_PATH = "test";

// paths
app.use("/css", express.static(path.join(__dirname, MAIN_PATH + '/css')));
app.use("/js", express.static(path.join(__dirname, (MAIN_PATH + '/js'))));
app.use("/src", express.static(path.join(__dirname, 'src')));
app.use("/templ", express.static(path.join(__dirname, MAIN_PATH + '/templ')));
app.use("/locale", express.static(path.join(__dirname, MAIN_PATH + '/locale')));
app.use("/img", express.static(path.join(__dirname, MAIN_PATH + '/img')));
app.use("/dist", express.static(path.join(__dirname, 'dist')));

// test api
app.get("/api/home/", function(req, res) {
	res.json({
		name: "test API item",
		value: 42
	});
});

// cropper
app.get('/crop', function(req, res) {
	res.sendfile(MAIN_PATH + '/crop.html');
});

// anonymizer
app.get('/anonymizer', function(req, res) {
	res.sendfile(MAIN_PATH + '/anonymizer.html');
});

// minimal
app.get('/minimal', function(req, res) {
	res.sendfile(MAIN_PATH + '/minimal.html');
});

// default
app.get('/*', function(req, res) {
	res.sendfile(MAIN_PATH + '/index.html');
});

console.log("Server running on the port " + port);
app.listen(port);
