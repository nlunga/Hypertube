const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { check, validationResult } = require('express-validator');
const {conInit, con} = require('../config/connection');
const nodemailer = require('nodemailer');
const { v1: uuidv1 } = require('uuid');
const saltRounds = 10;
const emailToken = uuidv1();

const dotenv = require('dotenv');

dotenv.config();

const port = process.env.PORT;

router.get('/', (req, res) => {
    res.render('pages/register', {
        title : "Sign Up"
    });
});

router.post('/', [
    check('firstname')
    .isAlpha()
    .not().isEmpty()
    .trim()
    .escape(),
    check('lastname')
    .isAlpha()
    .not().isEmpty()
    .trim()
    .escape(),
    check('email')
    .isEmail()
    .normalizeEmail(),
    check('username')
    .isAlphanumeric()
    .not().isEmpty()
    .trim()
    .escape()
    .isLength({ min: 4 }),
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
        bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
            var confirmed = 0;
            con.query("INSERT INTO users (firstName, lastName, userName, email, password, verified, token) VALUES (?, ?, ?, ?, ?, ?, ?)", [req.body.firstname, req.body.lastname, req.body.username, req.body.email, hash, confirmed, emailToken], (err, result) => {
                if (err) throw err;
                console.log("1 record inserted");
            });

            const transporter = nodemailer.createTransport({
                secure: true,
                service: 'gmail',
                auth: {
                    user: 'matchamanagment@gmail.com',
                    pass: 'welcometomatcha'
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