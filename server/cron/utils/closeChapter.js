import {updateSectionFromApplicant} from "./updateSectionFromApplicant";
import moment from "moment";

const ADD_COUNT_DAY_ON_WRITE = 2;
const ADD_COUNT_DAY_ON_VOTE = 2;

export const closeChapter = async (mysql, section, applicant) => {
    //заполняем текущую секцию
    updateSectionFromApplicant(mysql, section, applicant);
    //получаем старую главу, что бы получить id книги
    const resultChapter = await mysql.query(`SELECT * FROM \`chapters\` WHERE \`id\` = '${section.id_chapter}'`);
    const id_book = resultChapter[0][0].id_book;
    const next_chapter_number = resultChapter[0][0].number;
    //создаем новую главу
    const resultNewChapter = await mysql.query(`INSERT INTO \`chapters\` (\`id_book\`, \`number\`) VALUES ('${id_book}', '${next_chapter_number}')`);
    const id_new_chapter = resultNewChapter[0].insertId;
    //создаем первую секцию в новой главе
    const finished_at_next = moment(section.vote_finished_at).add(ADD_COUNT_DAY_ON_WRITE, "days").set({second: 0}).format("YYYY-MM-DD HH:mm:ss");
    const vote_finished_at_next = moment(finished_at_next, "YYYY-MM-DD HH:mm:ss").add(ADD_COUNT_DAY_ON_VOTE, "days").set({second: 0}).format("YYYY-MM-DD HH:mm:ss");
    mysql.query(`INSERT INTO \`sections\` (\`id_chapter\`, \`number\`, \`finished_at\`, \`vote_finished_at\`)
                                            VALUES ('${id_new_chapter}', '1', '${finished_at_next}', '${vote_finished_at_next}');`);
};