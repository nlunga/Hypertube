const mysql = require('mysql');

var conInit = mysql.createConnection({
    host: "localhost",
    user: "root",
    port: 3306,
    password: ""
});

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    port: 3306,
    password: "",
    database: "Hypertube"
});

con.connect((err) =>{
    if (err) throw err;
    console.log('Database Connected');
});

conInit.connect((err) =>{
    if (err) throw err;
});

module.exports = {
    conInit,
    con
};