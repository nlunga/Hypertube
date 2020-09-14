const express = require('express');
const router = express.Router();
const {redirectLogin, redirectDashboard} = require('./accessControls');
const dotenv = require('dotenv');
const {conInit, con } = require('../config/connection');
const fs = require('fs');
const { movieGenres, tvGenres } = require('../genreId');

router.get('/:username', (req, res) => {
    con.query(`SELECT * FROM users WHERE username = '${req.params.username}' LIMIT 1`, (err, result) => {
        if (err) throw err;
        if (result.length !== 0) {
            con.query(`SELECT * FROM images WHERE username = '${req.params.username}' LIMIT 1`, (err, tableVal) => {
                
                if (err) throw err;
                if (tableVal.length === 0) {
                    var image = undefined;
                    let user = req.session;
                    res.render('pages/viewProfile', {
                        title: `${req.params.usernam}'s Profile`,
                        data: user,
                        userData: result[0],
                        imageData: image,
                        isMovie: true
                    })
                }else {
                    var image = tableVal[0].imagePath;
                    let user = req.session;
                    res.render('pages/viewProfile', {
                        title: `${req.params.usernam}'s Profile`,
                        data: user,
                        userData: result[0],
                        imageData: image,
                        isMovie: true
                    })
                }
    
                return ;
            });
        }
    });
});

module.exports = router;