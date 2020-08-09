let express = require('express'),
    router = express.Router(),
    AdminController = require('./AdminController'),
    { validateBody, schemas } = require('./AdminValidation'),
    JWtController = require('../JWT/JWTController');

router.post('/create', JWtController.checkToken, JWtController.isSuperAdmin, validateBody(schemas.createSubadmin), AdminController.createSubadmin);

module.exports = router;
