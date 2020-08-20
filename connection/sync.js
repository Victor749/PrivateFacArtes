var db = require("mysql-sync-query");

var dbObj = new db(process.env.LOCAL_MYSQL_DB);
dbObj.connectLocal(process.env.LOCAL_MYSQL_HOST, 3306, process.env.LOCAL_MYSQL_USER, process.env.LOCAL_MYSQL_PASSWORD);

module.exports = dbObj;