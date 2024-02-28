const mongoose = require('mongoose')

mongoose.connect('mongodb+srv://ujwalb:temp123@cluster0.s8txp8u.mongodb.net/Instagram');

const chatSchema = mongoose.Schema({
    _id: {
        type: String,
        required: true
    },
    chats: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            },
            message: {
                type: String
            },
            createdAt: {
                type: Date,
                default: Date.now
            }
        },
    ]
});

const chatModel = mongoose.model('Chat', chatSchema); 


module.exports = chatModel;