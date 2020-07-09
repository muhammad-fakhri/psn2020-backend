let express = require('express'),
    router = express.Router(),
    TeacherController = require('./TeacherController'),
    {validateBody, schemas} = require('./TeacerValidation'),
    JWtController = require('../JWT/JWTController');

router.post('/', JWtController.checkToken, JWtController.isSchool, validateBody(schemas.create), TeacherController.create);
router.get('/', JWtController.checkToken, JWtController.isAdmin, TeacherController.list);
router.get('/:_id', JWtController.checkToken, JWtController.isSchool, TeacherController.get);
router.get('/school/:school', JWtController.checkToken, TeacherController.listBySchool);
router.get('/unbooked-accommodation/school/:school', JWtController.checkToken, TeacherController.getUnbooked);
router.get('/unpaid/school/:school', JWtController.checkToken, TeacherController.getUnpaid);
router.put('/', JWtController.checkToken, JWtController.isSchool, validateBody(schemas.edit), TeacherController.edit);
router.delete('/:_id', JWtController.checkToken, JWtController.isSchool, TeacherController.delete);
router.get('/count/:school', JWtController.checkToken, TeacherController.count);
router.get('/download/excel', JWtController.checkToken, TeacherController.getExcel);
// router.post('/login', validateBody(schemas.schoolLogin), StudentController.schoolLogin);

module.exports = router;
