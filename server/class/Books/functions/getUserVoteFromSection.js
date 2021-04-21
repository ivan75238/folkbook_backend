import "core-js/stable";
import "regenerator-runtime/runtime";
import {checkGetParams} from "../../unitls";
import {HTTPStatus} from "../../HTTPStatus";
import MySQL from "../../mysql";

export const getUserVoteFromSection = async (req, res) => {
    if (!checkGetParams(req, ["id_section"])) {
        return res.status(HTTPStatus.FORBIDDEN).send({
            result: false,
            msg: "Not all params",
            msgUser: "Переданы не все обязательные параметры"
        });
    }
    const mysql = new MySQL();

    const resultSectionVotes = await mysql.query(`SELECT * FROM \`section_votes\` WHERE \`id_section\` = '${req.query.id_section}';`);
    let isVoted = false;
    if (resultSectionVotes[0].length > 0) {
        const id_vote = resultSectionVotes[0][0].id;
        const resultVotingResults = await mysql.query(`SELECT * FROM \`section_voting_results\` WHERE \`id_vote\` = '${id_vote}' AND \`id_user\` = '${req.user.id}';`);
        isVoted = resultVotingResults[0].length;
    }
    res.send({isVoted});
};