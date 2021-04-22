import MySQL from "../../mysql";
import {HTTPStatus} from "../../HTTPStatus";
import {checkParams} from "../../unitls";

export const joinInBook = async (req, res) => {
    if (!checkParams(req, ["id_book", "id_user"])) {
        return res.status(HTTPStatus.FORBIDDEN).send({
            result: false,
            msg: "Not all params",
            msgUser: "Переданы не все обязательные параметры"
        });
    }
    const mysql = new MySQL();
    let result = await mysql.query(`SELECT * FROM \`books\` WHERE \`id\` = '${req.body.id_book}';`);
    const book = result[0][0];
    result = await mysql.query(`SELECT * FROM \`participants_in_book\` WHERE \`id_book\` = '${req.body.id_book}';`);
    if (result[0].length < book.max_participants) {
        await mysql.query(`INSERT INTO \`participants_in_book\` (\`id_user\`, \`id_book\`) VALUES ('${req.body.id_user}', '${req.body.id_book}')`);
        mysql.close();
        res.send({result: true});
    }
    else {
        mysql.close();
        res.status(HTTPStatus.FORBIDDEN).send({
            result: false,
            msg: "Not spot",
            msgUser: "На данную книгу закончились свободные места, выберите другую"
        });
    }
};