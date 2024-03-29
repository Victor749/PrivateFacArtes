var mysql = require('mysql');

var connection = mysql.createPool({
    host: process.env.LOCAL_MYSQL_HOST,
    port: process.env.LOCAL_MYSQL_PORT,
    user: process.env.LOCAL_MYSQL_USER,
    password: process.env.LOCAL_MYSQL_PASSWORD,
    database: process.env.LOCAL_MYSQL_DB
});

module.exports = connection;