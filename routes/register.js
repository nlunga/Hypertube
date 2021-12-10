const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const {registerValidation, loginValidation} = require('../validation');
const db = require('../config/connection');
const User = require('../models/User');
const {redirectLogin, redirectDashboard} = require('./accessControls');
const nodemailer = require('nodemailer');
const { v1: uuidv1 } = require('uuid');
const saltRounds = 10;
// const emailToken = uuidv1();
const emailToken = require('crypto').randomBytes(20).toString('hex');
const port = process.env.PORT;


router.get('/', redirectDashboard, (req, res) => { 
    let user = req.session;
    let err = undefined
    global.CURRENT_PAGE = 'signup';
    res.render('pages/register', {
        title : "Sign Up",
        data: user,
        errors: err
    });
});

// router.post('/', [
//     check('firstname')
//     .isAlpha()
//     .not().isEmpty().withMessage('Firstname field must not be empty')
//     .trim()
//     .escape(),
//     check('lastname')
//     .isAlpha()
//     .not().isEmpty().withMessage('Lastname field must not be empty')
//     .trim()
//     .escape(),
//     check('email')
//     .isEmail()
//     .normalizeEmail(),
//     check('username')
//     .isAlphanumeric()
//     .not().isEmpty().withMessage('Username field must not be empty')
//     .trim()
//     .escape()
//     .isLength({ min: 4 }),
//     check('password')
//         .isLength({ min:8 }).withMessage('Password must be at least 8 characters in length.')
//         .matches('[0-9]').withMessage('Password must contain at least 1 number.')
//         .matches('[a-z]').withMessage('Password must contain at least 1 lowercase letter.')
//         .matches('[A-Z]').withMessage('Password must contain at least 1 uppercase letter.')
//         .matches(['[^A-Za-z0-9]']).withMessage('Password must contain at least 1 special character.'),
//     check('confPassword').custom((value, { req }) => { 
//         if (value !== req.body.password) {
//           throw new Error('Password confirmation does not match password');
//         }
//         // Indicates the success of this synchronous custom validator
//         return true;
//     })
// ], (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()){
//         // console.log(errors);
//         res.render('pages/register', {
//             title : "Sign Up",
//             data: req.session,
//             errors: errors.errors
//         });
//         // return res.status(422).json({errors : errors.array()});
//     }else {
//         bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
//             var confirmed = 0;
//             con.query(`SELECT * FROM users WHERE email = ? LIMIT 1`, [req.body.email], (err, dbData) => {
//                 if (err) throw err;
//                 if (dbData.length === 0) {
//                     con.query("INSERT INTO users (firstName, lastName, userName, email, password, languagePreference, verified, token) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", [req.body.firstname, req.body.lastname, req.body.username, req.body.email, hash, "English", confirmed, emailToken], (err, result) => {
//                         if (err) throw err;
//                         console.log("1 record inserted");
//                     });

//                     const transporter = nodemailer.createTransport({
//                         secure: true,
//                         service: 'gmail',
//                         auth: {
//                             user: 'matchamanagment@gmail.com',
//                             pass: 'welcometomatcha'
//                             // pass: '9876543210khulu'
//                         },
//                         tls: {
//                             // do not fail on invalid certs
//                             rejectUnauthorized: false
//                         }
//                     });
//                     // var emailToken = "jhdashghohwg2gwg";
//                     const conUrl = `http://localhost:${port}/confirmation/${emailToken}`;
//                     const mailOptions = {
//                         from: 'matchamanagment@gmail.com',
//                         to: req.body.email,
//                         subject: 'Please Verify your email',
//                         text: `That was easy!`,
//                         html: `Please click on the link bellow to confirm your email:<br>
                                
//                         <a href="${conUrl}"><button type="button" class="btn btn-outline-secondary">Confirm</button></a>
//                         `
//                     };
                        
//                     transporter.sendMail(mailOptions, (error, info) => {
//                         if (error) {
//                             console.log(error);
//                         } else {
//                             console.log('Email sent: ' + info.response);
//                         }
//                     });
        
//                     res.render('pages/register-success', {
//                         title: "Verify Account",
//                         data: req.body
//                     });
//                 }else {
//                     return res.render('pages/register', {
//                         title : "Sign Up",
//                         data: req.session,
//                         errors: [{
//                             msg: 'Email already exist',
//                             param: 'email',
//                             location: 'body'
//                         }]
//                     });
//                 }
//             })
//         });
//     }
// });



router.post('/', redirectDashboard, async (req, res) => {
    // Validate the data before entry to the database
    console.log(req.body);
    const {error} = registerValidation(req.body);
    console.log(error);
    // if (error) return res.status(400).json({success: false, message: error.details[0].message});
    console.log("After ERROR");
    if (error) return res.render('pages/register', {
        title : "Sign Up",
        data: req.session,
        status: 400,
        success: false,
        errors: [{
            msg: error.details[0].message
        }]
    });
    console.log("After ERROR IF");
    // Checking if the user already exists
    const emailExist =  await User.findOne({email: req.body.email});
    // if (emailExist) return res.status(400).json({success: false, message: 'Email already exists'})
    if (emailExist) return res.render('pages/register', {
        title : "Sign Up",
        data: req.session,
        status: 400,
        success: false,
        errors: [{
            msg: 'Email already exists'
        }]
    });
    
    // Hash password
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    
    // Create a new user
    const user = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword,
        token: emailToken
    });

    //  languagePreference, verified, token

    try {
        const savedUser = await user.save();
        res.status(200).json({success: true, message: `User ${savedUser.firstName} ${savedUser.lastName} has been created`});
        let testAccount = await nodemailer.createTestAccount();

        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
            secure: true,
            service: 'gmail',
            auth: {
                user: 'matchamanagment@gmail.com',
                // pass: 'welcometomatcha'
                pass: '9876543210khulu'
            },
            tls: {
                // do not fail on invalid certs
                rejectUnauthorized: false
            }
        });

        // send mail with defined transport object
        const url = `http://localhost:${port}/confirmation/${emailToken}`;
        let info = await transporter.sendMail({
            from: '"Fred Foo 👻" matchamanagment@gmail.com', // sender address
            to: req.body.email, // list of receivers
            subject: "Please verify your email ✔", // Subject line
            // text: "Hello world?", // plain text body
            html: `
            <!DOCTYPE html>
            <html>
                        
                <head>
                    <title></title>
                    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
                    <meta name="viewport" content="width=device-width, initial-scale=1">
                    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
                    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css">
                    <style type="text/css">
                        @media screen {
                            @font-face {
                                font-family: 'Lato';
                                font-style: normal;
                                font-weight: 400;
                                src: local('Lato Regular'), local('Lato-Regular'), url(https://fonts.gstatic.com/s/lato/v11/qIIYRU-oROkIk8vfvxw6QvesZW2xOQ-xsNqO47m55DA.woff) format('woff');
                            }
                
                            @font-face {
                                font-family: 'Lato';
                                font-style: normal;
                                font-weight: 700;
                                src: local('Lato Bold'), local('Lato-Bold'), url(https://fonts.gstatic.com/s/lato/v11/qdgUG4U09HnJwhYI-uK18wLUuEpTyoUstqEm5AMlJo4.woff) format('woff');
                            }
                
                            @font-face {
                                font-family: 'Lato';
                                font-style: italic;
                                font-weight: 400;
                                src: local('Lato Italic'), local('Lato-Italic'), url(https://fonts.gstatic.com/s/lato/v11/RYyZNoeFgb0l7W3Vu1aSWOvvDin1pK8aKteLpeZ5c0A.woff) format('woff');
                            }
                
                            @font-face {
                                font-family: 'Lato';
                                font-style: italic;
                                font-weight: 700;
                                src: local('Lato Bold Italic'), local('Lato-BoldItalic'), url(https://fonts.gstatic.com/s/lato/v11/HkF_qI1x_noxlxhrhMQYELO3LdcAZYWl9Si6vvxL-qU.woff) format('woff');
                            }
                        }
                
                        /* CLIENT-SPECIFIC STYLES */
                        body,
                        table,
                        td,
                        a {
                            -webkit-text-size-adjust: 100%;
                            -ms-text-size-adjust: 100%;
                        }
                
                        table,
                        td {
                            mso-table-lspace: 0pt;
                            mso-table-rspace: 0pt;
                        }
                
                        img {
                            -ms-interpolation-mode: bicubic;
                        }
                
                        /* RESET STYLES */
                        img {
                            border: 0;
                            height: auto;
                            line-height: 100%;
                            outline: none;
                            text-decoration: none;
                        }
                
                        table {
                            border-collapse: collapse !important;
                        }
                
                        body {
                            height: 100% !important;
                            margin: 0 !important;
                            padding: 0 !important;
                            width: 100% !important;
                        }
                
                        /* iOS BLUE LINKS */
                        a[x-apple-data-detectors] {
                            color: inherit !important;
                            text-decoration: none !important;
                            font-size: inherit !important;
                            font-family: inherit !important;
                            font-weight: inherit !important;
                            line-height: inherit !important;
                        }
                
                        /* MOBILE STYLES */
                        @media screen and (max-width:600px) {
                            h1 {
                                font-size: 32px !important;
                                line-height: 32px !important;
                            }
                        }
                
                        /* ANDROID CENTER FIX */
                        div[style*="margin: 16px 0;"] {
                            margin: 0 !important;
                        }
                    </style>
                </head>
                        
                <body style="background-color: #f4f4f4; margin: 0 !important; padding: 0 !important;">
                    <!-- HIDDEN PREHEADER TEXT -->
                    <div style="display: none; font-size: 1px; color: #fefefe; line-height: 1px; font-family: 'Lato', Helvetica, Arial, sans-serif; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;"> We're thrilled to have you here! Get ready to dive into your new account. </div>
                    <table border="0" cellpadding="0" cellspacing="0" width="100%">
                        <!-- LOGO -->
                        <tr>
                            <td bgcolor="#FFA73B" align="center">
                                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                                    <tr>
                                        <td align="center" valign="top" style="padding: 40px 10px 40px 10px;"> </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                        <tr>
                            <td bgcolor="#FFA73B" align="center" style="padding: 0px 10px 0px 10px;">
                                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                                    <tr>
                                        <td bgcolor="#ffffff" align="center" valign="top" style="padding: 40px 20px 20px 20px; border-radius: 4px 4px 0px 0px; color: #111111; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 48px; font-weight: 400; letter-spacing: 4px; line-height: 48px;">
                                            <h1 style="font-size: 48px; font-weight: 400; margin: 2;">Hi ${req.body.firstName} ${req.body.lastName}!</h1> <img src=" https://img.icons8.com/clouds/100/000000/handshake.png" width="125" height="120" style="display: block; border: 0px;" />
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                        <tr>
                            <td bgcolor="#f4f4f4" align="center" style="padding: 0px 10px 0px 10px;">
                                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                                    <tr>
                                        <td bgcolor="#ffffff" align="left" style="padding: 20px 30px 40px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">
                                            <p style="margin: 0;">We're excited to have you get started. First, you need to confirm your account. Just press the button below.</p>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td bgcolor="#ffffff" align="left">
                                            <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                                <tr>
                                                    <td bgcolor="#ffffff" align="center" style="padding: 20px 30px 60px 30px;">
                                                        <table border="0" cellspacing="0" cellpadding="0">
                                                            <tr>
                                                                <td align="center" style="border-radius: 3px;" bgcolor="#FFA73B"><a href="${url}" target="_blank" style="font-size: 20px; font-family: Helvetica, Arial, sans-serif; color: #ffffff; text-decoration: none; color: #ffffff; text-decoration: none; padding: 15px 25px; border-radius: 2px; border: 1px solid #FFA73B; display: inline-block;">Confirm You Email</a></td>
                                                            </tr>
                                                        </table>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr> <!-- COPY -->
                                    <!-- 
            
                                        <tr>
                                            <td bgcolor="#ffffff" align="left" style="padding: 0px 30px 0px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">
                                                <p style="margin: 0;">If that doesn't work, copy and paste the following link in your browser:</p>
                                            </td>
                                        </tr> 
                                        <tr>
                                            <td bgcolor="#ffffff" align="left" style="padding: 20px 30px 20px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">
                                                <p style="margin: 0;"><a href="#" target="_blank" style="color: #FFA73B;">https://bit.li.utlddssdstueincx</a></p>
                                            </td>
                                        </tr>
                                    -->
                                    <tr>
                                        <td bgcolor="#ffffff" align="left" style="padding: 0px 30px 20px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">
                                            <p style="margin: 0;">If you have any questions, just reply to this email—we're always happy to help out.</p>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td bgcolor="#ffffff" align="left" style="padding: 0px 30px 40px 30px; border-radius: 0px 0px 4px 4px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">
                                            <p style="margin: 0;">Cheers,<br>Hypertube Team</p>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                        <!--
                        <tr>
                            <td bgcolor="#f4f4f4" align="center" style="padding: 30px 10px 0px 10px;">
                                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                                    <tr>
                                        <td bgcolor="#FFECD1" align="center" style="padding: 30px 30px 30px 30px; border-radius: 4px 4px 4px 4px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">
                                            <h2 style="font-size: 20px; font-weight: 400; color: #111111; margin: 0;">Need more help?</h2>
                                            <p style="margin: 0;"><a href="#" target="_blank" style="color: #FFA73B;">We&rsquo;re here to help you out</a></p>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                        <tr>
                            <td bgcolor="#f4f4f4" align="center" style="padding: 0px 10px 0px 10px;">
                                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                                    <tr>
                                        <td bgcolor="#f4f4f4" align="left" style="padding: 0px 30px 30px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 14px; font-weight: 400; line-height: 18px;"> <br>
                                            <p style="margin: 0;">If these emails get annoying, please feel free to <a href="#" target="_blank" style="color: #111111; font-weight: 700;">unsubscribe</a>.</p>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr> -->
                    </table>
                    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.bundle.min.js"></script>
                    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
                </body>
                        
            </html>
            `, // html body
        });

        console.log("Message sent: %s", info.messageId);
        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

        // Preview only available when sending through an Ethereal account
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    } catch (err) {
        res.status(400).json({success: false, message: err});
    }
});

// router.post('/login', async (req, res) => {
//     // Validate the data before entry to the database
//     const {error} = loginValidation(req.body);
//     if (error) return res.status(400).json({success: false, message: error.details[0].message});
    
//     // Checking if the email already exists
//     const user =  await User.findOne({email: req.body.email});
//     if (!user) return res.status(400).json({success: false, message: 'Email doesn\'t exists'});

//     // return res.send(user.password)
//     // Check if password is correct
//     const password = await bcrypt.compare(req.body.password, user.password);
//     if (!password) return res.status(400).json({success: false, message: 'Password doesn\'t match'});
    
//     // Create and assign a token
//     const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET);
//     // res.header('auth.token', token);
//     return res.status(200).header('auth-token', token).json({success: true, message: `You are logged in`});
// });

module.exports = router;