export const logout = (req, res) => {
    req.logOut();
    res.send({result: true});
};