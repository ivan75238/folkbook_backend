import MySQL from "../../mysql";
import {HTTPStatus} from "../../HTTPStatus";
import {checkParams} from "../../unitls";

export const remove = async (req, res) => {
    if (!checkParams(req, ["id_book"])) {
        return res.status(HTTPStatus.FORBIDDEN).send({
            result: false,
            msg: "Not all params",
            msgUser: "Переданы не все обязательные параметры"
        });
    }
    const mysql = new MySQL();
    await mysql.query(`DELETE FROM \`liked_books\` WHERE \`id_book\` = ${req.body.id_book} AND \`id_user\` = '${req.user.id}';`);
    mysql.close();
    return res.send({result: true});
};
