var express = require('express');
var router = express.Router();
var connection = require('../connection');
var debug = require('debug')('backendmuseovirtual:index');

/* GET Index page. */
router.get('/', function (req, res, next) {
   res.render('index', { title: 'Index' });
});



module.exports = router;
