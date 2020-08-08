let express = require('express'),
    router = express.Router(),
    StudentController = require('./StudentController'),
    { validateBody, schemas } = require('./StudentValidation'),
    JWtController = require('../JWT/JWTController');

router.get('/available/:school', JWtController.checkToken, StudentController.getAvailable);
router.get('/count/:schoolId', JWtController.checkToken, StudentController.count);
router.get('/school/:schoolId', JWtController.checkToken, StudentController.listBySchool);
router.get('/unbooked-accommodation/school/:school', JWtController.checkToken, StudentController.getUnbooked);
router.delete('/:studentId', JWtController.checkToken, StudentController.delete);
router.post('/', JWtController.checkToken, JWtController.isSchool, validateBody(schemas.create), StudentController.create);
router.put('/', JWtController.checkToken, validateBody(schemas.update), StudentController.update);

module.exports = router;
