var createError = require('http-errors');
var express = require('express');
var path = require('path');
var logger = require('morgan');
var cors = require('cors');
var methodOverride = require("method-override");
var session = require('express-session');

var indexRouter = require('./routes/index');
var editorRouter = require('./routes/editor');
var museoRouter = require('./routes/museo');
var salasRouter = require('./routes/salas');
var obrasRouter = require('./routes/obras');
var comentariosRouter = require('./routes/comentarios');
var usuariosRouter = require('./routes/usuarios');
var visor3DRouter = require('./routes/visor3D');
var crudMuseo = require('./routes/crudMuseo');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(session({
  secret: '2C44-4D44-WppQ38S',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 } // Una hora
}));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors({ origin: process.env.ORIGIN_SITE }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride("_method"));

app.use('/', indexRouter);
app.use('/editor', editorRouter);
app.use('/museo', museoRouter);
app.use('/salas', salasRouter);
app.use('/obras', obrasRouter);
app.use('/comentarios', comentariosRouter);
app.use('/usuarios', usuariosRouter);
app.use('/visor3D', visor3DRouter);
app.use('/crudMuseo', crudMuseo);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


module.exports = app;
