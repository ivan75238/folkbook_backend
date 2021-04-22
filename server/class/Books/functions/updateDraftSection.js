import "core-js/stable";
import "regenerator-runtime/runtime";
import {checkParams} from "../../unitls";
import {HTTPStatus} from "../../HTTPStatus";
import MySQL from "../../mysql";
import {checkVoteStart} from "./checkVoteStart";

export const updateDraftSection = async (req, res) => {
    if (!checkParams(req, ["id_section", "text", "next_is_last_in_chapter", "next_is_last_in_book"])) {
        return res.status(HTTPStatus.FORBIDDEN).send({
            result: false,
            msg: "Not all params",
            msgUser: "Переданы не все обязательные параметры"
        });
    }
    if (await checkVoteStart(req.body.id_section)) {
        return res.status(HTTPStatus.FORBIDDEN).send({
            result: false,
            msg: "vote start",
            msgUser: "Невозможно сохранить изменения, голосование уже началось."
        });
    }
    const mysql = new MySQL();
    await mysql.query(`UPDATE \`applicants\` SET \`text\` = '${req.body.text}', \`next_is_last_in_chapter\` = '${req.body.next_is_last_in_chapter ? 1 : 0}', \`next_is_last_in_book\` = '${req.body.next_is_last_in_book ? 1 : 0}' WHERE \`id_section\` = ${req.body.id_section};`);
    mysql.close();
    res.send({result: true});
};