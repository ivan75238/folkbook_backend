"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var mysql = _interopRequireWildcard(require("mysql2"));

var _config = require("../config");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MySQL = function MySQL() {
  var _this = this;

  _classCallCheck(this, MySQL);

  this.connection = null;

  this.connect = function () {
    _this.connection.connect(function (err) {
      if (err) {
        return console.error("Ошибка подключения к БД: " + err.message);
      }
    });
  };

  this.close = function () {
    _this.connection.end(function (err) {
      if (err) {
        return console.log("Ошибка закрытия соединения: " + err.message);
      }
    });
  };

  this.queryFull = function (sql, callback) {
    _this.connection.query(sql).then(function (res, err) {
      callback(res[0], err);

      _this.close();
    });
  };

  this.query = function (sql) {
    return _this.connection.query(sql);
  };

  this.connection = mysql.createConnection({
    host: _config.config.MYSQL_HOST,
    user: _config.config.MYSQL_USER,
    password: _config.config.MYSQL_SECRET,
    database: _config.config.MYSQL_DB_NAME,
    port: _config.config.MYSQL_port
  }).promise();
  this.connect();
};

exports["default"] = MySQL;