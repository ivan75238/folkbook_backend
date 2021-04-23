import MySQL from "../../mysql";
import {HTTPStatus} from "../../HTTPStatus";
import {checkParams} from "../../unitls";
import moment from 'moment';

const ADD_COUNT_DAY = 2;

export const joinInBook = async (req, res) => {
    if (!checkParams(req, ["id_book", "id_user"])) {
        return res.status(HTTPStatus.FORBIDDEN).send({
            result: false,
            msg: "Not all params",
            msgUser: "Переданы не все обязательные параметры"
        });
    }
    const mysql = new MySQL();
    let result = await mysql.query(`SELECT * FROM \`books\` WHERE \`id\` = '${req.body.id_book}';`);
    const book = result[0][0];
    result = await mysql.query(`SELECT * FROM \`participants_in_book\` WHERE \`id_book\` = '${req.body.id_book}';`);
    if (result[0].length < book.max_participants) {
        await mysql.query(`INSERT INTO \`participants_in_book\` (\`id_user\`, \`id_book\`) VALUES ('${req.body.id_user}', '${req.body.id_book}')`);
        //Если участник последний, то передвигаем начало книги на ближайшее время
        const started_at = moment(book.started_at);
        //Если между датой старта и текущей датой меньше часа, то не трогаем ничего
        //Иначе передвинем на ближйший час
        if (moment().diff(started_at, 'hours') > 1) {
            const new_started_at = moment().add(1, "h").set({minute: 0, second: 0}).format("YYYY-MM-DD HH:mm:ss");
            await mysql.query(`UPDATE \`books\` SET \`started_at\` = '${new_started_at}' WHERE \`id\` = '${req.body.id_book}';`);
            const chapter = (await mysql.query(`SELECT * FROM \`chapters\` WHERE \`id_book\` = '${req.body.id_book}'`))[0][0];
            const section = (await mysql.query(`SELECT * FROM \`sections\` WHERE \`id_chapter\` = '${chapter.id}'`))[0][0];
            const vote_finished_at = moment(new_started_at).add(ADD_COUNT_DAY, "days").set({second: 0}).format("YYYY-MM-DD HH:mm:ss");
            await mysql.query(`UPDATE \`sections\` SET \`finished_at\` = '${new_started_at}', \`updated_at\` = NOW(), \`vote_finished_at\` = '${vote_finished_at}' WHERE \`id\` = '${section.id}';`);
        }
        mysql.close();
        res.send({result: true});
    }
    else {
        mysql.close();
        res.status(HTTPStatus.FORBIDDEN).send({
            result: false,
            msg: "Not spot",
            msgUser: "На данную книгу закончились свободные места, выберите другую"
        });
    }
};