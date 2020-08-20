var express = require('express');
var router = express.Router();
var connection = require('../connection');

/* GET Login page. */
router.get('/', function (req, res, next) {
   res.render('index', { title: 'Login' });
});

module.exports = router;
