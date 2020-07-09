let express = require('express'),
    router = express.Router(),
    ParamController = require('./ParamController'),
    {validateBody, schemas} = require('./ParamValidation'),
    JWTController = require('../JWT/JWTController');

router.post('/', JWTController.checkToken, validateBody(schemas.create), ParamController.create);
router.get('/', ParamController.list);
router.get('/:code', ParamController.get);
router.put('/', JWTController.checkToken, validateBody(schemas.edit), ParamController.edit);
router.delete('/:code', JWTController.checkToken, ParamController.delete);

module.exports = router;
