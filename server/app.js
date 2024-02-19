const express = require('express');
const app = express();
const cors = require('cors');
const http = require('http');


require('dotenv').config();
const PORT = 8080;
// app.use(express.json());
// const _dirname = path.dirname("");
// const buildpath = path.join(_dirname + "../build")
// app.use(express.static(buildpath))
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
app.use(fileUpload())



app.use('/', indexRouter);

app.listen(PORT, () => {
    console.log(`Server started at ${PORT}`);
});

module.exports = app;