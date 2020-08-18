var express = require('express');
var router = express.Router();
var connection = require('../connection');

/* GET Salas page. */
router.get('/', function (req, res, next) {
  res.render('salas', { title: 'Salas' });
});

module.exports = router;