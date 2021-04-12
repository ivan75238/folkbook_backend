import MySQL from "../../mysql";

export const login = (req, res) => {
    new MySQL().queryFull(`SELECT \`id\`, \`username\`, \`created_at\`, \`nickname\` FROM \`users\` WHERE \`username\` = '${req.body.username}'`,
    (results) => {
        res.send(JSON.stringify(results[0]));
    });
};