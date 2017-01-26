var express = require('express');
var Patrons = require('../models').Patrons;

var router = express.Router();

router.get('/', function(req, res) {
	Patrons.findAll().then(function(patrons) {
		res.render('all_patrons', {
			patrons: patrons
		});
	});
});

router.post('/', function(req, res) {
	Patrons.create(req.body).then(function(patron) {
		res.redirect('/patrons');
	}).catch(function(err) {
		if(err.name === "SequelizeValidationError") {
			res.render('new_patron', {
				patron: Patrons.build(req.body),
				errors: err.errors
			});
		} else {
			throw err;
		}
	}).catch(function(err) {
		res.send(500);
	})
});

router.get('/new', function(req, res) {
	res.render('new_patron', {patron : Patrons.build()});
});

module.exports = router;