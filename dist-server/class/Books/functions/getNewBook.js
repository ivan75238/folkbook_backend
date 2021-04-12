"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getNewBook = void 0;

var _mysql = _interopRequireDefault(require("../../mysql"));

require("core-js/stable");

require("regenerator-runtime/runtime");

var _mysqlPool = _interopRequireDefault(require("../../mysqlPool"));

var _orderBy2 = _interopRequireDefault(require("lodash/orderBy"));

var _moment = _interopRequireDefault(require("moment"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var getNewBook = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(req, res) {
    var books, mysql, mysqlPoll;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            books = [];
            mysql = new _mysql["default"]();
            mysqlPoll = new _mysqlPool["default"]();
            mysql.query("SELECT \n        `books`.`id`, \n        `books`.`name`, \n        `books`.`age_rating`, \n        `books`.`max_participants`, \n        `books`.`started_at`, \n        `books`.`status`, \n        COUNT(*) AS `chapter_count` \n    FROM \n        `books` INNER JOIN `chapters` ON `books`.`id` = `chapters`.`id_book`\n    WHERE \n        `books`.`started_at` > CURDATE() \n    GROUP BY \n        `chapters`.`id_book`\n    ").then( /*#__PURE__*/function () {
              var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(results) {
                var resultGenres, resultParticipants;
                return regeneratorRuntime.wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        books = results[0];
                        _context.next = 3;
                        return Promise.all(books.map(function (book) {
                          return mysqlPoll.query("\n                    SELECT \n                        `genres_of_books`.`id_book`, \n                        `genres`.`title` \n                    FROM `genres_of_books` INNER JOIN `genres` ON `genres_of_books`.`id_genre` = `genres`.`id` \n                    WHERE `genres_of_books`.`id_book` = '".concat(book.id, "';"));
                        }));

                      case 3:
                        resultGenres = _context.sent;
                        resultGenres.forEach(function (_ref3) {
                          var _ref4 = _slicedToArray(_ref3, 1),
                              rows = _ref4[0];

                          if (rows.length) {
                            var index = books.findIndex(function (i) {
                              return i.id === rows[0].id_book;
                            });

                            if (index > -1) {
                              books[index].genres = rows.map(function (p) {
                                return p.title;
                              });
                            }
                          }
                        });
                        _context.next = 7;
                        return Promise.all(books.map(function (book) {
                          return mysqlPoll.query("SELECT * FROM `participants_in_book` WHERE `id_book` = '".concat(book.id, "';"));
                        }));

                      case 7:
                        resultParticipants = _context.sent;
                        resultParticipants.forEach(function (_ref5) {
                          var _ref6 = _slicedToArray(_ref5, 1),
                              rows = _ref6[0];

                          if (rows.length) {
                            var index = books.findIndex(function (i) {
                              return i.id === rows[0].id_book;
                            });

                            if (index > -1) {
                              books[index].participants = rows.map(function (p) {
                                return p.id_user;
                              });
                            }
                          }
                        });
                        books = (0, _orderBy2["default"])(books, function (i) {
                          return (0, _moment["default"])(i.started_at).unix();
                        });
                        mysql.close();
                        res.send(books);

                      case 12:
                      case "end":
                        return _context.stop();
                    }
                  }
                }, _callee);
              }));

              return function (_x3) {
                return _ref2.apply(this, arguments);
              };
            }());

          case 4:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function getNewBook(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

exports.getNewBook = getNewBook;