const express = require('express');
const app = express();
const router = express.Router();
require('dotenv').config();
const {v4:uuidv4} = require('uuid');
const path = require("path");
const mongoose = require('mongoose')
const fileparser = require('../fileparser');
const http = require('http');
const cors = require('cors');

const userModel = require('../models/user');
const postModel = require('../models/post.js')
const storyModel = require('../models/story.js')
const chatModel = require('../models/chat.js')
const server = http.createServer(app);
const io = require("socket.io")(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt')

const fs = require("fs")
app.use(cors());
io.use((socket, next) => {
    // Get the token from the query parameters
    const token = socket.handshake.query.token;
  
    if (!token) {
      return next(new Error('Authentication error: Token missing'));
    }
  
    // Verify the JWT token
    jwt.verify(token, 'abcdefghijklmnopqrstuvwxyz', (err, decoded) => {
      if (err) {
        return next(new Error('Authentication error: Invalid token'));
      }
  
      // Attach the user information to the socket for use in event handlers
      socket.user = decoded;
      next();
    });
});

io.on('connection', (socket) => {
    // Listen for new messages
    socket.on('newMessage', async (data) => {
    //   console.log('Id: ', data);
        
      // Save the message to MongoDB
      try {
        const id = (socket.user.userId < data.id) ? (socket.user.userId + data.id) : (data.id + socket.user.userId);
        const chat = await chatModel.findOne({ _id: id });
        if(chat) {
            chat.chats.push({
                user: socket.user.userId,
                message: data.message
            });
            await chat.save();
        }
        else {
            const newChat = new chatModel({
                _id: id,
                chats: [{
                    user: socket.user.userId,
                    message: data.message
                }]                
            });

            await newChat.save();
        }
        socket.broadcast.emit(id, data.message);
    }
    catch(err) {
        console.log('Error sending message: ', err)
    }
  
      // Broadcast the new message to all connected clients
      
    });
  
    // Disconnect event
    socket.on('disconnect', () => {
      console.log('User disconnected');
    });
});

router.get('/', (req, res) => {
    res.json({message: 'Hi World'})
});

router.get('/register', (req, res) => {
    res.json({message: true});
})

const authenticateMiddleware = (req, res, next) => {
    const token = req.body.authorization;
    // console.log(token)
    // Verify the token
    jwt.verify(token, 'abcdefghijklmnopqrstuvwxyz', (err, decodedToken) => {
      if (err) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
  
      req.userId = decodedToken.userId;

      next();
    });
};

router.get('/protected-route', authenticateMiddleware, (req, res) => {
    res.json({ message: 'This is a protected route' });
});

router.post('/register', async (req, res) => {
    const { username, name, password } = req.body;
  
    // Validate input data (e.g., check if email is unique)
    // Hash the password using bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);
  
    // Save user details to MongoDB
    const newUser = new userModel({
      username,
      name,
      password: hashedPassword,
    });
  
    await newUser.save();

    const user = await userModel.findOne({ username });
    const token = jwt.sign({ userId: user._id }, 'abcdefghijklmnopqrstuvwxyz', { expiresIn: '1h' });
    // res.cookie('token', token, { httpOnly: true });
    // Return the JWT to the client

    // res.json({ token, userId: user._id, username: user.username });
    // Return a response to the client
    res.status(201).json({ message: 'User registered successfully', token });
});

// Express route for user login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  // Find the user in the database
  const user = await userModel.findOne({ username });

  // Verify user credentials
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  // Generate a JWT
  const token = jwt.sign({ userId: user._id }, 'abcdefghijklmnopqrstuvwxyz', { expiresIn: '1h' });
  res.cookie('token', token, { httpOnly: true });
  // Return the JWT to the client
  res.json({ token, userId: user._id, username: user.username });
});

router.post('/profile', authenticateMiddleware, async(req, res) => {    
    // console.log('Post Profile');
    // console.log(req.userId);
    const user = await userModel.findOne({_id: req.userId}, {password: 0}).populate('posts');
    res.json({user, own: true})
});

router.post('/profile/:id', authenticateMiddleware, async(req, res) => {
    // console.log('Enterd id')
    // console.log(req.params.id);
    const currUser = await userModel.findOne({_id: req.params.id}, {password: 0}).populate('posts');
    
    if(currUser.followers.includes(req.userId)) {
        console.log('Yes following')
        res.json({currUser, own: false, isFollowing: true});
    }
    else {
        console.log('Not Following')
        res.json({currUser, own: false, isFollowing: false});
    }    
})

router.post('/follow/:id', authenticateMiddleware, async(req, res) => {
    const currUser = await userModel.findOne({_id: req.userId});    
    const profileUser = await userModel.findOne({_id: req.params.id}); 
    const idx = currUser.following.indexOf(req.params.id);
    const idx2 = profileUser.followers.indexOf(req.userId);
    if(idx != -1) {
        // console.log(idx)                       
        currUser.following.splice(idx, 1);
        profileUser.followers.splice(idx2, 1);
        await currUser.save();
        await profileUser.save();
        res.json({message: false, following: profileUser.following.length, followers: profileUser.followers.length});
    }
    else {
        // console.log('In: ', idx)
        const profileUser = await userModel.findOne({_id: req.params.id});
        currUser.following.push(req.params.id);
        profileUser.followers.push(req.userId);
        await currUser.save();
        await profileUser.save();
        res.json({message: true, following: profileUser.following.length, followers: profileUser.followers.length});
    }
})

router.post('/upload', authenticateMiddleware, async(req, res) => {
    // console.log('Entered')
    // await fileparser(req)
    // .then((data) => {
    //     console.log('Uploaded')
    //     res.status(200).json({
    //         message: "Success",
    //         data
    //     });
    // })
    // .catch((error) => {
    //     console.log('Not uploaded');
    //     return res.status(400).json({
    //     message: "An error occurred.",
    //     error
    //     })
    // })

    // console.log('Done')

    const uniqueName = uuidv4() + req.files.file.name;
    // console.log('Body: ', req.body['tags[]']);
    // const uniqueName = 'abc' + req.files.file.name;

    fs.writeFileSync(`../public/${uniqueName}`, req.files.file.data);
    const user = await userModel.findOne({_id: req.userId});
    // const tagArr = req.body
    const newPost = new postModel({
        image: `./${uniqueName}`,
        caption: req.body.caption,
        user: user._id,
        tags: req.body['tags[]']
    });
    await newPost.save();
    
    user.posts.push(newPost);
    await user.save();
    res.json({message: true})
})

router.post('/createStory', authenticateMiddleware, async(req, res) => {
    const uniqueName = uuidv4() + req.files.file.name;
    fs.writeFileSync(`../public/${uniqueName}`, req.files.file.data);
    const user = await userModel.findOne({_id: req.userId});
    const newStory = new storyModel({
        image: `./${uniqueName}`,
        user: user._id,
    });
    await newStory.save();
    
    user.stories.push(newStory);
    await user.save();

    setTimeout(async() => {         
        const idx = user.stories.indexOf(newStory);
        user.stories.splice(idx, 1);
        await storyModel.deleteOne({ _id: newStory._id });
        await user.save();
        console.log('Done')
    }, 60000);

    res.json({message: true})
})

router.post('/editProfile', authenticateMiddleware, async(req, res) => {
    try {
        const user = await userModel.findOne({_id: req.userId});
        console.log('Image: ', req.files);
        if(req.files && req.files.file) {
            const uniqueName = uuidv4() + req.files.file.name;
            // const uniqueName = 'aaaaa' + req.files.file.name;
            fs.writeFileSync(`../public/${uniqueName}`, req.files.file.data);
            user.profileImg = `./${uniqueName}`;
        }
        
        const {name, bio} = req.body;
        if(name) {
            user.name = name;
        }

        if(bio) {
            user.bio = bio
        }          

        await user.save();
        res.json({message: true});
    }
    catch(err) {
        console.log('Error Upload: ', err);
        res.json({message: false});
    }
    
    
})

router.post('/addComment/:post_id', authenticateMiddleware, async(req, res) => {
    try {
        const user = await userModel.findOne({_id: req.userId});
        const post = await postModel.findOne({_id: req.params.post_id});

        const comment = req.body.comment;
        const newComment = {
            comment,
            user: user._id
        }

        post.comments.push(newComment);
        await post.save();

        res.json({message: true, post})
    }
    catch(err) {
        console.log('Error at 234: ', err);
        res.json({message: false, err});
    }
})

router.post('/getComments/:post_id', authenticateMiddleware, async(req, res) => {
    try {
        const post = await postModel.findOne({_id: req.params.post_id}).populate('comments.user');
        res.json({message: true, comments: post.comments});
    }
    catch(err) {
        console.log('Error at 234: ', err);
        res.json({message: false, err});
    }
})

router.post('/feed', authenticateMiddleware, async(req, res) => {
    try {
        const user = await userModel.findOne({ _id: req.userId }, { password: 0 });
        const allPosts = await postModel.find().populate('user').sort({createdAt: -1});

        const posts = allPosts?.filter((post) => {
            return user.following.includes(post.user._id);
        })

        const usersWithStories = await userModel.find({
            $expr: { $gt: [{ $size: '$stories' }, 0] }
        });

        const filteredUsers = usersWithStories?.filter((storyUser) => {
            return user.following.includes(storyUser._id);
        })
        res.json({message: true, token: req.headers.authorization, posts, user, userWithStories: filteredUsers});
    }
    catch (err) {
        console.log('Error in fetching feed: ', err);
    }
    
});

router.post('/post/:post_id', authenticateMiddleware, async(req, res) => {
    const post = await postModel.findOne({ _id: req.params.post_id.toString() }).populate('user');
    res.json({post});
})

router.post('/getPost/:post_id', authenticateMiddleware, async(req, res) => {
    try{

        const user = await userModel.findOne({ _id: req.userId.toString() });
        const postId = req.params.post_id;
        const post = await postModel.findOne({ _id: postId.toString() });
        let liked = false, saved = false;
        if(post && post.likes.includes(user._id.toString())) {   
            liked = true;                 
        }
        if(user && user.saved.includes(post._id.toString())) {
            saved = true;
        }
        res.json({liked, saved, post});
    }
    catch(err) {
        console.log('/Post: ', err);
    }  
})

router.post('/getStories/:user_id', authenticateMiddleware, async(req, res) => {
    try {
        const stories = await userModel.findOne({ _id: req.params.user_id }, { _id: 0, stories: 1 }).populate('stories');
        res.json({message: true, stories});
    }
    catch(err) {
        console.log('Error in getting stories: ', err);
        res.json({message: false})
    }
})

router.post('/like/:post_id', authenticateMiddleware, async(req, res) => {
    const user = await userModel.findOne({ _id: req.userId });
    const post = await postModel.findOne({ _id: req.params.post_id });
    if(post.likes.includes(user._id)) {
        const idx = post.likes.indexOf(user._id);
        post.likes.splice(idx, 1);
        await post.save();
        res.json({liked: false});
    }
    else {
        post.likes.push(user._id);
        await post.save();
        res.json({liked: true});
    }
})

router.post('/save/:post_id', authenticateMiddleware, async(req, res) => {
    try {
        const user = await userModel.findOne({ _id: req.userId });
        const post = await postModel.findOne({ _id: req.params.post_id });
        if(user.saved.includes(post._id)) {
            const idx = user.saved.indexOf(post._id);
            user.saved.splice(idx, 1);
            await user.save();
            res.json({saved: false});
        }
        else {
            user.saved.push({_id: req.params.post_id});
            await user.save();
            res.json({saved: true});
        }        
    }
    catch(err) {
        console.log("Error in 318: ", err);
    }    
})

router.post('/getSavedPost', authenticateMiddleware, async(req, res) => {
    try {
        const saved = await userModel.findOne({ _id: req.userId }, {saved: 1, _id:0}).populate('saved');        
        res.json({message: true, saved})
    }
    catch(err) {
        console.log("Error in 318: ", err);
        res.json({message: false})
    }    
})

router.post('/getUser/:user_id', authenticateMiddleware, async(req, res) => {
    const user = await userModel.findOne({_id: req.params.user_id}).populate('followers').populate('following');
    res.json({user});
})

router.post('/getChatUser', authenticateMiddleware, async(req, res) => {
    try {
        const user = await userModel.findOne({_id: req.userId}, {password: 0}).populate('following');
        const chatUsers = user.following;
        res.json({message: true, chatUsers});
    }
    catch(err) {
        console.log('Error in getting chat user');
        res.json({message: false});
    }
})

router.post(`/postChat/:userId`, authenticateMiddleware, async(req, res) => {
    try {
        const chat = await chatModel.findOne({ _id: req.userId + req.params.userId }) ?? 
                     await chatModel.findOne({ _id:  req.params.userId + req.userId });
        if(chat) {
            chat.chats.push({
                user: req.userId,
                message: req.body.message
            });

            await chat.save();
        }
        else {
            const newChat = new chatModel({
                _id: req.userId + req.params.userId,
                chats: [{
                    user: req.userId,
                    message: req.body.message
                }]                
            });

            await newChat.save();
        }

        res.json({message: true, chat});
    }
    catch(err) {
        console.log('Error sending message: ', err)
    }
    
});

router.post(`/getChat/:userId`, authenticateMiddleware, async(req, res) => {
    const id = (req.userId.toString() < req.params.userId.toString()) ? (req.userId.toString() + req.params.userId.toString()) : (req.params.userId.toString() + req.userId.toString());
    const chat = await chatModel.findOne({ _id: (req.userId.toString() + req.params.userId.toString() ) }) ?? 
                     await chatModel.findOne({ _id:  (req.params.userId.toString() + req.userId.toString() )});
        if(chat) {
            res.json({message: true, chat});
        }
        else {
            res.json({message: false});
        }        
})

router.post('/addPost', authenticateMiddleware, (req, res) => {
    res.json({message: true})
});

router.post('/search', authenticateMiddleware, async(req, res) => {
    // console.log('In search')
    const users = await userModel.find({ _id:{ $ne:req.userId } });
    res.json({users});
});

router.post('/search/tags', async(req, res) => {
    const searchTag = req.body.searchTag;
    // console.log('Tag: ', searchTag)
    // const searchTag = 'ball';
    try {        
        const posts = await postModel.find(
            { $text: { $search: searchTag } }
        ).populate('user');

        res.json({message: true, posts});
    }
    catch(err) {
        console.log('Error in 328: ', err);
        res.json({message: false});
    }
});

io.listen(5000, () => {
    console.log('Socket server started at 5000');
})

module.exports = router;