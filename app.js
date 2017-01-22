var express = require('express');
var bodyParser = require('body-parser');
var sequelize = require('./models').sequelize;

var books = require('./routes/books');
var patrons = require('./routes/patrons');
var loans = require('./routes/loans');

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
app.use('/loans', loans);

// app.get('/', function(req, res) {
// 	res.render('home');
// });

sequelize.sync({
	force: true
}).then(function() {
	app.listen(3000, function() {
		console.log('Server running at port 3000');
	});
});

