var express = require('express');
var router = express.Router();
var Loans = require('../models').Loans;

router.get('/all', function(req, res) {
	Loans.findAll().then(function() {
		res.render('all_loans');
	});
});

router.get('/new', function(req, res) {
	res.render('new_loan');
});

router.get('/overdue', function(req, res) {
	res.render('overdue_loans');
});

router.get('/checked', function(req, res) {
	res.render('checked_loans');
});

module.exports = router;
