export const updateSectionFromApplicant = (mysql, section, applicant) => {
    mysql.query(`UPDATE \`sections\` SET \`text\` = '${applicant.text}', \`updated_at\` = NOW(), \`id_author\` = '${applicant.id_user}' WHERE \`id\` = '${section.id}';`);
};