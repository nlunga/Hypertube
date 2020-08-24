const express = require('express');
const router = express.Router();
const {redirectLogin, redirectDashboard} = require('./accessControls');
const dotenv = require('dotenv');
const fetch = require('node-fetch');

dotenv.config();

const apiKey = process.env.TMDB_API_KEY

router.get('/:id', redirectLogin, (req, res) => {
    let user = req.session;
    let popularUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&sort_by=popularity.desc&language=en-US&include_adult=false&include_video=false&page=1`;
    let latestUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&language=en-US&sort_by=popularity.desc&certification_country=US&include_adult=false&include_video=false&page=1&primary_release_year=2020`

    fetch(popularUrl)
        .then(response => response.json())
        .then(dat => {
            dat.results.forEach((item, index, array) => {
                if (item.id == req.params.id) {
                    console.log("It should work")
                    res.render('pages/title',{
                        title: item.title,
                        data: user,
                        // popular: dat.results
                        mediaInfo: item
                    })
                    // return 0;
                }
            });
        })
});

module.exports = router;