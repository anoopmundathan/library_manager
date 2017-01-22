var express = require('express');
var router = express.Router();
var Books = require('../models').Books;

router.get('/all', function(req, res) {
	Books.findAll().then(function(books) {
		res.render('all_books', {books : books});
	});
});

router.get('/new', function(req, res) {
	res.render('new_book');
});

router.post('/add', function() {

});

module.exports = router;
