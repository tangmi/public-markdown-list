
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
	console.log("Downloading " + req.params.url);

	var request = http.get(req.params.url, function(response) {
		var output = "";
		response.setEncoding();
		response.on('data', function(data) {
			output += data;
		}).on('end', function() {

			try {
				output = marked(output);
			} catch(e) {
				output = "No file \"" + req.params.url + "\" found.";
			}

			filedata = {
				name: req.params.url,
				size: output.length,
				modified: null
			};

			res.render('index', { title: req.params.url, page: "single", output: output, file: filedata });
		});

	});

	

};