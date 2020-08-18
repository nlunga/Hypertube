const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { check, validationResult } = require('express-validator');
const {conInit, con} = require('../config/connection');
const nodemailer = require('nodemailer');
const saltRounds = 10;
const passport = require('passport');

const dotenv = require('dotenv');

dotenv.config();

const port = process.env.PORT;

router.get('/:token', (req, res) => {
    const userToken = req.params.token;
    res.render('pages/resetPassword', {
        title: "Reset Password",
        token: userToken
    });
});

router.post('/:token', [
    check('password').isLength({ min: 5 }),
    check('confPassword').custom((value, { req }) => { 
        if (value !== req.body.password) {
        throw new Error('Password confirmation does not match password');
        }
        // Indicates the success of this synchronous custom validator
        return true;
    })
    ], (req, res) => {
        const errors = validationResult(req);
    if (!errors.isEmpty()){
        console.log(errors);
        return res.status(422).json({errors : errors.array()});
    }else {
        const userToken = req.params.token;
        
        bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
            con.query('UPDATE users SET password = ? WHERE token = ?', [hash, userToken], (err, result) => {
                if (err) throw err; //TODO Set up email update
                res.redirect('/login');
            });
        });
    }
});

module.exports = router;