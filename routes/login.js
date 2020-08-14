const express = require('express');
const router = express.Router();
var mysql = require('mysql');
const { check, validationResult } = require('express-validator');
const {conInit, con } = require('../config/connection');
const bcrypt = require('bcrypt');

router.get('/', (req, res) => {
    res.render('pages/login', {
        title : "Login"
    });
});

router.post('/', [
  check('username')
  .isAlphanumeric()
  .not().isEmpty()
  .trim()
  .escape()
  .isLength({ min: 4 }),
  check('password').isLength({ min: 5 })
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()){
        console.log(errors);
        return res.status(422).json({errors : errors.array()});
    }else {
        let sql = `SELECT * FROM users WHERE username = ` + mysql.escape(req.body.username);
        con.query(sql, (err, result) => {
            if (err) throw err;
            if (result[0].username === req.body.username && req.body.password) {
                const hash = result[0].password;
                        
                bcrypt.compare(req.body.password, hash, (err, response) => {
                    if (result[0].verified === 0) {
                        console.log("Please confirm your email");
                        res.redirect("/login");
                    }else if (result[0].verified === 1) {
                        if (response === true) {
                            /* req.session.userId = result[0].id;
                            req.session.firstname = result[0].firstName;
                            req.session.lastname = result[0].lastName;
                            req.session.username = result[0].username;
                            req.session.email = result[0].email;
                            req.session.password = result[0].password;
                            
                            let user = req.session; */
                            console.log('loggen in');
                            res.render('pages/test',{
                                title: 'Entry'
                            });
                        }else {
                            res.redirect("/login");
                            return console.log('password does not match');
                        }
                    }
                });
            }
        });
    }
});

module.exports = router;