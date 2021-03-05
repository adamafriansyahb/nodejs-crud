const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Author',
        required: true
    },
    pageCount: {
        type: Number,
        required: true
    },
    publishedAt: {
        type: Date,
        required: true
    },
    publisher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Publisher',
        required: true
    },
    summary: {
        type: String,
        required: true
    },
    cover: {
        type: String,
        required: true
    }
});

bookSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Book', bookSchema);