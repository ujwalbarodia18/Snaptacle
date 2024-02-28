const express = require("express");
const app = express();
const router = express.Router();
require("dotenv").config();
const http = require("http");
const cors = require("cors");

const userModel = require("../models/user.model.js");
const postModel = require("../models/post.model.js");
// const storyModel = require("../models/story");

const authenticateMiddleware = require('../authentication/authMiddleware.js')

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

module.exports = router