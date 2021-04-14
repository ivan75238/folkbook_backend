export const checkParams = (req, params) => {
    let allFinded = true;
    params.map(param => {
        if (req.body[param] === null || req.body[param] === undefined )
            allFinded = false;
    });
    return allFinded;
};

export const checkGetParams = (req, params) => {
    let allFinded = true;
    params.map(param => {
        if (req.query[param] === null || req.query[param] === undefined )
            allFinded = false;
    });
    return allFinded;
};