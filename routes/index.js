
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

		res.render('index', { page: "list", msg: err, output: files });

	});


};

exports.single = function(req, res) {
	fs.readFile(basedir + req.params.filename, 'utf-8', function(err, data) {

		res.render('index', { page: "single", msg: err, output: marked(data) });

	});
};