const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const {conInit, con} = require('../config/connection');
const {redirectLogin, redirectDashboard} = require('./accessControls');
const bcrypt = require('bcrypt');
const saltRounds = 10;

router.get('/', redirectLogin, (req, res) => {
    let user = req.session;
    res.render('pages/settings', {
        title : `Edit Profile`,
        data: user,
        isMovie: true
    });
});

router.post('/firstname', check('firstname')
    .isAlpha()
    .not().isEmpty()
    .trim()
    .escape(),(req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()){
        console.log(errors);
        return res.status(422).json({errors : errors.array()});
    }else {
        let sql = `UPDATE users SET firstName = '${req.body.firstname}' WHERE username = '${req.session.username}'`;
        con.query(sql, (err, result) => {
            if (err) throw err;
            console.log(result.affectedRows + " record(s) updated");
            req.session.firstname = req.body.firstname;
            return res.redirect('/profile');
        });
    }
});

router.post('/lastname', check('lastname')
    .isAlpha()
    .not().isEmpty()
    .trim()
    .escape(),(req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()){
        console.log(errors);
        return res.status(422).json({errors : errors.array()});
    }else {
        let sql = `UPDATE users SET lastName = '${req.body.lastname}' WHERE username = '${req.session.username}'`;
        con.query(sql, (err, result) => {
            if (err) throw err;
            console.log(result.affectedRows + " record(s) updated");
            req.session.lastname = req.body.lastname;
            return res.redirect('/profile');
        });
    }
});

router.post('/email', check('email')
    .isEmail()
    .normalizeEmail(),(req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()){
        console.log(errors);
        return res.status(422).json({errors : errors.array()});
    }else {
        let sql = `UPDATE users SET email = '${req.body.email}' WHERE username = '${req.session.username}'`;
        con.query(sql, (err, result) => {
            if (err) throw err;
            console.log(result.affectedRows + " record(s) updated");
            req.session.email = req.body.email;
            return res.redirect('/profile');
        });
    }
});

router.post('/username', check('username')
    .isAlphanumeric()
    .not().isEmpty()
    .trim()
    .escape()
    .isLength({ min: 4 }),(req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()){
        console.log(errors);
        return res.status(422).json({errors : errors.array()});
    }else {
        let sql = `UPDATE users SET username = '${req.body.username}' WHERE username = '${req.session.username}'`;
        con.query(sql, (err, result) => {
            if (err) throw err;
            console.log(result.affectedRows + " record(s) updated");
            // return res.redirect('/profile');
        });
        let imgSql = `UPDATE images SET username = '${req.body.username}' WHERE username = '${req.session.username}'`;
        con.query(imgSql, (err, result) => {
            if (err) throw err;
            console.log(result.affectedRows + " record(s) updated");
            req.session.username = req.body.username;
            res.render('pages/usernameChange', {
                title: "Username Changed",
                data: req.session
            });
            // return res.redirect('/profile');
        });
    }
});

router.post('/password', [
    check('oldPassword')
        .isLength({ min:8 }).withMessage('Password must be at least 8 characters in length.')
        .matches('[0-9]').withMessage('Password must contain at least 1 number.')
        .matches('[a-z]').withMessage('Password must contain at least 1 lowercase letter.')
        .matches('[A-Z]').withMessage('Password must contain at least 1 uppercase letter.')
        .matches(['[^A-Za-z0-9]']).withMessage('Password must contain at least 1 special character.'),
    check('newPassword').isLength({ min:8 })
        .isLength({ min:8 }).withMessage('Password must be at least 8 characters in length.')
        .matches('[0-9]').withMessage('Password must contain at least 1 number.')
        .matches('[a-z]').withMessage('Password must contain at least 1 lowercase letter.')
        .matches('[A-Z]').withMessage('Password must contain at least 1 uppercase letter.')
        .matches(['[^A-Za-z0-9]']).withMessage('Password must contain at least 1 special character.'),
    check('confPassword').custom((value, { req }) => { 
        if (value !== req.body.newPassword) {
        throw new Error('Password confirmation does not match password');
        }
        // Indicates the success of this synchronous custom validator
        return true;
    })], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()){
        console.log(errors);
        return res.status(422).json({errors : errors.array()});
    }else {
        let hash = req.session.password
        bcrypt.compare(req.body.oldPassword, hash, (err, response) => {
            if (err) throw err;
            if (response === true) {
                bcrypt.hash(req.body.newPassword, saltRounds, (err, hidden) => {
                    let sql = `UPDATE users SET password = '${hidden}' WHERE username = '${req.session.username}'`;
                    con.query(sql, (err, result) => {
                        if (err) throw err;
                        console.log(result.affectedRows + " record(s) updated");
                        req.session.password = hash;
                        return res.redirect('/profile');
                    });
                });
            } else {
                throw new Error('Old Password does not match');
            }
        });
    }
});

router.post('/language', check('language')
    .isAlpha()
    .not().isEmpty()
    .trim()
    .escape(), (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()){
        console.log(errors);
        return res.status(422).json({errors : errors.array()});
    }else {
        let sql = `UPDATE users SET language = '${req.body.language}' WHERE username = '${req.session.username}'`;
        con.query(sql, (err, result) => {
            if (err) throw err;
            console.log(result.affectedRows + " record(s) updated");
            req.session.language = req.body.language;
            return res.redirect('/profile');
        });
    }
});

module.exports = router;