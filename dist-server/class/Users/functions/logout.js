"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.logout = void 0;

var logout = function logout(req, res) {
  req.logOut();
  res.send({
    result: true
  });
};

exports.logout = logout;