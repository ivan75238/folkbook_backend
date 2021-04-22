import "core-js/stable";
import "regenerator-runtime/runtime";
import {checkGetParams} from "../../unitls";
import {HTTPStatus} from "../../HTTPStatus";
import MySQL from "../../mysql";

export const getDraftSection = async (req, res) => {
    if (!checkGetParams(req, ["id_section"])) {
        return res.status(HTTPStatus.FORBIDDEN).send({
            result: false,
            msg: "Not all params",
            msgUser: "Переданы не все обязательные параметры"
        });
    }
    const mysql = new MySQL();

    const result = await mysql.query(`
        SELECT *
        FROM \`applicants\`  
        WHERE \`id_section\` = '${req.query.id_section}' AND \`id_user\` = ${req.user.id};`
    );
    mysql.close();
    const applicant = result[0].length > 0 ? result[0][0] : null;
    res.send(applicant);
};