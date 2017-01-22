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

module.exports = router;
