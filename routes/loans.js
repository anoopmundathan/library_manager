var express = require('express');
var router = express.Router();

var moment = require('moment');

var Books = require('../models').Books;
var Patrons = require('../models').Patrons;
var Loans = require('../models').Loans;

// GET request
router.get('/', function(req, res) {

	Loans.belongsTo(Books, {foreignKey: 'book_id'});
	Loans.belongsTo(Patrons, {foreignKey: 'patron_id'});

	Loans.findAll({
		order: [['createdAt', 'DESC']],
		include: [
				  {model: Books,required: true}, 
				  {model: Patrons,required: true}
				 ]
	}).then(function(loans) {
		res.render('all_loans', {loans: loans});
	});
});

// POST request 
router.post('/', function(req, res) {
	Loans.create(req.body).then(function(loan) {
		res.redirect('/loans');
	});
});

// GET loans/new
router.get('/new', function(req, res) {
	
	Books.findAll().then(function(books) {
		Patrons.findAll().then(function(patrons) {
			var loanedOn = moment().format('YYYY-MM-DD');
			var returnBy = moment().add('7', 'days').format('YYYY-MM-DD');

			res.render('new_loan', 
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

router.get('/overdue', function(req, res) {
	res.render('overdue_loans');
});

router.get('/checked', function(req, res) {
	res.render('checked_loans');
});

module.exports = router;
