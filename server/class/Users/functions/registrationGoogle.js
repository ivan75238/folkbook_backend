import MySQL from "../../mysql";

export const registrationGoogle = async (req, res) => {
    const mysql = new MySQL();
    await mysql.query(`
        INSERT INTO \`users\` (\`username\`, \`password\`, \`nickname\`, \`is_active\`, \`provider\`) 
        VALUES ('${req.body.username}', '${req.body.password}', '${req.body.first_name} ${req.body.last_name}', '1', 'google');`
    );
    mysql.close();
    return res.send({result: true});
};