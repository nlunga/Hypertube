const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const http = require('http').createServer(app);
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const port = process.env.PORT;

// import routes
const index = require('./routes/index');
const login = require('./routes/login');
const register = require('./routes/register');
const confirmationMail = require('./routes/confirmationMail');
const logout = require('./routes/logout');

// set the view engine to ejs
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// body-parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// express middleware - set Sastic path
app.use(express.static(path.join(__dirname, 'public')));

// using routes
app.use('/', index);
app.use('/login', login);
app.use('/signup', register);
app.use('/confirmation', confirmationMail);
app.use('/logout', logout);

http.listen(port, () => console.log(`Server running on port ${port}!`));