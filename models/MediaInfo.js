const mongoose = require('mongoose')

// id, mediaName, mediaMagnet, entryDate, mediaSize , currentSize, status

const mediaInfoSchema = mongoose.Schema({
    mediaName:  {
        type: String,
        required: true,
        max: 255,
        min: 3
    },
    mediaMagnet: {
        type: String,
        required: true,
        max: 255,
        min: 3
    },
    entryDate:  {
        type: Date,
        default: Date.now
    },
    mediaSize:   {
        type: mongoose.Decimal128,
        required: true,
        max: 255,
        min: 8
    },
    currentSize:   {
        type: mongoose.Decimal128,
        required: true,
        max: 255,
        min: 8
    },
    status: {
        type: Boolean,
        default: 0
    },
    date: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('MediaInfo', mediaInfoSchema);