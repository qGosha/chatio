const loggedIn = (req, res, next) => {
    if (req.user) {
        next();
    } else {
        return res.send(null);
    }
}

module.exports = loggedIn;
