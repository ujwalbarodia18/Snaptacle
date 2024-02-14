const express = require('express');
const app = express();
const cors = require('cors');
const http = require('http');
const fileparser = require('./fileparser');


require('dotenv').config();
const PORT = 8080;
app.use(cors());

const expressSession = require('express-session');
const passport = require('passport');

const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');

const usersRouter = require('./models/user.js');
const indexRouter = require('./routes/index.js');
const fileUpload = require('express-fileupload');

app.use(expressSession({
    resave: false,
    saveUninitialized: false,
    secret: 'Helo Helo'
}));



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(passport.initialize());
// app.use(passport.session());
app.use(fileUpload())
// passport.serializeUser(usersRouter.serializeUser());
// passport.deserializeUser(usersRouter.deserializeUser());

app.use('/', indexRouter);

// io.on('connection', (socket) => {
//     console.log('Socket: ', socket);
  
//     // Listen for new messages
//     socket.on('newMessage', async ({req}) => {
//         // authenticateMiddleware(req,)
//       const { user, text } = data;
  
//       // Save the message to MongoDB
//       const newMessage = new Message({ user, text });
//       await newMessage.save();
  
//       // Broadcast the new message to all connected clients
//       io.emit('newMessage', newMessage);
//     });
  
//     // Disconnect event
//     socket.on('disconnect', () => {
//       console.log('User disconnected');
//     });
// });

app.listen(PORT, () => {
    console.log(`Server started at ${PORT}`);
});

// module.exports = server;