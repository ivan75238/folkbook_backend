import moment from "moment";
import {updateSectionFromApplicant} from "./updateSectionFromApplicant";

const ADD_COUNT_DAY_ON_WRITE = 2;
const ADD_COUNT_DAY_ON_VOTE = 2;

export const createSection = async (mysql, section, applicant, is_last_in_chapter, is_last_in_book) => {
    const finished_at_next = moment(section.vote_finished_at).add(ADD_COUNT_DAY_ON_WRITE, "days").set({second: 0}).format("YYYY-MM-DD HH:mm:ss");
    const vote_finished_at_next = moment(finished_at_next, "YYYY-MM-DD HH:mm:ss").add(ADD_COUNT_DAY_ON_VOTE, "days").set({second: 0}).format("YYYY-MM-DD HH:mm:ss");
    await updateSectionFromApplicant(mysql, section, applicant);
    section.number++;
    await mysql.query(`INSERT INTO \`sections\` (\`id_chapter\`, \`text\`, \`number\`, \`finished_at\`, \`vote_finished_at\`, \`is_last_in_chapter\`, \`is_last_in_book\`)
                VALUES ('${section.id_chapter}', '', '${section.number}', '${finished_at_next}', '${vote_finished_at_next}', '${is_last_in_chapter}', '${is_last_in_book}');`);
    mysql.close();
};