
/*
* GET home page.
*/

var fs = require('fs');
var basedir = './public/md/';
var marked = require("marked");


exports.index = function(req, res) {
	var outFiles = "nothing";

	console.log("Requested " + req.route.path);


	fs.readdir(basedir,  function(err, files) {

		var output = [];

		for(i in files) {
			var file = files[i];


			var stats = fs.statSync(basedir + file);
			output.push({
				name: file,
				size: stats.size,
				modified: stats.mtime
			});
			
		}

		res.render('index', { page: "list", msg: err, output: output });

	});


};

exports.single = function(req, res) {
	fs.readFile(basedir + req.params.filename, 'utf-8', function(err, data) {
		var output = "";

		try {
			output = marked(data);
		} catch(e) {
			output = "No file \"" + req.params.filename + "\" found";
		}

		var stats = fs.statSync(basedir + req.params.filename);

		res.render('index', { page: "single", msg: err, output: output, file: {size: stats.size, modified: stats.mtime} });

	});
};