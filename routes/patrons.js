var express = require('express');
var Patrons = require('../models').Patrons;

var router = express.Router();

router.get('/', function(req, res) {
	Patrons.findAll().then(function() {
		res.render('all_patrons');
	});
});

router.post('/', function(req, res) {
	Patrons.create(req.body).then(function(patron) {
		res.redirect('/patrons');
	});
});

router.get('/new', function(req, res) {
	res.render('new_patron');
});

module.exports = router;