import MySQL from "../../mysql";
import moment from "moment";

export const checkVoteStart = async id_section => {
    const mysql = new MySQL();
    const result = await mysql.query(`SELECT * FROM \`sections\` WHERE \`id\` = '${id_section}';`);
    mysql.close();
    return moment().isAfter(moment(result[0][0].finished_at));
};