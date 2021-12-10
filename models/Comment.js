const mongoose = require('mongoose')

// id, movieName, tvSeriesName, comment, username, imagePath

const commentSchema = mongoose.Schema({
    movieName:  {
        type: String,
        required: false,
        max: 255,
        min: 3,
        default: null
    },
    tvSeriesName: {
        type: String,
        required: false,
        max: 255,
        min: 3,
        default: null
    },
    comment:  {
        type: String,
        required: true,
        max: 255,
        min: 3
    },
    username:   {
        type: String,
        required: true,
        max: 255,
        min: 3
    },
    imagePath:   {
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

module.exports = mongoose.model('Comments', commentSchema);