var express = require('express');
var router = express.Router();
var userRouter = require('./users');
var AuthRouter = require('./Auth/authRouter');
var StudentRouter = require('./Student/studentRouter');
var ContestRouter = require('./Contest/contestRouter');
var TeamRouter = require('./Team/teamRouter');
var SchoolRouter = require('./School/schoolRouter');
var ParamRouter = require('./Params/ParamRouter');
// var BillRouter = require('./Bill/BillRouter');

/* GET home page. */
router.get('/', function (req, res, next) {
  return res.json({ message: "Welcome to Pesta Sains Nasional 2020 API" });
});
router.use('/users', userRouter);
router.use('/auth', AuthRouter);
router.use('/students', StudentRouter);
router.use('/contests', ContestRouter);
router.use('/teams', TeamRouter);
router.use('/schools', SchoolRouter);
router.use('/params', ParamRouter);
// router.use('/bills', BillRouter);

module.exports = router;
