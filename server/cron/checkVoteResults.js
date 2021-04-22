import moment from "moment";
import MySQL from "../class/mysql";
import {closeChapter} from "./utils/closeChapter";
import {extendSectionVote} from "./utils/extendSectionVote";
import _orderBy from 'lodash/orderBy';
import {closeBook} from "./utils/closeBook";
import {createSection} from "./utils/createSection";
const CronJob = require('cron').CronJob;

export const checkVoteResults = () => {
    const job = new CronJob('0 */5 * * * *', async () => {
        const now = moment().set({second: 0}).format("YYYY-MM-DD HH:mm:ss");
        const mysql = new MySQL();
        const result = await mysql.query(`SELECT \`sections\`.*, \`section_votes\`.\`id\` AS 'id_section_vote' FROM \`sections\` INNER JOIN \`section_votes\` ON \`sections\`.\`id\` = \`section_votes\`.\`id_section\` WHERE \`sections\`.\`vote_finished_at\` = '${now}'`);
        mysql.close();
        if (result[0].length > 0) {
            result[0].map(async section => {
                if (section.id_section_vote) {
                    const mysql = new MySQL();
                    const resultVoteResults = await mysql.query(`SELECT MIN(\`id\`) AS \`id\`, \`id_applicant\`, COUNT(\`id_applicant\`) AS \`count\` FROM \`section_voting_results\` WHERE \`id_vote\` = '${section.id_section_vote}' GROUP BY \`section_voting_results\`.\`id_applicant\``);
                    const results = resultVoteResults[0];
                    if (results.length) {
                        const winnerApplicant = _orderBy(results, ["count", "id"])[0];
                        const resultCountApplicants = await mysql.query(`SELECT * FROM \`applicants\` WHERE \`id\` = '${winnerApplicant.id_applicant}'`);
                        const applicant = resultCountApplicants[0][0];
                        //Если текущая секция помечена как последняя в главе
                        if (section.is_last_in_chapter) {
                            closeChapter(mysql, section, applicant);
                        }
                        //Если текущая секция помечена как последняя в книге
                        else if (section.is_last_in_book) {
                            closeBook(mysql, section, applicant);
                        }
                        else {
                            //закрываем текущую секцию
                            //Ищем сколько проголосовало за завершение главы в следующей секции
                            const resultLastInChapter = await mysql.query(`SELECT \`next_is_last_in_chapter\`, COUNT(\`next_is_last_in_chapter\`) AS \`count\` FROM \`section_voting_results\` WHERE \`id_vote\` = '${section.id_section_vote}' GROUP BY \`next_is_last_in_chapter\``);
                            console.log("lastInChapterVotes 0", resultLastInChapter);
                            const lastInChapterVotes = _orderBy(resultLastInChapter[0], ["next_is_last_in_chapter"]);
                            console.log("lastInChapterVotes 1", lastInChapterVotes);
                            let resultVotesChapters = 0;
                            let summaryCount = lastInChapterVotes[0].count + lastInChapterVotes[1].count;
                            if (lastInChapterVotes[1].count/summaryCount > lastInChapterVotes[0].count/summaryCount) {
                                resultVotesChapters = 1;
                            }
                            //Ищем сколько проголосовало за завершение книги в следующей секции
                            const resultLastInBook = await mysql.query(`SELECT \`next_is_last_in_book\`, COUNT(\`next_is_last_in_book\`) AS \`count\` FROM \`section_voting_results\` WHERE \`id_vote\` = '${section.id_section_vote}' GROUP BY \`next_is_last_in_book\``);
                            const lastInBookVotes = _orderBy(resultLastInBook[0], ["next_is_last_in_chapter"]);
                            let resultVotesBook = 0;
                            let summaryCountBook = lastInBookVotes[0].count + lastInBookVotes[1].count;
                            if (lastInBookVotes[1].count/summaryCountBook > lastInBookVotes[0].count/summaryCountBook) {
                                resultVotesBook = 1;
                            }
                            //Если пользователи проголосвали за завершение книги, то обнуляем завершение главы. Завершение книги важнее.
                            if (resultVotesBook) {
                                resultVotesChapters = 0;
                            }
                            //закрываем текущую секцию
                            createSection(mysql, section, applicant, resultVotesChapters, resultVotesBook);
                        }
                    }
                    else {
                        //Продлеваем голосование
                        extendSectionVote(mysql, section);
                    }
                }
            });
        }
    });
    job.start();
};