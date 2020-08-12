const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('pages/login', {
        title : "Login"
    });
});

router.post('/', (req, res) => {
    // console.log(req.body);
});

module.exports = router;