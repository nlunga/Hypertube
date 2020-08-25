const express = require('express');
const router = express.Router();
const {redirectLogin, redirectDashboard} = require('./accessControls');
const dotenv = require('dotenv');
const fetch = require('node-fetch');

dotenv.config();

const apiKey = process.env.TMDB_API_KEY

router.get('/', redirectLogin, (req, res) => {
    let user = req.session;
    let popularUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&sort_by=popularity.desc&language=en-US&include_adult=false&include_video=false&page=1`;
    let latestUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&language=en-US&sort_by=popularity.desc&certification_country=US&include_adult=false&include_video=false&page=1&primary_release_year=2020`
    /* fetch(popularUrl)
        .then(response => response.json())
        .then(dat => {
            return fetch(latestUrl)
        })
        .then(response => response.json())
        .then(info => {
            console.log(dat)
            res.render('pages/test',{
                title: 'Entry',
                data: user,
                popular: dat,
                latest: info
            })
        })
        .catch(err => console.error(err)); */
    fetch(popularUrl)
        .then(response => response.json())
        .then(dat => {
            // console.log(dat.results[0].release_date);
            // var mydate = new Date(dat.results[0].release_date);
            // console.log(mydate.toDateString());
            res.render('pages/discover',{
                title: 'Entry',
                data: user,
                popular: dat.results
            })
        })
});

module.exports = router;