import MySQL from "../mysql";

// Generate Password
/*const saltRounds = 10;
const myPlaintextPassword = 'secret';
const salt = bcrypt.genSaltSync(saltRounds);
const passwordHash = bcrypt.hashSync(myPlaintextPassword, salt);*/

export function findUser (username, callback) {
    new MySQL().queryFull(`SELECT \`id\`, \`username\`, \`password\` FROM \`users\` WHERE \`username\` = '${username}'`,
        (results) =>  {
        if (results.length && results[0].username === username) {
            return callback(null, results[0])
        }
        return callback(null)
    });
}