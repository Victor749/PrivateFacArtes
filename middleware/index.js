let middleware = {};

// Usar middleware.pagina para rutas en donde se utilice res.render o res.redirect (Rutas que renderizen una página HTML)
// Normalmente accesos por enlaces o recargas GET o POST
middleware.pagina = function (req, res, next) {
    if (req.session && req.session.user && req.session.admin)
        return next();
    else
        return res.redirect('/editor');
};

// Usar middleware.estado para rutas en donde se utilice res.send, res.sendStatus, res.end, etc. (Rutas que no renderizen una página HTML)
// Normalmente llamadas por AJAX
middleware.estado = function (req, res, next) {
    if (req.session && req.session.user && req.session.admin)
        return next();
    else
        return res.sendStatus(401);
};

// Para uso exclusivo de la pagina de login, para evitar doble inicio de sesion
// Cuando ya exista una sesion iniciada redirige al inicio del editor
middleware.isLogueado = function (req, res, next) {
    if (req.session && req.session.user && req.session.admin)
        return res.redirect('/editor/inicio');
    else
        return next();
};

module.exports = middleware;