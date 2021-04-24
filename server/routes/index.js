import {getAllBookWithoutNotStarted} from "../class/Books/functions/getAllBookWithoutNotStarted";

export const ROUTS = {
    MAIN: {
        index: "/"
    },
    USER: {
        index: "/user",
        main: "/",
        login: "/login",
        logout: "/logout",
        registration: "/registration",
        activate: "/activate",
        getActiveBooks: "/get_active_books",
    },
    BOOKS: {
        index: "/books",
        create: "/create",
        getNew: "/get_new",
        joinInBook: "/join_in_book",
        get: "/get",
        getDraftSection: "/get_draft_section",
        getApplicantsOnSection: "/get_applicants_on_section",
        getUserVoteFromSection: "/get_user_vote_from_section",
        createDraftSection: "/create_draft_section",
        updateDraftSection: "/update_draft_section",
        sendApplicant: "/send_applicant",
        sendVoteResult: "/send_vote_result",
        getAllBookWithoutNotStarted: "/get_all_book_without_not_started",
    }
};