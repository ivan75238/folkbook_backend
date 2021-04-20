import moment from "moment";
import {updateSectionFromApplicant} from "./updateSectionFromApplicant";

const ADD_COUNT_DAY_ON_WRITE = 2;
const ADD_COUNT_DAY_ON_VOTE = 2;

export const createSectionWithoutVotes = (mysql, section, applicant) => {
    const finished_at_next = moment(section.vote_finished_at).add(ADD_COUNT_DAY_ON_WRITE, "days").set({second: 0}).format("YYYY-MM-DD HH:mm:ss");
    const vote_finished_at_next = moment(finished_at_next, "YYYY-MM-DD HH:mm:ss").add(ADD_COUNT_DAY_ON_VOTE, "days").set({second: 0}).format("YYYY-MM-DD HH:mm:ss");
    updateSectionFromApplicant(mysql, section, applicant);
    if (applicant.next_is_last_in_chapter) {
        //Выбрал что следующая секция последняя в главе, надо создать новую секцию
        mysql.query(`INSERT INTO \`sections\` (\`id_chapter\`, \`number\`, \`finished_at\`, \`vote_finished_at\`, \`is_last_in_chapter\`)
                                            VALUES ('${section.id_chapter}', '${section.number++}', '${finished_at_next}', '${vote_finished_at_next}', '1');`);
    } else if (applicant.next_is_last_in_book) {
        //Выбрал что следующая секция посленяя в книге
        mysql.query(`INSERT INTO \`sections\` (\`id_chapter\`, \`number\`, \`finished_at\`, \`vote_finished_at\`, \`is_last_in_book\`)
                                            VALUES ('${section.id_chapter}', '${section.number++}', '${finished_at_next}', '${vote_finished_at_next}', '1');`);
    }
};