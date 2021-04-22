import MySQL from "../../mysql";
import {checkGetParams} from "../../unitls";
import {HTTPStatus} from "../../HTTPStatus";

export const activate = async (req, res) => {
    if (!checkGetParams(req, ["uid"])) {
        return res.status(HTTPStatus.FORBIDDEN).send({
            result: false,
            msg: "Not all params",
            msgUser: "Переданы не все обязательные параметры"
        });
    }
    const mysql = new MySQL();
    const results = await mysql.query(`SELECT \`id\`, \`username\`, \`created_at\`, \`nickname\` FROM \`users\` WHERE \`id\` = '${req.body.uid}'`);
    if (results.length > 0) {
        //Когда нибудь тут будет перенаправление на страницу с печалькой
        mysql.close();
        return res.send({
            result: false,
            msg: "user not found",
            msgUser: "Не найден пользователь"
        });
    }
    else {
        await mysql.query(`UPDATE \`users\` SET \`is_active\` = '1' WHERE \`id\` = ${req.query.uid};`);
        mysql.close();
        return res.redirect('https://folkbook.ru');
    }
};