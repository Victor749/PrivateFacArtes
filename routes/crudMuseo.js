var express = require('express');
var router = express.Router();
var middleware = require('../middleware');
var connection = require('../connection');
var debug = require('debug')('backendmuseovirtual:crudMuseo');
var mysql = require('mysql');
var fs = require('fs');
const multer = require('multer');


var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        
      cb(null, './public/static_assets/')
    },
    filename: function (req, file, cb) {
        console.log(req);
      cb(null, file.fieldname )
    }
});

const upload = multer({ storage: storage });
  

/* GET crud del museo. */
router.get('/', /*middleware.pagina,*/ function (req, res, next) {
    res.render('crudMuseo', { title: 'Seccion museo.'});
});

function funciones(data, res){
    if(data.idMuseo == -1){
        //nuevo museo
        var sql = `insert into museo(idMuseo, nombreMuseo, idSalaInicial, nombreAudioFondo, activo) values
        (null, '${data.nombreMuseo}', null, '${data.nombreArchivo}', ${data.activo})`;
        connection.query(sql, function(error, results, fields){
            if(error){
                debug(error);
                res.sendStatus(500);
            }
            console.log(results);
            res.send(results);
        });
    }else{
        if(data.audioActual != data.nombreArchivo){
            if(data.estadoArchivo == 'nuevo'){
                fs.unlinkSync('./public/static_assets/'+data.audioActual);
            }else{
                fs.rename('./public/static_assets/'+data.audioActual, './public/static_assets/'+data.nombreArchivo, () => { 
                    console.log("\nFile Renamed!\n"); });
            }
            
        }
        var sql = `update museo set nombreMuseo = '${data.nombreMuseo}', nombreAudioFondo = '${data.nombreArchivo}', activo = ${data.activo} where idMuseo = ${data.idMuseo}`;
        connection.query(sql, function(error, results, fields){
            if(error){
                debug(error);
                res.sendStatus(500);
            }
            console.log(results);
            res.send(results);
        });
    }
}

router.post('/setMuseoInfo' , upload.any(), /*middleware.estado,*/ function (req, res) {
    var data = req.body;
    //var forReturn = res;
    //Creacion de transaccion -> no se guarda ningun cambio si primero no se desactiva el museo actual activado
    //Solo para cuando data.activo = 1
    if(data.activo == 0){
        funciones(data, res);
    }else{
        connection.getConnection(function(err, connection) {
            connection.beginTransaction(function(err) {
                if (err) {                  //Transaction Error (Rollback and release connection)
                    connection.rollback(function() {
                        connection.release();
                        //Failure
                    });
                } else {
                    connection.query('update museo set activo = 0 where museo.activo = 1', function(err, results) {
                        if (err) {          //Query Error (Rollback and release connection)
                            connection.rollback(function() {
                                connection.release();
                                //Failure
                            });
                        } else {
                            connection.commit(function(err) {
                                if (err) {
                                    connection.rollback(function() {
                                        connection.release();
                                        //Failure
                                    });
                                } else {
                                    connection.release();
                                    funciones(data, res);
                                }
                            });
                        }
                    });
                }    
            });
        });
    }
});



module.exports = router;