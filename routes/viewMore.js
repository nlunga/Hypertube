const express = require('express');
const router = express.Router();
const {redirectLogin, redirectDashboard} = require('./accessControls');
const dotenv = require('dotenv');
const fetch = require('node-fetch');
const { movieGenres, tvGenres } = require('../genreId');

dotenv.config();

const apiKey = process.env.TMDB_API_KEY

router.get('/:pageNo/:id', redirectLogin, (req, res) => {
    let user = req.session;
    let pageNo = req.params.pageNo;

    let popularUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&sort_by=popularity.desc&language=en-US&include_adult=false&include_video=false&page=${pageNo}`;
    let latestUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&language=en-US&sort_by=popularity.desc&certification_country=US&include_adult=false&include_video=false&page=${pageNo}&primary_release_year=2020`

    fetch(popularUrl)
        .then(response => response.json())
        .then(dat => {
            var genres = movieGenres;
            dat.results.forEach((item, index, array) => {
                if (item.id == req.params.id) {
                    res.render('pages/title',{
                        title: item.name,
                        data: user,
                        // popular: dat.results
                        mediaInfo: item,
                        genresName: genres,
                        isMovie: true
                    })
                    // return 0;
                }
            });
        })
});

router.get('/movies/:pageNo/:id', redirectLogin, (req, res) => {
    let user = req.session;
    let pageNo = req.params.pageNo;
    
    let popularUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&sort_by=popularity.desc&language=en-US&include_adult=false&include_video=false&page=${pageNo}`;
    let latestUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&language=en-US&sort_by=popularity.desc&certification_country=US&include_adult=false&include_video=false&page=${pageNo}&primary_release_year=2020`

    fetch(popularUrl)
        .then(response => response.json())
        .then(dat => {
            var genres = movieGenres;
            dat.results.forEach((item, index, array) => {
                if (item.id == req.params.id) {
                    res.render('pages/title',{
                        title: item.title,
                        data: user,
                        // popular: dat.results
                        mediaInfo: item,
                        genresName: genres,
                        isMovie: true
                    })
                    // return 0;
                }
            });
        })
});

router.get('/tv/:pageNo/:id', redirectLogin, (req, res) => {
    let user = req.session;
    let pageNo = req.params.pageNo;
    
    let popularUrl = `https://api.themoviedb.org/3/discover/tv?api_key=${apiKey}&sort_by=popularity.desc&language=en-US&include_adult=false&include_video=false&page=${pageNo}`;
    let latestUrl = `https://api.themoviedb.org/3/discover/tv?api_key=${apiKey}&language=en-US&sort_by=popularity.desc&certification_country=US&include_adult=false&include_video=false&page=${pageNo}&primary_release_year=2020`

    fetch(popularUrl)
        .then(response => response.json())
        .then(dat => {
            var genres = tvGenres;
            dat.results.forEach((item, index, array) => {
                if (item.id == req.params.id) {
                    res.render('pages/title',{
                        title: item.title,
                        data: user,
                        // popular: dat.results
                        mediaInfo: item,
                        genresName: genres,
                        isMovie: false
                    })
                    // return 0;
                }
            });
        })
});

router.get('/s/:category/:queryString/:id', redirectLogin, (req, res) => {
    let user = req.session;
    let category = req.params.category;
    let queryString = req.params.queryString;

    let searchMovieUrl = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&language=en-US&query=${queryString}&page=1&include_adult=false`;
    let searchTvUrl = `https://api.themoviedb.org/3/search/tv?api_key=${apiKey}&language=en-US&page=1&query=${queryString}&include_adult=false`;
    if (category === 'movies') {
        fetch(searchMovieUrl)
            .then(response => response.json())
            .then(dat => {
                var genres = tvGenres;
                dat.results.forEach((item, index, array) => {
                    if (item.id == req.params.id) {
                        res.render('pages/title',{
                            title: item.title,
                            data: user,
                            mediaInfo: item,
                            genresName: genres,
                            isMovie: true
                        })
                    }
                });
            })
    }else {
        fetch(searchTvUrl)
            .then(response => response.json())
            .then(dat => {
                var genres = tvGenres;
                dat.results.forEach((item, index, array) => {
                    if (item.id == req.params.id) {
                        res.render('pages/title',{
                            title: item.title,
                            data: user,
                            // popular: dat.results
                            mediaInfo: item,
                            genresName: genres,
                            isMovie: false
                        })
                        // return 0;
                    }
                });
            })
    }
    
});

router.get('/s/:category/:queryString/:pageNo/:id', redirectLogin, (req, res) => {
    let user = req.session;
    let pageNo = req.params.pageNo;
    let category = req.params.category;
    let queryString = req.params.queryString;

    let searchMovieUrl = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&language=en-US&query=${queryString}&page=${pageNo}&include_adult=false`;
    let searchTvUrl = `https://api.themoviedb.org/3/search/tv?api_key=${apiKey}&language=en-US&page=${pageNo}&query=${queryString}&include_adult=false`;
    if (category === 'movies') {
        fetch(searchMovieUrl)
            .then(response => response.json())
            .then(dat => {
                var genres = tvGenres;
                dat.results.forEach((item, index, array) => {
                    if (item.id == req.params.id) {
                        res.render('pages/title',{
                            title: item.title,
                            data: user,
                            // popular: dat.results
                            mediaInfo: item,
                            genresName: genres,
                            isMovie: true
                        })
                        // return 0;
                    }
                });
            })
    }else {
        fetch(searchTvUrl)
            .then(response => response.json())
            .then(dat => {
                var genres = tvGenres;
                dat.results.forEach((item, index, array) => {
                    if (item.id == req.params.id) {
                        res.render('pages/title',{
                            title: item.title,
                            data: user,
                            // popular: dat.results
                            mediaInfo: item,
                            genresName: genres,
                            isMovie: false
                        })
                        // return 0;
                    }
                });
            })
    }
    
});

module.exports = router;