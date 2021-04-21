import moment from "moment";

const ADD_COUNT_DAY = 1;

export const extendStartedBook = async (mysql, book) => {
    const started_at = moment(book.started_at).add(ADD_COUNT_DAY, "days").set({second: 0}).format("YYYY-MM-DD HH:mm:ss");
    await mysql.query(`UPDATE \`books\` SET \`started_at\` = '${started_at}' WHERE \`id\` = '${book.id}';`);
    const chapter = (await mysql.query(`SELECT * FROM \`chapters\` WHERE \`id_book\` = '${book.id}'`))[0][0];
    const section = (await mysql.query(`SELECT * FROM \`sections\` WHERE \`id_chapter\` = '${chapter.id}'`))[0][0];
    const finished_at = moment(section.finished_at).add(ADD_COUNT_DAY, "days").set({second: 0}).format("YYYY-MM-DD HH:mm:ss");
    const vote_finished_at = moment(section.vote_finished_at).add(ADD_COUNT_DAY, "days").set({second: 0}).format("YYYY-MM-DD HH:mm:ss");
    mysql.query(`UPDATE \`sections\` SET \`finished_at\` = '${finished_at}', \`updated_at\` = NOW(), \`vote_finished_at\` = '${vote_finished_at}' WHERE \`id\` = '${section.id}';`)
};