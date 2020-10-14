const express = require('express');
const router = express.Router();
const passport = require('passport');
const {conInit, con } = require('../config/connection');
const dotenv = require('dotenv');
const { v1: uuidv1 } = require('uuid');
const emailToken = uuidv1();
dotenv.config();

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/signup' }),(req, res) => {
    // Successful authentication, redirect home.
    if (CURRENT_PAGE === undefined)
      return res.redirect('/login');
    if (CURRENT_PAGE === 'signup') {
      let sql = `SELECT * FROM users WHERE username = '${req.user.displayName}'`;
      con.query(sql, (err, result) => {
        if (err) throw err;
        if (result.length === 0) {
            let confirmed = 1;
            con.query("INSERT INTO users (firstName, lastName, userName, email, password, languagePreference, verified, token) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", [req.user.name.givenName, req.user.name.familyName, req.user.displayName, req.user.emails[0].value, "NULL", "English", confirmed, emailToken], (err, results) => {
                if (err) throw err;
                console.log("1 record inserted");
            });
  
            const sql = `INSERT INTO images(imagePath, username) VALUES (?, ?)`;
  
            con.query(sql, [req.user.photos[0].value, req.user.displayName], (err, result) => {
                if (err) throw err;
                console.log("1 record inserted");
            });
            return res.redirect('/discover');
        }else {
          return res.render('pages/register', {
            title : "Sign Up",
            data: req.session,
            errors: [{
                msg: 'Email already exist',
                param: 'email',
                location: 'body'
            }]
          });
        }
      });
    }else {
      let sql = `SELECT * FROM users WHERE username = ? AND email = ? LIMIT 1`;

      con.query(sql, [req.user.displayName, req.user.emails[0].value], (err, db) => {
          if (err) throw err;
          if (db.length === 0) {
            return res.render('pages/login', {
              title : "Sign Up",
              data: req.session,
              errors: [{
                  msg: 'Email already exist',
                  param: 'email',
                  location: 'body'
              }]
            });
          }else {
              
              req.session.photo = req.user.photos[0].value;

              req.session.userId = db[0].id;
              req.session.firstname = req.user.name.givenName;
              req.session.lastname = req.user.name.familyName;
              req.session.username = req.user.displayName;
              req.session.email = req.user.emails[0].value;
              req.session.password = "";
              let user = req.session;
              return res.redirect('/discover');
          }
      })
    }
});

router.get('/42', passport.authenticate('42'));

passport.authenticate('42', { failureRedirect: '/signup' })

router.get('/42/callback', passport.authenticate('42', { failureRedirect: '/signup' }),(req, res) => {
    // Successful authentication, redirect home.
    if (CURRENT_PAGE === undefined)
      return res.redirect('/login');

    if (CURRENT_PAGE === 'signup') {
      let sql = `SELECT * FROM users WHERE username = '${req.user.username}'`;
      con.query(sql, (err, result) => {
        if (err) throw err;
        if (result.length === 0) {
            let confirmed = 1;
            con.query("INSERT INTO users (firstName, lastName, userName, email, password, languagePreference, verified, token) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", [req.user.name.givenName, req.user.name.familyName, req.user.username, req.user.emails[0].value, "NULL", "English", confirmed, emailToken], (err, results) => {
                if (err) throw err;
                console.log("1 record inserted");
            });
  
            const sql = `INSERT INTO images(imagePath, username) VALUES (?, ?)`;
  
            con.query(sql, [req.user.photos[0].value, req.user.username], (err, result) => {
                if (err) throw err;
                console.log("1 record inserted");
            });
            return res.redirect('/discover');
        }else {
          return res.render('pages/register', {
            title : "Sign Up",
            data: req.session,
            errors: [{
                msg: 'Email already exist',
                param: 'email',
                location: 'body'
            }]
          });
        }
      });
    }else {
      let sql = `SELECT * FROM users WHERE username = ? AND email = ? LIMIT 1`;

      con.query(sql, [req.user.username, req.user.emails[0].value], (err, db) => {
          if (err) throw err;
          if (db.length === 0) {
            return res.render('pages/login', {
              title : "Sign Up",
              data: req.session,
              errors: [{
                  msg: 'Email already exist',
                  param: 'email',
                  location: 'body'
              }]
            });
          }else {
              req.session.photo = req.user.photos[0].value;

              req.session.userId = db[0].id;
              req.session.firstname = req.user.name.givenName;
              req.session.lastname = req.user.name.familyName;
              req.session.username = req.user.username;
              req.session.email = req.user.emails[0].value;
              req.session.password = "";
              let user = req.session;
              return res.redirect('/discover');
          }
      })
    }
});

router.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }));

router.get('/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/signup' }), (req, res) => {
    // Successful authentication, redirect home.
    if (CURRENT_PAGE === undefined)
      return res.redirect('/login');

    if (CURRENT_PAGE === 'signup') {
      let sql = `SELECT * FROM users WHERE username = '${req.user.displayName}'`;
      con.query(sql, (err, result) => {
          if (err) throw err;
          if (result.length === 0) {
              let confirmed = 1;
              con.query("INSERT INTO users (firstName, lastName, userName, email, password, languagePreference, verified, token) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", [req.user.name.givenName, req.user.name.familyName, req.user.displayName, req.user.emails[0].value, "NULL", "English", confirmed, emailToken], (err, results) => {
                  if (err) throw err;
                  console.log("1 record inserted");
              });
  
              const sql = `INSERT INTO images(imagePath, username) VALUES (?, ?)`;
  
              con.query(sql, [req.user.photos[0].value, req.user.displayName], (err, result) => {
                  if (err) throw err;
                  console.log("1 record inserted");
              });
              return res.redirect('/discover');
          }else {
            return res.render('pages/register', {
              title : "Sign Up",
              data: req.session,
              errors: [{
                  msg: 'Email already exist',
                  param: 'email',
                  location: 'body'
              }]
            });
          }
      });
    } else {
      let sql = `SELECT * FROM users WHERE username = ? AND email = ? LIMIT 1`;

      con.query(sql, [req.user.displayName, req.user.emails[0].value], (err, db) => {
        if (err) throw err;
        if (db.length === 0) {
          return res.render('pages/login', {
            title : "Sign Up",
            data: req.session,
            errors: [{
                msg: 'Email already exist',
                param: 'email',
                location: 'body'
            }]
          });
        }else {
          req.session.photo = req.user.photos[0].value;
    
          req.session.userId = db[0].id;
          req.session.firstname = req.user.name.givenName;
          req.session.lastname = req.user.name.familyName;
          req.session.username = req.user.displayName;
          req.session.email = req.user.emails[0].value;
          req.session.password = "";
          let user = req.session;
          return res.redirect('/discover');

        }
      })
    }
  });

module.exports = router;