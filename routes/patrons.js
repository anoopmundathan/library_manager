var express = require('express');
var Patrons = require('../models').Patrons;

var router = express.Router();

router.get('/', function(req, res) {
	Patrons.findAll().then(function() {
		console.log('Patrons');
	});
	res.send('Patrons All route');
});

router.get('/new', function(req, res) {
	res.send('Patrons New');
});

module.exports = router;