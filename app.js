var express = require('express');
var bodyParser = require('body-parser');
var sequelize = require('./models').sequelize;

var books = require('./routes/books');
var patrons = require('./routes/patrons');

var Loans = require('./models').Loans;
var Patrons = require('./models').Patrons;

var app = express();

app.use(express.static('public'));

app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

app.set('views', './views');
app.set('view engine', 'pug');

app.use('/books', books);
app.use('/patrons', patrons);

// app.get('/', function(req, res) {
// 	res.render('home');
// });

// ///////
app.get('/loans/all', function(req, res) {

	res.render('all_loans');
});

app.get('/loans/new', function(req, res) {
	res.render('new_loan');
});


sequelize.sync({
	force: true
}).then(function() {
	app.listen(3000, function() {
		console.log('Server running at port 3000');
	});
});

