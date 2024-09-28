const express = require("express");
const app = express();
const router = express.Router();
require("dotenv").config();
const cors = require("cors");

const sendMail = require('../sendMail.js')

const userModel = require("../models/user.model.js");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

app.use(cors())
router.get("/register", (req, res) => {
	res.json({ message: true });
});

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

		res.json({ token, userId: user._id, username: user.username, email: user.email});
	}
	catch(err) {
		res.json({message: false})
	}
});

router.post('/verification', async(req, res) => {
	const otp = req.body.OTP;	
	console.log('otp: ', otp, ' OTP: ', OTP)
	if(OTP != null && otp == OTP) {
		OTP = null;
		res.send({message: true});
	}
	else {
		// OTP = null;
		res.send({message: false});
	}
})

module.exports = router