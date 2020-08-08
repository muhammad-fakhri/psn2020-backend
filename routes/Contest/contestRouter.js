let express = require('express'),
    router = express.Router(),
    ContestController = require('./ContestController'),
    { validateBody, schemas } = require('./ContestValidation'),
    JWTController = require('../JWT/JWTController');

router.delete('/:_id', JWTController.checkToken, ContestController.delete);
router.get('/', ContestController.list);
router.post('/', JWTController.checkToken, validateBody(schemas.create), ContestController.create);
router.put('/', JWTController.checkToken, validateBody(schemas.edit), ContestController.edit);

module.exports = router;
