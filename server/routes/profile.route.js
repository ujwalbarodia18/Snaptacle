const express = require("express");
const app = express();
const router = express.Router();
require("dotenv").config();
const cors = require("cors");

const userModel = require("../models/user.model.js");

app.use(cors());

const authenticateMiddleware = require('../authentication/authMiddleware.js')

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

module.exports = router