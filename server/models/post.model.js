const mongoose = require('mongoose')
const mongoUrl = process.env.MONGO_URL;
mongoose.connect(mongoUrl);

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
// }
// createIndex();

// postModel.collection.getIndexes((err, idx) => {
//     console.log('50: ', idx);
// })

module.exports = postModel;