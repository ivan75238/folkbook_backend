import {checkCreateVotes} from "./checkCreateVotes";

export const cronStart = () => {
    checkCreateVotes();
};

