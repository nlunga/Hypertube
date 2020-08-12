const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('pages/index', {
        title : "Hypertube"
    });
})


router.get('/index', (req, res) => {
    res.render('pages/index', {
        title : "Hypertube"
    });
})
module.exports = router;