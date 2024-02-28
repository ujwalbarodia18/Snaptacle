const express = require("express");
const app = express();
const router = express.Router();
require("dotenv").config();
const http = require("http");
const cors = require("cors");

const userModel = require("../models/user.model.js");
const postModel = require("../models/post.model.js");

const authenticateMiddleware = require('../authentication/authMiddleware.js')

app.use(cors())

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
			console.log('Ele: ', ele)
			console.log('Post: ', post._id)
			if(ele.toString() == post._id.toString()) {
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

router.post("/addComment/:post_id",
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

router.post("/follow/:id", authenticateMiddleware, async (req, res) => {
	const currUser = await userModel.findOne({ _id: req.userId });
	const profileUser = await userModel.findOne({ _id: req.params.id });
	const idx = currUser.following.indexOf(req.params.id);
	const idx2 = profileUser.followers.indexOf(req.userId);
	if (idx != -1) {
		console.log('In if')
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
		console.log('In else')
		const profileUser = await userModel.findOne({ _id: req.params.id });
		console.log('1')
		currUser.following.push(req.params.id);
		console.log(2)
		profileUser.followers.push(req.userId);
		console.log(3)
		await currUser.save();
		console.log(4)
		await profileUser.save();
		console.log(5)
		res.json({
			message: true,
			following: profileUser.following.length,
			followers: profileUser.followers.length,
		});
	}
});

module.exports = router