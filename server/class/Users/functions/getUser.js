import MySQL from "../../mysql";

export const getUser = async (req, res) => {
    const mysql = new MySQL();
    const results = await mysql.query(`SELECT \`id\`, \`username\`, \`created_at\`, \`nickname\` FROM \`users\` WHERE \`username\` = '${req.user.username}'`);
    mysql.close();
    res.send(JSON.stringify(results[0]));
};