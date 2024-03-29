var express = require('express');
var router = express.Router();
var connection = require('../connection');
var debug = require('debug')('backendmuseovirtual:enlaces');
var middleware = require('../middleware');
var logger = require('../logger').child({ from: 'enlaces' });

// Obtener todos los enlaces dada una sala
router.get('/all/api/json/:id_sala', function(req, res){
   
    let sql = `select * from enlace where idSala=${req.params.id_sala}`;
    
    connection.query(sql, function (error, results) {
        if (error) {
            debug(error);
            logger.error(error);
            return res.sendStatus(500);
        }
        return res.send(results);
    });
  
});

// router.get('/api/json/:idEnlace', function(req, res){

//   let sql = `select * from obra where idObra=${req.params.id_obra}`;
  
//   connection.query(sql, function (error, results) {
    
//     if (error) {
//       debug(error);
//       res.sendStatus(500);
//    }else if(results.length > 0){
//       res.send(results[0]);
//    }else{
//       res.send([]);
//    }
//   });

// });

router.put('/contenido/:idEnlace', middleware.estado ,function(req, res){
  // debug(req.params);
  // debug(req.body);

  let sql = `update enlace set idSalaDestino = ${req.body.sala} where idEnlace = ${req.params.idEnlace}`;
  connection.query(sql, function(error, results, fields){
    if(error){
      debug(error);
      logger.error(error);
      return res.sendStatus(500);
    }
    if(results.affectedRows == 0){
      return res.send('No este enlace');
    }else{
      return res.send('Se ha actualizado enlace correctamente');
    }
  });

  // res.send('HEYY UPDATING LINK REFERENCE');
});

router.put('/coordinates/:idEnlace', middleware.estado, function(req, res){
    // debug("hola");
    // debug(req.params);
    // debug(req.body);
  
    let posX = req.body.x;
    let posY = req.body.y;
    let posZ = req.body.z;
  
    let sql = `update enlace set posXIcono = ${posX}, posYIcono = ${posY}, posZIcono = ${posZ} where idEnlace = '${req.params.idEnlace}'`;
   // console.log(sql);
  
    connection.query(sql, function(error, results, fields){
      if(error){
        debug(error);
        logger.error(error);
        return res.sendStatus(500);
      }
      if(results.affectedRows == 0){
        return res.send('No existe este enlace');
      }else{
        return res.send('Se ha actualizado el enlace');
      }
    });
  
    // res.send('Si Se hizoo jeje');
  
  });

router.post('/new', middleware.estado ,function(req, res){
  // debug(req.body);
  // debug(req.params);

  let sala = req.body.sala;

  let sql = `INSERT INTO enlace (idEnlace, idSala, idSalaDestino, posXIcono, posYIcono, posZIcono) VALUES (NULL, ${sala}, ${sala}, 0, 0, 0)`;

  connection.query(sql, function(error, results, fields){
    if(error){
      debug(error);
      logger.error(error);
      return res.sendStatus(500);
    }
    if(results.affectedRows == 0){
      return res.send('No pudo añadir el enlace');
    }else{
      return res.send('Se ha añadido el enlace correctamente');
    }
  });
  // res.send('MAKIN A NEW OBRA');
});

router.delete('/:idEnlace', middleware.estado ,function(req, res){
  // debug(req.body);
  // debug(req.params);

  let sql = `delete from enlace where idEnlace=${req.params.idEnlace}`;
  connection.query(sql, function(error, results, fields){
    if(error){
      debug(error);
      logger.error(error);
      return res.sendStatus(500);
    }
    // debug(results);
    if(results.affectedRows == 0){
      return res.send('No pudo eliminar este enlace');
    }else{
      return res.send('Se ha eliminado su enlace correctamente');
    }
  });

});

module.exports = router;

