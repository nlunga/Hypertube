const Torrent = require('torrent-xiv');
const os = require('os');
const express = require('express');
const router = express.Router();
const {redirectLogin, redirectDashboard} = require('./accessControls');
const {conInit, con } = require('../config/connection');
const { movieGenres, tvGenres } = require('../genreId');
const dotenv = require('dotenv');
const fetch = require('node-fetch');
const TorrentIndexer = require("torrent-indexer");
const TorrentSearchApi = require('torrent-search-api');
var torrentStream = require('torrent-stream');

os.tmpDir = os.tmpdir;

dotenv.config();

const apiKey = process.env.TMDB_API_KEY
const ytsApi = 'https://yts.mx/api/v2/list_movies.json?quality=720p&query_term=';

const opts = { 
    connections: 100,        // Max number of connections
    uploads: 10,           // Max number of upload slots
    path: `${os.homedir()}\\Downloads`,     // Directory to save files to
    mkdir: false,           // Make a directory in opts.path? Name will be the info hash
    seed: false,           // NYI - Seed the torrent when done instead of quitting?
    start: true,           // Auto-start the download?
    statFrequency: 2000    // How often to broadcast 'stats'
}

const dataStream = {
    connections: 100,     // Max amount of peers to be connected to.
    uploads: 10,          // Number of upload slots.
                          // Defaults to '/tmp' or temp folder specific to your OS.
                          // Each torrent will be placed into a separate folder under /tmp/torrent-stream/{infoHash}
    // path: `${os.homedir()}\\Downloads\\tmp`, // Where to save the files. Overrides `tmp`.
    path: `./tmp/media`, // Where to save the files. Overrides `tmp`.
    verify: true,         // Verify previously stored data before starting
                          // Defaults to true
    tracker: true,        // Whether or not to use trackers from torrent file or magnet link
                          // Defaults to true
    trackers: [
        'udp://tracker.openbittorrent.com:80',
        'udp://tracker.ccc.de:80',
        'udp://tracker.leechers-paradise.org:6969/announce',
        'udp://tracker.pirateparty.gr:6969/announce',
        'udp://tracker.coppersurfer.tk:6969/announce',
        'http://asnet.pw:2710/announce',
        'http://tracker.opentrackr.org:1337/announce',
        'udp://tracker.opentrackr.org:1337/announce',
        'udp://tracker1.xku.tv:6969/announce',
        'udp://tracker1.wasabii.com.t'
    ],
                          // Allows to declare additional custom trackers to use
                          // Defaults to empty
}

router.get('/:mediaName',async (req, res) => {
    // console.log(req.params.mediaName);
    // console.log(req.params.titleRoute);

    let id = req.params.titleRoute;

    // let tmpId = id.split('movieId=');

    let user = req.session;
    // let queryString = req.params.mediaName;
    res.render('pages/stream', {
        title: req.params.mediaName,
        mediaInfo: req.params.mediaName,
        data: user
    });
});

router.get('/stream/:mediaName', async (req, res) => {
    // console.log(req.params.mediaName);
    const torrentIndexer = new TorrentIndexer();

    TorrentSearchApi.enableProvider('ThePirateBay'); 

    // Search '1080' in 'Movies' category and limit to 20 results
    const torrents = await TorrentSearchApi.search(req.params.mediaName, 'Video', 20);

    let movieFormat = [];
    let movieSeeder = [];
    torrents.forEach((item, index, array) => {
        // if (index && index < 50) {
            if (item.title.search("mkv")  || item.title.search("mp4") ) {
                movieFormat.push(item);
                movieSeeder.push(item.seeds);
            }
        // }
    });

    var biggestSeeder = movieSeeder.reduce((a, b) => {
        return Math.max(a, b);
    });

    var magnetLink;
    movieFormat.forEach((item, index, array) => {
        if (item.seeds === biggestSeeder){
            magnetLink = item.magnet;
        }
    });
    if (magnetLink != undefined) {
        var engine = torrentStream(magnetLink, dataStream);
        engine.on('ready', function() {
            engine.files.forEach(function(file) {
                var pattMp4 = new RegExp(".mp4");
                var pattMkv = new RegExp(".mkv");
                var form;
                if (pattMp4.test(file.name)) {
                    form = ".mp4";
                } else if (pattMkv.test(file.name)) {
                    form = ".mkv";
                }

                if (form != undefined)
                {
                    const fileSize = engine.files[0].length;
                    const range = req.headers.range;
    
                    if (range) {
                        const parts = range.replace(/bytes=/, "").split("-");
                        const start = parseInt(parts[0], 10);
                        const end = parts[1] ? parseInt(parts[1], 10) : fileSize-1;
    
                        const chunksize = (end-start)+1;
                        // const file = file.createReadStream(moviePath, {start, end});
                        const head = {
                            'Content-Range': `bytes ${start}-${end}/${fileSize}`,
                            'Accept-Ranges': 'bytes',
                            'Content-Length': chunksize,
                            'Content-Type': `video/${form}`,
                        }
                        res.writeHead(206, head);
                        var stream = file.createReadStream({start, end});
                        stream.pipe(res);
                    }
                }
            });
        }).on('download', () => {
            console.log('percentage: ' + engine.swarm.downloaded);
        })
    }
});

module.exports = router;