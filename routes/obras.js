var express = require('express');
var router = express.Router();
var connection = require('../connection');
const app = require('../app');
var debug = require('debug')('backendmuseovirtual:obras');
var path = require('path');
var multer = require('multer');
var fs = require('fs');

var storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, path.join(__dirname, '../public/static_assets'))
  },
  filename: function (req, file, callback) {
    callback(null, file.fieldname + path.extname(file.originalname) )
  }
});

// var upload = multer({ storage: storage }).single('filejaja');
var upload = multer({ storage: storage });

/* GET Obras page. */
router.get('/', function(req, res, next) {
  res.render('obras', { title: 'Obras' });
});

// Obtener Información de una Obra
router.get('/api/json/:id_obra', function(req, res){
   
  let sql = `select * from obra where idObra=${req.params.id_obra}`;
  
  connection.query(sql, function (error, results) {
    
    if (error) {
      debug(error);
      res.sendStatus(500);
   }else if(results.length > 0){
      res.send(results[0]);
   }else{
      res.send([]);
   }
  });

});

router.put('/contador/:id_obra', function(req, res){
  // debug(req.body);
  // debug(req.params);

  let id_obra = req.params.id_obra;
  let sql = `update obra set contador = contador + 1 where idObra = ${id_obra}`;

  connection.query(sql, function(error, result, fields){
    if(error){
      debug(error);
      res.sendStatus(500);
    }else{
      // debug(result);
      // debug(fields);

      let sql_2 = `select contador from obra where idObra = ${id_obra}`;

      connection.query(sql_2, function(error2, results2, fields2){
        if(error2){
          // debug(error2);
          res.sendStatus(500);
        }else{
          // debug(results2[0]);
          res.send(results2[0]);
        }
      });
    }
  });    
});


router.get('/edit', function(req, res){

  res.render('./obras', {title: 'Editar enlaces'});

});



router.get('/all/api/json/:idSala', function(req, res){

  let sala = req.params.idSala;

  // debug('hola500');

  let sql = `select * from obra where idSala = ${sala}`;

  connection.query(sql, function(error, results, fields){
    if(error){
      debug(500);
      return res.sendStatus(500);
    }
    // debug(results);
    return res.send(results);
  });

});

router.put('/coordinates/:idObra', function(req, res){
  // debug("hola");
  // debug(req.params);
  // debug(req.body);

  let posX = req.body.x;
  let posY = req.body.y;
  let posZ = req.body.z;

  let sql = `update obra set posX = ${posX}, posY = ${posY}, posZ = ${posZ} where idObra = '${req.params.idObra}'`;
  console.log(sql);

  connection.query(sql, function(error, results, fields){
    if(error){
      debug(error);
      return res.sendStatus(500);
    }
    if(results.affectedRows == 0){
      res.send('No existe esa obra');
    }else{
      res.send('Se ha actualizado el botón de información de la obra');
    }
  });

  // res.send('Si Se hizoo jeje');

});

router.delete('/imagenes/:idObra', function(req, res){

  debug('Holaaa');

  let sql = `select imagenes from obra where idObra = ${req.params.idObra}`;

  connection.query(sql, function(error, results, fiedls){
    if(error){
      debug(error);
      return res.sendStatus(500);
    }
    if(results.length > 0){
      imagenes = results[0].imagenes.split(';');
      imagenes = imagenes.filter(item => item !== '');
      debug(imagenes);
      try {
        for(let i = 0; i<imagenes.length; i++){
          fs.unlinkSync(path.join(__dirname, `../public/static_assets/${imagenes[i]}`));
          debug('AQUI');
        }
        let sql_1 = `update obra set imagenes = '' where idObra = ${req.params.idObra}`;
        connection.query(sql_1, function(error1, results1, fields1){
          if(error1){
            debug(error1);
            return res.sendStatus(500);
          }
          if(results1.affectedRows == 0){
            return res.send('No se elimino ninguna imagen');
          }else{
            return res.send('Se ha eliminado sus fotos correctamente');
          }
        });
      } catch(err) {
        debug(error);
        return res.sendStatus(500);
      }
    }
  });

  // res.send('HEYYY DELETING IMAGES');

});

router.put('/imagenes/:idObra', upload.any(), function(req, res){
  
  // debug(req.params);
  // debug(req.body);
  // debug(req.files);

  let imagenes = '';
  if(req.files.length != 0){
    for(let i=0; i<req.files.length; i++){
      imagen = req.files[i];
      // if(i == req.files.length-1){
        // imagenes += `${imagen.fieldname}${path.extname(imagen.originalname)}`;
      // }else{
        imagenes += `${imagen.fieldname}${path.extname(imagen.originalname)};`;
      // }
      
    }
  }

  if(imagenes != ''){
    let sql = `update obra set imagenes = CONCAT(imagenes, '${imagenes}') where idObra='${req.params.idObra}'`;
    debug(sql);
    connection.query(sql, function(error, results, fields){
      if(error){
        debug(error);
        return res.sendStatus(500);
      }
      if(results.affectedRows == 0){
        res.send('No se añadio ninguna imagen');
      }else{
        res.send('Se ha actualizado las imagenes de las obras');
      }
    });
  }else{
    return res.sendStatus(500);
  }
  // res.send('HEY MEN, IMAGEEES');
});


router.put('/contenido/:idObra', function(req, res){

  let { asignatura, ciclo , autor , titulo , genero , facebook , instagram , proyectoWeb , dimensiones , fechaProduccion , tutor , descripcion , youtube } = req.body;

  debug(req.params);
  debug(req.body);
  debug(req.files);

  ciclo = Number(ciclo);
  if(isNaN(ciclo) || ciclo == 0){
    ciclo = null;
  }


  let sql = `update obra set  asignatura = '${asignatura}', ciclo = ${ciclo},  autor = '${autor}', titulo = '${titulo}', genero = '${genero}', facebook = '${facebook}', instagram = '${instagram}', proyectoWeb = '${proyectoWeb}', dimensiones = '${dimensiones}', fechaProduccion = '${fechaProduccion}', tutor = '${tutor}', descripcion = '${descripcion}', linkVideoYoutube = '${youtube}' where idObra = ${req.params.idObra}`;

  debug(sql);

  connection.query(sql, function(error, results, fields){
    if(error){
      debug(error);
      return res.sendStatus(500);
    }
    if(results.affectedRows == 0){
      res.send('No existe esa obra');
    }else{
      res.send('Se ha actualizado la información de la obra');
    }
  });

  // res.send('HEYYY MEEEN');


});

router.get('/file/:fileName', function(req, res){
  debug(req.body);
  debug(req.params);
  try{
    debug(process.env.PWD);
    debug(process.cwd());
    debug('Hola');
    debug(path.join(__dirname, '../public/static_assets'));
    debug('Hola');
  }catch(e){
    console.log(error);
  }
  

  res.sendFile(path.join(__dirname, '../public/static_assets', 'activeA.png'), function(error){
    if(error){
      debug(error);
    }
  });
});

router.post('/new', function(req, res){
  debug(req.body);
  debug(req.params);

  let museo = req.body.museo;
  let sala = req.body.sala;

  let sql = `INSERT INTO obra (idObra, idSala, asignatura, ciclo, autor, titulo, genero, facebook, instagram, proyectoWeb, dimensiones, fechaProduccion, tutor, descripcion, contador, imagenes, posX, posY, posZ, tecnica) VALUES (NULL, ${sala}, null, null, null, null, null, null, null, null, null, null, null, null, 0, '', 0, 0, 0, null)`;

  connection.query(sql, function(error, results, fields){
    if(error){
      debug(error);
      return res.sendStatus(500);
    }
    if(results.affectedRows == 0){
      res.send('No pudo añadir su obra');
    }else{
      res.send('Se ha añadido su obra correctamente');
    }
  });

  // res.send('MAKIN A NEW OBRA');
});

router.delete('/:idObra', function(req, res){

  debug(req.body);
  debug(req.params);

  


  let sql = `select imagenes from obra where idObra = ${req.params.idObra}`;

  connection.query(sql, function(error, results, fiedls){
    if(error){
      debug(error);
      return res.sendStatus(500);
    }
    if(results.length > 0){
      imagenes = results[0].imagenes.split(';');
      imagenes = imagenes.filter(item => item !== '');
      debug(imagenes);
      try {
        for(let i = 0; i<imagenes.length; i++){
          fs.unlinkSync(path.join(__dirname, `../public/static_assets/${imagenes[i]}`));
          debug('AQUI');
        }
        let sql_1 = `delete from obra where idObra = ${req.params.idObra}`;
        connection.query(sql_1, function(error1, results1, fields1){
          if(error1){
            debug(error1);
            return res.sendStatus(500);
          }
          if(results1.affectedRows == 0){
            return res.send('No se elimino ninguna imagen');
          }else{
            return res.send('Se ha eliminado sus fotos correctamente');
          }
        });
      } catch(err) {
        debug(error);
        return res.sendStatus(500);
      }
    }
  });

});


module.exports = router;