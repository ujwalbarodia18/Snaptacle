const express = require("express");
const app = express();
const router = express.Router();
require("dotenv").config();
const http = require("http");
const cors = require("cors");

const userModel = require("../models/user.model.js");
const postModel = require("../models/post.model.js");

const authenticateMiddleware = require('../authentication/authMiddleware.js')

app.use(cors());

router.get("/", async(req, res) => {
	res.json({ message: "Hi! World" });
});

router.post('/getUser', authenticateMiddleware, async(req, res) => {
    res.json({user: req.userId});
})

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
		res.json({message: false, err})
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

router.post("/addPost", authenticateMiddleware, (req, res) => {
	res.json({ message: true });
});

module.exports = router;