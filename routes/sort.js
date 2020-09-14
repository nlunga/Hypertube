const express = require('express');
const router = express.Router();
const {redirectLogin, redirectDashboard} = require('./accessControls');
const dotenv = require('dotenv');
const fetch = require('node-fetch');
const { compareSync } = require('bcrypt');

dotenv.config();

const apiKey = process.env.TMDB_API_KEY

router.post('/movie', (req, res) => {
    let user = req.session;
    // console.log(req.body);
    let sortResult = req.body.sortResults;
    let popularUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&sort_by=${sortResult}&language=en-US&include_adult=false&include_video=false&page=1`;

    fetch(popularUrl)
        .then(response => response.json())
        .then(dat => {
            if (sortResult.length === 0) {
                res.render('pages/discover',{
                    title: 'Entry',
                    data: user,
                    popular: dat.results,
                    isMovie: true,
                    discMovie: false,
                    sortTag: 'popularity.desc',
                    pageNo: dat.page,
                    totalPages: dat.total_pages
                });
            }else {
                res.render('pages/discover',{
                    title: 'Entry',
                    data: user,
                    popular: dat.results,
                    isMovie: true,
                    discMovie: false,
                    sortTag: sortResult,
                    pageNo: dat.page,
                    totalPages: dat.total_pages
                }); 
            }
        });
});

router.post('/tv', (req, res) => {
    let user = req.session;
    // console.log(req.body);
    let sortResult = req.body.sortResults;
    let popularUrl = `https://api.themoviedb.org/3/discover/tv?api_key=${apiKey}&sort_by=${sortResult}&language=en-US&include_adult=false&include_video=false&page=1`;

    fetch(popularUrl)
        .then(response => response.json())
        .then(dat => {
            if (sortResult.length === 0) {
                res.render('pages/discover',{
                    title: 'Entry',
                    data: user,
                    popular: dat.results,
                    isMovie: false,
                    sortTag: 'popularity.desc',
                    pageNo: dat.page,
                    totalPages: dat.total_pages
                });
            }else {
                res.render('pages/discover',{
                    title: 'Entry',
                    data: user,
                    popular: dat.results,
                    isMovie: true,
                    discMovie: false,
                    sortTag: sortResult,
                    pageNo: dat.page,
                    totalPages: dat.total_pages
                }); 
            }
        });
});

module.exports = router;