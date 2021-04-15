import MySQL from "../../mysql";

export const login = (req, res) => {
    new MySQL().queryFull(`SELECT \`id\`,\`is_active\`, \`username\`, \`created_at\`, \`nickname\` FROM \`users\` WHERE \`username\` = '${req.body.username}'`,
    async (results) => {
        res.send(results[0]);
    });
};