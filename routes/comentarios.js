var express = require('express');
var router = express.Router();
var connection = require('../connection');
var debug = require('debug')('backendmuseovirtual:comentarios');

router.get('/', function(req, res, next) {
    res.render('comentarios', { title: 'Comentarios' });
  });


router.post('/new', function(req, res){

    debug(req.params);
    debug(req.body);

    res.send('SI SE HIZOOOOO');

});

router.get('/getComentario/:idObra/:actual/:limit', function(req, res){
   console.log('in');
    // System.Threading.Thread.Sleep(4000);
    actual = parseInt(req.params.actual);
    limit = parseInt(req.params.limit);
    let sql = `select  idComentario, comentario.idUsuario, usuario.nombreUsuario, usuario.email, contenido, usuario.linkFoto, comentario.fecha from obra,comentario,usuario where obra.idObra=${req.params.idObra} and comentario.idObra=${req.params.idObra} and comentario.idUsuario = usuario.idUsuario`;
    connection.query(sql, function (error, results) {
      
    if (error) {
      debug(error);
      res.sendStatus(500);
    }else{
      finIndex = actual+limit;
      console.log(finIndex)
      if(finIndex >= results.length){
        finIndex = results.length;
      }
      resultadoC = [];
      for (var i=actual; i<finIndex;i++){
        resultadoC.push(results[i]);
      }
      res.send(resultadoC);
    }
  });
});

router.get('/api/getData', function(req, res){
    
   res.send('hola');
});


module.exports = router;

