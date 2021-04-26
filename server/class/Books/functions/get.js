import MySQL from "../../mysql";
import "core-js/stable";
import "regenerator-runtime/runtime";
import MySQLPool from "../../mysqlPool";
import {checkGetParams} from "../../unitls";
import {HTTPStatus} from "../../HTTPStatus";

export const get = async (req, res) => {
    if (!checkGetParams(req, ["id_book"])) {
        return res.status(HTTPStatus.FORBIDDEN).send({
            result: false,
            msg: "Not all params",
            msgUser: "Переданы не все обязательные параметры"
        });
    }
    let books = [];
    let book = null;
    const mysql = new MySQL();
    mysql.query(`SELECT 
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
        \`books\`.\`id\` = ${req.query.id_book} 
    GROUP BY 
        \`chapters\`.\`id_book\`
    `)
        .then(async results => {
            books = results[0];
            if (books.length === 0) {
                mysql.close();
                return res.status(HTTPStatus.FORBIDDEN).send({
                    result: false,
                    msg: "Not all params",
                    msgUser: "Книга не найдена"
                });
            }
            book = books[0];
            const resultsGenres = await mysql.query(`
                SELECT 
                    \`genres_of_books\`.\`id_book\`, 
                    \`genres\`.\`title\` 
                FROM \`genres_of_books\` INNER JOIN \`genres\` ON \`genres_of_books\`.\`id_genre\` = \`genres\`.\`id\` 
                WHERE \`genres_of_books\`.\`id_book\` = '${book.id}';`
            );
            book.genres = resultsGenres[0].map(p => p.title);
            const resultParticipants = await mysql.query(`SELECT * FROM \`participants_in_book\` WHERE \`id_book\` = '${book.id}';`);
            book.participants = resultParticipants[0].map(p => p.id_user);
            const resultChapters = await mysql.query(`SELECT * FROM \`chapters\` WHERE \`id_book\` = '${book.id}';`);
            book.chapters = resultChapters[0].map(p => ({
                id: p.id,
                number: p.number,
                sections: []
            }));
            const mysqlPoll = new MySQLPool();
            const resultSections = await Promise.all(
                book.chapters.map(chapter => mysqlPoll.query(`SELECT * FROM \`sections\` WHERE \`id_chapter\` = '${chapter.id}';`))
            );
            resultSections.forEach(([rows]) => {
                if (rows.length) {
                    const index = book.chapters.findIndex(i => i.id === rows[0].id_chapter);
                    if (index > -1) {
                        book.chapters[index].sections = rows;
                    }
                }
            });
            book.likes = (await mysql.query(`SELECT \`id_user\` FROM \`liked_books\` WHERE \`id_book\` = ${req.query.id_book}`))[0];
            book.likes = book.likes.map(i => i.id_user);
            mysql.close();
            mysqlPoll.close();
            res.send(book)
        })
};