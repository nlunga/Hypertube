const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const bodyParser = require('body-parser');
const path = require('path');
const passport = require('passport');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const {conInit, con } = require('./config/connection');
const dotenv = require('dotenv');

dotenv.config();

require('./routes/passport')(passport);

const port = process.env.PORT;
const dbHost = process.env.HOST;
// const sqlPort = process.env.MYSQL_PORT;
const dbUser = process.env.USER;
const dbName = process.env.DB_NAME;
const sess_name = process.env.SESS_NAME;
const sess_sectret = process.env.SESS_SECRET;

// import routes
const index = require('./routes/index');
const login = require('./routes/login');
const register = require('./routes/register');
const googleRegister = require('./routes/auth');
const fortyTwoRegister = require('./routes/registerWith42');
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
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// express middleware - set Sastic path
app.use(express.static(path.join(__dirname, 'public')));
 

const options = {
    host: dbHost,
    port: 3306,
    user: dbUser,
    password: '',
    database: dbName
};
 
const sessionStore = new MySQLStore(options);
 
app.set('trust proxy', 1); // trust first proxy
app.use(session({
    key: sess_name,
    secret: sess_sectret,
    store: sessionStore,
    resave: false,
    saveUninitialized: false
}));

// Passport Middleware

app.use(passport.initialize());
app.use(passport.session());

// using routes
app.use('/', index);
app.use('/login', login);
app.use('/signup', register);
app.use('/auth', googleRegister);
app.use('/auth/42', fortyTwoRegister);
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

io.on('connection', (socket) => {
    // console.log('a user connected');
 
    socket.on('comment', (comment) => {
        console.log('comment: ');
        console.log(comment);
        if (comment.commentType === 'movie') {
            let commentSql = `INSERT INTO comments n`;
            con.query(commentSql, [comment.mediaData, "NULL", comment.commentData, comment.user, comment.image], (err, result) => {
                if (err) throw err;
                io.sockets.emit('message', comment);
                console.log("1 record inserted");
            });
        } else {
            let commentSql = `INSERT INTO comments (movieName, tvSeriesName, comment, username, imagePath) VALUES (?, ?, ?, ?, ?)`;
            con.query(commentSql, ["NULL", comment.mediaData, comment.commentData, comment.user, comment.image], (err, result) => {
                if (err) throw err;
                io.sockets.emit('message', data);
                console.log("1 record inserted");
            });
        }
    });

    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
  });

http.listen(port, () => console.log(`Server running on port ${port}!`));