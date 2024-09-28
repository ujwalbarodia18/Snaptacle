const mongoose = require('mongoose')
// const plm = require('passport-local-mongoose');
const mongoUrl = process.env.MONGO_URL;
mongoose.connect(mongoUrl);

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String
    },
    profileImg: {
        type: String,
        default: 'https://demobktt.s3.ap-southeast-2.amazonaws.com/default-dp.jpg'
    },
    bio: {
        type: String
    },
    posts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Post'
        }
    ],
    followers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    following: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    saved: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Post'
        }
    ],
    stories: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Story',
            default: []
        }
    ]
})

// userSchema.plugin(plm);

module.exports = mongoose.model('User', userSchema);
