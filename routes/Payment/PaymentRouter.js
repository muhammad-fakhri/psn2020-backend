let express = require('express'),
    router = express.Router(),
    PaymentController = require('./PaymentController'),
    { validateBody, schemas } = require('./PaymentValidation'),
    JWtController = require('../JWT/JWTController');

router.get('/', JWtController.checkToken, JWtController.isAdmin, PaymentController.getAllPayment);
router.get('/:paymentId', JWtController.checkToken, PaymentController.getPaymentDetail);
router.post('/', JWtController.checkToken, JWtController.isSchool, validateBody(schemas.create), PaymentController.create);

router.post('/callback', PaymentController.callback);
router.get('/school/:school', JWtController.checkToken, PaymentController.listBySchool);
router.get('/count/:school', JWtController.checkToken, PaymentController.count);
router.post('/search', PaymentController.findByVA);
router.post('/force-update', JWtController.checkToken, PaymentController.forceUpdateBill);

module.exports = router;
