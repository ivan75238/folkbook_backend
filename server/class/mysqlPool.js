import * as mysql from "mysql2";
import {config} from "../config";

export default class MySQLPool {
    connection = null;

    constructor() {
        this.connection = mysql.createPool({
            host: config.MYSQL_HOST,
            user: config.MYSQL_USER,
            password: config.MYSQL_SECRET,
            database: config.MYSQL_DB_NAME,
            port: config.MYSQL_port
        }).promise();
    }

    query = (sql) => {
        return this.connection.query(sql);
    };
}