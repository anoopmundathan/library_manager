var express = require('express');
var router = express.Router();
var Books = require('../models').Books;

// GET /books
router.get('/', function(req, res) {

	if(req.query.filter === 'overdue') {
		res.render('overdue_books');
	} else if(req.query.filter === 'checked_out') {
		res.render('checked_books');
	} else {
		Books.findAll().then(function(books) {
			res.render('all_books', {books : books});
		});	
	}
});

// POST /books
router.post('/', function(req, res) {
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

router.get('/new', function(req, res) {
	res.render('new_book', {book: Books.build()});
});

module.exports = router;
