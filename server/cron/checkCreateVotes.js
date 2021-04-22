import moment from "moment";
import MySQL from "../class/mysql";
import {extendSection} from "./utils/extendSection";
import {createSection} from "./utils/createSection";
import {createVote} from "./utils/createVote";
import {closeChapter} from "./utils/closeChapter";
import {closeBook} from "./utils/closeBook";
const CronJob = require('cron').CronJob;

export const checkCreateVotes = () => {
    const job = new CronJob('0 */5 * * * *', async () => {
        const now = moment().set({second: 0}).format("YYYY-MM-DD HH:mm:ss");
        const mysql = new MySQL();
        const result = await mysql.query(`SELECT \`sections\`.*, \`section_votes\`.\`id\` AS \`id_section_vote\` FROM \`sections\` LEFT JOIN \`section_votes\` ON \`sections\`.\`id\` = \`section_votes\`.\`id_section\` WHERE \`sections\`.\`finished_at\` = '${now}'`);
        mysql.close();
        if (result[0].length > 0) {
            result[0].map(async section => {
                //Получаем количество вариантов
                const mysql = new MySQL();
                const resultCountApplicants = await mysql.query(`SELECT * FROM \`applicants\` WHERE \`id_section\` = '${section.id}'`);
                const applicants = resultCountApplicants[0];
                if (applicants.length === 0) {
                    //Продлеваем секцию
                    extendSection(mysql, section);
                }
                else if (applicants.length === 1) {
                    //Если текущая секция помечена как последняя в главе
                    if (section.is_last_in_chapter) {
                        closeChapter(mysql, section, applicants[0]);
                    }
                    //Если текущая секция помечена как последняя в книге
                    else if (section.is_last_in_book) {
                        closeBook(mysql, section, applicants[0]);
                    }
                    else {
                        //закрываем текущую секцию
                        createSection(mysql, section, applicants[0], applicants[0].next_is_last_in_chapter, applicants[0].next_is_last_in_book);
                    }
                }
                else if (!section.id_section_vote) {
                    //создание голосования
                    createVote(mysql, section);
                }
            });
        }
    });
    job.start();
};