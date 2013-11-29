/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');
var fs = require('fs');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.use(express.favicon(path.join(__dirname, 'public/images/favicon.ico')));
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
app.engine('html', require('ejs').renderFile);

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', function (req, res){res.render('index.html');});
app.get('/results', function (req, res){res.render('results.html');});
app.get('/hashlist',function (req, res){res.render('hashlist.html');});

app.post('/form', function (req, res)
{
	var hashlist = new Array(10);
	var hashfreq = new Array(10);
	var hash1 = (req.body.textfield).toLowerCase();
	var hash2 = (req.body.textfield2).toLowerCase();

	hashlist[0] = hash1;
	hashlist[1] = hash2;
	
	//save array to html file for ajax display
	var bigString = '<ol>';
	for(var i=0; i < 10; i++)
	{
		bigString += '<li>';
		bigString += hashlist[i];
		bigString += '</li>'
	}
	bigString += '</ol>'

	fs.writeFile('views/hashlist.html', bigString, function (err) {
  		if (err) throw err;
  		console.log('It\'s saved!');
	});
	//end saving 
	res.redirect('results');
	res.location('/results');
	console.log("post received", hash1, hash2);
});



//server junk 
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});


// lost pieces of code
/*
	fs.writeFile('views/hashlist.txt', hash1 + "\n" + hash2, function (err) {
  		if (err) throw err;
  		console.log('It\'s saved!');
	});
*/