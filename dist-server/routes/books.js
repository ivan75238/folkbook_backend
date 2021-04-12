"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _index = require("./index");

var _midlleware = require("../class/Authentication/midlleware");

var _create = require("../class/Books/functions/create");

var _getNewBook = require("../class/Books/functions/getNewBook");

var _joinInBook = require("../class/Books/functions/joinInBook");

var express = require('express');

var router = express.Router();
router.post(_index.ROUTS.BOOKS.create, (0, _midlleware.authenticationMiddleware)(), _create.create);
router.post(_index.ROUTS.BOOKS.joinInBook, (0, _midlleware.authenticationMiddleware)(), _joinInBook.joinInBook);
router.get(_index.ROUTS.BOOKS.getNew, (0, _midlleware.authenticationMiddleware)(), _getNewBook.getNewBook);
var _default = router;
exports["default"] = _default;