import {ROUTS} from "./index";
import {authenticationMiddleware} from "../class/Authentication/midlleware";
import {create} from "../class/Books/functions/create";
import {getNewBook} from "../class/Books/functions/getNewBook";
import {joinInBook} from "../class/Books/functions/joinInBook";
import {get} from "../class/Books/functions/get";
import {getDraftSection} from "../class/Books/functions/getDraftSection";
import {createDraftSection} from "../class/Books/functions/createDraftSection";
import {updateDraftSection} from "../class/Books/functions/updateDraftSection";
import {sendApplicant} from "../class/Books/functions/sendApplicant";
import {getApplicantsOnSection} from "../class/Books/functions/getApplicantsOnSection";
import {getUserVoteFromSection} from "../class/Books/functions/getUserVoteFromSection";
import {sendVoteResult} from "../class/Books/functions/sendVoteResult";
import {getAllBookWithoutNotStarted} from "../class/Books/functions/getAllBookWithoutNotStarted";

var express = require('express');
var router = express.Router();

router.post(ROUTS.BOOKS.create, authenticationMiddleware(), create);
router.post(ROUTS.BOOKS.joinInBook, authenticationMiddleware(), joinInBook);
router.get(ROUTS.BOOKS.getNew, authenticationMiddleware(), getNewBook);
router.get(ROUTS.BOOKS.get, authenticationMiddleware(), get);
router.get(ROUTS.BOOKS.getDraftSection, authenticationMiddleware(), getDraftSection);
router.get(ROUTS.BOOKS.getApplicantsOnSection, authenticationMiddleware(), getApplicantsOnSection);
router.get(ROUTS.BOOKS.getUserVoteFromSection, authenticationMiddleware(), getUserVoteFromSection);
router.get(ROUTS.BOOKS.getAllBookWithoutNotStarted, authenticationMiddleware(), getAllBookWithoutNotStarted);
router.post(ROUTS.BOOKS.createDraftSection, authenticationMiddleware(), createDraftSection);
router.post(ROUTS.BOOKS.updateDraftSection, authenticationMiddleware(), updateDraftSection);
router.post(ROUTS.BOOKS.sendApplicant, authenticationMiddleware(), sendApplicant);
router.post(ROUTS.BOOKS.sendVoteResult, authenticationMiddleware(), sendVoteResult);

export default router;
