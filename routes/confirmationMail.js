const express = require('express');
const router = express.Router();
const db = require('../config/connection');
const {redirectLogin, redirectDashboard} = require('./accessControls');
const User = require('../models/User');

router.get('/:id', redirectDashboard, async (req, res) =>{
    let token = req.params.id;
    // console.log(token);
    const tokenExist =  await User.findOne({token: token});
    if (!tokenExist) {
        console.log("1" + token);
        
        return res.render('pages/confirmError', {
            title : "Something went wrong",
            data: req.session,
            errors: [{
                msg: 'Something went wrong. Please contact the administrator for more information',
            }]
        });
    } else {
        try {
            const updatedUser = await User.updateOne({token: token}, {
                $set: {
                    verified: 1,
                    token: null
                }
            });
            return res.redirect('/login');
        } catch (error) {
            console.log(error);
            console.log("2 " + token);
            return res.render('pages/confirmError', {
                title : "Something went wrong",
                data: req.session,
                errors: [{
                    msg: 'Something went wrong. Please contact the administrator for more information',
                }]
            });
        }
    }
});

module.exports = router;