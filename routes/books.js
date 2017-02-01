'use strict';

var express = require('express');
var router = express.Router();

var Books = require('../models').Books;
var Loans = require('../models').Loans;
var Patrons = require('../models').Patrons;

// GET /books - List All Books
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
		}).catch(function(err) {
    		res.sendStatus(500);
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
		}).catch(function(err) {
    		res.sendStatus(500);
  		});
	} else if(searchTitle !== undefined ) {
		Books.findAll({
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
		}).catch(function(err) {
    		res.sendStatus(500);
  		});

	} else {
		Books.findAll().then(function(books) {
			res.render('books/all_books', {books : books});
		}).catch(function(err) {
    		res.sendStatus(500);
  		});
	}
});

// GET /books/new - New Book
router.get('/new', function(req, res, next) {
	res.render('books/new_book', {book: Books.build()});
});

// POST /books - Create New Book
router.post('/', function(req, res, next) {
	Books.create(req.body).then(function(book) {
		res.redirect('/books');
	}).catch(function(err) {
		if(err.name === "SequelizeValidationError") {
			res.render('books/new_book', {
				book: Books.build(req.body),
				errors: err.errors
			});
		} else {
			throw err;
		}
	}).catch(function(err) {
		res.sendStatus(500);
	})
});


// GET /books/:id - Individual Book detail and Loan History
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
		}).catch(function(err) {
    		res.sendStatus(500);
  		});
	});
});

// PUT /books/:id - Update Book
router.put('/:id', function(req, res, next) {
	
	Books.findById(req.params.id).then(function(book) {
		return book.update(req.body);
	}).then(function() {
		res.redirect('/books');
	}).catch(function(err) {
		/*
		 * If required fields are not there, show error
		 */
		if(err.name === "SequelizeValidationError") {

			/*
	 		 * Set Associations
	  		 */
			Loans.belongsTo(Books, {foreignKey: 'book_id'});
			Loans.belongsTo(Patrons, {foreignKey: 'patron_id'});

			/*
			 * Query again to get loan History of book
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
		
				req.body.id = req.params.id;
				res.render('books/book_detail', {
					book: req.body, 
					loans: data,
					errors: err.errors
				}); // End of res.render 
			}).catch(function(err) {
    			res.sendStatus(500);
  			}); // End of Loans.findAll
		} else {
			throw err;
		} // End If

	}).catch(function(err) {
		res.sendStatus(500);
	});
});

module.exports = router;
