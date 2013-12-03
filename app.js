/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');
var fs = require('fs');
var twitter = require('ntwitter');
var sentiment = require('sentiment');

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
app.get('/hashlist', function (req, res){res.render('hashlist.html');});
app.get('/selection', function (req, res){res.render('selection.html');});

//authenticate with twitter dev account
var twit = new twitter({
  consumer_key: 'zjVQiFUnRX5ikVCLVgIw',
  consumer_secret: 'pNllpbhujW2inNcNCQ8ktIIQGRaL70dzLBm9tXNLHLc',
  access_token_key: '43466231-KhsLhbx53cgremwCTYeY80na6FfCoUwiPlNO5ylaL',
  access_token_secret: 'tF7bYNLjDLcOZRmuhUSK0lucn4ZkF1jGZgbRs0DGPQOMb'
});
 twit
   .verifyCredentials(function (err, data) {
    console.log("Verifying Credentials...");
    if(err)
      console.log("Verification Failed : " + err)
      else
          //console.log(data);
        console.log("Verification Success");
})

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
  var startDate = (req.body.startDate);
  var endDate = (req.body.endDate);
  var radius = (req.body.number);
  var lat = (req.body.lat);
  var lon = (req.body.lon);
  //console.log(hash1,hash2,startDate,endDate,radius,lat,lon);

  //sentiment evaluation and construct soundcloud api implementation
  var score1, score2, Total;
  sentiment(hash1, function (err, result1){
    score1 = (result1.score);
  });
  sentiment(hash2, function (err, result2){
    score2 = (result2.score);
  });
  Total = score1 + score2;
  var string = '<strong>Sentiment Score:</strong> ' + score1 + ' + ' + score2 + ' = ' + Total + '<p>';
  if(Total < 1 && Total > -1)
  {
    string += 'Neutral Sentiment: ' + '<p> (-4)  (-3 - -2) <b>(-1 - +1)</b> (+2 - +3) (4+)';
  }
  else if(Total == -2 || Total == -3)
  {
    string += 'Negative Sentiment: ' + '<p> (-4)  <b>(-3 - -2)</b> (-1 - +1) (+2 - +3) (4+)';
  }
  else if(Total == 2 || Total == 3)
  {
    string += 'Positive Sentiment: ' + '<p> (-4)  (-3 - -2) (-1 - +1) <b>(+2 - +3)</b> (4+)';
  }
  else if (Total >= 4)
  {
    string += 'Very Positive Sentiment: ' + '<p> (-4)  (-3 - -2) (-1 - +1) (+2 - +3) <b>(4+)</b>';
  }
  else if (Total <= -4)
  {
    string += 'Very Negative Sentiment: ' + '<p> <b>(-4)</b>  (-3 - -2) (-1 - +1) (+2 - +3) (4+)';
  }

  string += '</p><p><iframe width="100%" height="166" scrolling="no" frameborder="no" src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/'

  if(Total < 1 && Total > -1)
  {
    string += '85910201';
  }
  else if(Total == -2 || Total == -3)
  {
    string += '60360398';
  }
  else if(Total == 2 || Total == 3)
  {
    string += '65625445';
  }
  else if (Total >= 4)
  {
    string += '106687285';
  }
  else if (Total <= -4)
  {
    string += '122952876';
  }

  string += '&amp;color=00FF00&amp;auto_play=false&amp;show_artwork=true"></iframe></p>';
  fs.writeFile('views/selection.html', string, function (err) {
      if (err) throw err;
      console.log('Sentiment saved!');
  });

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
			if (hashfreq[i] == 1)
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