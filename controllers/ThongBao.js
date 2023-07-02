var fs = require('fs');
var thongBaoModel = require('../models/ThongBao');
var baiVietModel = require('../models/BaiViet');

exports.list = async (req, res, next) => {
  var reqFilter = null;
  var values = req.query;

  if (typeof (values.idNguoiDung) != 'undefined') {
    reqFilter = { idNguoiDung: values.idNguoiDung };
  }

  try {
    let listThongBao = await thongBaoModel.find(reqFilter).populate('idChuBaiViet').sort({ thoiGianTB: -1 });
    return res.status(200).json({
      success: true,
      data: {
        listThongBao: listThongBao,
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
    console.log(req.body);

    var objData = new thongBaoModel();
    objData.idNguoiDung = body.idNguoiDung;
    objData.idBaiViet = body.idBaiViet;
    objData.idChuBaiViet = body.idChuBaiViet;
    objData.tieuDeTB = body.tieuDeTB;
    objData.noiDungTB = body.noiDungTB;
    objData.thoiGianTB = body.thoiGianTB;

    if (objData != {}) {
      try {
        await objData.save();
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
