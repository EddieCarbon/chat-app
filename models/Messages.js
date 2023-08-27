const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    chatroom: {
        type: mongoose.Schema.Types.ObjectId,
        required: 'Please enter a chatroom!',
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: 'Please enter a user!',
        ref: 'User',
    },
    message: {
        type: String,
        required: 'Please enter a message!',
    },
});

module.exports = mongoose.model('Message', messageSchema);