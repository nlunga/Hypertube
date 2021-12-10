const mongoose = require('mongoose')

// id, firstName, lastName, username, email, password, languagePreference, verified, token

const userSchema = mongoose.Schema({
    firstName:  {
        type: String,
        required: true,
        max: 255,
        min: 3
    },
    lastName: {
        type: String,
        required: true,
        max: 255,
        min: 3
    },
    username:  {
        type: String,
        required: true,
        max: 255,
        min: 3
    },
    email:   {
        type: String,
        required: true,
        max: 255,
        min: 8
    },
    password:   {
        type: String,
        required: true,
        max: 255,
        min: 6
    },
    languagePreference:   {
        type: String,
        required: true,
        max: 255,
        min: 8,
        default: 'en'
    },
    verified: {
        type: Boolean,
        default: 0
    },
    token: {
        type: String,
        max: 1024,
        default: null
    },
    date: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Users', userSchema);