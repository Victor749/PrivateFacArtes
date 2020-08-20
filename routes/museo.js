var express = require('express');
var router = express.Router();
var connection = require('../connection');
var dbObj = require('../connection/sync');

/* GET Museo page. */
router.get('/', function (req, res, next) {
   res.render('museo', { title: 'Museo' });
});

// Obtener estructura del Museo en Formato JSON
router.get('/api/json', function (req, res) {
   async function start() {
      // Cadena con JSON
      let json = `{`;
      try {
         // Consulta de Museo
         let museoResults = await dbObj.executeQuery(`select idSalaInicial, nombreAudioFondo, nombreIconoInfo, nombreIconoNext from museo`);
         if (museoResults.length !== 0) {
            json += `"nav_icon": "${museoResults[0].nombreIconoNext}",
            "info_icon": "${museoResults[0].nombreIconoInfo}", 
            "firstPhotoId": "${museoResults[0].idSalaInicial}",
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
                  "volume": 0.01
               }
            },
            "photos": {`;
            // Consulta de Salas
            let salasResults = await dbObj.executeQuery(`select idSala, nombreImgFondo, rotacionInicial, temaCuratorial from sala`);
            for (let i = 0; i < salasResults.length; i++) {
               let idSalaActual = salasResults[i].idSala;
               json += `"${salasResults[i].idSala}":{
                       "idSala": ${salasResults[i].idSala},
                       "rotationOffset": ${salasResults[i].rotacionInicial},
                       "uri": "${salasResults[i].nombreImgFondo}",
                       "temaCuratorial": "${salasResults[i].temaCuratorial}",
                       "tooltips": [`;
               // Consulta de Enlaces
               let enlacesResults = await dbObj.executeQuery(`select enlace.idSalaDestino as idSalaDestino, enlace.posXIcono as posXIcono, 
               enlace.posYIcono as posYIcono, sala.temaCuratorial as temaCuratorial from enlace join sala on enlace.idSalaDestino = sala.idSala 
               where enlace.idSala = ${idSalaActual}`);
               for (let i = 0; i < enlacesResults.length; i++) {
                  json += `{
                     "text": "${enlacesResults[i].temaCuratorial}",
                     "rotationY": ${enlacesResults[i].posYIcono},
                     "rotationX": ${enlacesResults[i].posXIcono},
                     "linkedPhotoId": "${enlacesResults[i].idSalaDestino}"
                  }`;
                  if (i !== enlacesResults.length - 1) {
                     json += `,`
                  }
               }
               // Consulta de Obras
               let obrasResults = await dbObj.executeQuery(`select idObra, titulo, descripcion, posX, posY from obra where idSala = ${idSalaActual}`);
               if (obrasResults.length !== 0) {
                  json += `,`
               }
               for (let i = 0; i < obrasResults.length; i++) {
                  json += `{
                     "type": "textblock",
                     "idObra": ${obrasResults[i].idObra},
                     "rotationY": ${obrasResults[i].posY},
                     "rotationX": ${obrasResults[i].posX},
                     "title": "${obrasResults[i].titulo}",
                     "text": "${obrasResults[i].descripcion}"
                  }`;
                  if (i !== obrasResults.length - 1) {
                     json += `,`
                  }
               }
               json += `]
               }`;
               if (i !== salasResults.length - 1) {
                  json += `,`
               }
            }
            json += `}`
         }
         json += `}`
      } catch (error) {
         console.log(error);
      } finally {
         res.send(json);
      }
   }
   start();
});

module.exports = router;
