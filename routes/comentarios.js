var express = require('express');
var router = express.Router();
var connection = require('../connection');
var debug = require('debug')('backendmuseovirtual:comentarios');



router.post('/new', function(req, res){

    // debug(req.params);
    // debug(req.body);

    let today = new Date();
    let date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();

    let { identifier, idObra, contenido } = req.body;

    let sql_0 = `select * from usuario where identificador = '${identifier}'`;

    connection.query(sql_0, function(error0, results0, fields0){
        if(error0){
            debug(error0);
            return res.send(500);
        }else if(results0.length == 0){
            // debug(results0);
            return res.sendStatus(404);
        }
        // debug(results0);
        const { idUsuario } = results0[0];
        let sql = `insert into 
        comentario(idComentario, idUsuario, idObra, contenido, fecha) 
        values(null, '${idUsuario}', ${idObra}, '${contenido}', '${date}')`;

        connection.query(sql, function(error, results, fields){
            if(error){
                debug(error);
                return res.send(500);
            }
            // debug(results);
            return res.send(200);
        });
    });

});





module.exports = router;

