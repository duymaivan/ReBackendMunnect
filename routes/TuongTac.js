var express = require('express');
var router = express.Router();
var tuongTacCtrl = require('../controllers/TuongTac');

router.get('/', tuongTacCtrl.get);

router.get('/TuongTacMoi', tuongTacCtrl.newInteract);

module.exports = router;