let express = require('express'),
    router = express.Router(),
    ContestController = require('./ContestController'),
    { validateBody, schemas } = require('./ContestValidation'),
    JWTController = require('../JWT/JWTController');

router.delete('/:contestId', JWTController.checkToken, JWTController.isAdmin, ContestController.delete);
router.get('/', ContestController.list);
router.post('/', JWTController.checkToken, JWTController.isAdmin, validateBody(schemas.create), ContestController.create);
router.put('/', JWTController.checkToken, JWTController.isAdmin, validateBody(schemas.update), ContestController.update);

module.exports = router;
