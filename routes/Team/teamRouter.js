let express = require('express'),
    router = express.Router(),
    TeamController = require('./TeamController'),
    { validateBody, schemas } = require('./TeamValidation'),
    JWtController = require('../JWT/JWTController');

router.get('/count/:school', JWtController.checkToken, TeamController.count);
router.get('/excel/contest/:contest', TeamController.getExcelByContest);
router.get('/:_id', JWtController.checkToken, TeamController.get);
router.delete('/:_id', JWtController.checkToken, TeamController.delete);
router.post('/', JWtController.checkToken, JWtController.isSchool, validateBody(schemas.create), TeamController.create);
router.get('/', JWtController.checkToken, TeamController.list);
router.put('/', JWtController.checkToken, validateBody(schemas.edit), TeamController.edit);
// router.get('/unpaid/school/:school', JWtController.checkToken, TeamController.getUnpaid);


module.exports = router;
