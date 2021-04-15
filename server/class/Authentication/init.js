import MySQL from "../mysql";

export const findUser =  (username, callback) => {
    new MySQL().queryFull(`SELECT \`id\`, \`username\`, \`is_active\`, \`password\` FROM \`users\` WHERE \`username\` = '${username}'`,
        async results =>  {
        if (results.length && results[0].username === username) {
            return callback(null, results[0])
        }
        return callback(null)
    });
}