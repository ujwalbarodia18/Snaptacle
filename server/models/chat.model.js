const mongoose = require('mongoose')
const mongoUrl = process.env.MONGO_URL;
mongoose.connect(mongoUrl);

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