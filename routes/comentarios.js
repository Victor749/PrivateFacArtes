var express = require('express');
var router = express.Router();
var connection = require('../connection');
var debug = require('debug')('backendmuseovirtual:comentarios');



router.post('/new', function(req, res){

    debug(req.params);
    debug(req.body);

    res.send('SI SE HIZOOOOO');

});


module.exports = router;

