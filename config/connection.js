const mysql = require('mysql');
const dotenv = require('dotenv');

dotenv.config();


const dbHost = process.env.HOST;
const dbUser = process.env.USER;
const dbName = process.env.DB_NAME;

var conInit = mysql.createConnection({
    host: dbHost,
    user: dbUser,
    port: 3306,
    password: ""
});

conInit.connect((err) =>{
    if (err) throw err;
});

var con = mysql.createConnection({
    host: dbHost,
    user: dbUser,
    port: 3306,
    password: "",
    database: dbName
});


con.connect((err) =>{
    if (err) throw err;
    console.log('Database Connected');
});

module.exports = {
    conInit,
    con
};