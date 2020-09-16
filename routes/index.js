const express = require("express");
const router = express.Router();
const AuthRouter = require("./Auth/authRouter");
const AdminRouter = require("./Admin/adminRouter");
const StudentRouter = require("./Student/studentRouter");
const ContestRouter = require("./Contest/contestRouter");
const TeamRouter = require("./Team/teamRouter");
const SchoolRouter = require("./School/schoolRouter");
const ParamRouter = require("./Params/ParamRouter");
const PaymentRouter = require("./Payment/PaymentRouter");

// API Front Page Index
router.get("/", function (req, res, next) {
  return res.status(200).json({
    message:
      "Welcome to Pesta Sains Nasional 2020 API. Check the documentation for more information",
  });
});
router.use("/auth", AuthRouter);
router.use("/admin", AdminRouter);
router.use("/contest", ContestRouter);
router.use("/params", ParamRouter);
router.use("/schools", SchoolRouter);
router.use("/school", SchoolRouter);
router.use("/students", StudentRouter);
router.use("/teams", TeamRouter);
router.use("/payment", PaymentRouter);
router.post("/test", function (req, res, next) {
  let { name, role } = req.body;
  let host = req.get("host");
  return res.status(200).json({
    name,
    role,
    host,
    message: "Masuk datanya",
  });
});

module.exports = router;
