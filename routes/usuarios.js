var express = require('express');
var router = express.Router();
var connection = require('../connection');
var debug = require('debug')('backendmuseovirtual:usuarios');

function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}


router.post('/new', function(req, res){

    const {idUsuario, nombreUsuario, apellidoUsuario, linkFoto, email} = req.body;

    let today = new Date();
    let date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();

    let identifier = makeid(30);

    let sql_0 = `select * from usuario where idUsuario = '${idUsuario}'`;

    let sql = `insert into usuario(idUsuario, identificador, nombreUsuario, linkFoto, email)
    values('${idUsuario}', '${identifier}', '${nombreUsuario} ${apellidoUsuario}', '${linkFoto}', '${email}')`;

    connection.query(sql_0, function(err0, results0, fields0){
        if(err0){
            debug(error);
            return res.sendStatus(500);
        }else if(results0.length >= 1){
            debug("Already in database");
            debug(results0);
            return res.send(results0[0].identificador);
        }else{
            connection.query(sql, function(error, results, fields){
                if(error){
                    debug(error);
                    return res.sendStatus(500);
                }else{
                    debug(results);
                    return res.send(identifier);
                }
            });
        }
    })
});

router.get('/:identifier/check', function(req, res){
    debug(req.params);
    debug('Holaaa');

    res.send('true');

});



module.exports = router;

