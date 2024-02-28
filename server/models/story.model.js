const mongoose = require('mongoose')

mongoose.connect('mongodb+srv://ujwalb:temp123@cluster0.s8txp8u.mongodb.net/Instagram');

const storySchema = mongoose.Schema({
    image: {
        type: String,
        required: true
    },    
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const storyModel = mongoose.model('Story', storySchema); 

module.exports = storyModel;