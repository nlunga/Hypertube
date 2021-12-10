const mongoose = require('mongoose')

// id, mediaName, mediaRating, releaseDate, mediaPicture, mediaLink, username

const viewedSchema = mongoose.Schema({
    mediaName:  {
        type: String,
        required: true,
        max: 255,
        min: 3
    },
    mediaRating: {
        type: String,
        required: true,
        max: 255,
        min: 3
    },
    releaseDate:  {
        type: String,
        required: true,
        max: 255,
        min: 3
    },
    mediaPicture:   {
        type: String,
        required: true,
        max: 255,
        min: 8
    },
    mediaLink:   {
        type: String,
        required: true,
        max: 255,
        min: 8
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

module.exports = mongoose.model('Viewed', viewedSchema);