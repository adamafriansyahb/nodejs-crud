const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Role',
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
});

userSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('User', userSchema);