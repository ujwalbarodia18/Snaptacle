const express = require('express');
const app = express();
const cors = require('cors');

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
app.use('/', chatRouter);
app.use('/', postRouter);
app.use('/', indexRouter);


app.listen(PORT, () => {
    console.log(`Server started at ${PORT}`);
});

module.exports = app;