const express = require("express");
const app = express();
const router = express.Router();
require("dotenv").config();
const http = require("http");
const cors = require("cors");
const uploadFile = require('../upload.js')
const sendMail = require('../sendMail.js')
const AWS = require('aws-sdk');


const s3 = new AWS.S3({
	accessKeyId: process.env.AWS_ACCESS_KEY_ID,
	secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});


const userModel = require("../models/user");
const postModel = require("../models/post.js");
const storyModel = require("../models/story.js");
const chatModel = require("../models/chat.js");
const server = http.createServer(app);
const io = require("socket.io")(server, {
	cors: {
		origin: "*",
		methods: ["GET", "POST"],
	},
});

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const fs = require("fs");
app.use(cors());

io.use((socket, next) => {
	// Get the token from the query parameters
	const token = socket.handshake.query.token;

	if (!token) {
		return next(new Error("Authentication error: Token missing"));
	}

	// Verify the JWT token
	jwt.verify(token, "abcdefghijklmnopqrstuvwxyz", (err, decoded) => {
		if (err) {
			return next(new Error("Authentication error: Invalid token"));
		}

		// Attach the user information to the socket for use in event handlers
		socket.user = decoded;
		next();
	});
});

io.on("connection", (socket) => {
	socket.on("join-chat", (e) => {
        // console.log(e + ' ' + socket.user.userId);
		// console.log()
        let roomID = e;
		// const roomID = (socket.user.userId < e) ? socket.user.userId + e : e + socket.user.userId;
		// Listen for new messages
		// console.log('Room id: ', roomID)
		socket.on(roomID, async (data) => {
			  console.log('Id: ', data);

			// Save the message to MongoDB
			try {
				// const id =
				// 	socket.user.userId < data.id
				// 		? socket.user.userId + data.id
				// 		: data.id + socket.user.userId;
				const chat = await chatModel.findOne({ _id: roomID });
				if (chat) {
					chat.chats.push({
						user: socket.user.userId,
						message: data.message,
					});
					await chat.save();
				} 
                else {
					const newChat = new chatModel({
						_id: roomID,
						chats: [
							{
								user: socket.user.userId,
								message: data.message,
							},
						],
					});

					await newChat.save();
				}
				socket.broadcast.emit(roomID, data.message);
			} catch (err) {
				console.log("Error sending message: ", err);
			}

			// Broadcast the new message to all connected clients
		});

		// Disconnect event
		socket.on("disconnect", () => {
			console.log("User disconnected");
		});
	});
});

router.get("/", async(req, res) => {
	res.json({ message: "Hi! World" });
});

router.get("/register", (req, res) => {
	res.json({ message: true });
});

const authenticateMiddleware = (req, res, next) => {
	const token = req.body.authorization ? req.body.authorization : req.headers.authorization;

	if (!token) {
		return res.status(401).json({ message: "Unauthorized" });
	}
	// Verify the token
	jwt.verify(token, "abcdefghijklmnopqrstuvwxyz", (err, decodedToken) => {
		if (err) {
			return res.status(401).json({ message: "Unauthorized" });
		}

		req.userId = decodedToken.userId;
		next();
	});
};

router.post('/getUser', authenticateMiddleware, async(req, res) => {
    res.json({user: req.userId});
})

router.post("/register", async (req, res) => {
	const { username, name, email, password } = req.body;

	const hashedPassword = await bcrypt.hash(password, 10);
	// Save user details to MongoDB
	const newUser = new userModel({
		username,
		name,
		email,
		password: hashedPassword,
	});

	await newUser.save();

	const user = await userModel.findOne({ username });
	const token = jwt.sign({ userId: user._id }, "abcdefghijklmnopqrstuvwxyz", {
		expiresIn: "1h",
	});

	res.status(201).json({ message: true, token });
});

let OTP;
// Express route for user login
router.post("/login", async (req, res) => {
	try {
		const { username, password } = req.body;
		// Find the user in the database
		const user = await userModel.findOne({ username });
		console.log('User: ', user)
		// Verify user credentials
		if (!user || !(await bcrypt.compare(password, user.password))) {
			return res.status(401).json({ message: "Invalid credentials" });
		}
		
		// Generate a JWT
		const token = jwt.sign({ userId: user._id }, "abcdefghijklmnopqrstuvwxyz", {
			expiresIn: "1h",
		});

		res.cookie("token", token, { httpOnly: true });
		OTP = sendMail(user.email);
		// Return the JWT to the client
		res.json({ token, userId: user._id, username: user.username, email: user.email});
	}
	catch(err) {
		res.json({message: false})
	}
});

router.post('/verification', async(req, res) => {
	const otp = req.body.OTP;	
	console.log('otp: ', otp, ' OTP: ', OTP)
	if(otp == OTP) {
		OTP = null;
		res.send({message: true});
	}
	else {
		OTP = null;
		res.send({message: false});
	}
})

router.post("/profile", authenticateMiddleware, async (req, res) => {		
	try {
		const user = await userModel
		.findOne({ _id: req.userId }, { password: 0 })
		.populate("posts");
		res.json({ user, own: true });	
	}
	catch(err) {
		console.log('Err')
		res.json({message: false})
	}
});

router.post("/profile/:id", authenticateMiddleware, async (req, res) => {
	// console.log('Enterd id')
	// console.log(req.params.id);	
	const currUser = await userModel
		.findOne({ _id: req.params.id }, { password: 0 })
		.populate("posts");
	console.log('currUser: ', currUser)
	if (currUser.followers.includes(req.userId)) {
		console.log("Yes following");
		res.json({ currUser, own: false, isFollowing: true });
	} else {
		console.log("Not Following");
		res.json({ currUser, own: false, isFollowing: false });
	}
});

router.post("/follow/:id", authenticateMiddleware, async (req, res) => {
	const currUser = await userModel.findOne({ _id: req.userId });
	const profileUser = await userModel.findOne({ _id: req.params.id });
	const idx = currUser.following.indexOf(req.params.id);
	const idx2 = profileUser.followers.indexOf(req.userId);
	if (idx != -1) {
		// console.log(idx)
		currUser.following.splice(idx, 1);
		profileUser.followers.splice(idx2, 1);
		await currUser.save();
		await profileUser.save();
		res.json({
			message: false,
			following: profileUser.following.length,
			followers: profileUser.followers.length,
		});
	} else {
		// console.log('In: ', idx)
		const profileUser = await userModel.findOne({ _id: req.params.id });
		currUser.following.push(req.params.id);
		profileUser.followers.push(req.userId);
		await currUser.save();
		await profileUser.save();
		res.json({
			message: true,
			following: profileUser.following.length,
			followers: profileUser.followers.length,
		});
	}
});

router.post("/upload", authenticateMiddleware, async (req, res) => {
	const location = await uploadFile(req.files.file);

	console.log('Location: ', location)	
	const user = await userModel.findOne({ _id: req.userId });
			const newPost = new postModel({
				image: location,
				caption: req.body.caption,
				user: user._id,
				tags: req.body["tags[]"],
			});
			await newPost.save();
			user.posts.push(newPost);
			await user.save();

			res.json({message: true})
});

router.post("/createStory", authenticateMiddleware, async (req, res) => {
	const location = await uploadFile(req.files.file);

	const user = await userModel.findOne({ _id: req.userId });

	const newStory = new storyModel({
		image: location,
		user: user._id,
	});
	await newStory.save();

	user.stories.push(newStory);
	await user.save();

	setTimeout(async () => {
		const idx = user.stories.indexOf(newStory);
		user.stories.splice(idx, 1);
		await storyModel.deleteOne({ _id: newStory._id });
		await user.save();

		const params = {
			Bucket: process.env.S3_BUCKET,
			Key: req.files.file.name
		};

		s3.deleteObject(params, (err, data) => {
			if(err) {
				console.log('Error in deleting: ', err);
			}
		});
		// console.log("Done");
	}, 60000);

	res.json({ message: true });
});

router.post("/editProfile", authenticateMiddleware, async (req, res) => {
	try {
		const user = await userModel.findOne({ _id: req.userId });
		console.log("Image: ", req.files);
		if (req.files && req.files.file) {
			const location = await uploadFile(req.files.file);
			user.profileImg = location;
		}
		const { name, bio } = req.body;
		if (name) {
			user.name = name;
		}
		if (bio) {
			user.bio = bio;
		}
		await user.save();
		res.json({ message: true });
	} catch (err) {
		console.log("Error Upload: ", err);
		res.json({ message: false });
	}
});

router.post(
	"/addComment/:post_id",
	authenticateMiddleware,
	async (req, res) => {
		try {
			const user = await userModel.findOne({ _id: req.userId });
			const post = await postModel.findOne({ _id: req.params.post_id });

			const comment = req.body.comment;
			const newComment = {
				comment,
				user: user._id,
			};

			post.comments.push(newComment);
			await post.save();

			res.json({ message: true, post });
		} catch (err) {
			console.log("Error at 234: ", err);
			res.json({ message: false, err });
		}
	}
);

router.post("/getComments/:post_id", authenticateMiddleware, async (req, res) => {
		try {
			const post = await postModel
				.findOne({ _id: req.params.post_id })
				.populate("comments.user");
			res.json({ message: true, comments: post.comments });
		} catch (err) {
			console.log("Error at 234: ", err);
			res.json({ message: false, err });
		}
	}
);

router.post("/feed", authenticateMiddleware, async (req, res) => {
	try {
		const user = await userModel.findOne({ _id: req.userId }, { password: 0 });
		const allPosts = await postModel
			.find()
			.populate("user")
			.sort({ createdAt: -1 });

		const posts = allPosts?.filter((post) => {
			return (post.user._id == req.userId) || (user.following.includes(post.user._id));
		});

		const usersWithStories = await userModel.find({
			$expr: { $gt: [{ $size: "$stories" }, 0] },
		});

		const filteredUsers = usersWithStories?.filter((storyUser) => {
			return user.following.includes(storyUser._id);
		});
		res.json({
			message: true,
			token: req.headers.authorization,
			posts,
			user,
			userWithStories: filteredUsers,
		});
	} catch (err) {
		console.log("Error in fetching feed: ", err);
	}
});

router.post("/post/:post_id", authenticateMiddleware, async (req, res) => {
	try {
		const post = await postModel
		.findOne({ _id: req.params.post_id.toString() })
		.populate("user");
		res.json({ post });
	}
	catch(err) {
		console.log('Error in getting post: ', err);
		res.json({post: null})
	}
});

router.post("/getPost/:post_id", authenticateMiddleware, async (req, res) => {
	try {
		const user = await userModel.findOne({ _id: req.userId.toString() });
		const postId = req.params.post_id;
		const post = await postModel.findOne({ _id: postId.toString() });
		let liked = false,
			saved = false;
		if (post && post.likes.includes(user._id.toString())) {
			liked = true;
		}
		if (user && user.saved.includes(post._id)) {
			saved = true;
		}
		res.json({ liked, saved, post });
	} catch (err) {
		res.json({message: false})
		// console.log("/Post: ", err);
	}
});

router.post("/getStories/:user_id",
	authenticateMiddleware,
	async (req, res) => {
		try {
			const stories = await userModel
				.findOne({ _id: req.params.user_id }, { _id: 0 })
				.populate("stories");
			res.json({ message: true, stories });
		} catch (err) {
			// console.log("Error in getting stories: ", err);
			res.json({ message: false });
		}
	}
);

router.post("/like/:post_id", authenticateMiddleware, async (req, res) => {
	const user = await userModel.findOne({ _id: req.userId });
	const post = await postModel.findOne({ _id: req.params.post_id });
	let idx = -1;
	post.likes.forEach((ele, index) => {
		if(ele.toString() == user._id) {				
			idx = index;
		}
	})
	
	if (idx != -1) {
		post.likes.splice(idx, 1);
		await post.save();
		res.json({ liked: false });
	} else {
		post.likes.push(user._id);
		await post.save();
		res.json({ liked: true });
	}
});

router.post("/save/:post_id", authenticateMiddleware, async (req, res) => {
	try {
		const user = await userModel.findOne({ _id: req.userId });
		const post = await postModel.findOne({ _id: req.params.post_id });

		let idx = -1;
		user.saved.forEach((ele, index) => {
			if(ele._id == post._id) {
				idx = index;
			}
		})
		if (idx != -1) {
			user.saved.splice(idx, 1);
			await user.save();
			res.json({ saved: false });
		} else {
			user.saved.push({ _id: post._id });
			await user.save();
			res.json({ saved: true });
		}
	} catch (err) {
		console.log("Error in 318: ", err);
	}
});

router.post("/getSavedPost", authenticateMiddleware, async (req, res) => {
	try {
		const saved = await userModel
			.findOne({ _id: req.userId }, { saved: 1, _id: 0 })
			.populate("saved");
		res.json({ message: true, saved });
	} catch (err) {
		// console.log("Error in 318: ", err);
		res.json({ message: false });
	}
});

router.post("/getUser/:user_id", authenticateMiddleware, async (req, res) => {
	try {
		console.log('In get user')
		const user = await userModel
			.findOne({ _id: req.params.user_id })
			.populate("followers")
			.populate("following");
		res.json({ user });
	}
	catch(err) {
		res.json({message: false})
	}
	
});

router.post("/getChatUser", authenticateMiddleware, async (req, res) => {
	try {
		const user = await userModel
			.findOne({ _id: req.userId }, { password: 0 })
			.populate("following");
		const chatUsers = user.following;
		res.json({ message: true, chatUsers, userId: user._id });
	} catch (err) {
		console.log("Error in getting chat user");
		res.json({ message: false });
	}
});

router.post(`/getChat/:userId`, authenticateMiddleware, async (req, res) => {
	const id = req.params.userId;
			
	const chat =
		(await chatModel.findOne({
			_id: id
		})) 
	if (chat) {		
		res.json({ message: true, chat});
	} else {
		res.json({ message: false });
	}
});

router.post("/addPost", authenticateMiddleware, (req, res) => {
	res.json({ message: true });
});

router.post("/search", authenticateMiddleware, async (req, res) => {
	// console.log('In search')
	try {
		const users = await userModel.find({ _id: { $ne: req.userId } });
		res.json({ users });
	}
	catch(err) {
		res.json({message: false})
	}
	
});

router.post("/search/tags", async (req, res) => {
	const searchTag = req.body.searchTag;
	// console.log('Tag: ', searchTag)
	// const searchTag = 'ball';
	try {
		const posts = await postModel
			.find({ $text: { $search: searchTag } })
			.populate("user");

		res.json({ message: true, posts });
	} catch (err) {
		res.json({ message: false });
	}
});

io.listen(5000, () => {
	console.log("Socket server started at 5000");
});

module.exports = router;