let express = require("express"),
  router = express.Router(),
  PaymentController = require("./PaymentController"),
  { validateBody, schemas } = require("./PaymentValidation"),
  JWtController = require("../JWT/JWTController");

router.get(
  "/",
  JWtController.checkToken,
  JWtController.isAdmin,
  PaymentController.getAllPayment
);
router.get(
  "/:paymentId",
  JWtController.checkToken,
  PaymentController.getPaymentDetail
);
router.get(
  "/school/:schoolId",
  JWtController.checkToken,
  PaymentController.listBySchool
);
router.post(
  "/",
  JWtController.checkToken,
  validateBody(schemas.create),
  PaymentController.create
);
router.post(
  "/upload",
  JWtController.checkToken,
  validateBody(schemas.upload),
  PaymentController.uploadReceipt
);
router.put(
  "/update",
  JWtController.checkToken,
  JWtController.isAdmin,
  validateBody(schemas.update),
  PaymentController.updatePayment
);

// router.post('/callback', PaymentController.callback);
// router.get('/count/:school', JWtController.checkToken, PaymentController.count);
// router.post('/search', PaymentController.findByVA);

module.exports = router;
