const Torrent = require('torrent-xiv');
const os = require('os');
const express = require('express');
const router = express.Router();
const {redirectLogin, redirectDashboard} = require('./accessControls');
const dotenv = require('dotenv');
const fetch = require('node-fetch');
const TorrentIndexer = require("torrent-indexer");
const TorrentSearchApi = require('torrent-search-api');

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

router.get('/:mediaName/:titleRoute',async (req, res) => {
    // console.log(req.params.mediaName);
    // const movie = encodeURI(req.params.mediaName);

    // const movie = encodeURI(req.params.mediaName);
    // const torrentIndexer = new TorrentIndexer();
    
    // const torrents = await torrentIndexer.search(req.params.mediaName);
    TorrentSearchApi.enableProvider('ThePirateBay'); 

    // Search '1080' in 'Movies' category and limit to 20 results
    const torrents = await TorrentSearchApi.search(req.params.mediaName, 'Video', 20);

    let movieFormat = [];
    let movieSeeder = [];
    torrents.forEach((item, index, array) => {
        // if (index && index < 50) {
            if (item.title.search("mkv")  || item.title.search("mp4") ) {
                movieFormat.push(item);
                // console.log(item);
                movieSeeder.push(item.seeds);
            }
        // }
    });

    var biggestSeeder = movieSeeder.reduce((a, b) => {
        return Math.max(a, b);
    });

    // console.log(biggestSeeder);

    var magnetLink;
    movieFormat.forEach((item, index, array) => {
        if (item.seeds === biggestSeeder){
            magnetLink = item.magnet;
            // console.log(item);
        }
    });
    // if (torrents.length !== 0) {
        const torrent = new Torrent(magnetLink, opts);
            
        //torrent.on('progress', console.log); // prints torrent.status()
        //torrent.on('metadata', console.log);
                
        torrent.on('stats', (stats) => {
            console.log("Percentage: " + stats.percentage);
            console.log("Download Speed: " + stats.downSpeed);
            console.log("Upload Speed: " + stats.upSpeed);
            console.log("Total Downloaded: " + (stats.downloaded/1024));
            console.log("Uploaded: " + stats.uploaded);
            console.log("Seeds/Peers: " + stats.peersTotal);
            console.log("Peers Unchocked: " + stats.peersUnchoked);
        });
    
        torrent.on('complete', console.log); // prints torrent.metadata
        // res.redirect(`/title/${pageNo}/${splitId}`);
    // } else {
    //     console.log("check downloads.js for errors!")
    // }

    /* const titleRoute = req.params.titleRoute;
    const urlLink = titleRoute.split('&');
    const page = urlLink[0].split('=');
    const linkId = urlLink[1].split('=');
    const pageNo = page[1];
    const splitId = linkId[1];

    fetch(ytsApi+movie)
        .then(res => res.json())
        .then((out) => {
            const TORRENT_HASH = out.data.movies[0].torrents[0].hash;
            const magnetLink = `magnet:?xt=urn:btih:${TORRENT_HASH}&amp;dn=${movie}&amp;tr=udp://tracker.opentrackr.org:1337/announce&amp;tr=udp://tracker.openbittorrent.com:80`
            const torrent = new Torrent(magnetLink, opts);
        
            //torrent.on('progress', console.log); // prints torrent.status()
            //torrent.on('metadata', console.log);
            
            torrent.on('stats', (stats) => {
                console.log("Percentage: " + stats.percentage);
                console.log("Download Speed: " + stats.downSpeed);
                console.log("Upload Speed: " + stats.upSpeed);
                console.log("Total Downloaded: " + (stats.downloaded/1024));
                console.log("Uploaded: " + stats.uploaded);
                console.log("Seeds/Peers: " + stats.peersTotal);
                console.log("Peers Unchocked: " + stats.peersUnchoked);
            });
            res.redirect(`/title/${pageNo}/${splitId}`);
            torrent.on('complete', console.log); // prints torrent.metadata
        })
        .catch(err => { throw err }); */
});

module.exports = router;