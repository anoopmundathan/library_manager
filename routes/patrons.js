'use strict';

var express = require('express');

var Books = require('../models').Books;
var Loans = require('../models').Loans;
var Patrons = require('../models').Patrons;

var router = express.Router();

// GET /patrons - List All Patrons
router.get('/', function(req, res, next) {
	Patrons.findAll().then(function(patrons) {
		res.render('patrons/all_patrons', {
			patrons: patrons
		});
	});
});

// GET /patrons/new - New Patron
router.get('/new', function(req, res, next) {
	res.render('patrons/new_patron', {patron : Patrons.build()});
});

// POST /patrons - Create New Patron
router.post('/', function(req, res, next) {
	Patrons.create(req.body).then(function(patron) {
		res.redirect('/patrons');
	}).catch(function(err) {
		if(err.name === "SequelizeValidationError") {
			res.render('patrons/new_patron', {
				patron: Patrons.build(req.body),
				errors: err.errors
			});
		} else {
			throw err;
		}
	});
});

// GET /patrons/:id - Individual Patron detail and Loan History
router.get('/:id', function(req, res, next) {
	Patrons.findById(req.params.id).then(function(patron) {
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
				patron_id: req.params.id
			}
		}).then(function(data) {
			res.render('patrons/patron_detail', {patron: patron, loans: data});
		}).catch(function(err) {
    		res.sendStatus(500);
  		});
		
	});
});

// PUT /patrons/:id - Update Patron
router.put('/:id', function(req, res, next) {
	Patrons.findById(req.params.id).then(function(patron) {
		return patron.update(req.body);
	}).then(function() {
		res.redirect('/patrons');
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
					patron_id: req.params.id
				}
			}).then(function(data) {
				req.body.id = req.params.id;
				res.render('patrons/patron_detail', {
					patron: req.body, 
					loans: data,
					errors: err.errors
				});
			}).catch(function(err) {
    			res.sendStatus(500);
  			}); // End of Loans.findAll
		} else {
			throw err;
		} // End If
	});
});
module.exports = router;