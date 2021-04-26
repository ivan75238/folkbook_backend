import MySQL from "../../mysql";
import {checkParams} from "../../unitls";
import {HTTPStatus} from "../../HTTPStatus";
const bcrypt = require('bcryptjs');
import {MailSender} from "../../MailSender";
import {activateUser} from "../../../emailsTemplate/activateUser";

export const registration = async (req, res) => {
    if (!checkParams(req, ["username", "password"])) {
        return res.status(HTTPStatus.FORBIDDEN).send({
            result: false,
            msg: "Not all params",
            msgUser: "Переданы не все обязательные параметры"
        });
    }
    const mysql = new MySQL();
    const results = (await mysql.query(`SELECT \`id\`, \`username\`, \`created_at\`, \`nickname\` FROM \`users\` WHERE \`username\` = '${req.body.username}'`))[0];
    if (results.length > 0) {
        mysql.close();
        return res.status(HTTPStatus.FORBIDDEN).send({
            result: false,
            msg: "user name is exist",
            msgUser: "Введенный email уже занят"
        });
    }
    else {
        const saltRounds = 10;
        const myPlaintextPassword = req.body.password;
        const salt = bcrypt.genSaltSync(saltRounds);
        const passwordHash = bcrypt.hashSync(myPlaintextPassword, salt);
        const result = await mysql.query(`
            INSERT INTO \`users\` (\`username\`, \`password\`, \`nickname\`) 
            VALUES ('${req.body.username}', '${passwordHash}', '${req.body.username}');`
        );
        const resultMail = await new MailSender().send({
            toEmail: req.body.username,
            subject: 'Подтверждение регистрации',
            bodyHtml: activateUser(result[0].insertId)
        });
        if (resultMail.accepted.length){
            mysql.close();
            return res.send({
                result: true,
                msgUser: "Регистрация прошла успешно, для активации аккаунта на указанный адрес электронной почты отправислено письмо с инструкциями"
            });
        }
        else {
            await mysql.query(`DELETE FROM \`users\` WHERE \`id\` = ${result[0].insertId};`);
            mysql.close();
            return res.send({
                result: false,
                msg: "send email error",
                msgUser: "При отправки email произошла ошибка. Проверьте email и попробуйте позже"
            });
        }
    }
};