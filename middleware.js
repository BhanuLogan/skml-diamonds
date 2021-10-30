exports.requireLogin = (req, res, next) => {
    // TODO - we need to authorize
    console.log("Middleware");
    return next();
}