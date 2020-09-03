var express = require('express');
var router = express.Router();
var middleware = require('../middleware');
var connection = require('../connection');
var debug = require('debug')('backendmuseovirtual:crudMuseo');
var mysql = require('mysql');


/* GET crud del museo. */
router.get('/', /*middleware.pagina,*/ function (req, res, next) {
    res.render('crudMuseo', { title: 'Seccion museo.' });
});

module.exports = router;