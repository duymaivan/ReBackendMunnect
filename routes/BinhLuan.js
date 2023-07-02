var express = require('express');
var router = express.Router();
const multer  = require('multer');
const uploader = multer({dest: './public/temp'});
var binhLuanCtrl = require('../controllers/BinhLuan');

router.get('/DanhSach', binhLuanCtrl.list);

router.post('/BinhLuanMoi', uploader.single('anhBinhLuan'), binhLuanCtrl.add);

// router.put('/SuaBinhLuan/:idBinhLuan', binhLuanCtrl.updateUser);

// router.get('/XoaBinhLuan/:idBinhLuan', binhLuanCtrl.updateUser);

module.exports = router;