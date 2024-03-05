const express = require('express');
const app = express();
const cors = require('cors');
const http = require('http');
const server = http.createServer(app);

require('dotenv').config();
const PORT = 8080;
app.use(cors());

const bodyParser = require('body-parser');

const indexRouter = require('./routes/index.route.js');
const chatRouter = require('./routes/chat.route.js');
const authRouter = require('./routes/auth.route.js');
const profileRouter = require('./routes/profile.route.js');
const searchRouter = require('./routes/search.route.js');
const postRouter = require('./routes/post.route.js');
const uploadRouter = require('./routes/upload.route.js')
const interactionRouter = require('./routes/interaction.route.js');
const fileUpload = require('express-fileupload');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload())

app.use('/', authRouter);
app.use('/', interactionRouter);
app.use('/', uploadRouter);
app.use('/', profileRouter);
app.use('/', searchRouter);
// app.use('/', chatRouter);
app.use('/', postRouter);
app.use('/', indexRouter);

console.log('Server at app: ', server)


require("dotenv").config();
// const http = require("http");
// const server = http.createServer(app);
const userModel = require("./models/user.model.js");
const chatModel = require("./models/chat.model.js");
const jwt = require("jsonwebtoken");

const authenticateMiddleware = require('./authentication/authMiddleware.js')

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

app.post("/getChatUser", authenticateMiddleware, async (req, res) => {
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

app.post(`/getChat/:userId`, authenticateMiddleware, async (req, res) => {
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


server.listen(PORT, () => {
    console.log(`Server started at ${PORT}`);
});

module.exports = app;