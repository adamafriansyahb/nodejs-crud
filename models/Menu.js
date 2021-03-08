const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const menuSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true
    },
    path: {
        type: String,
        required: true
    },
    logo: {
        type: String,
        required: true
    }
});

menuSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Menu', menuSchema);