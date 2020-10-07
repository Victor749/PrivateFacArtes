var db = require("./mysql-sync");

var dbObj = new db(process.env.LOCAL_MYSQL_DB);
dbObj.connectLocal(process.env.LOCAL_MYSQL_HOST, process.env.LOCAL_MYSQL_PORT, process.env.LOCAL_MYSQL_USER, process.env.LOCAL_MYSQL_PASSWORD);

module.exports = dbObj;