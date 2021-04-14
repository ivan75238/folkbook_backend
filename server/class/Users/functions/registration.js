import MySQL from "../../mysql";
import {checkParams} from "../../unitls";
import {HTTPStatus} from "../../HTTPStatus";
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');

export const registration = (req, res) => {
    if (!checkParams(req, ["username", "password"])) {
        return res.status(HTTPStatus.FORBIDDEN).send({
            result: false,
            msg: "Not all params",
            msgUser: "Переданы не все обязательные параметры"
        });
    }
    new MySQL().queryFull(`SELECT \`id\`, \`username\`, \`created_at\`, \`nickname\` FROM \`users\` WHERE \`username\` = '${req.body.username}'`,
    (results) => {
        if (results.length > 0) {
            return res.send({
                result: false,
                msg: "user name is exist",
                msgUser: "Введенный email уже занят"
            });
        }
        else {
            const mysql = new MySQL();
            const saltRounds = 10;
            const myPlaintextPassword = req.body.password;
            const salt = bcrypt.genSaltSync(saltRounds);
            const passwordHash = bcrypt.hashSync(myPlaintextPassword, salt);
            mysql.query(`
            INSERT INTO \`users\` (\`username\`, \`password\`, \`nickname\`) 
            VALUES ('${req.body.username}', '${passwordHash}', '${req.body.username}');`
            )
                .then(async result => {
                    let transporter = nodemailer.createTransport({
                        service: 'gmail',
                        auth: {
                            user: 'help@folkbook.ru',
                            pass: 'bARSIk75238',
                        },
                    });
                    let resultMail = await transporter.sendMail({
                        from: "folkbook.ru@gmail.com",
                        to: req.body.username,
                        subject: 'Подтверждение регистрации',
                        text: 'Тект из поля text',
                        html: `Ваш <i>ID</i> <strong>${result[0].insertId}</strong>.
                                <br/> Для активации акаунта перейдите по <a>ссылке</a>`,
                    });
                });
        }
    });
};