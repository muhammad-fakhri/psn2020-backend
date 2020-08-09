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
router.use('/auth', AuthRouter);
router.use('/contest', ContestRouter);
router.use('/params', ParamRouter);
router.use('/schools', SchoolRouter);
router.use('/school', SchoolRouter);
router.use('/students', StudentRouter);
router.use('/teams', TeamRouter);
router.use('/users', userRouter);
// router.use('/payment', PaymentRouter);

module.exports = router;
