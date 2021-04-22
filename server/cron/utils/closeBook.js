import {updateSectionFromApplicant} from "./updateSectionFromApplicant";

export const closeBook = async (mysql, section, applicant) => {
    //заполняем текущую секцию
    await updateSectionFromApplicant(mysql, section, applicant);
    //получаем старую главу, что бы получить id книги
    const resultChapter = await mysql.query(`SELECT * FROM \`chapters\` WHERE \`id\` = '${section.id_chapter}'`);
    const id_book = resultChapter[0][0].id_book;
    //Меняем статус у книги на Заверешена
    await mysql.query(`UPDATE \`books\` SET \`status\` = 'finished', \`finished_at\` = NOW() WHERE \`id\` = ${id_book};`);
    mysql.close();
};