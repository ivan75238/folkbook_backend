"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getUser = void 0;

var _mysql = _interopRequireDefault(require("../../mysql"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var getUser = function getUser(req, res) {
  new _mysql["default"]().queryFull("SELECT `id`, `username`, `created_at`, `nickname` FROM `users` WHERE `username` = '".concat(req.user.username, "'"), function (results) {
    res.send(JSON.stringify(results[0]));
  });
};

exports.getUser = getUser;