import MySQL from "../../mysql";

export const login = (req, res) => {
    new MySQL().queryFull(`SELECT \`id\`,\`is_active\`, \`username\`, \`created_at\`, \`nickname\` FROM \`users\` WHERE \`username\` = '${req.body.username}'`,
    (results) => {
        if (!results[0].is_active) {
            return res.send({
                result: false,
                msgUser: "Учетная запись не активирована. На указанный email было отправленно письмо с инструкцией по активации"
            })
        }
        res.send(results[0]);
    });
};