let express = require('express'),
    router = express.Router(),
    BillController = require('./BillController'),
    {validateBody, schemas} = require('./BillValidation'),
    JWtController = require('../JWT/JWTController');

router.post('/', JWtController.checkToken, JWtController.isSchool, validateBody(schemas.create), BillController.create);
router.post('/callback', BillController.callback);
router.get('/:_id', BillController.get);
router.get('/school/:school', JWtController.checkToken, BillController.listBySchool);
router.get('/count/:school', JWtController.checkToken, BillController.count);
router.post('/search', BillController.findByVA);
router.post('/force-update', JWtController.checkToken, BillController.forceUpdateBill);

module.exports = router;
