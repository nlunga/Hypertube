const express = require('express');
const router = express.Router();
const {redirectLogin, redirectDashboard} = require('./accessControls');

router.get('/', redirectLogin, (req, res) => {
    let user = req.session;
    res.render('pages/profile', {
        title : `${user.firstname}'s Profile`,
        data: user
    });
});

module.exports = router;