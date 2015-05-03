var express  = require('express');
var path = require('path');
var app      = express();
var port  	 = process.env.PORT || 8000;
var lessMiddleware = require('less-middleware');
var MAIN_PATH = "static";

// less
app.use(lessMiddleware(path.join(__dirname, MAIN_PATH)), {}, {}, {
	sourceMap: true
});

// paths
app.use("/css", express.static(path.join(__dirname, MAIN_PATH + '/css')));
app.use("/img", express.static(path.join(__dirname, MAIN_PATH + '/img')));
app.use("/js", express.static(path.join(__dirname, MAIN_PATH + '/js')));
app.use("/templates", express.static(path.join(__dirname, MAIN_PATH + '/templates')));

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
