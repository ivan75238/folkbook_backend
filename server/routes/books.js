import {ROUTS} from "./index";
import {authenticationMiddleware} from "../class/Authentication/midlleware";
import {create} from "../class/Books/functions/create";
import {getNewBook} from "../class/Books/functions/getNewBook";
import {joinInBook} from "../class/Books/functions/joinInBook";

var express = require('express');
var router = express.Router();

router.post(ROUTS.BOOKS.create, authenticationMiddleware(), create);
router.post(ROUTS.BOOKS.joinInBook, authenticationMiddleware(), joinInBook);
router.get(ROUTS.BOOKS.getNew, authenticationMiddleware(), getNewBook);

export default router;
