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


router.get('/google', passport.authenticate('google', { scope: ['profile'] }));

router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/login' }),(req, res) => {
    // Successful authentication, redirect home.
    res.redirect('/discover');
  });

module.exports = router;