var express = require('express');
var router = express.Router();
var connection = require('../connection');

/* GET Obras page. */
router.get('/', function(req, res, next) {
  res.render('obras', { title: 'Obras' });
});

module.exports = router;