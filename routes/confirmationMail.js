const express = require('express');
const router = express.Router();
const {conInit, con} = require('../config/connection');

router.get('/:id', /* redirectDashboard, */ (req, res) =>{
    let token = req.params.id;
    let sql = `UPDATE users SET verified = 1 WHERE token = '${token}'`;
    con.query(sql, (err, result) => {
        if (err) throw err;
        console.log(result.affectedRows + " record(s) updated");
        return res.redirect('/login');
    });
});

module.exports = router;