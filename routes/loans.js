var express = require('express');
var router = express.Router();
var Loans = require('../models').Loans;

router.get('/', function(req, res) {
	Loans.findAll().then(function() {
		console.log('Loans');
	});
	res.send('Loans route');
});

router.get('/new', function(req, res) {
	res.send('Loans New route');
});

module.exports = router;
