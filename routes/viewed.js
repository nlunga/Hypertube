const express = require('express');
const router = express.Router();
const {redirectLogin, redirectDashboard} = require('./accessControls');
const {conInit, con } = require('../config/connection');
const dotenv = require('dotenv');
const fetch = require('node-fetch');
const { compareSync } = require('bcrypt');

dotenv.config();

const apiKey = process.env.TMDB_API_KEY

router.get('/', redirectLogin, (req, res) => {
    let user = req.session;
    con.query(`SELECT * FROM viewed WHERE username = '${req.session.username}'`, (err, result) => {
        if (err) throw err;
        if (result.length === 0) {
            res.render('pages/viewed', {
                title: 'Viewed',
                data: user,
                popular: undefined,
                isMovie: true
            })
        } else {
            res.render('pages/viewed', {
                title: 'Viewed',
                data: user,
                popular: result,
                isMovie: true
            })
        }
    })
})

module.exports = router;