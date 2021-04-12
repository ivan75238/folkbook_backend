"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.authenticationMiddleware = void 0;

var _HTTPStatus = require("../HTTPStatus");

var authenticationMiddleware = function authenticationMiddleware() {
  return function (req, res, next) {
    if (!req.isAuthenticated()) {
      return res.status(_HTTPStatus.HTTPStatus.UNAUTHORIZED).send({
        result: false,
        msg: "Not auth",
        msgUser: "Пользоватль не авторизован"
      });
    }

    next();
  };
};

exports.authenticationMiddleware = authenticationMiddleware;