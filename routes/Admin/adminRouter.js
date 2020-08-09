let express = require('express'),
    router = express.Router(),
    AdminController = require('./AdminController'),
    { validateBody, schemas } = require('./AdminValidation'),
    JWtController = require('../JWT/JWTController');

router.post('/create', JWtController.checkToken, JWtController.isSuperAdmin,
    validateBody(schemas.createSubadmin), AdminController.createSubadmin);
router.post('/delete', JWtController.checkToken, JWtController.isSuperAdmin,
    validateBody(schemas.deleteSubadmin), AdminController.deleteSubadmin);

// NEVER UNCOMMENT THIS ROUTE
// THIS ROUTE ONLY FOR DEVELOPMENT AND FIRST DEPLOY
// router.post('/create-super', validateBody(schemas.createSuperadmin), AdminController.createSuperadmin);
// | ---------------------- |

module.exports = router;

