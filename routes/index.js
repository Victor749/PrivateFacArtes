var express = require('express');
var router = express.Router();
var connection = require('../connection');

/* GET Login page. */
router.get('/', function (req, res, next) {
   res.render('index', { title: 'Login' });
});

router.get('/api/json', function (req, res) {
   res.send(`{
      "nav_icon": "nav_icon.png",
      "info_icon": "info_icon.png", 
      "firstPhotoId": "112379",
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
            "uri": "ambient.wav",
            "loop": true,
            "volume": 0.01
         }
      },
      "photos": {
         "112362":{
            "rotationOffset": -150,
            "uri": "360mipo_5 - Panorama.jpg",
            "tooltips": [
               {
                  "text": "Sala 1",
                  "rotationY": -40,
                  "rotationX": 0,
                  "linkedPhotoId": "112379"
               },
               {
                  "type": "panelimage",
                  "rotationY": -9.929,
                  "rotationX": 7,
                  "width": 204,
                  "height": 276,
                  "text": "Escultura 1. Esto es una prueba.",
                  "attribution": "Universidad de Cuenca.",
                  "source": "Escultura 1.jpg"
               }
            ]
         },
         "112379": {
            "rotationOffset": -120,
            "uri": "360mipo_6 - Panorama.jpg",
            "tooltips": [
               {
                  "text": "Sala 2",
                  "rotationY": -40,
                  "rotationX": 0,
                  "linkedPhotoId": "112362"
               },
               {
                  "text": "Sala 3",
                  "rotationY": 40,
                  "rotationX": 0,
                  "linkedPhotoId": "112355"
               },
               {
                  "type": "panelimage",
                  "rotationY": -107,
                  "rotationX": 0,
                  "width": 300,
                  "height": 300,
                  "source": "Escultura 2.jpg",
                  "text": "Escultura 2. Esto es una prueba.",
                  "attribution": "Universidad de Cuenca."
               },
               {
                  "type": "panelimage",
                  "source": "Escultura 5.jpg",
                  "text": "Escultura 5. Esto es una prueba.",
                  "attribution": "Universidad de Cuenca.",
                  "rotationY": 4,
                  "rotationX": 0,
                  "width": 300,
                  "height": 300
               },
               {
                  "type": "panelimage",
                  "title": "Escultura 3",
                  "source": "Escultura 3.jpg",
                  "text": "Escultura 3. Esto es una prueba.",
                  "attribution": "Universidad de Cuenca.",
                  "rotationY": -20,
                  "rotationX": 0,
                  "width": 300,
                  "height": 300
               }
            ]
         },
         "112355": {
            "rotationOffset": -30,
            "uri": "360mipo_7 - Panorama.jpg",
            "tooltips": [
               {
                  "text": "Sala 1",
                  "rotationY": 290,
                  "rotationX": 0,
                  "linkedPhotoId": "112379"
               },
               {
                  "type": "panelimage",
                  "rotationY": -45,
                  "rotationX": 0,
                  "width": 300,
                  "height": 300,
                  "source": "Escultura 4.jpg",
                  "text": "Escultura 4. Esto es una prueba.",
                  "attribution": "Universidad de Cuenca."
               }
            ]
         }
      }
   }   
 `);
});

module.exports = router;
