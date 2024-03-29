let express = require('express'),
    router = express.Router(),
    AuthController = require('./AuthController'),
    { validateBody, schemas } = require('./AuthValidation'),
    JWtController = require('../JWT/JWTController');

router.post('/email/verify/resend', validateBody(schemas.resendVerifyEmail), AuthController.resendVerifyEmail);
router.get('/email/verify', AuthController.verifyEmail);
router.post('/login/admin', validateBody(schemas.adminLogin), AuthController.adminLogin);
router.post('/login', validateBody(schemas.schoolLogin), AuthController.schoolLogin);
router.post('/password/change', JWtController.checkToken, JWtController.isSchool, validateBody(schemas.changePassword), AuthController.changePassword);
router.post('/password/forgot', validateBody(schemas.forgotPassword), AuthController.forgotPassword);
router.post('/password/forgot/set', validateBody(schemas.setForgotPassword), AuthController.setForgotPassword);
router.post('/registration', validateBody(schemas.schoolRegistration), AuthController.schoolRegistration);

module.exports = router;
