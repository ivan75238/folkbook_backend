import MySQL from "../../mysql";

export const getUser = (req, res) => {
    new MySQL().queryFull(`SELECT \`id\`, \`username\`, \`created_at\`, \`nickname\` FROM \`users\` WHERE \`username\` = '${req.user.username}'`,
        (results) => {
            res.send(JSON.stringify(results[0]));
        });
};