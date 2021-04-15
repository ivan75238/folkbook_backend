import {ROUTS} from "./index";
import {getUser} from "../class/Users/functions/getUser";
import {login} from "../class/Users/functions/login";
import {logout} from "../class/Users/functions/logout";
import {authenticationMiddleware} from "../class/Authentication/midlleware";
import {getActiveBook} from "../class/Users/functions/getActiveBook";
import {registration} from "../class/Users/functions/registration";
import {activate} from "../class/Users/functions/activate";

var express = require('express');
var router = express.Router();
const passport = require('passport');

router.post(ROUTS.USER.login, (req, res) =>
    passport.authenticate(
        'local',
        {session: true},
        (err, user, info) =>  login(err, user, info, res)
    )(req, res)
);

router.get(ROUTS.USER.main, authenticationMiddleware(), getUser);
router.get(ROUTS.USER.getActiveBooks, authenticationMiddleware(), getActiveBook);
router.post(ROUTS.USER.registration, registration);
router.get(ROUTS.USER.activate, activate);
router.post(ROUTS.USER.logout, authenticationMiddleware(), logout);

export default router;
