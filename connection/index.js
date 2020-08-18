var mysql = require('mysql');

var connection = mysql.createPool({
    connectionLimit : 100,
    host: process.env.LOCAL_MYSQL_HOST,
    user: process.env.LOCAL_MYSQL_USER,
    password: process.env.LOCAL_MYSQL_PASSWORD,
    database: process.env.LOCAL_MYSQL_DB
});

connection.getConnection(function (err, conn) {
    if (err) {
        console.log('No se ha podido conectar.');
        console.log(err);
    } else {
        console.log('Conectado a BD.');
    }
});

module.exports = connection;