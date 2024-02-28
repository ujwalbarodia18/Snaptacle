const express = require("express");
const app = express();
const router = express.Router();
require("dotenv").config();
const cors = require("cors");
const uploadFile = require('../upload.js')
const deleteFile = require('../deleteFile.js')

const userModel = require("../models/user.model.js");
const postModel = require("../models/post.model.js");
const storyModel = require("../models/story.model.js");

const authenticateMiddleware = require('../authentication/authMiddleware.js')

app.use(cors())

router.post("/upload", authenticateMiddleware, async (req, res) => {
	// console.log('Req file: ', req.body)
	// console.log('start')
	const fileToUpload = req?.files?.file ?? {name: 'img1', data: 'mockFile'};
	// const fileToUpload = 'abc'
	console.log('End---')
	try {
			const {location} = await uploadFile(fileToUpload);

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
	}
	catch(err) {
		console.log('Err uploading to AWS: ', err);
		res.json({message: false, err})
	}
	
});

router.post("/createStory", authenticateMiddleware, async (req, res) => {
	const {location, key} = await uploadFile(req.files.file);

	const user = await userModel.findOne({ _id: req.userId });

	const newStory = new storyModel({
		image: location,
		user: user._id,
	});
	await newStory.save();

	user.stories.push(newStory);
	await user.save();

	setTimeout(async () => {
		console.log('In setTImeout')
		const idx = user.stories.indexOf(newStory);
		user.stories.splice(idx, 1);
		await storyModel.deleteOne({ _id: newStory._id });
		await user.save();
		// console.log('Key:- ', key)
		// try {
		// 	const deleteResponse = await deleteFile(key);
		// 	console.log('Delete Response: ', deleteResponse);
		// }
		// catch(err) {
		// 	console.log('Error deleting: ', err);
		// }
		

	}, 60000);

	res.json({ message: true });
});

router.post("/editProfile", authenticateMiddleware, async (req, res) => {
	try {
		const user = await userModel.findOne({ _id: req.userId });
		console.log("Image: ", req.files);
		if (req.files && req.files.file) {
			const {location} = await uploadFile(req.files.file);
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

module.exports = router