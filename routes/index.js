var express = require('express');
var router = express.Router();
var userRouter = require('./users');
var AuthRouter = require('./Auth/authRouter');
var StudentRouter = require('./Student/studentRouter');
var ContestRouter = require('./Contest/contestRouter');
var TeamRouter = require('./Team/teamRouter');
var SchoolRouter = require('./School/schoolRouter');
var ParamRouter = require('./Params/ParamRouter');
// var PaymentRouter = require('./Payment/PaymentRouter');

// API Front Page Index
router.get('/', function (req, res, next) {
  return res.status(200).json({ message: "Welcome to Pesta Sains Nasional 2020 API. Check the documentation for more information" });
});
router.use('/users', userRouter);
router.use('/auth', AuthRouter);
router.use('/students', StudentRouter);
router.use('/contests', ContestRouter);
router.use('/teams', TeamRouter);
router.use('/schools', SchoolRouter);
router.use('/params', ParamRouter);
// router.use('/payment', PaymentRouter);

module.exports = router;
