const redirectLogin = (req, res, next) => {
    if (!req.session.userId) {
        res.redirect('/login');
    } else {
        next();
    }
}

const redirectDashboard = (req, res, next) => {
    if (req.session.userId) {
        res.redirect('/discover');
    } else {
        next();
    }
}

module.exports = {
    redirectLogin,
    redirectDashboard
}