let express = require('express'),
    router = express.Router(),
    AuthController = require('./AuthController'),
    { validateBody, schemas } = require('./AuthValidation');

router.post('/email/verify/resend', validateBody(schemas.resendVerifyEmail), AuthController.resendVerifyEmail);
router.get('/email/verify', AuthController.verifyEmail);
router.post('/login/admin', validateBody(schemas.adminLogin), AuthController.adminLogin);
router.post('/login', validateBody(schemas.schoolLogin), AuthController.schoolLogin);
router.post('/registration/admin', validateBody(schemas.adminRegistration), AuthController.adminRegistration);
router.post('/registration', validateBody(schemas.schoolRegistration), AuthController.schoolRegistration);

module.exports = router;
