const mysql = require('mysql');
// import mysql from 'mysql';

const dotenv = require('dotenv');

dotenv.config();

const dbHost = process.env.HOST;
const dbUser = process.env.USER;
const dbName = process.env.DB_NAME;
const dbPass = process.env.DB_PASS;

var conInit = mysql.createConnection({
    host: dbHost,
    user: dbUser,
    port: 3306,
    password: dbPass
});

// conInit.connect((err) =>{
//     // if (err) throw err;
//     if (err) throw "Broken";
// });

var con = mysql.createConnection({
    host: dbHost,
    user: dbUser,
    port: 3306,
    password: dbPass,
    database: dbName,
    insecureAuth : true
    // host: 'localhost',
    // user: 'hypertube',
    // port: 3306,
    // password: 'password123',
    // database: 'hypertube',
    // insecureAuth : true
});

// console.log(con)
con.connect((err) =>{
    console.log(dbHost);
    console.log(dbUser);
    console.log(dbPass);
    console.log(dbName);
    if (err) return console.log("An error has occured\n" + err);
    console.log('Database Connected');
});

// export default con;
module.exports = {conInit, con};