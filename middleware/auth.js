export const ensureAuthenticated = (req, res, next) => {
    if(!req.isAuthenticated()){
        res.json({'msg': "Please log in to view this resource"});
    }
    return next();
}