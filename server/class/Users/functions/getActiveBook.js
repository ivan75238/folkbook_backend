import MySQL from "../../mysql";
import "core-js/stable";
import "regenerator-runtime/runtime";
import MySQLPool from "../../mysqlPool";
import _orderBy from 'lodash/orderBy';
import moment from 'moment';

export const getActiveBook = async (req, res) => {
    const mysql = new MySQL();
    const results = await mysql.query(`SELECT 
        \`books\`.\`id\`, 
        \`books\`.\`name\`, 
        \`books\`.\`age_rating\`, 
        \`books\`.\`max_participants\`, 
        \`books\`.\`started_at\`, 
        \`books\`.\`status\`,
        COUNT(*) AS \`chapter_count\`,
        max(\`chapters\`.\`number\`) AS \`last_chapter_number\`,
        max(\`chapters\`.\`id\`) AS \`last_chapter_id\`
    FROM 
        \`participants_in_book\` INNER JOIN \`books\` ON \`books\`.\`id\` = \`participants_in_book\`.\`id_book\`
        INNER JOIN \`chapters\` ON \`books\`.\`id\` = \`chapters\`.\`id_book\`
    WHERE 
        \`participants_in_book\`.\`id_user\` = '${req.user.id}' AND 
        \`books\`.\`status\` = 'in_work'
    GROUP BY 
        \`chapters\`.\`id_book\`
    `);
    mysql.close();
    let books = results[0];
    const mysqlPoll = new MySQLPool();
    const resultGenres = await Promise.all(
        books.map(book => mysqlPoll.query(`
            SELECT 
                \`genres_of_books\`.\`id_book\`, 
                \`genres\`.\`title\` 
            FROM \`genres_of_books\` INNER JOIN \`genres\` ON \`genres_of_books\`.\`id_genre\` = \`genres\`.\`id\` 
            WHERE \`genres_of_books\`.\`id_book\` = '${book.id}';`
        ))
    );
    resultGenres.forEach(([rows]) => {
        if (rows.length) {
            const index = books.findIndex(i => i.id === rows[0].id_book);
            if (index > -1) {
                books[index].genres = rows.map(p => p.title);
            }
        }
    });
    const resultParticipants = await Promise.all(
        books.map(book => mysqlPoll.query(`SELECT * FROM \`participants_in_book\` WHERE \`id_book\` = '${book.id}';`))
    );
    resultParticipants.forEach(([rows]) => {
        if (rows.length) {
            const index = books.findIndex(i => i.id === rows[0].id_book);
            if (index > -1) {
                books[index].participants = rows.map(p => p.id_user);
            }
        }
    });
    const resultSections = await Promise.all(
        books.map(book => mysqlPoll.query(`
            SELECT \`sections\`.* 
            FROM \`sections\` INNER JOIN \`chapters\` ON \`sections\`.\`id_chapter\` = \`chapters\`.\`id\` 
            WHERE \`chapters\`.\`id\` = '${book.last_chapter_id}';`
        ))
    );
    resultSections.forEach(([rows]) => {
        if (rows.length) {
            const index = books.findIndex(i => i.last_chapter_id === rows[0].id_chapter);
            if (index > -1) {
                rows = _orderBy(rows, i => i.number, "desc");
                books[index].last_section = rows[0];
            }
        }
    });
    mysqlPoll.close();
    books = _orderBy(books, i => moment(i.started_at).unix());
    res.send(books)
};