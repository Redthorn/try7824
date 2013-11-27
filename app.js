/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.use(express.favicon());
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

app.get('/', function (req, res)
{
    res.render('index.html');
});
app.get('/results', function (req, res)
{
	res.render('results.html');
});

app.post('/form', function (req, res)
{
	var hash1 = req.body.textfield1;
	var hash2 = req.body.textfield2;

	res.redirect('/results');
	res.location('/results');
	console.log("post received", hash1, hash2);
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
