import {ROUTS} from "./routes";
import indexRouter from './routes/main';
import usersRouter from './routes/users';
import booksRouter from './routes/books';
import path from 'path';
import {authenticationMiddleware} from "./class/Authentication/midlleware";
import {findUser} from "./class/Authentication/init";

const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const RedisStorage = require('connect-redis')(session);
const redis = require('redis');
const passport = require('passport');
const bcrypt = require('bcryptjs');
const LocalStrategy = require('passport-local').Strategy;
const cors = require('cors');
import "core-js/stable";
import "regenerator-runtime/runtime";
import {MailSender} from "./class/MailSender";

const app = express();
const client = redis.createClient({"password": "ujujkm123"});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
    session({
        store: new RedisStorage({
            host: "localhost",
            port: 6379,
            client: client,
            ttl: 3600000,
        }),
        resave: true,
        secret: 'you secret key',
        saveUninitialized: false,
        cookie: {
            maxAge: 2 * 3600 * 1000,
            httpOnly: false,
        },
    })
);

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy((username, password, done) => {
        findUser(username, (err, user) => {
            if (err) return done(err);

            if (!user) {
                return done(null, false)
            }

            bcrypt.compare(password, user.password, async (err, isValid) => {
                if (err) {
                    return done(err)
                }
                if (!isValid) {
                    return done(null, false)
                }

                if (user.is_active) {
                    return done(null, user);
                }
                else {
                    await new MailSender().send({
                        toEmail: username,
                        subject: 'Подтверждение регистрации',
                        bodyHtml: `Благодарим вас за регистрацию на folkbook.ru.
                            <br/> Для активации аккаунта перейдите по 
                            <a href="https://api.folkbook.ru/user/activate?uid=${user.id}">ссылке</a>`
                    });
                    return done(
                        null,
                        false,
                        { message: "Учетная запись не активирована. На указанный email было отправленно повторное письмо с инструкцией по активации"}
                    );
                }
            })
        })
    }
));

passport.serializeUser((user, done) => {
    done(null, user.username);
});

passport.deserializeUser((username, done) => {
    findUser(username, (err, user) => {
        done(null, user);
        return null;
    });
});

passport.authenticationMiddleware = authenticationMiddleware;

app.use(cookieParser());

var whitelist = ['http://127.0.0.1:8000', 'http://127.0.0.1:8080', 'https://www.folkbook.ru', 'https://folkbook.ru']; //white list consumers
var corsOptions = {
    origin: function (origin, callback) {
        if (whitelist.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(null, false);
        }
    },
    methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS'],
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
    credentials: true, //Credentials are cookies, authorization headers or TLS client certificates.
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'device-remember-token', 'Access-Control-Allow-Origin', 'Origin', 'Accept', 'Set-Cookie']
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

app.use(ROUTS.MAIN.index, indexRouter);
app.use(ROUTS.USER.index, usersRouter);
app.use(ROUTS.BOOKS.index, booksRouter);
app.use(express.static(path.join(__dirname, '../public')));

export default app;
