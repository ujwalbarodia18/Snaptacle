const express = require("express");
const app = express();
const router = express.Router();
require("dotenv").config();
// const http = require("http");
const cors = require("cors");
// const server = http.createServer(app);
const server = require('../app.js')
const userModel = require("../models/user.model.js");
const chatModel = require("../models/chat.model.js");
const jwt = require("jsonwebtoken");

const authenticateMiddleware = require('../authentication/authMiddleware.js')

console.log('Server: ', server)
const io = require("socket.io")(server, {
	cors: {
		origin: "*",
		methods: ["GET", "POST"],
	},
});

console.log('IO: ', io)


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
        let roomID = e;
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

io.listen(5000, () => {
	console.log("Socket server started at 5000");
});

module.exports = router;