const express = require('express');
const router = express.Router();
const {redirectLogin, redirectDashboard} = require('./accessControls');
const {conInit, con } = require('../config/connection');
const dotenv = require('dotenv');
const fetch = require('node-fetch');
const Comment = require('../models/Comment');
const { movieGenres, tvGenres } = require('../genreId');
const { SanitizersImpl } = require('express-validator/src/chain');

dotenv.config();

const apiKey = process.env.TMDB_API_KEY

router.get('/:pageNo/:id', redirectLogin, async (req, res) => {
    let user = req.session;
    let pageNo = req.params.pageNo;
   
    let popularUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&sort_by=popularity.desc&language=en-US&include_adult=false&include_video=false&page=${pageNo}`;
    // let latestUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&language=en-US&sort_by=popularity.desc&certification_country=US&include_adult=false&include_video=false&page=${pageNo}&primary_release_year=2020`

    const response = await fetch(popularUrl);
    const movies = await response.json();
    
    const genres = movieGenres;

    var output = movies.results.filter(function(value){ return value.id==req.params.id;});

    let comments = await Comment.find({});
    if (!comments) return console.log('error');

    return res.render('pages/title',{
        title: output[0].title,
        data: user,
        pastComments: comments,
        isSeason: false,
        mediaInfo: output[0],
        // titleRoute: `{pageNumber=${pageNo}&movieId=${req.params.id}}`,
        titleRoute: `link=${pageNo}_${req.params.id}`,
        genresName: genres,
        isMovie: true
    });
});

router.get('/movies/:pageNo/:id', redirectLogin, async (req, res) => {
    let user = req.session;
    let pageNo = req.params.pageNo;
    
    let popularUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&sort_by=popularity.desc&language=en-US&include_adult=false&include_video=false&page=${pageNo}`;
    let latestUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&language=en-US&sort_by=popularity.desc&certification_country=US&include_adult=false&include_video=false&page=${pageNo}&primary_release_year=2020`

    const response = await fetch(popularUrl);
    const movies = await response.json();
    const genres = movieGenres;

    var output = movies.results.filter(function(value){ return value.id==req.params.id;});

    let comments = await Comment.find({});
    if (!comments) return console.log('error');

    return res.render('pages/title',{
        title: output[0].title,
        data: user,
        pastComments: comments,
        isSeason: false,
        isSeason: false,
        mediaInfo: output[0],
        // titleRoute: `{pageNumber=${pageNo}&movieId=${req.params.id}}`,
        titleRoute: `link=${pageNo}_${req.params.id}`,
        genresName: genres,
        isMovie: true
    });
});

router.get('/tv/:pageNo/:id', redirectLogin, async (req, res) => {
    let user = req.session;
    let pageNo = req.params.pageNo;
    let tvId = req.params.id;
    
    let popularUrl = `https://api.themoviedb.org/3/discover/tv?api_key=${apiKey}&sort_by=popularity.desc&language=en-US&include_adult=false&include_video=false&page=${pageNo}`;
    let tvUrl = `https://api.themoviedb.org/3/tv/${tvId}?api_key=${apiKey}&language=en-US`;

    let comments = await Comment.find({});
    if (!comments) return console.log('error');

    fetch(tvUrl)
        .then(response => response.json())
        .then( dat => {
            var genres = tvGenres;
            res.render('pages/title',{
                title: dat.name,
                data: user,
                pastComments: comments,
                isSeason: false,
                mediaInfo: dat,
                titleRoute: `pageNumber=${pageNo}&movieId=${tvId}`,
                genresName: genres,
                isMovie: false
            });
        })

        // var start = performance.now()

        // const response = await fetch(tvUrl);
        // const tvSeries = await response.json();
    
        // const genres = tvGenres;
    
        // let comments = await Comment.find({});
        // if (!comments) return console.log('error');
        // var end = performance.now()
        // console.log(`This is the time it took ${end - start} milliseconds` )
    
        // return res.render('pages/title',{
        //     title: tvSeries.name,
        //     data: user,
        //     pastComments: comments,
        //     isSeason: false,
        //     mediaInfo: tvSeries,
        //     titleRoute: `pageNumber=${pageNo}&movieId=${tvId}`,
        //     genresName: genres,
        //     isMovie: false
        // });
});

router.get('/tv/:pageNo/:id/:season/:episode', async (req, res) => {
    let user = req.session;
    let pageNo = req.params.pageNo;
    let tvId = req.params.id;
    let season = req.params.season.split('season=');
    let seasonNo = season[1];
    let episode = req.params.episode.split('episode=');
    let episodeNo = episode[1];
    if (season[1] < 10) {
        var sea = `s0${season[1]}`;
    } else {
        var sea = `s${season[1]}`;
    }

    if (episode[1] < 10) {
        var epi = `e0${episode[1]}`;
    } else {
        var epi = `e${episode[1]}`;
    }
    let tvUrl = `https://api.themoviedb.org/3/tv/${tvId}?api_key=${apiKey}&language=en-US`
    let comments = await Comment.find({});
    if (!comments) return console.log('error');
    fetch(tvUrl)
        .then(response => response.json())
        .then(dat => {
            // console.log(dat);
            var genres = tvGenres;
            res.render('pages/title',{
                title: dat.name,
                data: user,
                pastComments: comments,
                isSeason: true,
                seasonData: seasonNo,
                episodeData: episodeNo,
                seaEpi: `${sea}${epi}`,
                seaName:  `${dat.name} s${sea}e${epi}`,
                titleRoute: `pageNumber=${pageNo}&movieId=${tvId}`,
                mediaInfo: dat,
                genresName: genres,
                isMovie: false
            });
        })
})

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
                        con.query('SELECT * FROM comments', (err, results) => {
                            if (err) throw err;
                            res.render('pages/title',{
                                title: item.title,
                                data: user,
                                pastComments: results,
                                isSeason: false,
                                mediaInfo: item,
                                genresName: genres,
                                isMovie: true
                            });
                        });
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
                        con.query('SELECT * FROM comments', (err, results) => {
                            if (err) throw err;
                            res.render('pages/title',{
                                title: item.title,
                                data: user,
                                pastComments: results,
                                isSeason: false,
                                mediaInfo: item,
                                genresName: genres,
                                isMovie: false
                            });
                        });
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
                var genres = movieGenres;
                dat.results.forEach((item, index, array) => {
                    if (item.id == req.params.id) {
                        con.query('SELECT * FROM comments', (err, results) => {
                            if (err) throw err;
                            res.render('pages/title',{
                                title: item.title,
                                data: user,
                                pastComments: results,
                                isSeason: false,
                                mediaInfo: item,
                                titleRoute: `pageNumber=${pageNo}&movieId=${req.params.id}`,
                                genresName: genres,
                                isMovie: true
                            });
                        });
                    }
                });
            })
    }else {
        fetch(searchTvUrl)
            .then(response => response.json())
            .then(dat => {
                var genres = tvGenres;
                // console.log(dat);
                dat.results.forEach((item, index, array) => {
                    if (item.id == req.params.id) {
                        let tvUrl = `https://api.themoviedb.org/3/tv/${item.id}?api_key=${apiKey}&language=en-US`

                        fetch(tvUrl)
                            .then(response => response.json())
                            .then(dat => {
                                // console.log(dat);
                                var genres = tvGenres;
                                con.query('SELECT * FROM comments', (err, results) => {
                                    if (err) throw err;
                                    res.render('pages/title',{
                                        title: dat.name,
                                        data: user,
                                        pastComments: results,
                                        isSeason: false,
                                        pageData: pageNo,
                                        mediaInfo: dat,
                                        titleRoute: `pageNumber=${pageNo}&movieId=${req.params.id}`,
                                        genresName: genres,
                                        isMovie: false
                                    });
                                });
                            });
                    }
                });
            })
    }
    
});

module.exports = router;