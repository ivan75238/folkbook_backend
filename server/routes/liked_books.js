import {ROUTS} from "./index";
import {authenticationMiddleware} from "../class/Authentication/midlleware";
import {create} from "../class/LikedBooks/functions/create";
import {getAllLikedBooks} from "../class/LikedBooks/functions/getAllLikedBooks";
import {remove} from "../class/LikedBooks/functions/remove";

var express = require('express');
var router = express.Router();

router.post(ROUTS.LIKED_BOOKS.create, authenticationMiddleware(), create);
router.get(ROUTS.LIKED_BOOKS.get, authenticationMiddleware(), getAllLikedBooks);
router.post(ROUTS.LIKED_BOOKS.remove, authenticationMiddleware(), remove);

export default router;
