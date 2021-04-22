import "core-js/stable";
import "regenerator-runtime/runtime";
import {checkGetParams} from "../../unitls";
import {HTTPStatus} from "../../HTTPStatus";
import MySQL from "../../mysql";

export const getApplicantsOnSection = async (req, res) => {
    if (!checkGetParams(req, ["id_section"])) {
        return res.status(HTTPStatus.FORBIDDEN).send({
            result: false,
            msg: "Not all params",
            msgUser: "Переданы не все обязательные параметры"
        });
    }
    const mysqlPoll = new MySQL();

    const result = await mysqlPoll.query(`SELECT * FROM \`applicants\` WHERE \`id_section\` = '${req.query.id_section}' AND \`status\` = 'finished'`);
    res.send(result[0]);
};