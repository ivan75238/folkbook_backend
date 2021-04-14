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
                            user: 'folkbook.ru@gmail.com',
                            pass: 'bARSIk75238',
                        },
                    });
                    let resultMail = await transporter.sendMail({
                        from: "folkbook.ru@gmail.com",
                        to: req.body.username,
                        subject: 'Подтверждение регистрации',
                        text: 'Тект из поля text',
                        html: `Благодарим вас за регистрацию на folkbook.ru.
                                <br/> Для активации акаунта перейдите по 
                                <a href="https://api.folkbook.ru/user/activate?uid=${result[0].insertId}">ссылке</a>`,
                    });
                    if (resultMail.accepted.length){
                        return res.send({result: true});
                    }
                    else {
                        mysql.query(`DELETE \`users\` WHERE \`id\` = ${result[0].insertId};`)
                        .then(() => {
                            mysql.close();
                            return res.send({
                                result: false,
                                msg: "send email error",
                                msgUser: "При отправки email произошла ошибка. Проверьте email и попробуйте позже"
                            });
                        });
                    }
                });
        }
    });
};