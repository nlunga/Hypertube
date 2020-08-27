const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const {redirectLogin, redirectDashboard} = require('./accessControls');
const dotenv = require('dotenv');
const fetch = require('node-fetch');

dotenv.config();

const apiKey = process.env.TMDB_API_KEY


router.post('/movies', [
    check('movie')
        .not().isEmpty().withMessage('movie title is required')
        .trim()
        .escape()
    ], (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()){
            console.log(errors);
            return res.status(422).json({errors : errors.array()});
        }else {
            let user = req.session;
            //let queryString = encodeURI(req.body.movie);
            let queryString = req.body.movie;
            
            let searchMovieUrl = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&language=en-US&query=${queryString}&page=1&include_adult=false`;
            
            fetch(searchMovieUrl)
                .then(response => response.json())
                .then(dat => {
                    res.render('pages/searchResults',{
                        title: 'Search Results',
                        data: user,
                        popular: dat.results,
                        isMovie: true,
                        searchFor: queryString,
                        pageNo: dat.page,
                        totalPages: dat.total_pages
                    })
                })
        }
});


router.post('/tv', [
    check('tvSeries')
        .not().isEmpty().withMessage('Tv series name is required')
        .trim()
        .escape()
    ], (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()){
            console.log(errors);
            return res.status(422).json({errors : errors.array()});
        }else {
            let user = req.session;
            let queryString = encodeURI(req.body.tvSeries);
            let searchTvUrl = `https://api.themoviedb.org/3/search/tv?api_key=${apiKey}&language=en-US&page=1&query=${queryString}&include_adult=false`;
            
            fetch(searchTvUrl)
                .then(response => response.json())
                .then(dat => {
                    res.render('pages/searchResults',{
                        title: 'Search Results',
                        data: user,
                        popular: dat.results,
                        isMovie: false,
                        searchFor: queryString,
                        pageNo: dat.page,
                        totalPages: dat.total_pages
                    })
                })
        }
});

router.get('/:category/:queryString/:pageNo', (req, res) => {
    let user = req.session;
    let page = req.params.pageNo.split('page=');
    let pageNo = page[1];
    let queryString = req.params.queryString;
    let category = req.params.category;
    
    let searchMovieUrl = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&language=en-US&query=${queryString}&page=${pageNo}&include_adult=false`;
    let searchTvUrl = `https://api.themoviedb.org/3/search/tv?api_key=${apiKey}&language=en-US&page=${pageNo}&query=${queryString}&include_adult=false`;

    if (category == 'movies') {
        fetch(searchMovieUrl)
            .then(response => response.json())
            .then(dat => {
                res.render('pages/searchResults',{
                    title: 'Search Results',
                    data: user,
                    popular: dat.results,
                    isMovie: true,
                    searchFor: queryString,
                    pageNo: dat.page,
                    totalPages: dat.total_pages
                })
            })
    } else {
        fetch(searchTvUrl)
            .then(response => response.json())
            .then(dat => {
                res.render('pages/searchResults',{
                    title: 'Search Results',
                    data: user,
                    popular: dat.results,
                    isMovie: false,
                    searchFor: queryString,
                    pageNo: dat.page,
                    totalPages: dat.total_pages
                })
            })
    }
});


module.exports = router;