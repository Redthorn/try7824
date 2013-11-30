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

var hashlist = new Array(25);
var hashfreq = new Array(25);
for(var i=0; i<25; i++)
{
  hashlist[i]= 'undefined';
  hashfreq[i]= 0;
}

app.post('/form', function (req, res)
{
	var hash1 = (req.body.textfield).toLowerCase();
	var hash2 = (req.body.textfield2).toLowerCase();

	//search and insert input1 to arrays
	for(var i=0; i < 25; i++)
  	{
    	var result = hash1.localeCompare(hashlist[i]);
    	if(result == 0 && hashlist[i]!='undefined')
    	{
        	hashfreq[i] += 1;
        	result = 0;
        	break;
    	}
    	else if(result != 0 && hashlist[i]== 'undefined')
    	{
        	hashlist[i] = hash1;
        	hashfreq[i] = 1;
        	break;
    	}
  	}
  	//above but for input2
  	for(var i=0; i < 25; i++)
  	{
    	var result = hash2.localeCompare(hashlist[i]);
    	if(result == 0 && hashlist[i]!='undefined')
    	{
        	hashfreq[i] += 1;
        	result = 0;
        	break;
    	}
    	else if(result != 0 && hashlist[i]== 'undefined')
    	{
        	hashlist[i] = hash2;
        	hashfreq[i] = 1;
        	break;
    	}
  	}
  	//sort the fudging arrays by hashfreq
  	var j = 0;
  	var index = 0;
  	while (j < 23)
  	{
  		var num = hashfreq[index+1] - hashfreq[index];
  		if (num > 0)
  		{
  			var tempHash = hashlist[index];
  			var tempNum = hashfreq[index];
  			hashlist[index] = hashlist[index+1];
  			hashfreq[index] = hashfreq[index+1];
  			hashlist[index+1] = tempHash;
  			hashfreq[index+1] = tempNum;
  			index = 0;
  			j = 0;
  		}
  		else if (num < 0 || num == 0)
  		{
  			index++;
  			j++;
  		}

  	}

	//save array to html file for ajax display
	var bigString = '<ol>';
	for(var i=0; i < 10; i++)
	{
		bigString += '<li>';
		bigString += '#';
		if (hashlist[i] == 'undefined')
		{
			bigString += ' ';
		}
		else
		{
			if (hashlist[i] == 1)
			{
				bigString += hashlist[i] + ' \(' + hashfreq[i] + ' time searched\)';
			}
			else
			{
				bigString += hashlist[i] + ' \(' + hashfreq[i] + ' times searched\)';
			}	
		}
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