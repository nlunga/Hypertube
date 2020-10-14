// const GoogleStrategy = require('passport-google-oauth20').Strategy;
const {conInit, con } = require('../config/connection');
const { v1: uuidv1 } = require('uuid');
const emailToken = uuidv1();
const dotenv = require('dotenv');

dotenv.config();

const GoogleStrategy = require('passport-google-oauth20').Strategy;
var FortyTwoStrategy = require('passport-42').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const passport = require('passport');

passport.serializeUser(function(user, done) {
    /*
    From the user take just the id (to minimize the cookie size) and just pass the id of the user
    to the done callback
    PS: You dont have to do it like this its just usually done like this
    */
    done(null, user);
});
  
passport.deserializeUser(function(user, done) {
    /*
    Instead of user this function usually recives the id 
    then you use the id to select the user from the db and pass the user obj to the done callback
    PS: You can later access this data in any routes in: req.user
    */
    done(null, user);
});

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
    passReqToCallback: true
  },
  function(request, accessToken, refreshToken, profile, cb) {
    return cb(null, profile);
  }
));

passport.use(new FortyTwoStrategy({
    clientID: process.env.FORTYTWO_APP_ID,
    clientSecret: process.env.FORTYTWO_APP_SECRET,
    callbackURL: process.env.FORTYTWO_APP_CALLBACK_URL,
    // callbackURL: 'keahjwfhj vneiugraelgprjgoiregvrjnirambre bio'
    // passReqToCallback: true
  },
  function(accessToken, refreshToken, profile, cb) {
    // console.log("FAIL");
    // console.log(profile);
    return cb(null, profile);
  }
));

passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_APP_ID,
  clientSecret: process.env.FACEBOOK_APP_SECRET,
  callbackURL: process.env.FACEBOOK_APP_CALLBACK_URL,
  profileFields   : ['id','displayName','name','gender','picture.type(large)','email']
  },
  function(accessToken, refreshToken, profile, cb) {
    return cb(null, profile);
  }
));