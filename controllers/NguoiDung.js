var fs = require('fs');
var nguoiDungModel = require('../models/NguoiDung');

exports.list = async (req, res, next) => {
  var reqFilter = null;
  var reqSearch = null;
  var values = req.query;

  if (typeof (values.inputID) != 'undefined') {
    console.log(values.inputID);
    reqFilter = { _id: values.inputID };
  }

  if (typeof (values.inputSearch) != 'undefined') {
    var inputValue = values.inputSearch;
    var inputRegex = new RegExp(inputValue);
    reqSearch = { tenTaiKhoan: inputRegex };
  }

  try {
    let listNguoiDung = await nguoiDungModel.find(reqFilter).find(reqSearch);
    return res.status(200).json({
      success: true,
      data: {
        listNguoiDung: listNguoiDung,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

exports.login = async (req, res, next) => {
  if (req.method == 'POST') {
    var inputEmail = req.query.inputEmail;
    console.log(inputEmail);
    var body = req.body;

    try {
      let listNguoiDung = await nguoiDungModel.find({ email: inputEmail });
      console.log(req.body);

      if (listNguoiDung.length == 1) {
        var nguoiDung = listNguoiDung[0];
        if (nguoiDung.matKhau == body.matKhau) {
          return res.status(200).json({
            success: true,
            message: "Đăng nhập thành công",
            objData: nguoiDung
          });
        } else {
          return res.status(200).json({
            success: false,
            message: "Sai mật khẩu! Vui lòng thử lại."
          });
        }
      } else {
        return res.status(200).json({
          success: false,
          message: "Không tìm thấy tài khoản hoặc cơ sở dữ liệu bị trùng lặp.",
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
}

exports.register = async (req, res, next) => {
  if (req.method == 'POST') {
    var body = req.body;
    var objData = new nguoiDungModel();
    objData.tenTaiKhoan = body.tenTaiKhoan;
    objData.email = body.email;
    objData.matKhau = body.matKhau;
    objData.sinhNhat = body.sinhNhat;
    objData.anhDaiDien = "https://backend-munnect.herokuapp.com/uploads/iconEarth.png";
    objData.anhBia = "https://backend-munnect.herokuapp.com/uploads/worldWallpaper.jpg";

    if (objData != {}) {
      try {
        await objData.save();
        return res.status(201).json({
          success: true,
          message: "Đăng ký thành công!",
        });
      } catch (error) {
        console.log(error.message);
        var errRegex = new RegExp('^E11000+.');
        return res.status(500).json({
          success: false,
          message: (error.message.match(errRegex)) ? 'Email đã tồn tại trong cơ sở dữ liệu!' : error.message,
        });
      }
    }
  }
}

exports.updateInfo = async (req, res, next) => {
  if (req.method == 'PUT') {
    var objID = req.params.idNguoiDung;

    if (objID != {}) {
      try {
        var objData = fillObj(req.body);
        objData._id = objID;

        await nguoiDungModel.findByIdAndUpdate(objID, objData);
        return res.status(200).json({
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

exports.updatePass = async (req, res, next) => {
  if (req.method == 'PUT') {
    var objID = req.params.idNguoiDung;

    if (objID != {}) {
      try {
        let listNguoiDung = await nguoiDungModel.find({_id: objID});

        if (listNguoiDung[0].matKhau == req.query.matKhauCu) {
          var objData = fillObj(req.body);
          objData._id = objID;
  
          await nguoiDungModel.findByIdAndUpdate(objID, objData);
          return res.status(200).json({
            success: true,
            data: {},
          });
        } else {
          return res.status(200).json({
            success: false,
            data: {},
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
  }
}

exports.updateImage = async (req, res, next) => {
  if (req.method == 'PUT') {
    var body = req.body;
    var objID = req.params.idNguoiDung;
    var objData = fillObj(body);
    objData._id = objID;

    // console.log(req.files.anhTaiLen);
    if (req.files != undefined) {
      req.files.map((file, index, arr) => {
        if (file != {}) {
          fs.renameSync(file.path, './public/uploads/' + file.originalname);
          let imagePath = 'https://backend-munnect.herokuapp.com/uploads/' + file.originalname;
          if (typeof (body.solo) != 'undefined') {
            if (body.solo == 'avatar') {
              objData.anhDaiDien = imagePath;
            }
            if (body.solo == 'wallpaper') {
              objData.anhBia = imagePath;
            }
          } else {
            if (index == 0) {
              objData.anhDaiDien = imagePath;
            } else {
              objData.anhBia = imagePath;
            }
          }
        }
      })
    }

    if (objData != {}) {
      try {
        await nguoiDungModel.findByIdAndUpdate(objID, objData);
        return res.status(200).json({
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

exports.updateArrBV = async (req, res, next) => {
  var idNguoiDung = req.params.idNguoiDung;
  var idBV = req.query.idBV;

  if (typeof (idBV) != 'undefined' && typeof (idNguoiDung) != 'undefined') {

    try {
      let listNguoiDung = await nguoiDungModel.find({ _id: idNguoiDung });

      if (listNguoiDung.length > 0) {
        var objData = fillObj(listNguoiDung[0]);
        objData._id = idNguoiDung;
        objData.arr_BaiViet.push(idBV);
        console.log(objData);

        await nguoiDungModel.findByIdAndUpdate(idNguoiDung, objData);
        return res.status(200).json({
          success: true,
          data: {
            listNguoiDung: listNguoiDung,
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

}

function fillObj(body) {
  let objData = new nguoiDungModel();
  objData.tenTaiKhoan = body.tenTaiKhoan;
  objData.email = body.email;
  objData.sdt = body.sdt;
  objData.matKhau = body.matKhau;
  objData.gioiThieu = body.gioiThieu;
  objData.queQuan = body.queQuan;
  objData.sinhNhat = body.sinhNhat;
  objData.anhDaiDien = body.anhDaiDien;
  objData.anhBia = body.anhBia;
  objData.arr_BaiViet = body.arr_BaiViet;
  objData.arr_AnBaiViet = body.arr_AnBaiViet;
  objData.arr_TheoDoi = body.arr_TheoDoi;
  objData.arr_NguoiTheoDoi = body.arr_NguoiTheoDoi;
  objData.arr_HoiNhom = body.arr_HoiNhom;
  return objData;
}
