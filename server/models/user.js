const mongoose = require('mongoose')
// const plm = require('passport-local-mongoose');

mongoose.connect('mongodb+srv://ujwalb:temp123@cluster0.s8txp8u.mongodb.net/Instagram');

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
    password: {
        type: String
    },
    profileImg: {
        type: String,
        default: './default-dp.jpg'
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
