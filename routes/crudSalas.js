var express = require('express');
var router = express.Router();
var middleware = require('../middleware');
var connection = require('../connection');
var debug = require('debug')('backendmuseovirtual:crudSalas');
var mysql = require('mysql');
var fs = require('fs');
const multer = require('multer');


var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        
      cb(null, './public/static_assets/')
    },
    filename: function (req, file, cb) {
        //console.log(req);
      cb(null, file.fieldname )
    }
});

const upload = multer({ storage: storage });

/* GET crud de la sala. */
router.get('/', middleware.pagina, function (req, res, next) {
    res.render('crudSalas', { title: 'Seccion Salas.'});
});

/*Guardar la nueva sala inicial */
router.get('/saveSalaInicial/:idMuseo/:idSala', /*middleware.estado,*/ function (req, res, next) {
    sql = `update museo set idSalaInicial = ${req.params.idSala} where idMuseo = ${req.params.idMuseo}`;
    connection.query(sql, function(error, result, fields){
        if(error){
          debug(error);
          res.sendStatus(500);
        }else{
          //resultado = '{"estado":"done"}';
          res.send(result);
        }
      });
});


router.post('/saveSala' , middleware.estado, upload.any(),  function (req, res) {
    var data = req.body;
    idSala = data.idSala;
    rotacion = parseFloat(data.rotacion);
    idMuseo = data.idMuseo;
    tema = data.tema;
    console.log(rotacion);
    sql = ``;
    if(idSala == -1){
        sql = `insert into sala(idSala, idMuseo, nombreImgFondo, rotacionInicial, temaCuratorial) values(null, ${idMuseo},null, ${rotacion}, ${mysql.escape(tema)})`;
    }else{
        //console.log(data);
        nuevoArchivo = data.nuevoArchivo;
       // console.log(nuevoArchivo);
        if(nuevoArchivo == undefined){
            nuevoArchivo = data.antiguoFile;
        }
        sql = `update sala set nombreImgFondo = ${mysql.escape(nuevoArchivo)}, rotacionInicial = ${rotacion} , temaCuratorial = ${mysql.escape(tema)} where idSala = ${idSala}`;

    }
    //console.log(sql);
    connection.query(sql, function(error, result, fields){
        if(error){
          //console.log(error);
          res.sendStatus(500);
        }else{
            //console.log('well', data);
            //console.log(result);
            if(idSala!=-1 && data.nuevoArchivo!=data.antiguoFile){
              console.log('here');
              try{
                  fs.unlinkSync('./public/static_assets/'+data.antiguoFile);
              }catch (e){
                  console.log(e);
              }
              
              //console.log('here');
          }
            res.send(result);
        }
    });
});

router.put('/saveImage' , middleware.estado, upload.any(), function (req, res) {
    var data = req.body;
    //console.log('saving image', data);
    idSala = data.idSala;
    nuevoArchivo = data.nuevoArchivo;
    sql = `update sala set nombreImgFondo = ${mysql.escape(nuevoArchivo)} where idSala=${idSala}`;
    //console.log(sql);
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


//eliminar sala
router.delete('/deleteSala', middleware.estado, function(req, res){
    // console.log(req.body.contenido);
    var data = req.body;
    console.log(data);
    console.log(data.nombreArchivo);
    
    
    let sql = `delete from sala where idSala = ${data.idSala}`;
   
    connection.query(sql, function(error, result, fields){
       if(error){
         debug(error);
         res.sendStatus(500);
       }else{
        if(data.nombreArchivo != null){
          try{
            fs.unlinkSync('./public/static_assets/'+data.nombreArchivo);
            console.log('over here');
          }catch(e){
            console.log(e);
          }
         
        }
         resultado = '{"estado":"done"}';
         res.send(resultado);
       }
     });
        
 });


module.exports = router;