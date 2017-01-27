var express = require('express');
var router = express.Router();
var Books = require('../models').Books;
var Patrons = require('../models').Patrons;
var Loans = require('../models').Loans;
var moment = require('moment');

router.get('/', function(req, res) {
	Loans.findAll().then(function() {
		res.render('all_loans');
	});
});

// POST request 
router.post('/', function(req, res) {
	Loans.create(req.body).then(function(loan) {
		res.send('Posted');
	});
});


router.get('/new', function(req, res) {
	
	// Create Promise object
	var bookDetail = new Promise(function(resolve, reject) {
		Books.findAll().then(function(books) {
			resolve(books);
		}).catch(function(err) {
			reject(err);
		});
	});

	// Create Promise object
	var patronDetail = new Promise(function(resolve, reject) {
		Patrons.findAll().then(function(patrons) {
			resolve(patrons);
		}).catch(function(err) {
			reject(err);
		})
	});

	// Render only if both Promise resolve
	Promise.all([bookDetail, patronDetail]).then(function(data) {
		
		/*
		 * Format date
		*/
		var loanedOn = moment().format('YYYY-MM-DD');
		var returnBy = moment().add('7', 'days').format('YYYY-MM-DD');

		res.render('new_loan', 
			{
				books : data[0], 
				patrons: data[1], 
				loanedOn: loanedOn,
				returnBy: returnBy
			});
	}).catch(function(error) {
		// Error
	});

});

router.get('/overdue', function(req, res) {
	res.render('overdue_loans');
});

router.get('/checked', function(req, res) {
	res.render('checked_loans');
});

module.exports = router;
