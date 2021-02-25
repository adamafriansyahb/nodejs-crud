const mongoose = require('mongoose');

const publisherSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    headquarter: {
        type: String,
        required: true
    },
    ceo: {
        type: String,
        required: true
    },
    foundedAt: {
        type: Date
    }
});

module.exports = mongoose.model('Publisher', publisherSchema);