var connection = require('../connection');
var debug = require('debug')('backendmuseovirtual:middleware');
var logger = require('../logger').child({ from: 'middleware' });

let middleware = {};

// Usar middleware.pagina para rutas en donde se utilice res.render o res.redirect (Rutas que renderizen una página HTML)
// Normalmente accesos por enlaces o recargas GET o POST
middleware.pagina = function (req, res, next) {
    if (req.session && req.session.user && req.session.admin && req.session.idAdmin) {
        let sql = `select idAdmin from usuarioadmin where idAdmin=${req.session.idAdmin}`;
        connection.query(sql, function (error, results) {
            if (error) {
                debug(error);
                logger.error(error);
                return res.sendStatus(500);
            } else {
                if (results.length !== 0) {
                    return next();
                } else {
                    req.session.destroy();
                    return res.redirect('/museovirtual/editor');
                }
            }
        });
    } else {
        return res.redirect('/museovirtual/editor');
    }
};

// Usar middleware.estado para rutas en donde se utilice res.send, res.sendStatus, res.end, etc. (Rutas que no renderizen una página HTML)
// Normalmente llamadas por AJAX
middleware.estado = function (req, res, next) {
    if (req.session && req.session.user && req.session.admin && req.session.idAdmin) {
        let sql = `select idAdmin from usuarioadmin where idAdmin=${req.session.idAdmin}`;
        connection.query(sql, function (error, results) {
            if (error) {
                debug(error);
                logger.error(error);
                return res.sendStatus(500);
            } else {
                if (results.length !== 0) {
                    return next();
                } else {
                    req.session.destroy();
                    return res.sendStatus(401);
                }
            }
        });
    } else {
        return res.sendStatus(401);
    }
};

// Para uso exclusivo de la pagina de login, para evitar doble inicio de sesion
// Cuando ya exista una sesion iniciada redirige al inicio del editor
middleware.isLogueado = function (req, res, next) {
    if (req.session && req.session.user && req.session.admin && req.session.idAdmin) {
        let sql = `select idAdmin from usuarioadmin where idAdmin=${req.session.idAdmin}`;
        connection.query(sql, function (error, results) {
            if (error) {
                debug(error);
                logger.error(error);
                return res.sendStatus(500);
            } else {
                if (results.length !== 0) {
                    return res.redirect('/museovirtual/editor/inicio');
                } else {
                    req.session.destroy();
                    return next();
                }
            }
        });
    } else {
        return next();
    }
};

module.exports = middleware;