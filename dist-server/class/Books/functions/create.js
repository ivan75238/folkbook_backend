"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.create = void 0;

var _mysql = _interopRequireDefault(require("../../mysql"));

var _HTTPStatus = require("../../HTTPStatus");

var _unitls = require("../../unitls");

var _moment = _interopRequireDefault(require("moment"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var create = function create(req, res) {
  var id_book;
  var mysql = new _mysql["default"]();
  createBook(req, res, mysql).then(function (result) {
    id_book = result[0].insertId;
    createGenresOfBook(req, res, result[0].insertId, mysql);
  }).then(function () {
    return createChapter(id_book, mysql);
  }).then(function (result) {
    return createSection(req, result[0].insertId, mysql);
  }).then(function () {
    mysql.close();
    res.send(JSON.stringify({
      result: true
    }));
  });
};

exports.create = create;

var createBook = function createBook(req, res, mysql) {
  if (!(0, _unitls.checkParams)(req, ["name", "age_rating", "started_at", "genres"])) {
    return res.status(_HTTPStatus.HTTPStatus.FORBIDDEN).send({
      result: false,
      msg: "Not all params",
      msgUser: "Переданы не все обязательные параметры"
    });
  }

  return mysql.query("\n        INSERT INTO `books` (`name`, `age_rating`, `created_type`, `started_at`, `status`) \n        VALUES ('".concat(req.body.name, "', '").concat(req.body.age_rating, "', 'auto', '").concat(req.body.started_at, "', 'created')"));
};

var createGenresOfBook = function createGenresOfBook(req, res, id_book, mysql) {
  var query = "INSERT INTO `genres_of_books` (`id_book`, `id_genre`) VALUES ";
  req.body.genres.map(function (id_genre, i) {
    query += "('".concat(id_book, "', '").concat(id_genre, "')").concat(i + 1 === req.body.genres.length ? ";" : ",");
  });
  return mysql.query(query);
};

var createChapter = function createChapter(id_book, mysql) {
  return mysql.query("INSERT INTO `chapters` (`id_book`, `number`) VALUES ('".concat(id_book, "', '1');"));
};

var createSection = function createSection(req, id_chapter, mysql) {
  return mysql.query("\n        INSERT INTO `sections` (`id_chapter`, `number`, `finished_at`, `vote_finished_at`) \n        VALUES ('".concat(id_chapter, "', '1',\n         '").concat((0, _moment["default"])(req.body.started_at).add(2, "days").format("YYYY-MM-DD HH:mm"), "',\n         '").concat((0, _moment["default"])(req.body.started_at).add(4, "days").format("YYYY-MM-DD HH:mm"), "'\n         );\n    "));
};