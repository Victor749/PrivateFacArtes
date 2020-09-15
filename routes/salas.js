var express = require('express');
var router = express.Router();
var connection = require('../connection');
var debug = require('debug')('backendmuseovirtual:salas');
var mysql = require('mysql');
var logger = require('../logger').child({ from: 'salas' });

router.get('/api/getSalas/:idMuseo', function (req, res) {
  // Consulta de Salas
  let sql = `select * from sala where sala.idMuseo =  ${req.params.idMuseo}`;
  connection.query(sql, function (error, results) {
     if (error) {
        debug(error);
        logger.error(error);
        res.sendStatus(500);
     } else {
       //if(results.length!=0){
        return res.send(results);
       //}
     }
  });
});

// Obtener el tema curatorial, expositores y curadores de una sala
router.get('/api/curatorial/:idSala', function (req, res) {
  // Cadena con JSON
  let json = `{`;
  // Consulta de Salas
  let sql = `select sala.temaCuratorial as temaCuratorial, obra.autor as expositor, obra.tutor as curador
  from sala join obra on sala.idSala = obra.idSala where sala.idSala = ${mysql.escape(req.params.idSala)}`;
  connection.query(sql, function (error, results) {
    if (error) {
      debug(error);
      logger.error(error);
      res.sendStatus(500);
    } else {
      if (results.length !== 0) {
        json += `"temaCuratorial": "${results[0].temaCuratorial}",`;
        let curadores = `"curadores": [`;
        let expositores = `"expositores": [`;
        for (let i = 0; i < results.length; i++) {
          curadores += `"${results[i].curador}"`;
          expositores += `"${results[i].expositor}"`;
          if (i !== results.length - 1) {
            curadores += `,`;
            expositores += `,`;
          }
        }
        curadores += `],`;
        expositores += `]`;
        json += curadores + expositores;
        json += `}`;
        res.send(json);
      } else {
        let sql = `select sala.temaCuratorial as temaCuratorial from sala where sala.idSala = ${mysql.escape(req.params.idSala)}`;
        connection.query(sql, function (error, results) {
          if (error) {
            debug(error);
            logger.error(error);
            res.sendStatus(500);
          } else {
            if (results.length !== 0) {
              json += `"temaCuratorial": "${results[0].temaCuratorial}",`;
              let curadores = `"curadores": [],`;
              let expositores = `"expositores": []`;
              json += curadores + expositores;
            }
            json += `}`;
            res.send(json);
          }
        });
      }
    }
  });
});


router.get('/all/api/json/:idMuseo', function(req, res){

  let idMuseo = req.params.idMuseo;
  let sql = `select * from sala where idMuseo = ${idMuseo}`;

  connection.query(sql, function(error, results, fields){
    if(error){
      debug(error);
      return res.sendStatus(500);
    }
    return res.send(results);
  });

});

module.exports = router;