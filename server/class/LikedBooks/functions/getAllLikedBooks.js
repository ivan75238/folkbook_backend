import MySQL from "../../mysql";
import {HTTPStatus} from "../../HTTPStatus";
import {checkGetParams} from "../../unitls";
import MySQLPool from "../../mysqlPool";

export const getAllLikedBooks = async (req, res) => {
    if (!checkGetParams(req, ["page", "count_on_page"])) {
        return res.status(HTTPStatus.FORBIDDEN).send({
            result: false,
            msg: "Not all params",
            msgUser: "Переданы не все обязательные параметры"
        });
    }
    const mysql = new MySQL();
    const mysqlPoll = new MySQLPool();
    const firstItemIndex = (req.query.page - 1) * req.query.count_on_page;
    const results = await mysql.query(`
        SELECT 
            \`books\`.\`id\`, 
            \`books\`.\`name\`, 
            \`books\`.\`age_rating\`, 
            \`books\`.\`max_participants\`, 
            \`books\`.\`started_at\`, 
            \`books\`.\`status\`, 
            COUNT(*) AS \`chapter_count\`,
            max(\`chapters\`.\`id\`) AS \`last_chapter_id\`
        FROM 
            \`liked_books\` INNER JOIN \`books\` ON \`liked_books\`.\`id_book\` = \`books\`.\`id\`
            INNER JOIN \`chapters\` ON \`chapters\`.\`id_book\` = \`books\`.\`id\`
        WHERE 
            \`liked_books\`.\`id_user\` = '${req.user.id}'
        GROUP BY 
            \`chapters\`.\`id_book\`
        LIMIT ${firstItemIndex},${req.query.count_on_page}
    `);
    const allCount = (await mysql.query(`SELECT COUNT(*) AS \`count\` FROM \`books\` WHERE \`books\`.\`status\` <> 'created'`))[0][0].count;
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
    res.send({ allCount, books });
};
