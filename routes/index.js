const express = require('express');
const router = express.Router();
const {redirectLogin, redirectDashboard} = require('./accessControls');

router.get('/', redirectDashboard, (req, res) => {
    let user = req.session;
    res.render('pages/index', {
        title : "Hypertube",
        data: user
    });
})


router.get('/index', redirectDashboard,(req, res) => {
    let user = req.session;
    res.render('pages/index', {
        title : "Hypertube",
        data: user
    });
})
module.exports = router;