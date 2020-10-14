const {conInit, con} = require("./connection");

var userSql = "CREATE TABLE IF NOT EXISTS users (id INT AUTO_INCREMENT PRIMARY KEY, firstName VARCHAR(255) NOT NULL, lastName VARCHAR(255) NOT NULL, username VARCHAR(255) NOT NULL UNIQUE, email VARCHAR(255) NOT NULL, password VARCHAR(255) NOT NULL, languagePreference VARCHAR(255) NOT NULL, verified TINYINT(4), token VARCHAR(255) NOT NULL)";
var imagesSql = "CREATE TABLE IF NOT EXISTS images (id INT AUTO_INCREMENT PRIMARY KEY, imagePath VARCHAR(255) NOT NULL, username VARCHAR(255) NOT NULL)";
var commentsSql = "CREATE TABLE IF NOT EXISTS comments (id INT AUTO_INCREMENT PRIMARY KEY, movieName VARCHAR(255) NOT NULL, tvSeriesName VARCHAR(255) NOT NULL, comment VARCHAR(255) NOT NULL, username VARCHAR(255) NOT NULL, imagePath VARCHAR(255) NOT NULL)";
var mediaSql = "CREATE TABLE IF NOT EXISTS mediaInfo (id INT AUTO_INCREMENT PRIMARY KEY, mediaName VARCHAR(255) NOT NULL, mediaMagnet VARCHAR(255) NOT NULL, entryDate DATE NOT NULL DEFAULT current_timestamp(), mediaSize DECIMAL, currentSize DECIMAL, status TINYINT(4))";
var viewedSql = "CREATE TABLE IF NOT EXISTS viewed (id INT AUTO_INCREMENT PRIMARY KEY, mediaName VARCHAR(255) NOT NULL, mediaRating VARCHAR(255) NOT NULL, releaseDate VARCHAR(255) NOT NULL, mediaPicture VARCHAR(255) NOT NULL, mediaLink VARCHAR(255) NOT NULL, username VARCHAR(255) NOT NULL)";

conInit.query(`CREATE DATABASE IF NOT EXISTS Hypertube`, (err, result) => {
    if (err) throw err;
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

con.query(mediaSql, (err, result) => {
    if (err) throw err;
    console.log("MediaInfo Table created");
});

con.query(viewedSql, (err, result) => {
    if (err) throw err;
    console.log("Viewed Table created");
})