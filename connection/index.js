var mysql = require('mysql');
var debug = require('debug')('backendmuseovirtual:mysql-conn');

var connection = mysql.createPool({
    connectionLimit : 99,
    host: process.env.LOCAL_MYSQL_HOST,
    user: process.env.LOCAL_MYSQL_USER,
    password: process.env.LOCAL_MYSQL_PASSWORD,
    database: process.env.LOCAL_MYSQL_DB
});

module.exports = connection;