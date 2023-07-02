var express = require('express');
var router = express.Router();
const multer  = require('multer');
const uploader = multer({dest: './public/temp'});
var baiVietCtrl = require('../controllers/BaiViet');

router.get('/DanhSach', baiVietCtrl.list);

router.get('/DanhSach/:idBV', baiVietCtrl.getOne);

router.get('/DanhSach/NguoiDung/:idND',  baiVietCtrl.getLatest);

router.post('/BaiVietMoi', uploader.single('anhBaiViet'), baiVietCtrl.add);

router.put('/SuaBaiViet/:idBaiViet', uploader.single('anhBaiViet'), baiVietCtrl.update);

router.delete('/XoaBaiViet/:idBaiViet', baiVietCtrl.delete);

module.exports = router;