#!/usr/bin/env node
var express = require('express');
var path = require('path');
var app = express();
var port = process.env.PORT || 8001;

const MAIN_PATH = "static";

// paths
app.use("/css", express.static(path.join(__dirname, MAIN_PATH, 'css')));
app.use("/js", express.static(path.join(__dirname, MAIN_PATH, 'js')));
app.use("/templ", express.static(path.join(__dirname, MAIN_PATH, 'templ')));
app.use("/locale", express.static(path.join(__dirname, MAIN_PATH, 'locale')));
app.use("/img-test", express.static(path.join(__dirname, MAIN_PATH, 'img')));
app.use("/img", express.static(path.join(__dirname, 'img')));
app.use("/docs", express.static(path.join(__dirname, 'docs')));

// test api
app.get("/api/home/", function(req, res) {
	res.json({
		name: "test API item",
		value: 42
	});
});

// test
app.get('/test', function(req, res) {
	res.sendfile(path.join(MAIN_PATH, 'test.html'));
});

// cropper
app.get('/crop', function(req, res) {
	res.sendfile(path.join(MAIN_PATH, 'crop.html'));
});

// anonymizer
app.get('/anonymizer', function(req, res) {
	res.sendfile(path.join(MAIN_PATH, 'anonymizer.html'));
});

// minimal
app.get('/minimal', function(req, res) {
	res.sendfile(path.join(MAIN_PATH, 'minimal.html'));
});

// utils
app.get('/utils', function(req, res) {
	res.sendfile(path.join(MAIN_PATH, 'utils.html'));
});

// docs
app.get('/docs', function(req, res) {
	res.sendfile('docs/index.html');
});

// default
app.get('/*', function(req, res) {
	res.sendfile(path.join(MAIN_PATH, 'index.html'));
});

console.log("Server running on the port " + port);
app.listen(port);
