import {ROUTS} from "./index";
import {getUser} from "../class/Users/functions/getUser";
import {login} from "../class/Users/functions/login";
import {logout} from "../class/Users/functions/logout";
import {authenticationMiddleware} from "../class/Authentication/midlleware";
import {getActiveBook} from "../class/Users/functions/getActiveBook";
import {registration} from "../class/Users/functions/registration";
import {activate} from "../class/Users/functions/activate";
import {getAllUserBook} from "../class/Users/functions/getAllUserBook";

var express = require('express');
var router = express.Router();
const passport = require('passport');

router.get(ROUTS.USER.main, authenticationMiddleware(), getUser);
router.get(ROUTS.USER.getActiveBooks, authenticationMiddleware(), getActiveBook);
router.get(ROUTS.USER.getAllUserBooks, authenticationMiddleware(), getAllUserBook);
router.post(ROUTS.USER.login, passport.authenticate('local', {session: true}), login);
router.post(ROUTS.USER.registration, registration);
router.get(ROUTS.USER.activate, activate);
router.post(ROUTS.USER.logout, authenticationMiddleware(), logout);

export default router;
