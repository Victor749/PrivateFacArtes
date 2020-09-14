var express = require('express');
var router = express.Router();
var connection = require('../connection');
var dbObj = require('../connection/sync');
var debug = require('debug')('backendmuseovirtual:museo');
var logger = require('../logger').child({ from: 'museo' });

// Obtener estructura del Museo Activo en Formato JSON
router.get('/api/json', function (req, res) {
   async function start() {
      // Cadena con JSON
      let json = `{`;
      try {
         // Consulta de Museo
         let museoResults = await dbObj.executeQuery(`select idMuseo, idSalaInicial, nombreAudioFondo from museo where activo = true`);
         if (museoResults.length !== 0) {
            let idMuseo = museoResults[0].idMuseo;
            json += `"nav_icon": "nav_icon.png",
            "info_icon": "info_icon.png", 
            "firstPhotoId": "ucmv-${museoResults[0].idSalaInicial}",
            "firstPhotoRotation": 0,
            "soundEffects": {
               "navButton": {
                  "onEnter": {
                     "uri": "switch-flip.wav"
                  },
                  "onClick": {
                     "uri": "menu-click.wav"
                  }
               },
               "infoButton": {
                  "onEnter": {
                     "uri": "switch-flip.wav"
                  }
               },
               "ambient": {
                  "uri": "${museoResults[0].nombreAudioFondo}",
                  "loop": true,
                  "volume": 0.05
               }
            },
            "photos": {`;
            // Consulta de Salas
            let salasResults = await dbObj.executeQuery(`select idSala, nombreImgFondo, rotacionInicial, temaCuratorial from sala where idMuseo = ${idMuseo}`);
            for (let i = 0; i < salasResults.length; i++) {
               let idSalaActual = salasResults[i].idSala;
               json += `"ucmv-${salasResults[i].idSala}":{
                       "idSala": ${salasResults[i].idSala},
                       "rotationOffset": ${salasResults[i].rotacionInicial},
                       "uri": "${salasResults[i].nombreImgFondo}",
                       "temaCuratorial": "${salasResults[i].temaCuratorial}",
                       "tooltips": [`;
               // Consulta de Enlaces por Sala
               let enlacesResults = await dbObj.executeQuery(`select enlace.idEnlace as idEnlace , enlace.idSalaDestino as idSalaDestino, enlace.posXIcono as posXIcono, 
               enlace.posYIcono as posYIcono, enlace.posZIcono as posZIcono, sala.temaCuratorial as temaCuratorial from enlace 
               join sala on enlace.idSalaDestino = sala.idSala where enlace.idSala = ${idSalaActual}`);
               for (let i = 0; i < enlacesResults.length; i++) {
                  json += `{
                     "rotationY": ${enlacesResults[i].posYIcono},
                     "rotationX": ${enlacesResults[i].posXIcono},
                     "rotationZ": ${enlacesResults[i].posZIcono},
                     "text": "${enlacesResults[i].temaCuratorial}",
                     "linkedPhotoId": "ucmv-${enlacesResults[i].idSalaDestino}",
                     "idEnlace": "${enlacesResults[i].idEnlace}"
                  }`;
                  if (i !== enlacesResults.length - 1) {
                     json += `,`;
                  }
               }
               // Consulta de Obras por Sala
               let obrasResults = await dbObj.executeQuery(`select idObra, posX, posY, posZ from obra where idSala = ${idSalaActual}`);
               if (enlacesResults.length !== 0 && obrasResults.length !== 0) {
                  json += `,`;
               }
               for (let i = 0; i < obrasResults.length; i++) {
                  json += `{
                     "type": "textblock",
                     "idObra": ${obrasResults[i].idObra},
                     "rotationY": ${obrasResults[i].posY},
                     "rotationX": ${obrasResults[i].posX},
                     "rotationZ": ${obrasResults[i].posZ}
                  }`;
                  if (i !== obrasResults.length - 1) {
                     json += `,`;
                  }
               }
               json += `]
               }`;
               if (i !== salasResults.length - 1) {
                  json += `,`;
               }
            }
            json += `}`;
         }
         json += `}`;
         res.send(json);
      } catch (error) {
         debug(error);
         logger.error(error);
         res.sendStatus(500);
      }
   }
   start();
});

// Obtener la lista de Salas del Museo Activo
router.get('/api/salas', function (req, res) {
   // Consulta de Salas
   let sql = `select sala.idSala, sala.temaCuratorial from sala join museo on sala.idMuseo = museo.idMuseo where museo.activo = true`;
   connection.query(sql, function (error, results) {
      if (error) {
         debug(error);
         logger.error(error);
         res.sendStatus(500);
      } else {
         res.send(results);
      }
   });
});


// Obtener información para el catálogo del Museo Activo
router.get('/api/catalogo', function (req, res) {
   // Cadena con JSON
   let json = "[";
   // Consulta de Salas y Obras
   let sql = `select sala.idSala as idSala, sala.temaCuratorial as temaCuratorial, obra.titulo as titulo, obra.autor as autor, obra.asignatura as asignatura,
   obra.ciclo as ciclo, obra.facebook as facebook, obra.instagram as instagram, obra.proyectoWeb as proyectoWeb, obra.dimensiones as dimensiones,
   obra.fechaProduccion as fechaProduccion, obra.tutor as tutor, obra.descripcion as descripcion, obra.imagenes as imagenes,
   obra.linkVideoYoutube as linkVideoYoutube, obra.tecnica as tecnica from obra join sala on obra.idSala = sala.idSala join museo on sala.idMuseo = museo.idMuseo where museo.activo = true`;
   let idSalaActual = -1;
   connection.query(sql, function (error, results) {
      if (error) {
         debug(error);
         logger.error(error);
         res.sendStatus(500);
      } else {
         if (results.length !== 0) {
            for (let i = 0; i < results.length; i++) {
               if (idSalaActual !== results[i].idSala) {
                  if (i !== 0) {
                     json += `]
                     },`;
                  }
                  json += `{"temaCuratorial": "${results[i].temaCuratorial}",
                  "obras": [`;
                  idSalaActual = results[i].idSala;
               } else {
                  json += `,`;
               }
               json += `{
                  "titulo": "${results[i].titulo}",
                  "autor": "${results[i].autor}",
                  "asignatura": "${results[i].asignatura}",
                  "ciclo": ${results[i].ciclo},
                  "facebook": "${results[i].facebook}",
                  "instagram": "${results[i].instagram}",
                  "proyectoWeb": "${results[i].proyectoWeb}",
                  "dimensiones": "${results[i].dimensiones}",
                  "fechaProduccion": "${results[i].fechaProduccion}",
                  "tutor": "${results[i].tutor}",
                  "descripcion": "${results[i].descripcion}",
                  "imagenes": "${results[i].imagenes}",
                  "tecnica": "${results[i].tecnica}",
                  "linkVideoYoutube": "${results[i].linkVideoYoutube}"
               }`;
            }
            json += `]
            }`;
         }
         json += `]`;
         res.send(json);
      }
   });
});

/* Get para conseguir todos los museos*/ 
router.get('/all/api/json', function (req, res) {

   let sql = `select * from museo`;

   connection.query(sql, function(error, results, fields){
      if(error){
         debug(error);
         return res.sendStatus(500);
      }
      res.send(results);
   });

});

module.exports = router;
