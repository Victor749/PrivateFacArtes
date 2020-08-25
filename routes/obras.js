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

module.exports = router;