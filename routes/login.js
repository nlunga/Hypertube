const express = require('express');
const router = express.Router();
var mysql = require('mysql');
const { check, validationResult } = require('express-validator');
const {conInit, con } = require('../config/connection');
const {redirectLogin, redirectDashboard} = require('./accessControls');
const bcrypt = require('bcrypt');

router.get('/', redirectDashboard, (req, res) => {
    let user = req.session;
    let err = undefined
    res.render('pages/login', {
        title : "Login",
        data: user,
        errors: err
    });
});

router.post('/', [
  check('username')
    .isAlphanumeric()
    .not().isEmpty().withMessage('Username field must not be empty')
    .trim()
    .escape()
    .isLength({ min: 4 }).withMessage('Username must be at least 4 characters in length.'),
  check('password')
    .isLength({ min:8 }).withMessage('Password must be at least 8 characters in length.')
    .matches('[0-9]').withMessage('Password must contain at least 1 number.')
    .matches('[a-z]').withMessage('Password must contain at least 1 lowercase letter.')
    .matches('[A-Z]').withMessage('Password must contain at least 1 uppercase letter.')
    .matches(['[^A-Za-z0-9]']).withMessage('Password must contain at least 1 special character.')
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()){
        console.log(errors);
        return res.render('pages/login', {
            title : "Login",
            data: req.session,
            errors: errors.errors
        });
        // return res.status(422).json({errors : errors.array()});
    }else {
        // req.session.errors = undefined;
        let sql = `SELECT * FROM users WHERE username = ` + mysql.escape(req.body.username);
        con.query(sql, (err, result) => {
            if (err) throw err;
            if (result[0].username === req.body.username && req.body.password) {
                const hash = result[0].password;
                        
                bcrypt.compare(req.body.password, hash, (err, response) => {
                    if (result[0].verified === 0) {
                        let testErrors = [{
                            msg: 'Please confirm your email.',
                            param: 'password',
                            location: 'body'
                        }]
                        // return res.redirect("/login");
                        return res.render('pages/login', {
                            title : "Login",
                            data: req.session,
                            errors: testErrors
                        });
                    }else if (result[0].verified === 1) {
                        if (response === true) {
                            req.session.userId = result[0].id;
                            req.session.firstname = result[0].firstName;
                            req.session.lastname = result[0].lastName;
                            req.session.username = result[0].username;
                            req.session.email = result[0].email;
                            req.session.password = result[0].password;
                            
                            con.query(`SELECT * FROM images WHERE username = '${req.body.username}' LIMIT 1`, (err, tableVal) => {
                                if (err) throw err;
                                if (tableVal.length === 0) {
                                    req.session.image = undefined
                                }else {
                                    req.session.image = tableVal[0].imagePath;
                                }
    
                                return res.redirect('/discover');
                            });
                        }else {
                            let testErrors = [{
                                msg: 'Password does not match.',
                                param: 'password',
                                location: 'body'
                            }]
                            // return res.redirect("/login");
                            return res.render('pages/login', {
                                title : "Login",
                                data: req.session,
                                errors: testErrors
                            });
                        }
                    }
                });
            }
        });
    }
});

module.exports = router;