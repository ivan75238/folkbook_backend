import MySQL from "../../mysql";
import {MailSender} from "../../MailSender";
import {HTTPStatus} from "../../HTTPStatus";

export const login = async (req, res) => {
    const mysql = new MySQL();
    const results = await mysql.queryFull(`SELECT \`id\`,\`is_active\`, \`username\`, \`created_at\`, \`nickname\` FROM \`users\` WHERE \`username\` = '${req.body.username}'`);
    mysql.close();
    if (!results[0].is_active) {
        await new MailSender().send({
            toEmail: req.body.username,
            subject: 'Подтверждение регистрации',
            bodyHtml: `Благодарим вас за регистрацию на folkbook.ru.
                        <br/> Для активации аккаунта перейдите по 
                        <a href="https://api.folkbook.ru/user/activate?uid=${results[0].id}">ссылке</a>`
        });
        req.logOut();
        return res.status(HTTPStatus.FORBIDDEN).send({
            result: false,
            msgUser: "Учетная запись не активирована. На указанный email было отправленно повторное письмо с инструкцией по активации"
        })
    }
    res.send(results[0]);
};