const mongoose = require('mongoose')
const mongoUrl = process.env.MONGO_URL;
mongoose.connect(mongoUrl);

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