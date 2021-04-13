"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _routes = require("./routes");

var _main = _interopRequireDefault(require("./routes/main"));

var _users = _interopRequireDefault(require("./routes/users"));

var _books = _interopRequireDefault(require("./routes/books"));

var _path = _interopRequireDefault(require("path"));

var _midlleware = require("./class/Authentication/midlleware");

var _init = require("./class/Authentication/init");

require("core-js/stable");

require("regenerator-runtime/runtime");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var express = require('express');

var bodyParser = require('body-parser');

var cookieParser = require('cookie-parser');

var session = require('express-session');

var RedisStorage = require('connect-redis')(session);

var redis = require('redis');

var passport = require('passport');

var bcrypt = require('bcryptjs');

var LocalStrategy = require('passport-local').Strategy;

var cors = require('cors');

var app = express();
var client = redis.createClient({
  "password": "ujujkm123"
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(session({
  store: new RedisStorage({
    host: "localhost",
    port: 6379,
    client: client,
    ttl: 3600000
  }),
  resave: true,
  secret: 'you secret key',
  saveUninitialized: false,
  cookie: {
    maxAge: 2 * 3600 * 1000,
    httpOnly: false
  }
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(function (username, password, done) {
  (0, _init.findUser)(username, function (err, user) {
    if (err) return done(err);

    if (!user) {
      return done(null, false);
    }

    bcrypt.compare(password, user.password, function (err, isValid) {
      if (err) {
        return done(err);
      }

      if (!isValid) {
        return done(null, false);
      }

      return done(null, user);
    });
  });
}));
passport.serializeUser(function (user, done) {
  done(null, user.username);
});
passport.deserializeUser(function (username, done) {
  (0, _init.findUser)(username, function (err, user) {
    done(null, user);
    return null;
  });
});
passport.authenticationMiddleware = _midlleware.authenticationMiddleware;
app.use(cookieParser());
var whitelist = ['http://127.0.0.1:8000', 'http://127.0.0.1:8080', 'https://www.folkbook.ru', 'https://folkbook.ru']; //white list consumers

var corsOptions = {
  origin: function origin(_origin, callback) {
    if (whitelist.indexOf(_origin) !== -1) {
      callback(null, true);
    } else {
      callback(null, false);
    }
  },
  methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS'],
  optionsSuccessStatus: 200,
  // some legacy browsers (IE11, various SmartTVs) choke on 204
  credentials: true,
  //Credentials are cookies, authorization headers or TLS client certificates.
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'device-remember-token', 'Access-Control-Allow-Origin', 'Origin', 'Accept', 'Set-Cookie']
};
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(_routes.ROUTS.MAIN.index, _main["default"]);
app.use(_routes.ROUTS.USER.index, _users["default"]);
app.use(_routes.ROUTS.BOOKS.index, _books["default"]);
app.use(express["static"](_path["default"].join(__dirname, '../public')));
var _default = app;
exports["default"] = _default;