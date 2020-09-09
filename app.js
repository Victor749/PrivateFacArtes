var createError = require('http-errors');
var express = require('express');
var path = require('path');
var logger = require('morgan');
var cors = require('cors');
var methodOverride = require("method-override");
var session = require('express-session');
// Almacenamiento de sesion en memoria que previene leaks. Se considera 
// suficiente debido a que no se espera manejar muchas sesiones.
var MemoryStore = require('memorystore')(session);
var helmet = require('helmet');


var indexRouter = require('./routes/index');
var editorRouter = require('./routes/editor');
var museoRouter = require('./routes/museo');
var salasRouter = require('./routes/salas');
var obrasRouter = require('./routes/obras');
var comentariosRouter = require('./routes/comentarios');
var usuariosRouter = require('./routes/usuarios');
var visor3DRouter = require('./routes/visor3D');
var crudMuseo = require('./routes/crudMuseo');
var adminsRouter = require('./routes/admins');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

var sess = {
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 28800000 }, // 8 horas
  store: new MemoryStore({
    checkPeriod: 28800000 // prune expired entries every 8h
  })
}

if (app.get('env') === 'production') {
  // Poner la app NodeJS bajo un proxy reverso con NGINX por ejemplo cuando entre en produccion.
  // El proxy debe implementar HTTPS (TLS) para almacenar las cookies de sesion de manera segura.
  // Comentar esta porcion de codigo en caso de que no funcione de manera correcta.
  if (process.env.PROXY_SEGURO === 'yes') {
    app.set('trust proxy', 1) // trust first proxy
    sess.cookie.secure = true // serve secure cookies
  } else {
    app.set('trust proxy', false);
  }
  // En produccion se guardan los logs de error en el archivo logs/http-errors.log con rotado diario
  var rfs = require('rotating-file-stream');
  var errorLogStream = rfs.createStream('http-errors.log', {
    interval: '1d', // rotate daily
    path: path.join(__dirname, 'logs')
  });
  app.use(logger('combined', { stream: errorLogStream, skip: function (req, res) { return res.statusCode < 400 } })); // Solo escribe errores 
} else {
  app.set('trust proxy', false);
  app.use(logger('dev'));
}


app.use(cors({ origin: process.env.ORIGIN_SITE }));
app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride("_method"));

// Rutas Sin Sesion (Museo Virtual)
app.use('/', indexRouter);
app.use('/museo', museoRouter);
app.use('/salas', salasRouter);
app.use('/obras', obrasRouter);
app.use('/comentarios', comentariosRouter);
app.use('/usuarios', usuariosRouter);
app.use('/visor3D', visor3DRouter);
// Sesion Para Editor
app.use(session(sess));
app.use(function (req, res, next) {
  res.locals.username = req.session.user;
  res.locals.picture = req.session.photo;
  next();
});
// Rutas Con Sesion (Editor Middleware)
app.use('/editor', editorRouter);
app.use('/crudMuseo', crudMuseo);
app.use('/editor/usuarios', adminsRouter);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.status = err.status;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
