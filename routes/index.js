
/*
* GET home page.
*/

var fs = require('fs');
var basedir = './public/md/';
var marked = require("marked");
var url = require('url');
var http = require('http');

exports.index = function(req, res) {

	var outFiles = "nothing";

	console.log("Requested " + req.route.path);


	fs.readdir(basedir,  function(err, files) {

		var output = [];

		for(var i in files) {
			var file = files[i];


			var stats = fs.statSync(basedir + file);
			output.push({
				name: file,
				size: stats.size,
				modified: stats.mtime
			});
		}

		res.render('index', { title: "list", page: "list", output: output });

	});


};

exports.single = function(req, res) {
	console.log("Requested " + req.route.path);

	fs.readFile(basedir + req.params.filename, 'utf-8', function(err, data) {
		var output = "";

		try {
			output = marked(data);
		} catch(e) {
			output = "No file \"" + req.params.filename + "\" found.";
		}

		var filedata = {};
		try {
			var stats = fs.statSync(basedir + req.params.filename);
			filedata = {
				name: req.params.filename,
				size: stats.size,
				modified: new Date(stats.mtime).toDateString()
			};
		} catch(e) {
			filedata = {
				name: "file not found",
				size: 0,
				modified: "n/a"
			};
		}

		res.render('index', { title: req.params.filename, page: "single", output: output, file: filedata });

	});
};

exports.external = function(req, res) {
	var url = new Buffer(req.params.url, 'base64').toString('ascii');

	var filedata = {
		name: url,
		url: url,
		size: 0,
		modified: null
	};

	console.log("Downloading " + url);

	var request = http.get(url, function(response) {

		console.log("Downloading " + url);


		var output = "";
		response.setEncoding();
		response.on('data', function(data) {
			output += data;
		}).on('end', function() {

			try {
				output = marked(output);
			} catch(e) {
				output = "No file \"" + url + "\" found.";
			}

			filedata = {
				name: url,
				url: url,
				size: output.length,
				modified: null
			};

			res.render('index', { title: url, page: "single", output: output, file: filedata });
		});

	}).on('error', function(e) {
		res.render('index', { title: url, page: "single", output: "Resource couldn't be loaded.", file: filedata });
	});


};

exports.helper = function(req, res) {
	res.render('helper');
};

exports.base64 = {};
exports.base64.encode = function(req, res) {
	res.send(new Buffer(req.params.string).toString('base64'));
};
exports.base64.decode = function(req, res) {
	res.send(new Buffer(req.params.string, 'base64').toString('ascii'));
};