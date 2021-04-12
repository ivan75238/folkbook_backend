import {ROUTS} from "./index";
import {getUser} from "../class/Users/functions/getUser";
import {login} from "../class/Users/functions/login";
import {logout} from "../class/Users/functions/logout";
import {authenticationMiddleware} from "../class/Authentication/midlleware";

var express = require('express');
var router = express.Router();
const passport = require('passport');

router.get(ROUTS.USER.main, authenticationMiddleware(), getUser);
router.post(ROUTS.USER.login, passport.authenticate('local', {session: true}), login);
router.post(ROUTS.USER.logout, authenticationMiddleware(), logout);

export default router;
