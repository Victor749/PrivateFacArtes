var express = require('express');
var router = express.Router();
var middleware = require('../middleware');
var connection = require('../connection');
var debug = require('debug')('backendmuseovirtual:crudMuseo');
var mysql = require('mysql');
const multer = require('multer');
const upload = multer();

/* GET crud del museo. */
router.get('/', /*middleware.pagina,*/ function (req, res, next) {
    res.render('crudMuseo', { title: 'Seccion museo.'});
});

router.post('/addNewAudio', upload.any(), /*middleware.estado,*/ function (req, res) {
    const formData = req.body;
    console.log('form data', formData);
    res.sendStatus(200);
});

module.exports = router;