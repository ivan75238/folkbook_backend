import MySQL from "../../mysql";
import {MailSender} from "../../MailSender";
import {HTTPStatus} from "../../HTTPStatus";
import {activateUser} from "../../../emailsTemplate/activateUser";

export const login = (req, res) => {
    new MySQL().queryFull(`SELECT \`id\`,\`is_active\`, \`username\`, \`created_at\`, \`nickname\` FROM \`users\` WHERE \`username\` = '${req.body.username}'`,
    async (results) => {
        if (!results[0].is_active) {
            await new MailSender().send({
                toEmail: req.body.username,
                subject: 'Подтверждение регистрации',
                bodyHtml: activateUser(results[0].id)
            });
            req.logOut();
            return res.status(HTTPStatus.FORBIDDEN).send({
                result: false,
                msgUser: "Учетная запись не активирована. На указанный email было отправленно повторное письмо с инструкцией по активации"
            })
        }
        res.send(results[0]);
    });
};