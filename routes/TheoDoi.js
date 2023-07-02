var express = require('express');
var router = express.Router();
var theoDoiCtrl = require('../controllers/TheoDoi');

router.get('/DanhSach', theoDoiCtrl.list);

router.get('/TheoDoiMoi', theoDoiCtrl.newFollow);

module.exports = router;