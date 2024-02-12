const express = require('express');
const app = express();
const cors = require('cors');
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
// app.use('/users', usersRouter);

// app.get('/', (req, res) => {
//     res.json({message: 'Hi World'})
// });

// app.get('http://localhost:3000', (req, res) => {
//     console.log('In Insta');
//     res.json({message: 'In App'});
// })

app.listen(PORT, () => {
    console.log(`Server started at ${PORT}`);
});