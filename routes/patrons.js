var express = require('express');
var Patrons = require('../models').Patrons;

var router = express.Router();

router.get('/all', function(req, res) {
	Patrons.findAll().then(function() {
		res.render('all_patrons');
	});
});

router.get('/new', function(req, res) {
	res.render('new_patron');
});

module.exports = router;