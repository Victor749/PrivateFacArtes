var express = require('express');
var router = express.Router();
var connection = require('../connection');
const e = require('express');
var debug = require('debug')('backendmuseovirtual:usuarios');

function makeid(length) {
    var result           = '';
    var characters       = 'abcdefghijklmnopqrstUVWXYZABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

const getUniqueIdentifier = async (identifier) => {
    return new Promise(function(resolve, reject){
        let sql_1 = `select * from usuario where identificador = '${identifier}'`;
        // debug('AQUIIIII');
        connection.query(sql_1, function(error, results, fields){
            if(error){
                return reject(error);
            }else if(results.length == 0){
                return resolve(results);
            }else{
                return reject(results);
            }
        });
    });
}


router.post('/new', async (req, res) => {

    debug('hola');

    const {idUsuario, nombreUsuario, apellidoUsuario, linkFoto, email} = req.body;

    let identifier = makeid(30);

    while(true){
        try{
            const resultados = await getUniqueIdentifier(identifier);
            // debug('hola 2');
            debug(resultados);
            break;
        }catch(error){
            debug('Error');
            debug(error);
            identifier = makeid(2);
        }
    }

    let sql_0 = `select * from usuario where idUsuario = '${idUsuario}'`;

    let sql = `insert into usuario(idUsuario, identificador, nombreUsuario, linkFoto, email)
    values('${idUsuario}', '${identifier}', '${nombreUsuario} ${apellidoUsuario}', '${linkFoto}', '${email}')`;

    connection.query(sql_0, function(err0, results0, fields0){
        if(err0){
            debug(error);
            return res.send('error cero');
        }else if(results0.length >= 1){
            // debug("Already in database");
            // debug(results0);
            return res.send(results0[0].identificador);
        }else{
            connection.query(sql, function(error, results, fields){
                if(error){
                    debug(error);
                    return res.send('error 1');
                }else{
                    // debug(results);
                    return res.send(identifier);
                }
            });
        }
    });

    // debug('hola 3');

});

router.get('/:identifier/check', function(req, res){
    // debug(req.params);
    // debug('Holaaa');

    let sql = `select * from usuario where identificador = '${req.params.identifier}'`;
    connection.query(sql, function(error, results, fields){
        if(error){
            debug(error);
            return res.sendStatus(500);
        }
        if(results.length > 0){
            return res.send('true');
        }
        return res.send('false');
    });
});



module.exports = router;

