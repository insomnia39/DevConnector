const mongoose = require('mongoose');
const userModel = {
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    avatar: {
        type: String
    },
    date: {
        type: Date,
        default: Date.now
    }
};
const UserSchema = new mongoose.Schema(userModel);

module.exports = User = mongoose.model('user', UserSchema);