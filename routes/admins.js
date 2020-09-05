var express = require('express');
var router = express.Router();
var connection = require('../connection');
var debug = require('debug')('backendmuseovirtual:admins');
var middleware = require('../middleware');
var mysql = require('mysql');

/* GET Admins page. */
router.get('/', middleware.pagina, function (req, res, next) {
    let sql = `select correo from usuarioadmin`;
    connection.query(sql, function (error, results) {
        if (error) {
            debug(error);
            res.sendStatus(500);
        } else {
            res.render('admins', { title: 'Usuarios', results: results });
        }
    });
});

/* POST Agregrar correo usuario admin */
router.post('/agregar', middleware.pagina, function (req, res, next) {
    if (req.body.correo) {
        let sql = `insert into usuarioadmin(correo) values(${mysql.escape(req.body.correo)})`;
        connection.query(sql, function (error, results) {
            if (error) {
                debug(error);
                res.sendStatus(500);
            } else {
                res.redirect('/editor/usuarios');
            }
        });
    } else {
        res.sendStatus(400);
    }
});

module.exports = router;