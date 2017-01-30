var express = require('express');
var router = express.Router();

var Books = require('../models').Books;
var Loans = require('../models').Loans;
// GET /books
router.get('/', function(req, res, next) {

	if(req.query.filter === 'overdue') {
		res.render('overdue_books');
	} else if(req.query.filter === 'checked_out') {
		/*
		 * SELECT * FROM LOANS A INNER JOIN BOOKS B ON A.BOOK_ID = B.ID 
		 * WHERE A.RETURNED_ON IS NULL;
		*/
		Loans.belongsTo(Books, {foreignKey: 'book_id'});
		Loans.findAll({
			where: {returned_on: {$eq: null}},
			include: [{model: Books, required: true}]
		}).then(function(loans) {
			res.render('checked_books', {loans: loans});
		});
	} else {
		Books.findAll().then(function(books) {
			res.render('all_books', {books : books});
		});	
	}
});

// POST /books
router.post('/', function(req, res, next) {
	Books.create(req.body).then(function(book) {
		res.redirect('/books');
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

router.get('/new', function(req, res, next) {
	res.render('new_book', {book: Books.build()});
});

// GET individual book
router.get('/:id', function(req, res, next) {
	Books.findById(req.params.id).then(function(book) {
		res.render('book_detail', {book: book});
	});
});

/* PUT update a book */
router.put('/:id', function(req, res, next) {
	Books.findById(req.params.id).then(function(book) {
		return book.update(req.body);
	}).then(function() {
		res.redirect('/');
	});
});


module.exports = router;
