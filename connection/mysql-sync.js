var mysql = require("mysql");
var util = require('util');

class Database {
    constructor(dbName) {
        this.dbName = dbName;
        this.query;
    }
    promisifyQuery(){
        this.query = util.promisify(this.connection.query).bind(this.connection);
    }
    connectLocal(host,port,user,password) {
        this.connection = mysql.createPool({
            host: host,
            port: port,
            user: user,
            password: password,
            database: this.dbName
        });
        this.promisifyQuery();
    }
    async executeQuery(textQuery) {
        const rows = await this.query(textQuery);
        return rows;
    }
}

module.exports = Database;