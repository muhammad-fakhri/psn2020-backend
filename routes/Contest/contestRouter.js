let express = require('express'),
    router = express.Router(),
    ContestController = require('./ContestController'),
    {validateBody, schemas} = require('./ContestValidation'),
    JWTController = require('../JWT/JWTController');

router.post('/', JWTController.checkToken, validateBody(schemas.create), ContestController.create);
router.get('/', ContestController.list);
router.put('/', JWTController.checkToken, validateBody(schemas.edit), ContestController.edit);
router.delete('/:_id', JWTController.checkToken, ContestController.delete);

module.exports = router;
