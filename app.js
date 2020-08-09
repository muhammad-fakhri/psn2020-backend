require('dotenv').config({ path: __dirname + '/.env' });
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
let cors = require('cors');

let indexRouter = require('./routes/index');

let app = express();
let mongoose = require('mongoose');
let mongoServer = "mongodb://localhost:27017/psn2020"
mongoose.connect(mongoServer, { useNewUrlParser: true, autoIndex: false });
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
app.use(logger('dev'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', indexRouter);

module.exports = app;