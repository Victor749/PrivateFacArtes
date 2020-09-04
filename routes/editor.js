var express = require('express');
var router = express.Router();
var connection = require('../connection');
var debug = require('debug')('backendmuseovirtual:editor');
var middleware = require('../middleware');
var mysql = require('mysql');
var nodemailer = require('nodemailer');

// Nodemailer Config
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_ADDRESS,
        pass: process.env.GMAIL_PASSWORD
    }
});

function sendMail(mail) {
    let mailOptions = {
        from: process.env.GMAIL_ADDRESS,
        to: `${mail}`,
        subject: 'Recuperación de Contraseña - Editor MVUC',
        text: ''
    };
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            debug(error);
        } else {
            debug('Email sent: ' + info.response);
        }
    });
}

/* GET Editor Login page. */
router.get('/', middleware.isLogueado, function (req, res, next) {
    res.render('editor', { title: 'Editor - Museo Virtual Facultad de Artes (Universidad de Cuenca)', info: null, user_field: null });
});

/* GET Editor Inicio page. */
router.get('/inicio', middleware.pagina, function (req, res, next) {
    let sql = `select correo from usuarioadmin where username=${mysql.escape(res.locals.username)}`;
    connection.query(sql, function (error, results) {
        if (error) {
            debug(error);
            res.sendStatus(500);
        } else {
            if (results.length !== 0) {
                res.render('inicio', { title: 'Inicio', correo: results[0].correo });
            } else {
                res.sendStatus(500);
            }
        }
    });
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

/* POST Cambiar Correo */
router.post('/cambiar_correo', middleware.pagina, function (req, res, next) {
    let sql = `update usuarioadmin set correo=${mysql.escape(req.body.correo)} where username=${mysql.escape(res.locals.username)}`;
    connection.query(sql, function (error, results) {
        if (error) {
            debug(error);
            res.sendStatus(500);
        } else {
            res.redirect('/editor/inicio');
        }
    });
});

/* POST Cambiar Contrasena */
router.post('/cambiar_contrasena', middleware.pagina, function (req, res, next) {
    let sql = `update usuarioadmin set contrasena=AES_ENCRYPT(${mysql.escape(req.body.password)}, '${process.env.MYSQL_AES_SECRET}') where username=${mysql.escape(res.locals.username)}`;
    connection.query(sql, function (error, results) {
        if (error) {
            debug(error);
            res.sendStatus(500);
        } else {
            res.redirect('/editor/inicio');
        }
    });
});

module.exports = router;