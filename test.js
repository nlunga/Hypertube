const {conInit, con} = require("config/connection.js");
// import  con from './config/connection.js'

const sql = "CREATE TABLE IF NOT EXISTS users (id INT AUTO_INCREMENT PRIMARY KEY, firstName VARCHAR(255) NOT NULL, lastName VARCHAR(255) NOT NULL, username VARCHAR(255) NOT NULL UNIQUE, email VARCHAR(255) NOT NULL, password VARCHAR(255) NOT NULL, languagePreference VARCHAR(255) NOT NULL, verified TINYINT(4), token VARCHAR(255) NOT NULL)";

con.query(sql, (err, db) => {
    if (err) return console.error(err);
    return console.log(`Users table created` + db);
});