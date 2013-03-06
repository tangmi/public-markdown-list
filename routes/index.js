String.prototype.contains = function(str) {
	return this.indexOf(str) >= 0;
};


/*
* GET home page.
*/

var fs = require('fs');
var basedir = './public/md/';
var marked = require("marked");
var url = require('url');
var http = require('http');

exports.index = function(req, res) {
	res.redirect("/index.md");
};

//TODO remove this?
exports.single = function(req, res) {
	console.log("Requested " + req.route.path);

	fs.readFile(basedir + req.params.filename, 'utf-8', function(err, data) {
		var output = "";

		try {
			output = marked(data);
		} catch(e) {
			output = "<p>No file \"" + req.params.filename + "\" found.</p>";
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
		url: null,
		size: 0,
		modified: null
	};

	var request = http.get(url, function(response) {

		console.log("Downloading " + url);

		console.log(response.headers['content-type']);

		if(response.headers['content-type'].contains("text/plain") || response.headers['content-type'].contains('markdown')) {

			var output = "";

			response.setEncoding();
			response.on('data', function(data) {
				output += data;
			}).on('end', function() {

				try {
					output = marked(output);
				} catch(e) {
					output = "<p>No file \"" + url + "\" found.</p>";
				}

				filedata = {
					name: url,
					url: url,
					size: output.length,
					modified: null
				};

				res.render('index', { title: url, page: "single", output: output, file: filedata });
			});

		} else {
			res.render('index', { title: url, page: "single", output: "<p>Resource is not a Markdown document.</p>", file: filedata });
		}

	}).on('error', function(e) {
		res.render('index', { title: url, page: "single", output: "<p>Resource couldn't be loaded.</p>", file: filedata });
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