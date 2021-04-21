import moment from "moment";


const ADD_COUNT_DAY = 1;
export const extendSection = (mysql, section) => {
    const finished_at = moment(section.finished_at).add(ADD_COUNT_DAY, "days").set({second: 0}).format("YYYY-MM-DD HH:mm:ss");
    const vote_finished_at = moment(section.vote_finished_at).add(ADD_COUNT_DAY, "days").set({second: 0}).format("YYYY-MM-DD HH:mm:ss");
    mysql.query(`UPDATE \`sections\` SET \`finished_at\` = '${finished_at}', \`updated_at\` = NOW(), \`vote_finished_at\` = '${vote_finished_at}' WHERE \`id\` = '${section.id}';`)
};