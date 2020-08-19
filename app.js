const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const http = require('http').createServer(app);
const path = require('path');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const dotenv = require('dotenv');

dotenv.config();

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
const fortyTwoRegister = require('./routes/registerWith42');
const confirmationMail = require('./routes/confirmationMail');
const forgotPassword = require('./routes/forgotPassword');
const resetPassword = require('./routes/resetPassword');
const entryPoint = require('./routes/entryPoint');
const profile = require('./routes/profile');
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




// using routes
app.use('/', index);
app.use('/login', login);
app.use('/signup', register);
app.use('/auth/42', fortyTwoRegister);
app.use('/confirmation', confirmationMail);
app.use('/forgotPassword', forgotPassword);
app.use('/resetPassword', resetPassword);
app.use('/test', entryPoint);
app.use('/profile', profile);
app.use('/logout', logout);

http.listen(port, () => console.log(`Server running on port ${port}!`));