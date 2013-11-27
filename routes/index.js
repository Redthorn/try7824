
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Form' });
};

exports.results = function(req, res){
	res.render('results', {title: 'Results'});
};

exports.form = function() {
	return function (req, res){

           /* if () {
                // If it failed, return error
                res.send("There was a problem adding the information to the database.");
            }
            else {  */
                // If it worked, forward to success page
                res.redirect('http://google.com');
                // And set the header so the address bar doesn't still say /adduser
                res.location('/results');
       }     //}
}