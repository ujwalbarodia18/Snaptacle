const mongoose = require('mongoose')

mongoose.connect('mongodb+srv://ujwalb:temp123@cluster0.s8txp8u.mongodb.net/Instagram');

const postSchema = mongoose.Schema({
    image: {
        type: String,
        required: true
    },
    caption: {
        type: String
    },
    comments: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            },
            comment: {
                type: String,
                // required: true
            }
        }
    ],
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    tags: [ String ]
});

const postModel = mongoose.model('Post', postSchema); 

// const createIndex = async() => {
//     postModel.createIndexes({
//         tags: 'text'
//     });

    
    // console.log('52: ', res);
// }

postModel.collection.getIndexes((err, idx) => {
    console.log('50: ', idx);
})

// createIndex();


module.exports = postModel;