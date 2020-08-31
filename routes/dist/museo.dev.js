"use strict";

var express = require('express');

var router = express.Router();

var connection = require('../connection');

var dbObj = require('../connection/sync');

var debug = require('debug')('backendmuseovirtual:museo');
/* GET Museo page. */


router.get('/', function (req, res, next) {
  res.render('museo', {
    title: 'Museo'
  });
}); // Obtener estructura del Museo Activo en Formato JSON

router.get('/api/json', function (req, res) {
  function start() {
    var json, museoResults, idMuseo, salasResults, i, idSalaActual, enlacesResults, _i, obrasResults, _i2;

    return regeneratorRuntime.async(function start$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            // Cadena con JSON
            json = "{";
            _context.prev = 1;
            _context.next = 4;
            return regeneratorRuntime.awrap(dbObj.executeQuery("select idMuseo, idSalaInicial, nombreAudioFondo, nombreIconoInfo, nombreIconoNext from museo where activo = true"));

          case 4:
            museoResults = _context.sent;

            if (!(museoResults.length !== 0)) {
              _context.next = 30;
              break;
            }

            idMuseo = museoResults[0].idMuseo;
            json += "\"nav_icon\": \"".concat(museoResults[0].nombreIconoNext, "\",\n            \"info_icon\": \"").concat(museoResults[0].nombreIconoInfo, "\", \n            \"firstPhotoId\": \"ucmv-").concat(museoResults[0].idSalaInicial, "\",\n            \"firstPhotoRotation\": 0,\n            \"soundEffects\": {\n               \"navButton\": {\n                  \"onEnter\": {\n                     \"uri\": \"switch-flip.wav\"\n                  },\n                  \"onClick\": {\n                     \"uri\": \"menu-click.wav\"\n                  }\n               },\n               \"infoButton\": {\n                  \"onEnter\": {\n                     \"uri\": \"switch-flip.wav\"\n                  }\n               },\n               \"ambient\": {\n                  \"uri\": \"").concat(museoResults[0].nombreAudioFondo, "\",\n                  \"loop\": true,\n                  \"volume\": 0.05\n               }\n            },\n            \"photos\": {"); // Consulta de Salas

            _context.next = 10;
            return regeneratorRuntime.awrap(dbObj.executeQuery("select idSala, nombreImgFondo, rotacionInicial, temaCuratorial from sala where idMuseo = ".concat(idMuseo)));

          case 10:
            salasResults = _context.sent;
            i = 0;

          case 12:
            if (!(i < salasResults.length)) {
              _context.next = 29;
              break;
            }

            idSalaActual = salasResults[i].idSala;
            json += "\"ucmv-".concat(salasResults[i].idSala, "\":{\n                       \"idSala\": ").concat(salasResults[i].idSala, ",\n                       \"rotationOffset\": ").concat(salasResults[i].rotacionInicial, ",\n                       \"uri\": \"").concat(salasResults[i].nombreImgFondo, "\",\n                       \"temaCuratorial\": \"").concat(salasResults[i].temaCuratorial, "\",\n                       \"tooltips\": ["); // Consulta de Enlaces por Sala

            _context.next = 17;
            return regeneratorRuntime.awrap(dbObj.executeQuery("select enlace.idSalaDestino as idSalaDestino, enlace.posXIcono as posXIcono, \n               enlace.posYIcono as posYIcono, sala.temaCuratorial as temaCuratorial from enlace join sala on enlace.idSalaDestino = sala.idSala \n               where enlace.idSala = ".concat(idSalaActual)));

          case 17:
            enlacesResults = _context.sent;

            for (_i = 0; _i < enlacesResults.length; _i++) {
              json += "{\n                     \"text\": \"".concat(enlacesResults[_i].temaCuratorial, "\",\n                     \"rotationY\": ").concat(enlacesResults[_i].posYIcono, ",\n                     \"rotationX\": ").concat(enlacesResults[_i].posXIcono, ",\n                     \"linkedPhotoId\": \"ucmv-").concat(enlacesResults[_i].idSalaDestino, "\"\n                  }");

              if (_i !== enlacesResults.length - 1) {
                json += ",";
              }
            } // Consulta de Obras por Sala


            _context.next = 21;
            return regeneratorRuntime.awrap(dbObj.executeQuery("select idObra, posX, posY from obra where idSala = ".concat(idSalaActual)));

          case 21:
            obrasResults = _context.sent;

            if (enlacesResults.length !== 0 && obrasResults.length !== 0) {
              json += ",";
            }

            for (_i2 = 0; _i2 < obrasResults.length; _i2++) {
              json += "{\n                     \"type\": \"textblock\",\n                     \"idObra\": ".concat(obrasResults[_i2].idObra, ",\n                     \"rotationY\": ").concat(obrasResults[_i2].posY, ",\n                     \"rotationX\": ").concat(obrasResults[_i2].posX, "\n                  }");

              if (_i2 !== obrasResults.length - 1) {
                json += ",";
              }
            }

            json += "]\n               }";

            if (i !== salasResults.length - 1) {
              json += ",";
            }

          case 26:
            i++;
            _context.next = 12;
            break;

          case 29:
            json += "}";

          case 30:
            json += "}";
            res.send(json);
            _context.next = 38;
            break;

          case 34:
            _context.prev = 34;
            _context.t0 = _context["catch"](1);
            debug(_context.t0);
            res.sendStatus(500);

          case 38:
          case "end":
            return _context.stop();
        }
      }
    }, null, null, [[1, 34]]);
  }

  start();
}); // Obtener la lista de Salas del Museo Activo

router.get('/api/salas', function (req, res) {
  // Consulta de Salas
  var sql = "select sala.idSala, sala.temaCuratorial from sala join museo on sala.idMuseo = museo.idMuseo where museo.activo = true";
  connection.query(sql, function (error, results) {
    if (error) {
      debug(error);
      res.sendStatus(500);
    } else {
      res.send(results);
    }
  });
}); // Obtener información para el catálogo del Museo Activo

router.get('/api/catalogo', function (req, res) {
  // Cadena con JSON
  var json = "["; // Consulta de Salas y Obras

  var sql = "select sala.idSala as idSala, sala.temaCuratorial as temaCuratorial, obra.titulo as titulo, obra.autor as autor, obra.asignatura as asignatura,\n   obra.ciclo as ciclo, obra.facebook as facebook, obra.instagram as instagram, obra.proyectoWeb as proyectoWeb, obra.dimensiones as dimensiones,\n   obra.fechaProduccion as fechaProduccion, obra.tutor as tutor, obra.descripcion as descripcion, obra.nombreElemento as nombreElemento,\n   obra.tipo as tipo, obra.tecnica as tecnica from obra join sala on obra.idSala = sala.idSala join museo on sala.idMuseo = museo.idMuseo where museo.activo = true";
  var idSalaActual = -1;
  connection.query(sql, function (error, results) {
    if (error) {
      debug(error);
      res.sendStatus(500);
    } else {
      if (results.length !== 0) {
        for (var i = 0; i < results.length; i++) {
          if (idSalaActual !== results[i].idSala) {
            if (i !== 0) {
              json += "]\n                     },";
            }

            json += "{\"temaCuratorial\": \"".concat(results[i].temaCuratorial, "\",\n                  \"obras\": [");
            idSalaActual = results[i].idSala;
          } else {
            json += ",";
          }

          json += "{\n                  \"titulo\": \"".concat(results[i].titulo, "\",\n                  \"autor\": \"").concat(results[i].autor, "\",\n                  \"asignatura\": \"").concat(results[i].asignatura, "\",\n                  \"ciclo\": ").concat(results[i].ciclo, ",\n                  \"facebook\": \"").concat(results[i].facebook, "\",\n                  \"instagram\": \"").concat(results[i].instagram, "\",\n                  \"proyectoWeb\": \"").concat(results[i].proyectoWeb, "\",\n                  \"dimensiones\": \"").concat(results[i].dimensiones, "\",\n                  \"fechaProduccion\": \"").concat(results[i].fechaProduccion, "\",\n                  \"tutor\": \"").concat(results[i].tutor, "\",\n                  \"descripcion\": \"").concat(results[i].descripcion, "\",\n                  \"nombreElemento\": \"").concat(results[i].nombreElemento, "\",\n                  \"tecnica\": \"").concat(results[i].tecnica, "\",\n                  \"tipo\": \"").concat(results[i].tipo, "\"\n               }");
        }

        json += "]\n            }";
      }

      json += "]";
      res.send(json);
    }
  });
});
module.exports = router;