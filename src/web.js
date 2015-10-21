var express = require('express');
var bodyParser = require('body-parser');
var format = require('./format');

module.exports = function (program) {
	var app = express();
	app.use(bodyParser.json());

	app.get('/', function (req, res) {
		res.end('POST to /format, /withmeta, or /sectioned');
	});

	app.post('/format', function (req, res) {
		var formatted = format.displayMapping(req.body, false);
		res.end(JSON.stringify(formatted));
	});

	app.post('/withmeta', function (req, res) {
		var formatted = format.display(req.body);
		res.end(JSON.stringify(formatted));
	});

	app.post('/sectioned', function (req, res) {
		var formatted = format.sectionedMapping(req.body);
		res.end(JSON.stringify(formatted));
	});

	app.listen(program.port, function () {
		console.log('Express server listening on port '+ program.port);
	});
};
