var express = require('express');
var router = express.Router();
var connection = require('../connection');
var debug = require('debug')('backendmuseovirtual:comentarios');


router.post('/new', function(req, res){

    debug(req.params);
    debug(req.body);

    res.send('SI SE HIZOOOOO');

});

router.get('/getComentario/:idObra/:actual/:limit/:identifier', function(req, res){
   console.log('in');
    // System.Threading.Thread.Sleep(4000);
    actual = parseInt(req.params.actual);
    limit = parseInt(req.params.limit);
    identifier = req.params.identifier;
    console.log(identifier);
    let sql = `select  idComentario, comentario.idUsuario, usuario.nombreUsuario, usuario.identificador, usuario.email, contenido, usuario.linkFoto, comentario.fecha from obra,comentario,usuario where obra.idObra=${req.params.idObra} and comentario.idObra=${req.params.idObra} and comentario.idUsuario = usuario.idUsuario`;
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
        //console.log(results[i].identificador);
        if(!(identifier != undefined && (identifier == results[i].identificador))){
          results[i].idUsuario = 'hide';
          console.log('hidden stuff');
        }
        resultadoC.push(results[i]);
      }
      res.send(resultadoC);
    }
  });
});

router.put('/editComentario', function(req, res){
 // console.log(req.body.contenido);
  data = req.body;
  let sql = `update comentario set fecha = '${data.fecha}', contenido = '${data.contenido}' where idComentario = ${data.idComentario}`;

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

router.delete('/deleteComentario/:idComentario', function(req, res){
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

