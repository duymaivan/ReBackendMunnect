var tuongTacModel = require('../models/TuongTac');
var baiVietModel = require('../models/BaiViet');

exports.get = async (req, res, next) => {
  var reqFilterND = null;
  var reqFilterBV = null;
  var values = req.query;

  if (typeof (values.idNguoiDung) != 'undefined' && typeof (values.idBaiViet) != 'undefined') {
    reqFilterND = { idNguoiDung: values.idNguoiDung };
    reqFilterBV = { idBaiViet: values.idBaiViet };
  }

  try {
    let listTuongTac = await tuongTacModel.find(reqFilterND).find(reqFilterBV);
    if (listTuongTac.length > 0) {
      return res.status(200).json({
        success: true,
        data: {
          tuongTac: listTuongTac[0].loaiTuongTac,
        },
      });
    } else {
      return res.status(200).json({
        success: true,
        data: {
          tuongTac: 'none',
        },
      });
    }
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

exports.newInteract = async (req, res, next) => {
  var reqFilterND = null;
  var reqFilterBV = null;
  var values = req.query;

  if (typeof (values.idNguoiDung) != 'undefined' && typeof (values.idBaiViet) != 'undefined') {
    reqFilterND = { idNguoiDung: values.idNguoiDung };
    reqFilterBV = { idBaiViet: values.idBaiViet };
  }

  try {
    let listTuongTac = await tuongTacModel.find(reqFilterND).find(reqFilterBV);
    let listBaiViet = await baiVietModel.find({ _id: values.idBaiViet });

    console.log(listTuongTac);
    if (typeof (values.tuongTac) != 'undefined') {
      var objData = new tuongTacModel();
      objData.idNguoiDung = values.idNguoiDung;
      objData.idBaiViet = values.idBaiViet;
      objData.loaiTuongTac = values.tuongTac;


      if (listTuongTac.length > 0) {
        objData._id = listTuongTac[0]._id;
        await tuongTacModel.findByIdAndUpdate(objData._id, objData);
        updatePost(values, listBaiViet[0], objData);
        return res.status(200).json({
          success: true,
          data: {
            tuongTac: values.tuongTac,
          },
        });
      } else {
        await objData.save();
        updatePost(values, listBaiViet[0], objData);
        return res.status(200).json({
          success: true,
          data: {
            tuongTac: values.tuongTac,
          },
        });
      }
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

async function updatePost(values, body, objData) {
  var objPost = fillObj(body);
  if (values.tuongTac == 'Liked') {
    objPost.arr_dongTinh.push(objData._id);
    if (objPost.arr_phanDoi.indexOf(objData._id) >= 0) {
      objPost.arr_phanDoi.splice(objPost.arr_phanDoi.indexOf(objData._id), 1);
    }
    await baiVietModel.findByIdAndUpdate(objPost._id, objPost);
  } else if (values.tuongTac == 'Disliked') {
    objPost.arr_phanDoi.push(objData._id);
    if (objPost.arr_dongTinh.indexOf(objData._id) >= 0) {
      objPost.arr_dongTinh.splice(objPost.arr_dongTinh.indexOf(objData._id), 1);
    }
    await baiVietModel.findByIdAndUpdate(objPost._id, objPost);
  } else {
    if (objPost.arr_dongTinh.indexOf(objData._id) >= 0) {
      objPost.arr_dongTinh.splice(objPost.arr_dongTinh.indexOf(objData._id), 1);
    }
    if (objPost.arr_phanDoi.indexOf(objData._id) >= 0) {
      objPost.arr_phanDoi.splice(objPost.arr_phanDoi.indexOf(objData._id), 1);
    }
    await baiVietModel.findByIdAndUpdate(objPost._id, objPost);
  }
}

function fillObj(body) {
  let objData = new baiVietModel();
  objData._id = body._id;
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
