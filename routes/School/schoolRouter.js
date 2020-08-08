let express = require('express'),
    router = express.Router(),
    SchoolController = require('./SchoolController'),
    { validateBody, schemas } = require('./SchoolValidation'),
    JWTController = require('../JWT/JWTController');

router.get('/count', JWTController.checkToken, JWTController.isAdmin, SchoolController.count);
router.get('/detail/:schoolId', JWTController.checkToken, JWTController.isAdmin, SchoolController.getSchoolDetailById);
router.get('/detail', JWTController.checkToken, JWTController.isSchool, SchoolController.getSchoolDetail);
router.put('/detail', JWTController.checkToken, JWTController.isSchool, validateBody(schemas.updateSchoolDetail), SchoolController.updateSchoolDetail);
router.get('/search', JWTController.checkToken, JWTController.isAdmin, SchoolController.search);
router.get('/', JWTController.checkToken, JWTController.isAdmin, SchoolController.listAllSchools);

module.exports = router;
