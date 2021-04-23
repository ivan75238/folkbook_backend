import moment from "moment";
import MySQL from "../class/mysql";
import {extendStartedBook} from "./utils/extendStartedBook";
import {extendStartedBook as extendStartedBookEmail} from "../emailsTemplate/extendStartedBook";
import {MailSender} from "../class/MailSender";
import {startedBook} from "../emailsTemplate/startedBook";
const CronJob = require('cron').CronJob;

export const updateCreatedBookToInWork = () => {
    const job = new CronJob('0 */5 * * * *', async () => {
        const now = moment().set({second: 0}).format("YYYY-MM-DD HH:mm:ss");
        const mysql = new MySQL();
        const result = await mysql.query(`SELECT * FROM \`books\` WHERE \`books\`.\`started_at\` = '${now}'`);
        mysql.close();
        if (result[0].length > 0) {
            result[0].map(async book => {
                const mysql = new MySQL();
                const result = await mysql.query(`SELECT COUNT(*) AS \`count\` FROM \`participants_in_book\` WHERE \`id_book\` = '${book.id}' GROUP BY \`id_book\``);
                if (result.length > 0) {
                    if (result[0].length > 0) {
                        const count = result[0][0].count;
                        if (count >= 3) {
                            //Переводим в работу книгу
                            mysql.query(`UPDATE \`books\` SET \`status\` = 'in_work' WHERE \`id\` = '${book.id}';`);
                            mysql.close();
                            new MailSender().sendAllParticipants(book.id, {
                                subject: `Старт книги ${book.name}`,
                                bodyHtml: startedBook()
                            });
                            console.log(`Книга id ${book.id}: переведена в работу`);
                        } else {
                            //Продлеваем старт книги, пока не будет минимальное количество участников
                            extendStartedBook(mysql, book);
                            new MailSender().sendAllParticipants(book.id, {
                                subject: `Изменение даты старта книги ${book.name}`,
                                bodyHtml: extendStartedBook()
                            });
                            console.log(`Книга id ${book.id}: продлен старт`);
                        }
                    }
                    else {
                        //Продлеваем старт книги, пока не будет минимальное количество участников
                        extendStartedBook(mysql, book);
                        new MailSender().sendAllParticipants(book.id, {
                            subject: `Изменение даты старта книги ${book.name}`,
                            bodyHtml: extendStartedBookEmail()
                        });
                        console.log(`Книга id ${book.id}: продлен старт`);
                    }
                }
                else {
                    mysql.close();
                }
            });
        }
    });
    job.start();
};