const mongoose = require('mongoose')

// id, imagePath, username

const imageSchema = mongoose.Schema({
    imagePath:  {
        type: String,
        required: true,
        max: 255,
        min: 3
    },
    username: {
        type: String,
        required: true,
        max: 255,
        min: 3
    },
    date: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Images', imageSchema);


