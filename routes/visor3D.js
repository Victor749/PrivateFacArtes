var express = require('express');
var router = express.Router();
var debug = require('debug')('backendmuseovirtual:visor3D');

/* GET Visor 3D page. */
router.get('/:archivo_modelo', function (req, res, next) {
    res.render('visor3D', { title: 'Visor Modelo 3D', archivo: req.params.archivo_modelo });
});

module.exports = router;