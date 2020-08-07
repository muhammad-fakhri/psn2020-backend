let express = require('express'),
    router = express.Router(),
    SchoolController = require('./SchoolController'),
    { validateBody, schemas } = require('./SchoolValidation'),
    JWTController = require('../JWT/JWTController');

router.get('/detail/:_id', SchoolController.get);
router.get('/detail', JWTController.checkToken, JWTController.isSchool, SchoolController.getSchoolDetail);
router.put('/detail', JWTController.checkToken, JWTController.isSchool, validateBody(schemas.updateSchoolDetail), SchoolController.updateSchoolDetail);
router.get('/search', SchoolController.search);
router.get('/', SchoolController.list);

module.exports = router;
