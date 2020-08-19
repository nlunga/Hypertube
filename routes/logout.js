const express = require('express');
const router = express.Router();
const {redirectLogin, redirectDashboard} = require('./accessControls');

router.get('/', redirectLogin,  (req, res) => {
    req.session.destroy( (err) => {
        if (err) return res.redirect('/test');
        // res.clearCookie(SESS_NAME);
        res.clearCookie('sid');
        res.redirect('/login')
    });
});

module.exports = router;