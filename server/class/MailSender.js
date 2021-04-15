import {config} from "../config";
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
    }
}