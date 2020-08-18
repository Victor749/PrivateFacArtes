var express = require('express');
var router = express.Router();
var connection = require('../connection');

/* GET Museo page. */
router.get('/', function(req, res, next) {
  res.render('museo', { title: 'Museo' });
});

module.exports = router;
