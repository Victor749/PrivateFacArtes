
var express = require('express');
var router = express.Router();
var middleware = require('../middleware');
var connection = require('../connection');
var debug = require('debug')('backendmuseovirtual:editorComentarios');
var mysql = require('mysql');

/* GET editor. */
router.get('/', middleware.pagina, function (req, res, next) {
    res.render('editorComentarios', { title: 'Editor de Comentarios.'});
});

/*Get comentarios sin data extra de la ruta de comentarios*/
router.get('/getComentarios/:idObra/:actual/:limit', middleware.estado, function (req, res, next) {
    actual = parseInt(req.params.actual);
    limit = parseInt(req.params.limit);
    idObra = req.params.idObra;
    let sql = `select  idComentario, comentario.idUsuario, usuario.nombreUsuario, usuario.identificador, usuario.email, contenido, usuario.linkFoto, comentario.fecha from obra,comentario,usuario where obra.idObra=${idObra} and comentario.idObra=${idObra} and comentario.idUsuario = usuario.idUsuario order by comentario.idComentario desc limit ${actual}, ${limit}`;
    connection.query(sql, function (error, results) {
      
    if (error) {
      debug(error);
      res.sendStatus(500);
    }else{
      res.send(results);
    }
  });
});

/*Eliminar comentarios tomando en cuenta el inicio de sesion en el editor*/
router.delete('/deleteComentario/:idComentario', middleware.estado,function(req, res){
    // console.log(req.body.contenido);
     data = req.body;
     let sql = `delete from comentario where idComentario = ${req.params.idComentario}`;
   
     connection.query(sql, function(error, result, fields){
       if(error){
         debug(error);
         res.sendStatus(500);
       }else{
         resultado = '{"estado":"done"}';
         res.send(resultado);
       }
     });
        
   });

module.exports = router;