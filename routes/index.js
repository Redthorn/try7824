
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Form' });
};

exports.results = function(req, res){
	res.render('results', {title: 'Results'});
};

exports.saveInput = function(hash1, hash2, hashlist){
  var buffer 

};