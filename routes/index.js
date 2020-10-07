var express = require('express');
var router = express.Router();
var connection = require('../connection');
var debug = require('debug')('backendmuseovirtual:index');
var logger = require('../logger').child({ from: 'index' });

/* GET Index page. */
router.get('/', function (req, res, next) {
   res.render('appMuseo');
});



module.exports = router;
