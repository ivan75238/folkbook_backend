import {ROUTS} from "./index";
import {authenticationMiddleware} from "../class/Authentication/midlleware";
import {create} from "../class/Books/functions/create";
import {getNewBook} from "../class/Books/functions/getNewBook";

var express = require('express');
var router = express.Router();

router.post(ROUTS.BOOKS.create, authenticationMiddleware(), create);
router.get(ROUTS.BOOKS.getNew, authenticationMiddleware(), getNewBook);

export default router;
