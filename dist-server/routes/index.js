"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ROUTS = void 0;
var ROUTS = {
  MAIN: {
    index: "/"
  },
  USER: {
    index: "/user",
    main: "/",
    login: "/login",
    logout: "/logout",
    getActiveBooks: "/get_active_books"
  },
  BOOKS: {
    index: "/books",
    create: "/create",
    getNew: "/get_new",
    joinInBook: "/join_in_book"
  }
};
exports.ROUTS = ROUTS;