const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const Book = require('./Book');

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

publisherSchema.plugin(mongoosePaginate);

publisherSchema.pre('remove', function(next) {
    Book.find({publisher: this.id}, (err, books) => {
        if (err) {
            next(err);
        }
        else if (books.length > 0) {
            next(new Error('This publisher still has book.'));
        }
        else {
            next();
        }
    });
});

module.exports = mongoose.model('Publisher', publisherSchema);