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

module.exports = router