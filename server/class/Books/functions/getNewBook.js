import MySQL from "../../mysql";
import "core-js/stable";
import "regenerator-runtime/runtime";
import MySQLPool from "../../mysqlPool";
import _orderBy from 'lodash/orderBy';
import moment from 'moment';

export const getNewBook = async (req, res) => {
    const mysql = new MySQL();
    const mysqlPoll = new MySQLPool();
    const results = await mysql.query(`SELECT 
        \`books\`.\`id\`, 
        \`books\`.\`name\`, 
        \`books\`.\`age_rating\`, 
        \`books\`.\`max_participants\`, 
        \`books\`.\`started_at\`, 
        \`books\`.\`status\`, 
        COUNT(*) AS \`chapter_count\` 
    FROM 
        \`books\` INNER JOIN \`chapters\` ON \`books\`.\`id\` = \`chapters\`.\`id_book\`
    WHERE 
        \`books\`.\`started_at\` > NOW() 
    GROUP BY 
        \`chapters\`.\`id_book\`
    `);
    mysql.close();
    let books = results[0];
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
    books = _orderBy(books, i => moment(i.started_at).unix());
    mysqlPoll.close();
    res.send(books);
};