import moment from "moment";
import MySQL from "../class/mysql";
import {closeChapter} from "./utils/closeChapter";
import {extendSectionVote} from "./utils/extendSectionVote";
import _orderBy from 'lodash/orderBy';
import {closeBook} from "./utils/closeBook";
import {createSection} from "./utils/createSection";
import {extendStartedBook} from "./utils/extendStartedBook";
const CronJob = require('cron').CronJob;

export const updateCreatedBookToInWork = () => {
    const job = new CronJob('0 */5 * * * *', function() {
        const now = moment().set({second: 0}).format("YYYY-MM-DD HH:mm:ss");
        const mysql = new MySQL();
        mysql.query(`SELECT * FROM \`books\` WHERE \`books\`.\`started_at\` = '${now}'`)
            .then(result => {
                if (result[0].length > 0) {
                    result[0].map(async book => {
                        const result = await mysql.query(`SELECT COUNT(*) AS \`count\` FROM \`participants_in_book\` WHERE \`id_book\` = '${book.id}' GROUP BY \`id_book\``);
                        if (result.length > 0) {
                            const count = result[0][0].count;
                            if (count > 3) {
                                //Переводим в работу книгу
                                mysql.query(`UPDATE \`books\` SET \`status\` = 'in_work' WHERE \`id\` = '${book.id}';`);
                            }
                            else {
                                //Продлеваем старт книги, пока не будет минимальное количество участников
                                extendStartedBook(mysql, book);
                            }
                        }
                    });
                }
            })
    });
    job.start();
};