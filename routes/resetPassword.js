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
    let user = req.session;
    res.render('pages/resetPassword', {
        title: "Reset Password",
        token: userToken,
        data: user,
        errors: undefined
    });
});

router.post('/:token', [
    check('password')
        .isLength({ min:8 }).withMessage('Password must be at least 8 characters in length.')
        .matches('[0-9]').withMessage('Password must contain at least 1 number.')
        .matches('[a-z]').withMessage('Password must contain at least 1 lowercase letter.')
        .matches('[A-Z]').withMessage('Password must contain at least 1 uppercase letter.')
        .matches(['[^A-Za-z0-9]']).withMessage('Password must contain at least 1 special character.'),
    check('confPassword')
        .custom((value, { req }) => { 
        if (value !== req.body.password) {
        throw new Error('Password confirmation does not match password');
        }
        // Indicates the success of this synchronous custom validator
        return true;
    })
    ], (req, res) => {
        const errors = validationResult(req);
    if (!errors.isEmpty()){
        // console.log(errors);
        // return res.status(422).json({errors : errors.array()});
        let user = req.session;
        res.render('pages/resetPassword', {
            title: "Reset Password",
            token: userToken,
            data: user,
            errors: errors.errors
        });
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