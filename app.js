var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var sequelize = require('./models').sequelize;

var books = require('./routes/books');
var patrons = require('./routes/patrons');
var loans = require('./routes/loans');

var Loans = require('./models').Loans;
var Patrons = require('./models').Patrons;

var app = express();

app.set('port', process.env.PORT || 3500);

app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

app.set('views', './views');
app.set('view engine', 'pug');

app.get('/', function(req, res) {
	res.render('home');
});

app.use('/books', books);
app.use('/patrons', patrons);
app.use('/loans', loans);

sequelize.sync().then(function() {
	app.listen(app.get('port'), function() {
		console.log('Server Running at port ' + app.get('port'));
	});
});

