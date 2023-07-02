var fs = require('fs');
var baiVietModel = require('../models/BaiViet');
var tuongTacModel = require('../models/TuongTac');
var binhLuanModel = require('../models/BinhLuan');

exports.list = async (req, res, next) => {
  var reqFilter = null;
  var reqSearch = null;
  var values = req.query;

  if (typeof (values.idNguoiDung) != 'undefined') {
    reqFilter = { idNguoiDung: values.idNguoiDung };
  }

  if (typeof (values.inputSearch) != 'undefined') {
    var inputValue = values.inputSearch;
    var inputRegex = new RegExp(inputValue);
    reqSearch = { noiDung: inputRegex };
  }

  try {
    let listBaiViet = await baiVietModel.find(reqFilter).find(reqSearch).populate('idNguoiDung').sort({ thoiGian: -1 });
    return res.status(200).json({
      success: true,
      data: {
        listBaiViet: listBaiViet,
        // listTuongTac: listTuongTac,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

exports.getOne = async (req, res, next) => {
  var reqFilter = null;
  var values = req.params.idBV;

  if (typeof (values) != 'undefined') {
    reqFilter = { _id: values };
  }

  try {
    let listBaiViet = await baiVietModel.find(reqFilter).populate('idNguoiDung');
    if (listBaiViet.length > 0) {
      return res.status(200).json({
        success: true,
        data: {
          baiViet: listBaiViet[0],
        },
      });
    } else {
      return res.status(200).json({
        success: true,
        data: {
          baiViet: null,
        },
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

exports.getLatest = async (req, res, next) => {
  var reqFilter = null;
  var values = req.params.idND;

  if (typeof (values) != 'undefined') {
    reqFilter = { idNguoiDung: values };
  }

  try {
    let listBaiViet = await baiVietModel.find(reqFilter).populate('idNguoiDung').sort({ thoiGian: -1 });
    if (listBaiViet.length > 0) {
      console.log(listBaiViet.length);
      return res.status(200).json({
        success: true,
        data: {
          listBaiViet: listBaiViet,
        },
      });
    } else {
      return res.status(200).json({
        success: true,
        data: {
          listBaiViet: [],
        },
      });
    }
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
    var objData = fillObj(body);

    if (req.file != undefined) {
      fs.renameSync(req.file.path, './public/uploads/' + req.file.originalname);
      let imagePath = 'https://backend-munnect.herokuapp.com/uploads/' + req.file.originalname;
      console.log('/uploads/' + req.file.originalname);
      objData.anhBaiViet = imagePath;
    }

    if (objData != {}) {
      try {
        await objData.save();
        return res.status(201).json({
          success: true,
          data: {
            baiViet: objData
          },
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

exports.update = async (req, res, next) => {
  if (req.method == 'PUT') {
    var body = req.body;
    var objData = fillObj(body);
    objData._id = req.params.idBaiViet;

    if (req.file != undefined) {
      fs.renameSync(req.file.path, './public/uploads/' + req.file.originalname);
      let imagePath = 'https://backend-munnect.herokuapp.com/uploads/' + req.file.originalname;
      console.log('/uploads/' + req.file.originalname);
      objData.anhBaiViet = imagePath;
    }

    if (objData != {}) {
      try {
        await baiVietModel.findByIdAndUpdate(objData._id, objData);
        return res.status(200).json({
          success: true,
          data: {
            baiViet: objData
          },
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

exports.delete = async (req, res, next) => {
  if (req.method == 'DELETE') {
    var objId = req.params.idBaiViet;

    if (typeof (objId) != 'undefined') {
      try {
        await baiVietModel.findByIdAndDelete(objId);
        let listBinhLuan = await binhLuanModel.find({idBaiViet: objId});
        let listTuongTac = await tuongTacModel.find({idBaiViet: objId});
        if (listBinhLuan.length > 0) {
          for (let i = 0; i < listBinhLuan.length; i++) {
            await binhLuanModel.findByIdAndDelete(listBinhLuan[i]._id);
          }
        }
        if (listTuongTac.length > 0) {
          for (let i = 0; i < listTuongTac.length; i++) {
            await tuongTacModel.findByIdAndDelete(listTuongTac[i]._id);
          }
        }
        return res.status(203).json({
          success: true,
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

function fillObj(body) {
  let objData = new baiVietModel();
  objData.idNguoiDung = body.idNguoiDung;
  objData.noiDung = body.noiDung;
  objData.phongChu = body.phongChu;
  objData.anhBaiViet = body.anhBaiViet;
  objData.thoiGian = body.thoiGian;
  objData.viTriBaiViet = body.viTriBaiViet;
  objData.arr_binhLuan = body.arr_binhLuan;
  objData.arr_dongTinh = body.arr_dongTinh;
  objData.arr_phanDoi = body.arr_phanDoi;
  objData.soLuongChiaSe = body.soLuongChiaSe;
  objData.soLuongBaoCao = body.soLuongBaoCao;
  return objData;
}
