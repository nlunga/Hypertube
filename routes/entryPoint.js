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

    fetch(popularUrl)
        .then(response => response.json())
        .then(dat => {
            res.render('pages/discover',{
                title: 'Entry',
                data: user,
                popular: dat.results,
                isMovie: true,
                discMovie: false,
                pageNo: dat.page,
                totalPages: dat.total_pages
            })
        })
});

router.get('/movies', redirectLogin, (req, res) => {
    let user = req.session;
    let popularUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&sort_by=popularity.desc&language=en-US&include_adult=false&include_video=false&page=1`;
    let latestUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&language=en-US&sort_by=popularity.desc&certification_country=US&include_adult=false&include_video=false&page=1&primary_release_year=2020`

    fetch(popularUrl)
        .then(response => response.json())
        .then(dat => {
            res.render('pages/discover',{
                title: 'Entry',
                data: user,
                popular: dat.results,
                isMovie: true,
                discMovie: true,
                pageNo: dat.page,
                totalPages: dat.total_pages
            })
        })
});

router.get('/tv', redirectLogin, (req, res) => {
    let user = req.session;
    let popularUrl = `https://api.themoviedb.org/3/discover/tv?api_key=${apiKey}&sort_by=popularity.desc&language=en-US&include_adult=false&include_video=false&page=1`;
    let latestUrl = `https://api.themoviedb.org/3/discover/tv?api_key=${apiKey}&language=en-US&sort_by=popularity.desc&certification_country=US&include_adult=false&include_video=false&page=1&primary_release_year=2020`

    fetch(popularUrl)
        .then(response => response.json())
        .then(dat => {
            // console.log(dat.results[0].name);
            res.render('pages/discover',{
                title: 'Entry',
                data: user,
                popular: dat.results,
                isMovie: false,
                pageNo: dat.page,
                totalPages: dat.total_pages
            })
        })
});

router.get('/:pageNo', redirectLogin, (req, res) => {
    let user = req.session;
    let page = req.params.pageNo.split('page=');
    let no = page[1];
    let popularUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&sort_by=popularity.desc&language=en-US&include_adult=false&include_video=false&page=${no}`;
    let latestUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&language=en-US&sort_by=popularity.desc&certification_country=US&include_adult=false&include_video=false&page=${no}&primary_release_year=2020`

    fetch(popularUrl)
        .then(response => response.json())
        .then(dat => {
            res.render('pages/discover',{
                title: 'Entry',
                data: user,
                popular: dat.results,
                isMovie: true,
                discMovie: false,
                pageNo: dat.page,
                totalPages: dat.total_pages
            })
        })
});

router.get('/movies/:pageNo', redirectLogin, (req, res) => {
    let user = req.session;
    let page = req.params.pageNo.split('page=');
    let no = page[1];
    let popularUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&sort_by=popularity.desc&language=en-US&include_adult=false&include_video=false&page=${no}`;
    let latestUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&language=en-US&sort_by=popularity.desc&certification_country=US&include_adult=false&include_video=false&page=${no}&primary_release_year=2020`
    
    fetch(popularUrl)
        .then(response => response.json())
        .then(dat => {
            res.render('pages/discover',{
                title: 'Entry',
                data: user,
                popular: dat.results,
                isMovie: true,
                discMovie: true,
                pageNo: dat.page,
                totalPages: dat.total_pages
            })
        })
});

router.get('/tv/:pageNo', redirectLogin, (req, res) => {
    let user = req.session;
    let page = req.params.pageNo.split('page=');
    let no = page[1];
    let popularUrl = `https://api.themoviedb.org/3/discover/tv?api_key=${apiKey}&sort_by=popularity.desc&language=en-US&include_adult=false&include_video=false&page=${no}`;
    let latestUrl = `https://api.themoviedb.org/3/discover/tv?api_key=${apiKey}&language=en-US&sort_by=popularity.desc&certification_country=US&include_adult=false&include_video=false&page=${no}&primary_release_year=2020`
    
    fetch(popularUrl)
        .then(response => response.json())
        .then(dat => {
            res.render('pages/discover',{
                title: 'Entry',
                data: user,
                popular: dat.results,
                isMovie: false,
                pageNo: dat.page,
                totalPages: dat.total_pages
            })
        })
});

module.exports = router;