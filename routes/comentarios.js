var express = require('express');
var router = express.Router();
var connection = require('../connection');
var debug = require('debug')('backendmuseovirtual:comentarios');
var logger = require('../logger').child({ from: 'comentarios' });
var mysql = require('mysql');

router.post('/new', function(req, res){

    // debug(req.params);
    // debug(req.body);

    let today = new Date();
    let date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();

    let { identifier, idObra, contenido } = req.body;

    let sql_0 = `select * from usuario where identificador = '${identifier}'`;

    connection.query(sql_0, function(error0, results0, fields0){
        if(error0){
            debug(error0);
            logger.error(error0);
            res.sendStatus(500);
        }else if(results0.length == 0){
            // debug(results0);
            res.sendStatus(404);
        }
        // debug(results0);
        const { idUsuario } = results0[0];
        let sql = `insert into 
        comentario(idComentario, idUsuario, idObra, contenido, fecha) 
        values(null, '${idUsuario}', ${idObra}, ${mysql.escape(contenido)}, '${date}')`;

        connection.query(sql, function(error, results, fields){
            if(error){
                debug(error);
                logger.error(error);
                res.sendStatus(500);
                //return res.send(500);
            }
            // debug(results);
            //console.log(results);
            res.send(results);
        });
    });

});

router.get('/getComentario/:idObra/:actual/:limit/:identifier', function(req, res){
   //console.log('in');
    // System.Threading.Thread.Sleep(4000);
    actual = parseInt(req.params.actual);
    limit = parseInt(req.params.limit);
    identifier = req.params.identifier;
    //console.log(identifier);
    let sql = `select  idComentario, comentario.idUsuario, usuario.nombreUsuario, usuario.identificador, usuario.email, contenido, usuario.linkFoto, comentario.fecha from obra,comentario,usuario where obra.idObra=${req.params.idObra} and comentario.idObra=${req.params.idObra} and comentario.idUsuario = usuario.idUsuario order by comentario.idComentario desc limit ${actual}, ${limit}`;
    connection.query(sql, function (error, results) {
      
    if (error) {
      debug(error);
      logger.error(error);
      res.sendStatus(500);
    }else{
     /* finIndex = actual+limit;
      console.log(finIndex)
      if(finIndex >= results.length){
        finIndex = results.length;
      }*/
      resultadoC = [];
      for (var i=0; i<results.length;i++){
        //console.log(results[i].identificador);
        if(!(identifier != undefined && (identifier == results[i].identificador))){
          results[i].idUsuario = 'hide';
         // console.log('hidden stuff');
        }
        resultadoC.push(results[i]);
      }
     // console.log(resultadoC);
      res.send(resultadoC);
    }
  });
});

router.put('/editComentario', function(req, res){
 // console.log(req.body.contenido);
  data = req.body;
  let sql = `update comentario set fecha = '${data.fecha}', contenido = ${mysql.escape(data.contenido)} where idComentario = ${data.idComentario}`;

  connection.query(sql, function(error, result, fields){
    if(error){
      debug(error);
      logger.error(error);
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
       logger.error(error);
       res.sendStatus(500);
     }else{
       resultado = '{"estado":"done"}';
       res.send(resultado);
     }
   });
      
 });

 router.get('/getNewComentario/:idComentario', function(req, res){
  // console.log(req.body.contenido);
   data = req.body;
   let sql = `select idComentario, comentario.idUsuario, usuario.nombreUsuario, usuario.identificador, usuario.email, contenido, usuario.linkFoto, comentario.fecha from comentario,usuario where comentario.idComentario=${req.params.idComentario} and comentario.idUsuario = usuario.idUsuario `;
 
   connection.query(sql, function(error, result, fields){
     if(error){
       debug(error);
       logger.error(error);
       res.sendStatus(500);
     }else{
       console.log(result);
       if(result.length > 0 ){
        res.send(result[0]);
       }else{
        res.sendStatus(500);
       }
       
     }
   });
      
 });




module.exports = router;

