var mongoose = require("mongoose");
var express = require("express");
var fs = require("fs");
var url = require("url");
var path = require("path");
var app = express();

mongoose.connect('mongodb://localhost/test');

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
  console.log('database is open')
});

var jobSchema = mongoose.Schema({
	title: String,
	location: String,
	description: String,
	keyskills: String,
	payfrom: String,
	payto: String,
	close: String,
	posted: String
});

var Job = mongoose.model('Job', jobSchema);

app.use(express.compress());

app.use('/public', express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/public'));

app.use('/home', function(req, res){
		var html = '';
		fs.readFile(__dirname + '/public/index.html', "binary", function(err, data){
        if(err){
        	console.log(err);
        } else {
         	html += data;
         	var htmlTitle = html.split('{{TITLE}}');
         	html = htmlTitle.join('Home Page');
         	var htmlContent = html.split('{{CONTENT}}');
			fullHtml = htmlContent.join('<h1>Hello there</h1>');
       		res.send(fullHtml);
        }
    });
});


app.post('/added', express.bodyParser(), function(req, res){
	var newDate = new Date();
	var closeDate = new Date(req.body.closing);
	var newJob = new Job({
		title: req.body.title,
		location: req.body.location,
		description: req.body.description,
		keyskills: req.body.keyskills,
		payfrom: req.body.payfrom,
		payto: req.body.payto,
		close: closeDate.toDateString(),
		posted: newDate.toDateString()
	});
	newJob.save(function(err){
		if(err) { 
			console.log(err); 
		} else { 
			console.log(req.body.title + ' saved successfully'); 
		}
	});
	res.send('foo');

});

app.get('/delete', express.bodyParser(), function(req, res){
    var uri = url.parse(req.url).pathname;
    var query = url.parse(req.url, true).query;
    var id = query.id;
	Job.findByIdAndRemove(id, function(err, job){
		if(err){
			console.log('Error: ' + err);
			res.send('Could not delete document');
		} else {
			console.log('Deleted ' + job.title);
			res.send(id);
		}
	});
});

app.get('/find', function(req, res){
	Job.find(function(err, jobs){
		if(err){
			console.log('Couldnt find jerbs because of this err: ' + err);
			res.send(404, 'There has been an error');
		} else {
			var jobsList = '';
			var html = '';
			var fullHtml = '';
			fs.readFile(__dirname + '/public/find.html', "binary", function(err, data){
	            if(err){
	            	console.log(err);
	            } else {
	             	html += data;
	             	var htmlArray = html.split('{{CONTENT}}');
	             	for(var i = 0; i < jobs.length; i++){
					 	jobsList += '<li>' + jobs[i].title + '<button id="' + jobs[i].id + '" class="remove">Remove</button></li>';
					 }
					fullHtml = htmlArray.join(jobsList);
	           		res.send(fullHtml);
	            }
            });
		}
	});

});

app.get('/edit', function(req, res){
	res.sendfile(__dirname + '/public/edit.html');
});

app.listen(2000, function(){
	console.log('Server is running at 127.0.0.1:2000');
});

// var source = '<h3>Job {{title}}</h3>
// 			<h4>Location: {{location}}</h4>
//             <p>Pay {{payfrom}} - {{payto}}</p>';
// var template = Handlebars.compile(source); 

// var html = '<!DOCTYPE html>
// 			<html>
// 				<head>
// 					<title>Find Jobs</title>
// 				</head>
// 				<body>
					
// 				</body>
// 			</html>'

