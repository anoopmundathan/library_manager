var express = require('express');
var bodyParser = require('body-parser');
var sequelize = require('./models').sequelize;
var Books = require('./models').Books;

var app = express();

app.use(express.static('public'));

app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

app.set('views', './views');
app.set('view engine', 'pug');

app.get('/', function(req, res) {
	
	Books.findAll().then(function(books) {
		books.forEach(function(book) {
			console.log(book.id);
			console.log(book.title);
			console.log(book.author);
			console.log(book.genre);
			console.log(book.first_published);
		});
	});

	res.render('home');
});

app.get('/books/new', function(req, res) {
	res.render('new_book');
});

app.post('/add', function(req, res) {
	Books.create(req.body).then(function() {
		res.redirect('/');
	});
});

sequelize.sync().then(function() {
	app.listen(3000, function() {
		console.log('Server running at port 3000');
	});
});

