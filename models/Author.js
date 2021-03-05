const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const Book = require('./Book');

const authorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    nationality: {
        type: String,
        required: true
    }
});

authorSchema.plugin(mongoosePaginate);

authorSchema.pre('remove', function(next) {
    Book.find({author: this.id}, (err, books) => {
        if (err) {
            next(err);
        }
        else if (books.length > 0) {
            next(new Error('This author still has book.'));
        }
        else {
            next();
        }
    });
});

module.exports = mongoose.model('Author', authorSchema);