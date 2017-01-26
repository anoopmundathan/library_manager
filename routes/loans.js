var express = require('express');
var router = express.Router();
var Books = require('../models').Books;
var Patrons = require('../models').Patrons;
var Loans = require('../models').Loans;

router.get('/', function(req, res) {
	Loans.findAll().then(function() {
		res.render('all_loans');
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
		res.render('new_loan', {books : data[0], patrons: data[1]});
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
