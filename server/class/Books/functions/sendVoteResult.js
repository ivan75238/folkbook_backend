import "core-js/stable";
import "regenerator-runtime/runtime";
import {checkParams} from "../../unitls";
import {HTTPStatus} from "../../HTTPStatus";
import MySQL from "../../mysql";

export const sendVoteResult = async (req, res) => {
    if (!checkParams(req, ["id_applicant", "id_section", "next_is_last_in_chapter", "next_is_last_in_book"])) {
        return res.status(HTTPStatus.FORBIDDEN).send({
            result: false,
            msg: "Not all params",
            msgUser: "Переданы не все обязательные параметры"
        });
    }
    const mysql = new MySQL();
    const resultSectionVotes = await mysql.query(`SELECT * FROM \`section_votes\` WHERE \`id_section\` = '${req.body.id_section}';`);
    const id_vote = resultSectionVotes[0][0].id;
    await mysql.query(`
        INSERT INTO \`section_voting_results\` (\`id_user\`, \`id_applicant\`, \`id_vote\`, \`next_is_last_in_chapter\`, \`next_is_last_in_book\`) 
        VALUES ('${req.user.id}', '${req.body.id_applicant}', '${id_vote}', '${req.body.next_is_last_in_chapter ? 1 : 0}', '${req.body.next_is_last_in_book ? 1 : 0}')`
    );
    mysql.close();
    res.send({result: true});
};