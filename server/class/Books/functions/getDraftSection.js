import "core-js/stable";
import "regenerator-runtime/runtime";
import MySQLPool from "../../mysqlPool";
import {checkGetParams} from "../../unitls";
import {HTTPStatus} from "../../HTTPStatus";

export const getDraftSection = async (req, res) => {
    if (!checkGetParams(req, ["id_section"])) {
        return res.status(HTTPStatus.FORBIDDEN).send({
            result: false,
            msg: "Not all params",
            msgUser: "Переданы не все обязательные параметры"
        });
    }
    const mysqlPoll = new MySQLPool();

    const result = await mysqlPoll.query(`
        SELECT *
        FROM \`applicants\`  
        WHERE \`id_section\` = '${req.query.id_section}' AND \`id_user\` = ${req.user.id};`
    );
    const applicant = result[0].length > 0 ? result[0][0] : null;
    res.send(applicant);
};