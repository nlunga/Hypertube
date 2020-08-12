const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.end(`Fix the logout function`);
});

module.exports = router;