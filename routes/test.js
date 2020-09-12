const express = require('express');
const router = express.Router();
const {redirectLogin, redirectDashboard} = require('./accessControls');
const dotenv = require('dotenv');
const fetch = require('node-fetch');
const fs = require('fs');
const { movieGenres, tvGenres } = require('../genreId');
const { SanitizersImpl } = require('express-validator/src/chain');

dotenv.config();

const apiKey = process.env.TMDB_API_KEY

router.get('/', redirectLogin, (req, res) => {
    let user = req.session;
    res.render('pages/test', {
        title: "test",
        data: user
    })
});

router.get('/video', redirectLogin, (req, res) => {
    const path = 'C:\\Users\\User\\Desktop\\Hypertube\\public\\assets\\videos\\Placeholder Video.mp4';
    const stat = fs.statSync(path);
    console.log(stat);
    const fileSize = stat.size;
    const range = req.headers.range;
    console.log("This is range " + range);

    if (range) {
        const parts = range.replace(/bytes=/, "").split("-");
        console.log(parts);
        const start = parseInt(parts[0], 10);
        console.log("start " + start);
        const end = parts[1] ? parseInt(parts[1], 10) : fileSize-1;
        console.log("end " + end);

        const chunksize = (end-start)+1;
        const file = fs.createReadStream(path, {start, end});
        const head = {
            'Content-Range': `bytes ${start}-${end}/${fileSize}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': chunksize,
            'Content-Type': 'video/mp4',
        }

        res.writeHead(206, head)
        file.pipe(res)
    } else {
        const head = {
            'Content-Length': fileSize,
            'Content-Type': 'video/mp4',
        }
        res.writeHead(200, head)
        fs.createReadStream(path).pipe(res)
    }
})

module.exports = router;