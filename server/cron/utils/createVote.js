import moment from "moment";

export const createVote = async (mysql, section) => {
    const vote_finished_at = moment(section.vote_finished_at).set({second: 0}).format("YYYY-MM-DD HH:mm:ss");
    await mysql.query(`INSERT INTO \`section_votes\` (\`id_section\`, \`finished_at\`) VALUES ('${section.id}', '${vote_finished_at}')`);
    mysql.close();
};