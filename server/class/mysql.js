import * as mysql from "mysql2";
import {config} from "../config";

export default class MySQL {
    connection = null;

    constructor() {
        this.connection = mysql.createConnection({
            host: config.MYSQL_HOST,
            user: config.MYSQL_USER,
            password: config.MYSQL_SECRET,
            database: config.MYSQL_DB_NAME,
            port: config.MYSQL_port
        }).promise();
        this.connect();
    }

    connect = () => {
        this.connection.connect(err =>  {
            if (err) {
                return console.error("Ошибка подключения к БД: " + err.message);
            }
        });
    };

    close = () => {
        this.connection.end(function(err) {
            if (err) {
                return console.log("Ошибка закрытия соединения: " + err.message);
            }
        });
    };

    queryFull = (sql, callback) => {
        this.connection.query(sql)
            .then((res, err) => {
                callback(res[0], err);
                this.close();
            });
    };

    query = (sql) => {
        return this.connection.query(sql);
    };
}