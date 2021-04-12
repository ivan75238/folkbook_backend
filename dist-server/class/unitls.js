"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.checkParams = void 0;

var checkParams = function checkParams(req, params) {
  var allFinded = true;
  params.map(function (param) {
    if (req.body[param] === null || req.body[param] === undefined) allFinded = false;
  });
  return allFinded;
};

exports.checkParams = checkParams;