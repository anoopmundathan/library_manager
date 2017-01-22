var express = require('express');

var router = express.Router();

router.get('/', function(req, res) {
	res.send('Patrons All route');
});

router.get('/new', function(req, res) {
	res.send('Patrons New');
});

module.exports = router;