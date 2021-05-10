import {ROUTS} from "./index";
import {getUser} from "../class/Users/functions/getUser";
import {login} from "../class/Users/functions/login";
import {logout} from "../class/Users/functions/logout";
import {authenticationMiddleware} from "../class/Authentication/midlleware";
import {getActiveBook} from "../class/Users/functions/getActiveBook";
import {registration} from "../class/Users/functions/registration";
import {activate} from "../class/Users/functions/activate";
import {getAllUserBook} from "../class/Users/functions/getAllUserBook";
import {loginVk} from "../class/Users/functions/loginVk";
import {registrationVk} from "../class/Users/functions/registrationVk";
import {loginGoogle} from "../class/Users/functions/loginGoogle";
import {registrationGoogle} from "../class/Users/functions/registrationGoogle";

var express = require('express');
var router = express.Router();
const passport = require('passport');

router.get(ROUTS.USER.main, authenticationMiddleware(), getUser);
router.get(ROUTS.USER.getActiveBooks, authenticationMiddleware(), getActiveBook);
router.get(ROUTS.USER.getAllUserBooks, authenticationMiddleware(), getAllUserBook);
router.post(ROUTS.USER.login, passport.authenticate('local', {session: true}), login);
router.post(ROUTS.USER.loginVk, passport.authenticate('local', {session: true}), loginVk);
router.post(ROUTS.USER.loginGoogle, passport.authenticate('local', {session: true}), loginGoogle);
router.post(ROUTS.USER.registration, registration);
router.post(ROUTS.USER.registrationVk, registrationVk);
router.post(ROUTS.USER.registrationGoogle, registrationGoogle);
router.get(ROUTS.USER.activate, activate);
router.post(ROUTS.USER.logout, authenticationMiddleware(), logout);

export default router;
