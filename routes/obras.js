var express = require('express');
var router = express.Router();
var connection = require('../connection');
var debug = require('debug')('backendmuseovirtual:obras');

/* GET Obras page. */
router.get('/', function(req, res, next) {
  res.render('obras', { title: 'Obras' });
});

router.get('/api/json/:id_obra', function(req, res){
   
  console.log(req.params);
  let sql = `select * from obra where idObra=${req.params.id_obra}`;
  
  connection.query(sql, function (error, results) {
    
    if (error) {
      debug(error);
      res.sendStatus(500);
   }else{
     res.send(results[0]);
   }
  });

});

router.put('/:id_obra', function(req, res){
  debug(req.body);
  debug(req.params);

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
          debug(error2);
          res.sendStatus(500);
        }else{
          // debug(results2[0]);
          res.send(results2[0]);
        }
      });
    }
  });
});

module.exports = router;