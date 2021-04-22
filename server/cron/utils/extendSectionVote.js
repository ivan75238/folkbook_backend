import moment from "moment";

const ADD_COUNT_DAY = 1;
export const extendSectionVote = async (mysql, section) => {
    const vote_finished_at = moment(section.vote_finished_at).add(ADD_COUNT_DAY, "days").set({second: 0}).format("YYYY-MM-DD HH:mm:ss");
    await mysql.query(`UPDATE \`sections\` SET \`updated_at\` = NOW(), \`vote_finished_at\` = '${vote_finished_at}' WHERE \`id\` = '${section.id}';`);
    await mysql.query(`UPDATE \`section_votes\` SET \`finished_at\` = '${vote_finished_at}' WHERE \`id_section\` = '${section.id}';`);
    mysql.close();
};