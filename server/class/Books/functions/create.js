import MySQL from "../../mysql";
import {HTTPStatus} from "../../HTTPStatus";
import {checkParams} from "../../unitls";
import moment from "moment";

export const create = (req, res) => {
    let id_book;
    const mysql = new MySQL();
    createBook(req, res, mysql)
        .then(result => {
            id_book = result[0].insertId;
            createGenresOfBook(req, res, result[0].insertId, mysql);
        })
        .then(() => createChapter(id_book, mysql))
        .then(result => createSection(req, result[0].insertId, mysql))
        .then(() => {
            mysql.close();
            res.send(JSON.stringify({result: true}));
        });
};

const createBook = (req, res, mysql) => {
    if (!checkParams(req, ["name", "age_rating", "started_at", "genres"])) {
        return res.status(HTTPStatus.FORBIDDEN).send({
            result: false,
            msg: "Not all params",
            msgUser: "Переданы не все обязательные параметры"
        });
    }
    return mysql.query(`
        INSERT INTO \`books\` (\`name\`, \`age_rating\`, \`created_type\`, \`started_at\`, \`status\`) 
        VALUES ('${req.body.name}', '${req.body.age_rating}', 'auto', '${req.body.started_at}', 'created')`)
};

const createGenresOfBook = (req, res, id_book, mysql) => {
    let query = `INSERT INTO \`genres_of_books\` (\`id_book\`, \`id_genre\`) VALUES `;
    req.body.genres.map((id_genre, i) => {
        query += `('${id_book}', '${id_genre}')${(i + 1) === req.body.genres.length ? ";" : ","}`;
    });

    return mysql.query(query);
};

const createChapter = (id_book, mysql) => {
    return mysql.query(`INSERT INTO \`chapters\` (\`id_book\`, \`number\`) VALUES ('${id_book}', '1');`);
};

const createSection = (req, id_chapter, mysql) => {
    return mysql.query(`
        INSERT INTO \`sections\` (\`id_chapter\`, \`number\`, \`finished_at\`) 
        VALUES ('${id_chapter}', '1', '${moment(req.body.started_at).add(2, "days").format("YYYY-MM-DD HH:mm")}');
    `);
};