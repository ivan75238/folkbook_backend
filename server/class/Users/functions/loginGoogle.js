import MySQL from "../../mysql";
import {MailSender} from "../../MailSender";
import {HTTPStatus} from "../../HTTPStatus";
import {activateUser} from "../../../emailsTemplate/activateUser";

export const loginGoogle = (req, res) => {
    new MySQL().queryFull(`SELECT \`id\`,\`is_active\`, \`username\`, \`created_at\`, \`nickname\` FROM \`users\` WHERE \`username\` = '${req.body.username}'`,
    async (results) => {
        res.send(results[0]);
    });
};