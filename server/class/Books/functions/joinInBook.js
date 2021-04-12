import MySQL from "../../mysql";
import {HTTPStatus} from "../../HTTPStatus";
import {checkParams} from "../../unitls";
import moment from "moment";

export const joinInBook = (req, res) => {
    if (!checkParams(req, ["id_book", "id_user"])) {
        return res.status(HTTPStatus.FORBIDDEN).send({
            result: false,
            msg: "Not all params",
            msgUser: "Переданы не все обязательные параметры"
        });
    }
    const mysql = new MySQL();
    mysql.query(`SELECT * FROM \`books\` WHERE \`id\` = '${req.body.id_book}';`)
        .then(result => {
            const book = result[0][0];
            mysql.query(`SELECT * FROM \`participants_in_book\` WHERE \`id_book\` = '${req.body.id_book}';`)
                .then(result => {
                    if (result[0].length < book.max_participants) {
                        mysql.query(`
                                    INSERT INTO \`participants_in_book\` (\`id_user\`, \`id_book\`) 
                                    VALUES ('${req.body.id_user}', '${req.body.id_book}')`)
                            .then(() => res.send({result: true}));
                    }
                    else {
                        res.status(HTTPStatus.FORBIDDEN).send({
                            result: false,
                            msg: "Not spot",
                            msgUser: "На данную книгу закончились свободные места, выберите другую"
                        });
                    }
                });
        });
};