var express = require('express');
var router = express.Router();
var connection = require('../connection');
var debug = require('debug')('backendmuseovirtual:editor');
var middleware = require('../middleware');
var mysql = require('mysql');

/* GET Editor Login page. */
router.get('/', middleware.isLogueado, function (req, res, next) {
    res.render('editor', { title: 'Editor', info: null, user_field: null });
});

/* GET Editor Inicio page. */
router.get('/inicio', middleware.pagina, function (req, res, next) {
    res.render('inicio', { title: 'Inicio' });
});

/* POST Login Editor */
router.post('/login', function (req, res, next) {
    let sql = `select username, contrasena from usuarioadmin where username=${mysql.escape(req.body.user)} and AES_DECRYPT(contrasena, '${process.env.MYSQL_AES_SECRET}')=${mysql.escape(req.body.pass)}`;
    connection.query(sql, function (error, results) {
        if (error) {
            debug(error);
            res.sendStatus(500);
        } else {
            if (results.length !== 0) {
                req.session.user = results[0].username;
                req.session.admin = true;
                res.redirect('/editor/inicio');
            } else {
                res.render('editor', { title: 'Editor', info: 'Usuario y/o contraseña incorrecto(s).', user_field: req.body.user });
            }
        }
    });
});

/* GET Logout Editor */
router.get('/logout', middleware.pagina, function (req, res, next) {
    req.session.destroy();
    res.redirect('/editor');
});

module.exports = router;