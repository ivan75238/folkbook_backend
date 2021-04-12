"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.findUser = findUser;

var _mysql = _interopRequireDefault(require("../mysql"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// Generate Password

/*const saltRounds = 10;
const myPlaintextPassword = 'secret';
const salt = bcrypt.genSaltSync(saltRounds);
const passwordHash = bcrypt.hashSync(myPlaintextPassword, salt);*/
function findUser(username, callback) {
  new _mysql["default"]().queryFull("SELECT `id`, `username`, `password` FROM `users` WHERE `username` = '".concat(username, "'"), function (results) {
    if (results.length && results[0].username === username) {
      return callback(null, results[0]);
    }

    return callback(null);
  });
}