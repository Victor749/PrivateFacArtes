var express = require('express');
var router = express.Router();
var connection = require('../connection');
var debug = require('debug')('backendmuseovirtual:editor');
var middleware = require('../middleware');
var mysql = require('mysql');
var { google } = require('googleapis');
var OAuth2 = google.auth.OAuth2;
var axios = require('axios');
var logger = require('../logger').child({ from: 'editor' });

var oauth2Credentials = {
    client_id: "161525782471-43khneealveoa5vdqiv9b5pc3ofppod9.apps.googleusercontent.com",
    project_id: "editor-museo-virtual",
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_secret: "yyivieCe3CXUzlf-c0183Qbn",
    redirect_uris: [`${process.env.SITE_URL}/editor/login`],
    javascript_origins: [`${process.env.SITE_URL}`],
    scopes: [
        "https://www.googleapis.com/auth/userinfo.email",
        "https://www.googleapis.com/auth/userinfo.profile",
    ]
}

var oauth2Client = new OAuth2(oauth2Credentials.client_id, oauth2Credentials.client_secret, oauth2Credentials.redirect_uris[0]);

var loginLink = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: oauth2Credentials.scopes
});

/* GET Editor Login page. */
router.get('/', middleware.isLogueado, function (req, res, next) {
    let mail = '';
    let show_alert = false;
    if (req.query.mail) {
        mail = req.query.mail;
        show_alert = true;
    }
    res.render('editor', { title: 'Editor Museo Virtual - Facultad de Artes | Universidad de Cuenca', loginLink: loginLink, show_alert: show_alert, mail: mail });
});

/* GET Editor Inicio page. */
router.get('/inicio', middleware.pagina, function (req, res, next) {
    res.render('inicio', { title: 'Inicio' });
});

/* GET Login Editor */
router.get('/login', function (req, res, next) {
    if (req.query.error) {
        debug(error);
        logger.error(error);
        return res.redirect('/editor');
    } else {
        if (req.query.code) {
            oauth2Client.getToken(req.query.code, function (err, token) {
                if (err) {
                    debug(err);
                    logger.error(err);
                    return res.redirect('/editor');
                }
                axios({
                    url: 'https://www.googleapis.com/oauth2/v2/userinfo',
                    method: 'get',
                    headers: {
                        Authorization: `Bearer ${token.access_token}`,
                    },
                }).then(function (response) {
                    let userInformation = response.data;
                    let sql = `select idAdmin from usuarioadmin where correo = ${mysql.escape(userInformation.email)}`;
                    connection.query(sql, function (error, results) {
                        if (error) {
                            debug(error);
                            logger.error(error);
                            res.redirect('/editor');
                        } else {
                            if (results.length !== 0) {
                                req.session.idAdmin = results[0].idAdmin;
                                req.session.user = userInformation.email;
                                req.session.photo = userInformation.picture;
                                req.session.admin = true;
                                res.redirect('/editor/inicio');
                            } else {
                                res.redirect(`/editor?mail=${userInformation.email}`);
                            }
                        }
                    });
                })
                .catch(function (error) {
                    debug(error);
                    logger.error(error);
                    res.redirect('/editor');
                });
            });
        } else {
            return res.redirect('/editor');
        }
    }
});

/* GET Logout Editor */
router.get('/logout', middleware.pagina, function (req, res, next) {
    req.session.destroy();
    res.redirect('/editor');
});

module.exports = router;