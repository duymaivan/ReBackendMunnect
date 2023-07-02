var fs = require('fs');
var binhLuanModel = require('../models/BinhLuan');
var baiVietModel = require('../models/BaiViet');

exports.list = async (req, res, next) => {
  var reqFilter = null;
  var values = req.query;

  if (typeof (values.idBaiViet) != 'undefined') {
    reqFilter = { idBaiViet: values.idBaiViet };
  }

  try {
    let listBinhLuan = await binhLuanModel.find(reqFilter).populate('idNguoiDung').sort({ thoiGian: -1 });
    return res.status(200).json({
      success: true,
      data: {
        listBinhLuan: listBinhLuan,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

exports.add = async (req, res, next) => {
  if (req.method == 'POST') {
    var body = req.body;
    var objData = new binhLuanModel();
    objData.idNguoiDung = body.idNguoiDung;
    objData.idBaiViet = body.idBaiViet;
    objData.noiDung = body.noiDung;
    objData.thoiGian = body.thoiGian;

    console.log(req.body);
    if (req.file != undefined) {
      fs.renameSync(req.file.path, './public/uploads/' + req.file.originalname);
      let imagePath = 'https://backend-munnect.herokuapp.com/uploads/' + req.file.originalname;
      console.log('/uploads/' + req.file.originalname);
      objData.anhBinhLuan = imagePath;
    }

    console.log(objData);
    if (objData != {}) {
      try {
        await objData.save();
        var listBaiViet = await baiVietModel.find({_id: body.idBaiViet});
        if (listBaiViet.length > 0) {
          var objPost = listBaiViet[0];
          objPost.arr_binhLuan.push(objData._id);
          await baiVietModel.findByIdAndUpdate(objPost._id, objPost);
        }
        return res.status(201).json({
          success: true,
          data: {},
        });
      } catch (error) {
        console.log(error.message);
        return res.status(500).json({
          success: false,
          message: error.message,
        });
      }
    }
  }
}
