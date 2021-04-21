import {checkCreateVotes} from "./checkCreateVotes";
import {checkVoteResults} from "./checkVoteResults";
import {updateCreatedBookToInWork} from "./updateCreatedBookToInWork";

export const cronStart = () => {
    checkCreateVotes();
    checkVoteResults();
    updateCreatedBookToInWork();
};

