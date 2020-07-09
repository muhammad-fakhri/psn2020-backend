let express = require('express'),
    router = express.Router(),
    StudentController = require('./StudentController'),
    {validateBody, schemas} = require('./StudentValidation'),
    JWtController = require('../JWT/JWTController');

router.post('/', JWtController.checkToken, JWtController.isSchool, validateBody(schemas.create), StudentController.create);
router.get('/school/:school', JWtController.checkToken, StudentController.listBySchool);
router.get('/unbooked-accommodation/school/:school', JWtController.checkToken, StudentController.getUnbooked);
router.put('/', JWtController.checkToken, JWtController.isSchool, validateBody(schemas.edit), StudentController.edit);
router.delete('/:_id', JWtController.checkToken, JWtController.isSchool, StudentController.delete);
router.get('/count/:school', JWtController.checkToken, StudentController.count);
router.get('/available/:school', JWtController.checkToken, StudentController.getAvailable);
// router.post('/login', validateBody(schemas.schoolLogin), StudentController.schoolLogin);

module.exports = router;
