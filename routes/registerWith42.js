const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { check, validationResult } = require('express-validator');
const {conInit, con} = require('../config/connection');
const nodemailer = require('nodemailer');
const { v1: uuidv1 } = require('uuid');
const saltRounds = 10;
const emailToken = uuidv1();
const passport = require('passport');

const dotenv = require('dotenv');

dotenv.config();

const port = process.env.PORT;
const appId = process.env.FORTYTWO_APP_ID;
const appSecret = process.env.FORTYTWO_APP_SECRET;

var FortyTwoStrategy = require('passport-42').Strategy;

passport.use(new FortyTwoStrategy({
    clientID: appId,
    clientSecret: appSecret,
    callbackURL: `http://127.0.0.1:${port}/auth/42/callback`
  },
  function(accessToken, refreshToken, profile, cb) {
    User.findOrCreate({ fortytwoId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));

router.get('/', passport.authenticate('42'));

router.get('/auth/42/callback', passport.authenticate('42', { failureRedirect: '/login' }),(req, res) => {
    // Successful authentication, redirect home.
    res.redirect('/library');
});

module.exports = router;