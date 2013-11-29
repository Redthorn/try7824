
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Form' });
};

exports.results = function(req, res){
	res.render('results', {title: 'Results'});
};

exports.hashlist = function(req, res){
  res.render('hashlist', {title: 'Hashlist'});
};