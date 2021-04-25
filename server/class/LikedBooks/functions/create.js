import MySQL from "../../mysql";
import {HTTPStatus} from "../../HTTPStatus";
import {checkParams} from "../../unitls";

export const create = async (req, res) => {
    if (!checkParams(req, ["id_book"])) {
        return res.status(HTTPStatus.FORBIDDEN).send({
            result: false,
            msg: "Not all params",
            msgUser: "Переданы не все обязательные параметры"
        });
    }
    const mysql = new MySQL();
    //Запрос-проверка на существование лайка данной книги
    const result = (await mysql.query(`SELECT * FROM \`liked_books\` WHERE \`id_book\` = '${req.body.id_book}' AND \`id_user\` = '${req.user.id}';`))[0];
    if (result.count) {
        mysql.close();
        return res.status(HTTPStatus.FORBIDDEN).send({
            result: false,
            msg: "like is exist",
            msgUser: "Книга уже добавлена в понравившиейся"
        });
    }

    await mysql.query(`INSERT INTO \`liked_books\` (\`id_user\`, \`id_book\`)  VALUES ('${req.user.id}', '${req.body.id_book}')`);
    mysql.close();
    return res.send({result: true});
};
