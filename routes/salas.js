var express = require('express');
var router = express.Router();
var connection = require('../connection');
var debug = require('debug')('backendmuseovirtual:salas');
var mysql = require('mysql');

/* GET Salas page. */
router.get('/', function (req, res, next) {
  res.render('salas', { title: 'Salas' });
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

module.exports = router;