const {conInit, con} = require("./connection");

var userSql = "CREATE TABLE IF NOT EXISTS users (id INT AUTO_INCREMENT PRIMARY KEY, firstName VARCHAR(255) NOT NULL, lastName VARCHAR(255) NOT NULL, username VARCHAR(255) NOT NULL UNIQUE, email VARCHAR(255) NOT NULL UNIQUE, password VARCHAR(255) NOT NULL, languagePreference VARCHAR(255) NOT NULL, verified TINYINT(4), token VARCHAR(255) NOT NULL)";
var imagesSql = "CREATE TABLE IF NOT EXISTS images (id INT AUTO_INCREMENT PRIMARY KEY, imagePath VARCHAR(255) NOT NULL, username VARCHAR(255) NOT NULL)";
var commentsSql = "CREATE TABLE IF NOT EXISTS comments (id INT AUTO_INCREMENT PRIMARY KEY, movieName VARCHAR(255) NOT NULL, tvSeriesName VARCHAR(255) NOT NULL, comment VARCHAR(255) NOT NULL, username VARCHAR(255) NOT NULL, imagePath VARCHAR(255) NOT NULL)";

conInit.query(`CREATE DATABASE IF NOT EXISTS Hypertube`, (err, result) => {
    if (err) throw err;
    // console.log(result);
    console.log('Hypertube database created');
});

con.query(userSql, (err, result) => {
    if (err) throw err;
    console.log("User Table created");
});

con.query(imagesSql, (err, result) => {
    if (err) throw err;
    console.log("Images Table created");
});

con.query(commentsSql, (err, result) => {
    if (err) throw err;
    console.log("Comments Table created");
});