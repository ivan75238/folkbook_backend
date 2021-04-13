"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _index = require("./index");

var _getUser = require("../class/Users/functions/getUser");

var _login = require("../class/Users/functions/login");

var _logout = require("../class/Users/functions/logout");

var _midlleware = require("../class/Authentication/midlleware");

var _getActiveBook = require("../class/Users/functions/getActiveBook");

var express = require('express');

var router = express.Router();

var passport = require('passport');

router.get(_index.ROUTS.USER.main, (0, _midlleware.authenticationMiddleware)(), _getUser.getUser);
router.get(_index.ROUTS.USER.getActiveBooks, (0, _midlleware.authenticationMiddleware)(), _getActiveBook.getActiveBook);
router.post(_index.ROUTS.USER.login, passport.authenticate('local', {
  session: true
}), _login.login);
router.post(_index.ROUTS.USER.logout, (0, _midlleware.authenticationMiddleware)(), _logout.logout);
var _default = router;
exports["default"] = _default;