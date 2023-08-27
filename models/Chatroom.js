const mongoose = require('mongoose');

const chatroomSchema = new mongoose.Schema({
    name: {
        type: String,
        required: 'Please enter a name!',
    },   
});

module.exports = mongoose.model('Chatroom', chatroomSchema);