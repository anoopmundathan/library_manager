var express = require('express');
var router = express.Router();

var Books = require('../models').Books;
var Loans = require('../models').Loans;
var Patrons = require('../models').Patrons;

// GET /books
router.get('/', function(req, res, next) {

	var filter = req.query.filter;
	var searchTitle = req.query.searchTitle;

	if(filter === 'overdue') {
		/*
		 * SELECT * 
		 * FROM LOANS A 
		 * INNER JOIN BOOKS B 
		 * 		ON A.BOOK_ID = B.ID
		 * WHERE 
		 *		A.RETURN_BY < "TODAYS' DATE" AND A.RETURNED_ON IS NULL;
		*/
		Loans.belongsTo(Books, {foreignKey: 'book_id'});

		Loans.findAll({
			where: {returned_on: {$eq: null}, return_by: {$lt: new Date()}},
			include: [{model: Books, required: true}]
		}).then(function(loans) {
			res.render('books/overdue_books', {loans: loans});
		});

	} else if(filter === 'checked_out') {
		/*
		 * SELECT * 
		 * FROM LOANS A 
		 * INNER JOIN BOOKS B 
		 *		ON A.BOOK_ID = B.ID 
		 * WHERE 
		 *		A.RETURNED_ON IS NULL;
		*/
		Loans.belongsTo(Books, {foreignKey: 'book_id'});
		Loans.findAll({
			where: {returned_on: {$eq: null}},
			include: [{model: Books, required: true}]
		}).then(function(loans) {
			res.render('books/checked_books', {loans: loans});
		});
	} else if(searchTitle !== undefined ) {
		console.log('hello');
		Books.findAll({
			order: [['updatedAt', 'DESC']],
			where: {
				$or: [
					{
						title: {
							$like: '%' + searchTitle + '%'
						}
					}
				]
			}
		}).then(function(books) {
			res.render('books/all_books', {books : books});
		});	

	} else {
		Books.findAll({
			order: [['updatedAt', 'DESC']]
		}).then(function(books) {
			res.render('books/all_books', {books : books});
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
	res.render('books/new_book', {book: Books.build()});
});

// GET individual book
router.get('/:id', function(req, res, next) {

		/*
		 * SELECT * FROM BOOKS WHERE ID = REQ.PARAMS.ID;
		 */

	Books.findById(req.params.id).then(function(book) {
		
		/*
		 * Set Associations
		 */

		Loans.belongsTo(Books, {foreignKey: 'book_id'});
		Loans.belongsTo(Patrons, {foreignKey: 'patron_id'});

		/*
		 * SELECT * 
		 * FROM LOANS A 
		 * INNER JOIN BOOKS B 
		 * 		ON A.BOOK_ID = B.ID
		 * INNER JOIN PATRONS C
		 *      ON A.PATRON_ID = C.ID 
		 * WHERE 
		 *      A.BOOK_ID = REQ.PARAMS.ID;
		*/

		Loans.findAll({
			include: [
					  {model: Books,required: true}, 
					  {model: Patrons,required: true}
					 ],
			where: {
				book_id: req.params.id
			}
		}).then(function(data) {
			res.render('books/book_detail', {book: book, loans: data});
		});
	});
});

/* PUT update a book */
router.put('/:id', function(req, res, next) {
	Books.findById(req.params.id).then(function(book) {
		return book.update(req.body);
	}).then(function() {
		res.redirect('/books');
	});
});


module.exports = router;
