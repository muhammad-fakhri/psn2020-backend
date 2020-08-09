let express = require('express'),
    router = express.Router(),
    TeamController = require('./TeamController'),
    { validateBody, schemas } = require('./TeamValidation'),
    JWtController = require('../JWT/JWTController');

router.get('/count', JWtController.checkToken, JWtController.isAdmin, TeamController.count);
router.get('/excel/contest/:contest', JWtController.checkToken, JWtController.isAdmin, TeamController.getExcelByContest);
router.get('/:teamId', JWtController.checkToken, TeamController.get);
router.delete('/:teamId', JWtController.checkToken, TeamController.delete);
router.get('/', JWtController.checkToken, TeamController.list);
router.post('/', JWtController.checkToken, JWtController.isSchool, validateBody(schemas.create), TeamController.create);
router.put('/', JWtController.checkToken, validateBody(schemas.update), TeamController.update);
// router.get('/unpaid/school/:school', JWtController.checkToken, TeamController.getUnpaid);


module.exports = router;
