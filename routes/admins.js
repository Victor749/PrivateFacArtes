var express = require('express');
var router = express.Router();
var connection = require('../connection');
var debug = require('debug')('backendmuseovirtual:admins');
var middleware = require('../middleware');
var mysql = require('mysql');
var logger = require('../logger').child({ from: 'admins' });

/* GET Admins page. */
router.get('/', middleware.pagina, function (req, res, next) {
    let sql = `select idAdmin, correo, super from usuarioadmin order by idAdmin DESC`;
    connection.query(sql, function (error, results) {
        if (error) {
            debug(error);
            logger.error(error);
            res.sendStatus(500);
        } else {
            res.render('admins', { title: 'Usuarios', results: results });
        }
    });
});

/* POST Agregrar correo usuario admin */
router.post('/agregar', middleware.pagina, function (req, res, next) {
    if (req.body.correo) {
        let sql = `insert into usuarioadmin(correo, super) values(${mysql.escape(req.body.correo)}, false)`;
        connection.query(sql, function (error, results) {
            if (error) {
                // Si es un correo duplicado se redirige a la pagina de usuarios
                if (error.code !== 'ER_DUP_ENTRY') {
                    debug(error);
                    logger.error(error);
                    res.sendStatus(500);
                } else {
                    res.redirect('/editor/usuarios');
                }
            } else {
                res.redirect('/editor/usuarios');
            }
        });
    } else {
        res.sendStatus(400);
    }
});

/* Delete Quitar correo usuario admin */
router.delete('/quitar/:idAdmin', middleware.estado, function (req, res, next) {
    let sql = `delete from usuarioadmin where idAdmin=${mysql.escape(req.params.idAdmin)} and super=false`;
    connection.query(sql, function (error, results) {
        if (error) {
            debug(error);
            logger.error(error);
            res.sendStatus(500);
        } else {
            res.sendStatus(200);
        }
    });
});

module.exports = router;