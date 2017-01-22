var express = require('express');
var router = express.Router();
var Books = require('../models').Books;

router.get('/', function(req, res) {
	res.send('Book All route');
});

router.get('/new', function(req, res) {
	res.send('Books - New route');
});

module.exports = router;
