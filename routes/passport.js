const GoogleStrategy = require('passport-google-oauth20').Strategy;
const {conInit, con } = require('../config/connection');
const { v1: uuidv1 } = require('uuid');
const emailToken = uuidv1();

module.exports = function(passport) {
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/auth/google/callback'
    },
    async(accessToken, refreshToken, profile, done) => {
        // console.log(profile);
        // console.log(profile.name.givenName);
        // console.log(profile.name.familyName);
        // console.log(profile.displayName);
        let sql = `SELECT * FROM users WHERE username = '${profile.displayName}'`;
        con.query(sql, (err, result) => {
            if (err) throw err;
            if (result.length === 0) {
                let confirmed = 1;
                con.query("INSERT INTO users (firstName, lastName, userName, email, password, languagePreference, verified, token) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", [profile.name.givenName, profile.name.familyName, profile.displayName, "NULL", "NULL", "English", confirmed, emailToken], (err, results) => {
                    if (err) throw err;
                    console.log("1 record inserted");
                });
            }else {
                done(null, result);
            }
        });
    }))

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });
      
    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
            done(err, user);
        });
    });
}
