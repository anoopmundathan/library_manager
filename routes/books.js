var express = require('express');
var router = express.Router();
var Books = require('../models').Books;

// 
router.get('/', function(req, res) {
	Books.findAll().then(function(books) {
		res.render('all_books', {books : books});
	});
});

router.get('/new', function(req, res) {
	res.render('new_book', {book: Books.build()});
});

router.get('/:filter', function(req, res) {
	// console.log(req.params.filter);
	res.render('overdue_books');
});

router.post('/add', function(req, res) {
	Books.create(req.body).then(function(book) {
		res.render('book_detail', {
			book: book
		});
	}).catch(function(err) {
		if(err.name === "SequelizeValidationError") {
			res.render('new_book', {
				book: Books.build(req.body),
				errors: err.errors
			});
		} else {
			throw err;
		}
	}).catch(function(err) {
		res.send(500);
	})
});

module.exports = router;
