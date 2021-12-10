const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const bodyParser = require('body-parser');
const path = require('path');
const passport = require('passport');
var session = require('express-session');
var MongoDBStore = require('connect-mongodb-session')(session);
const dotenv = require('dotenv');

dotenv.config();
const db = require('./config/connection');

// require('./routes/passport');

const port = process.env.PORT;
const dbHost = process.env.HOST;
// const sqlPort = process.env.MYSQL_PORT;
const dbUser = process.env.USER;
const dbName = process.env.DB_NAME;
const sess_name = process.env.SESS_NAME;
const sess_sectret = process.env.SESS_SECRET;
const Comment = require('./models/Comment');

// import routes
const index = require('./routes/index');
const login = require('./routes/login');
const register = require('./routes/register');
const oauth = require('./routes/auth');
const confirmationMail = require('./routes/confirmationMail');
const forgotPassword = require('./routes/forgotPassword');
const resetPassword = require('./routes/resetPassword');
const entryPoint = require('./routes/entryPoint');
const profile = require('./routes/profile');
const profilePic = require('./routes/profilePic');
const settings = require('./routes/settings');
const viewMore = require('./routes/viewMore');
const viewProfile = require('./routes/viewProfile');
const searchEngine = require('./routes/seachEngine');
const sort = require('./routes/sort');
const viewed = require('./routes/viewed');
const downloads = require('./routes/downloads');
const watch = require('./routes/watch');
const test = require('./routes/test');
const logout = require('./routes/logout');
const { proppatch } = require('./routes/login');

// set the view engine to ejs
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// body-parser Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// express middleware - set Sastic path
app.use(express.static(path.join(__dirname, 'public')));

const url = process.env.DB_CONNECTION_URI;

const store = new MongoDBStore({
    uri: url,
    collection: 'hyperSessions'
});
  
// Catch errors
store.on('error', function(error) {
    console.log(error);
});
  
app.use(require('express-session')({
    secret: sess_sectret,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
    },
    store: store,
    // Boilerplate options, see:
    // * https://www.npmjs.com/package/express-session#resave
    // * https://www.npmjs.com/package/express-session#saveuninitialized
    resave: true,
    saveUninitialized: true
}));

// Passport Middleware

// app.use(passport.initialize());
// app.use(passport.session());

// using routes
app.use('/', index);
app.use('/login', login);
app.use('/signup', register);
app.use('/auth', oauth);
app.use('/confirmation', confirmationMail);
app.use('/forgotPassword', forgotPassword);
app.use('/resetPassword', resetPassword);
app.use('/discover', entryPoint);
app.use('/profile', profile);
app.use('/set-profilePic', profilePic);
app.use('/settings', settings);
app.use('/title', viewMore);
app.use('/viewProfile', viewProfile);
app.use('/search', searchEngine);
app.use('/sort', sort);
app.use('/viewed', viewed);
app.use('/download', downloads);
app.use('/watch', watch);
app.use('/test', test);
app.use('/logout', logout);

app.get('/drop', (req, res) => {
    con.query('DROP DATABASE hypertube', (err, result) => {
        if (err) throw err;
        console.log('DB dropped');
    })
})

io.on('connection', (socket) => {
    // console.log('a user connected');
 
    socket.on('comment', async(comment) => {
        if (comment.commentType === 'movie') {
            const comments = new Comment({
                movieName: comment.mediaData,
                comment: comment.commentData,
                username: comment.user,
                imagePath: comment.image
            });

            try {
                const newComment = await comments.save();
                console.log(newComment)
                io.sockets.emit('message', comment);
                console.log("1 record inserted");
                // res.status(200).json({success: true, message: `User ${newComment.firstName} ${newComment.lastName} has been created`});
            } catch (error) {
                // res.status(400).json({success: false, message: error});
                return console.log(error.errors);
            }

        } else {
        //     let commentSql = `INSERT INTO comments (movieName, tvSeriesName, comment, username, imagePath) VALUES (?, ?, ?, ?, ?)`;
        //     con.query(commentSql, ["NULL", comment.mediaData, comment.commentData, comment.user, comment.image], (err, result) => {
        //         if (err) throw err;
        //         io.sockets.emit('message', data);
        //         console.log("1 record inserted");
        //     });
            const comments = new Comment({
                tvSeriesName: comment.mediaData,
                comment: comment.commentData,
                username: comment.user,
                imagePath: comment.image
            });

            try {
                const newComment = await comments.save();
                io.sockets.emit('message', comment);
                console.log("1 record inserted");
                // res.status(200).json({success: true, message: `User ${newComment.firstName} ${newComment.lastName} has been created`});
            } catch (error) {
                // res.status(400).json({success: false, message: error});
                return error;
            }
        }
    });

    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
  });

http.listen(port, () => console.log(`Server running on port ${port}!`));