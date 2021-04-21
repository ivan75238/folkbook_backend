import {checkCreateVotes} from "./checkCreateVotes";
import {checkVoteResults} from "./checkVoteResults";

export const cronStart = () => {
    checkCreateVotes();
    checkVoteResults();
};

