"use strict";

var _midlleware = require("./midlleware");

module.exports = {
  middleware: _midlleware.authenticationMiddleware
};