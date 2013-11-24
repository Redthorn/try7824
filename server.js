var express = require('express');
var app = express();

var jsonObj =
    {
          "name" : "John Ryan", "vacation" : 
          {"places": ["34.40, -199.71","24.67, -78.00","53.35, -6.306"]}
    };

app.get('/', function(req, res){
  res.json(jsonObj);
});

var port = process.env.PORT || 5000;
app.listen(port);
