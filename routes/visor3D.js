var express = require('express');
var router = express.Router();
var debug = require('debug')('backendmuseovirtual:visor3D');
var fs = require('fs');
var logger = require('../logger').child({ from: 'visor3D' });

/* GET Visor 3D page. */
router.get('/:archivo_modelo', function (req, res, next) {
    fs.access(`public/static_assets/${req.params.archivo_modelo}`, (err) => {
        if (err) {
            debug(err);
            logger.error(err);
            res.sendStatus(404);
        } else {
            res.render('visor3D', { title: 'Visor Modelo 3D', archivo: req.params.archivo_modelo });
        }
    });
});

module.exports = router;