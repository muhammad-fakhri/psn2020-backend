let express = require('express'),
    router = express.Router(),
    StudentController = require('./StudentController'),
    { validateBody, schemas } = require('./StudentValidation'),
    JWtController = require('../JWT/JWTController');

router.get('/available/:schoolId', JWtController.checkToken, StudentController.getAvailable);
router.get('/count/:schoolId', JWtController.checkToken, StudentController.count);
router.post('/delete', JWtController.checkToken, validateBody(schemas.delete), StudentController.multipleDelete);
router.get('/school/:schoolId', JWtController.checkToken, StudentController.listBySchool);
router.delete('/:studentId', JWtController.checkToken, StudentController.delete);
router.post('/', JWtController.checkToken, validateBody(schemas.create), StudentController.create);
router.put('/', JWtController.checkToken, validateBody(schemas.update), StudentController.update);

module.exports = router;
