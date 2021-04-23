import {config} from "../config";
import MySQL from "./mysql";
const nodemailer = require('nodemailer');

export class MailSender {
    transporter = null;

    constructor() {
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: config.EMAIL,
                pass: config.EMAIL_PASS
            },
        });
    }

    send = async ({toEmail, subject, bodyHtml}) => {
        return await this.transporter.sendMail({
            from: config.EMAIL,
            to: toEmail,
            subject: subject,
            text: '',
            html: bodyHtml,
        });
    };

    sendAllParticipants = async (id_book, emailObj) => {
        const mysql = new MySQL();
        const participants = (await mysql.query(`SELECT * FROM \`participants_in_book\` WHERE \`id_book\` = '${id_book}';`))[0];
        mysql.close();
        participants.map(async participant => {
            const mysql = new MySQL();
            const user = (await mysql.query(`SELECT * FROM \`user\` WHERE \`id\` = '${participant.id_user}';`))[0];
            mysql.close();
            this.send({
                toEmail: user.username,
                ...emailObj
            });
        });
    };
}