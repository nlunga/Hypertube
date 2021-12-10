const express = require('express');
const router = express.Router();
var mysql = require('mysql');
const { check, validationResult } = require('express-validator');
const db = require('../config/connection');
const {redirectLogin, redirectDashboard} = require('./accessControls');
const {registerValidation, loginValidation} = require('../validation');
const User = require('../models/User');
const bcrypt = require('bcrypt');

router.get('/', redirectDashboard, (req, res) => {
    let user = req.session;
    let err = undefined;
    global.CURRENT_PAGE = 'login';
    res.render('pages/login', {
        title : "Login",
        data: user,
        errors: err
    });
});

// router.post('/', [
//   check('username')
//     .isAlphanumeric()
//     .not().isEmpty().withMessage('Username field must not be empty')
//     .trim()
//     .escape()
//     .isLength({ min: 4 }).withMessage('Username must be at least 4 characters in length.'),
//   check('password')
//     .isLength({ min:8 }).withMessage('Password must be at least 8 characters in length.')
//     .matches('[0-9]').withMessage('Password must contain at least 1 number.')
//     .matches('[a-z]').withMessage('Password must contain at least 1 lowercase letter.')
//     .matches('[A-Z]').withMessage('Password must contain at least 1 uppercase letter.')
//     .matches(['[^A-Za-z0-9]']).withMessage('Password must contain at least 1 special character.')
// ], (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()){
//         // console.log(errors);
//         return res.render('pages/login', {
//             title : "Login",
//             data: req.session,
//             errors: errors.errors
//         });
//         // return res.status(422).json({errors : errors.array()});
//     }else {
//         // req.session.errors = undefined;
//         let sql = `SELECT * FROM users WHERE username = ` + mysql.escape(req.body.username);
//         con.query(sql, (err, result) => {
//             if (err) throw err;
//             if (result[0].username === req.body.username && req.body.password) {
//                 const hash = result[0].password;
                        
//                 bcrypt.compare(req.body.password, hash, (err, response) => {
//                     if (result[0].verified === 0) {
//                         let testErrors = [{
//                             msg: 'Please confirm your email.',
//                             param: 'password',
//                             location: 'body'
//                         }]
//                         // return res.redirect("/login");
//                         return res.render('pages/login', {
//                             title : "Login",
//                             data: req.session,
//                             errors: testErrors
//                         });
//                     }else if (result[0].verified === 1) {
//                         if (response === true) {
//                             req.session.userId = result[0].id;
//                             req.session.firstname = result[0].firstName;
//                             req.session.lastname = result[0].lastName;
//                             req.session.username = result[0].username;
//                             req.session.email = result[0].email;
//                             req.session.password = result[0].password;

//                             var currentDate;
//                             var d = new Date();
                            
//                             con.query(`SELECT * FROM mediaInfo`, (err, results) => {
//                                 if (err) throw err;
//                                 if (results.length === 0) {
//                                     console.log("No results found");
//                                 } else {
//                                     results.forEach((item, index, array) => {
//                                         console.log(item.entryDate);
//                                         var stuff = new Date(item.entryDate);
//                                         var Difference_In_Time = d.getTime() - stuff.getTime(); 
  
//                                         // To calculate the no. of days between two dates 
//                                         var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24); 

//                                         if (Difference_In_Days < 30) {
//                                             console.log('Still under the same month')
//                                         }else {
//                                             con.query(`DELETE FROM mediaInfo WHERE entryDate = '${item.entryDate}'`, (err, del) => {
//                                                 if (err) throw err;
//                                                 console.log('Data has been deleted');
//                                             })
//                                         }
//                                     })
//                                 }
//                             })

//                             con.query(`SELECT * FROM images WHERE username = '${req.body.username}' LIMIT 1`, (err, tableVal) => {
//                                 if (err) throw err;
//                                 if (tableVal.length === 0) {
//                                     req.session.image = undefined
//                                 }else {
//                                     req.session.image = tableVal[0].imagePath;
//                                 }
    
//                                 return res.redirect('/discover');
//                             });
//                         }else {
//                             let testErrors = [{
//                                 msg: 'Password does not match.',
//                                 param: 'password',
//                                 location: 'body'
//                             }]
//                             // return res.redirect("/login");
//                             return res.render('pages/login', {
//                                 title : "Login",
//                                 data: req.session,
//                                 errors: testErrors
//                             });
//                         }
//                     }
//                 });
//             }
//         });
//     }
// });

router.post('/', async (req, res) => {
    // Validate the data before entry to the database
    const {error} = loginValidation(req.body);
    // if (error) return res.status(400).json({success: false, message: error.details[0].message});
    if (error) return res.render('pages/login', {
        title : "Login",
        data: req.session,
        errors: [{
            msg: error.details[0].message
        }]
    });

    // Checking if the email already exists
    const user =  await User.findOne({username: req.body.username});
    // if (!user) return res.status(400).json({success: false, message: 'Email doesn\'t exists'});
    if (!user) return res.render('pages/login', {
        title : "Login",
        data: req.session,
        errors: [{
            msg: 'Email doesn\'t exists'
        }]
    });

    // return res.send(user.password)
    // Check if password is correct
    const password = await bcrypt.compare(req.body.password, user.password);
    // if (!password) return res.status(400).json({success: false, message: 'Password doesn\'t match'});
    if (!password) return res.render('pages/login', {
        title : "Login",
        data: req.session,
        errors: [{
            msg: 'Password doesn\'t match'
        }]
    });

    if (!user.verified) return res.render('pages/login', {
        title : "Login",
        data: req.session,
        errors: [{
            msg: 'Please verify your email address'
        }]
    });
    // console.log(user)

    req.session.userId = user._id;
    req.session.firstname = user.firstName;
    req.session.lastname = user.lastName;
    req.session.username = user.username;
    req.session.email = user.email;
    // req.session.password = user.password;

    return res.redirect('/discover');
});

module.exports = router;