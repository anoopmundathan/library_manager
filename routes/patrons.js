var express = require('express');

var Books = require('../models').Books;
var Loans = require('../models').Loans;
var Patrons = require('../models').Patrons;

var router = express.Router();

// GET all patrons
router.get('/', function(req, res, next) {
	Patrons.findAll({
		order: [['createdAt', 'DESC']],
	}).then(function(patrons) {
		res.render('patrons/all_patrons', {
			patrons: patrons
		});
	});
});

// POST - create new patron
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
	}).catch(function(err) {
		res.send(500);
	})
});

// GET new book route
router.get('/new', function(req, res, next) {
	res.render('patrons/new_patron', {patron : Patrons.build()});
});

// GET individual patron
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
		});
		
	});
});

module.exports = router;