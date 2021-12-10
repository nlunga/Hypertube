const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const url = process.env.DB_CONNECTION_URI;

mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection
    .once('open', () => console.log('Connected to MongoDB'))
    .on('error', (error) => {
        console.log(`Connection error: ${error}`);
    });

module.exports = db;