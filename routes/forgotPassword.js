const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const {conInit, con} = require('../config/connection');
const {redirectLogin, redirectDashboard} = require('./accessControls');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();

const port = process.env.PORT;

router.get('/', redirectDashboard, (req, res) => {
    let user = req.session;
    res.render('pages/forgotPassword', {
        title : "Forgot Password",
        data: user
    });
});

router.post('/',check('email').isEmail().normalizeEmail(), (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()){
        console.log(errors);
        return res.status(422).json({errors : errors.array()});
    }else {
        con.query(`SELECT * FROM users WHERE email = ? LIMIT 1`,[req.body.email], (err, result) => {
            if (err) throw err;
            if (result.length === 1) {
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
                const conUrl = `http://localhost:${port}/resetPassword/${result[0].token}`;
                const mailOptions = {
                    from: 'matchamanagment@gmail.com',
                    to: req.body.email,
                    subject: 'Request to reset password',
                    text: `That was easy!`,
                    html: `Please click on the link bellow to get reset password instructions:<br>
                            
                    <a href="${conUrl}"><button type="button" class="btn btn-outline-secondary">Reset Password</button></a>
                    `
                };
                    
                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log('Email sent: ' + info.response);
                        res.render('pages/forgotResponse', {
                            title: "Email Success"
                        });
                    }
                });
            }
        });
    }
});

module.exports = router;