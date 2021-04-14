import MySQL from "../../mysql";
import {checkParams} from "../../unitls";
import {HTTPStatus} from "../../HTTPStatus";

export const activate = (req, res) => {
    if (!checkParams(req, ["uid"])) {
        return res.status(HTTPStatus.FORBIDDEN).send({
            result: false,
            msg: "Not all params",
            msgUser: "Переданы не все обязательные параметры"
        });
    }
    new MySQL().queryFull(`SELECT \`id\`, \`username\`, \`created_at\`, \`nickname\` FROM \`users\` WHERE \`id\` = '${req.body.uid}'`,
    (results) => {
        if (results.length > 0) {
            //Когда нибудь тут будет перенаправление на страницу с печалькой
            return res.send({
                result: false,
                msg: "user not found",
                msgUser: "Не найден пользователь"
            });
        }
        else {
            const mysql = new MySQL();
            mysql.query(`UPDATE \`users\` SET \`is_active\` = '1' WHERE \`id\` = ${req.body.uid};`)
                .then(() => {
                        mysql.close();
                        return res.redirect('https://folkbook.ru');
                });
        }
    });
};