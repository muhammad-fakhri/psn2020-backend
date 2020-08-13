let express = require('express'),
    router = express.Router(),
    AdminController = require('./AdminController'),
    { validateBody, schemas } = require('./AdminValidation'),
    JWtController = require('../JWT/JWTController');

router.get('/list', JWtController.checkToken, JWtController.isSuperAdmin, AdminController.listAllSubadmin);
router.post('/create-super', validateBody(schemas.createSuperadmin), AdminController.createSuperadmin);
router.post('/create', JWtController.checkToken, JWtController.isSuperAdmin,
    validateBody(schemas.createSubadmin), AdminController.createSubadmin);
router.post('/delete', JWtController.checkToken, JWtController.isSuperAdmin,
    validateBody(schemas.deleteSubadmin), AdminController.deleteSubadmin);

module.exports = router;

