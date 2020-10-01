const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { check, validationResult } = require('express-validator');
const {conInit, con} = require('../config/connection');
const {redirectLogin, redirectDashboard} = require('./accessControls');
const nodemailer = require('nodemailer');
const { v1: uuidv1 } = require('uuid');
const saltRounds = 10;
const emailToken = uuidv1();
const passport = require('passport');

const dotenv = require('dotenv');

dotenv.config();

const port = process.env.PORT;


router.get('/', redirectDashboard, (req, res) => { 
    let user = req.session;
    let err = undefined
    res.render('pages/register', {
        title : "Sign Up",
        data: user,
        errors: err
    });
});

router.post('/', [
    check('firstname')
    .isAlpha()
    .not().isEmpty().withMessage('Firstname field must not be empty')
    .trim()
    .escape(),
    check('lastname')
    .isAlpha()
    .not().isEmpty().withMessage('Lastname field must not be empty')
    .trim()
    .escape(),
    check('email')
    .isEmail()
    .normalizeEmail(),
    check('username')
    .isAlphanumeric()
    .not().isEmpty().withMessage('Username field must not be empty')
    .trim()
    .escape()
    .isLength({ min: 4 }),
    check('password')
        .isLength({ min:8 }).withMessage('Password must be at least 8 characters in length.')
        .matches('[0-9]').withMessage('Password must contain at least 1 number.')
        .matches('[a-z]').withMessage('Password must contain at least 1 lowercase letter.')
        .matches('[A-Z]').withMessage('Password must contain at least 1 uppercase letter.')
        .matches(['[^A-Za-z0-9]']).withMessage('Password must contain at least 1 special character.'),
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
        // console.log(errors);
        res.render('pages/register', {
            title : "Sign Up",
            data: req.session,
            errors: errors.errors
        });
        // return res.status(422).json({errors : errors.array()});
    }else {
        bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
            var confirmed = 0;
            con.query("INSERT INTO users (firstName, lastName, userName, email, password, languagePreference, verified, token) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", [req.body.firstname, req.body.lastname, req.body.username, req.body.email, hash, "English", confirmed, emailToken], (err, result) => {
                if (err) throw err;
                console.log("1 record inserted");
            });

            const transporter = nodemailer.createTransport({
                secure: true,
                service: 'gmail',
                auth: {
                    user: 'matchamanagment@gmail.com',
                    pass: 'welcometomatcha'
                    // pass: '9876543210khulu'
                },
                tls: {
                    // do not fail on invalid certs
                    rejectUnauthorized: false
                }
            });
            // var emailToken = "jhdashghohwg2gwg";
            const conUrl = `http://localhost:${port}/confirmation/${emailToken}`;
            const mailOptions = {
                from: 'matchamanagment@gmail.com',
                to: req.body.email,
                subject: 'Please Verify your email',
                text: `That was easy!`,
                html: `Please click on the link bellow to confirm your email:<br>
                        
                <a href="${conUrl}"><button type="button" class="btn btn-outline-secondary">Confirm</button></a>
                `
            };
                
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                }
            });

            res.render('pages/register-success', {
                title: "Verify Account",
                data: req.body
            });
        });
    }
});

module.exports = router;