var express = require('express');
var router = express.Router();

var moment = require('moment');

var Books = require('../models').Books;
var Patrons = require('../models').Patrons;
var Loans = require('../models').Loans;

// GET - /loans
router.get('/', function(req, res, next) {

	Loans.belongsTo(Books, {foreignKey: 'book_id'});
	Loans.belongsTo(Patrons, {foreignKey: 'patron_id'});

	if(req.query.filter === 'overdue') {
		/*
		 * SELECT * 
		 * FROM LOANS A 
		 * INNER JOIN BOOKS B 
		 * 		ON A.BOOK_ID = B.ID
		 * WHERE 
		 *		A.RETURN_BY < "TODAYS' DATE" AND A.RETURNED_ON IS NULL;
		*/
		Loans.findAll({
			order: [['createdAt', 'DESC']],
			where: {returned_on: {$eq: null}, return_by: {$lt: new Date()}},
			include: [
				  		{model: Books,required: true}, 
				  		{model: Patrons,required: true}
				 	]
		}).then(function(data) {
			res.render('loans/overdue_loans', {loans: data});
		});
	} else if(req.query.filter === 'checked_out') {
		/*
		 * SELECT * 
		 * FROM LOANS A 
		 * INNER JOIN BOOKS B 
		 *		ON A.BOOK_ID = B.ID 
		 * WHERE 
		 *		A.RETURNED_ON IS NULL;
		*/
		Loans.findAll({
			order: [['createdAt', 'DESC']],
			where: {returned_on: {$eq: null}},
			include: [
				  		{model: Books,required: true}, 
				  		{model: Patrons,required: true}
				 	]
		}).then(function(data) {
			res.render('loans/checked_loans', {loans: data});
		});
	} else {
		Loans.findAll({
			order: [['createdAt', 'DESC']],
			include: [
				  		{model: Books,required: true}, 
				  		{model: Patrons,required: true}
				 	]
		}).then(function(loans) {
			res.render('loans/all_loans', {loans: loans});
		});
	}	
});

// GET - /loans/new
router.get('/new', function(req, res, next) {
	
	Books.findAll().then(function(books) {
		Patrons.findAll().then(function(patrons) {
			var loanedOn = moment().format('YYYY-MM-DD');
			var returnBy = moment().add('7', 'days').format('YYYY-MM-DD');

			res.render('loans/new_loan', 
			{
				books : books, 
				patrons: patrons, 
				loanedOn: loanedOn,
				returnBy: returnBy
			});

		}).catch(function(err) {

		});
	});	
});

// POST - /loans 
router.post('/', function(req, res, next) {
	Loans.create(req.body).then(function(loan) {
		res.redirect('/loans');
	});
});

//GET - /loans/:id
router.get('/:id', function(req, res, next) {
	Loans.belongsTo(Books, {foreignKey: 'book_id'});
	Loans.belongsTo(Patrons, {foreignKey: 'patron_id'});
	Loans.findAll({
			where: {id: {$eq: req.params.id}},
			include: [
				  		{model: Books,required: true}, 
				  		{model: Patrons,required: true}
				 	 ]
		}).then(function(data) {
			res.render('loans/return_book', {loan: data});
		});
});

//PUT - loans/:id
router.put('/:id', function(req, res, next) {
	Loans.findById(req.params.id).then(function(loan) {
		return loan.update(req.body);
	}).then(function() {
		res.redirect('/loans');
	});
});


module.exports = router;
