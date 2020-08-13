require('dotenv').config({ path: __dirname + '/.env' });
const indexRouter = require('./routes/index');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');
const logger = require('morgan');
const cors = require('cors');

const app = express();
const mongoose = require('mongoose');
const mongoServer = "mongodb://localhost:27017/psn2020"
mongoose.connect(mongoServer, { useNewUrlParser: true, autoIndex: false });
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

// serve static and uploaded files
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'uploads')));

// enable files upload
app.use(fileUpload({
    createParentPath: true
}));
app.use(logger('dev')); // logging HTTP request
app.use(cors()); // enabling CORS
app.use(express.json()); // parse request body
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser()); // enabling parse cookie from request

app.use('/', indexRouter);

module.exports = app;