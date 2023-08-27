const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: 'Please enter a name!',
    },
    email: {
        type: String,
        required: 'Please enter an email!',
        unique: true,
    },
    password: {
        type: String,
        required: 'Please enter a password!',
    }
},
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('User', userSchema);