import {HTTPStatus} from "../HTTPStatus";


export const authenticationMiddleware = () => {
    return (req, res, next) => {
        if (!req.isAuthenticated()) {
            return res.status(HTTPStatus.UNAUTHORIZED)
                .send({
                    result: false,
                    msg: "Not auth",
                    msgUser: "Пользоватль не авторизован"
                });
        }
        next();
    }
};