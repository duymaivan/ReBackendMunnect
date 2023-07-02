var theoDoiModel = require('../models/TheoDoi');
var nguoiDungModel = require('../models/NguoiDung');

exports.list = async (req, res, next) => {
  var reqFilterFollowing = null;
  var reqFilterFollower = null;
  var values = req.query;
  var getFollow = false;

  try {
    let listTheoDoi = {};

    if (typeof (values.getFollowing) != 'undefined' && typeof (values.idSelf) != 'undefined') {
      if (values.getFollowing == 'true') {
        reqFilterFollowing = { idNguoiTheoDoi: values.idSelf };
        listTheoDoi = await theoDoiModel.find(reqFilterFollowing).find({trangThai: 'true'}).populate('idNguoiDung');
      }
    }

    if (typeof (values.getFollower) != 'undefined' && typeof (values.idSelf) != 'undefined') {
      if (values.getFollower == 'true') {
        reqFilterFollower = { idNguoiDung: values.idSelf };
        listTheoDoi = await theoDoiModel.find(reqFilterFollower).find({trangThai: 'true'}).populate('idNguoiTheoDoi');
      }
    }

    if (typeof (values.idAccount) != 'undefined' && typeof (values.idSelf) != 'undefined') {
      reqFilterFollower = { idNguoiTheoDoi: values.idSelf };
      reqFilterFollowing = { idNguoiDung: values.idAccount };
      console.log(values.idAccount);
      getFollow = true;
      listTheoDoi = await theoDoiModel.find(reqFilterFollowing).find(reqFilterFollower).find({trangThai: 'true'});
    }

    if (listTheoDoi.length > 0) {
      if (getFollow == true) {
        return res.status(200).json({
          success: true,
          data: {
            trangThai: listTheoDoi[0].trangThai,
          },
        });
      } else {
        return res.status(200).json({
          success: true,
          data: {
            listTheoDoi: listTheoDoi,
          },
        });
      }
    } else {
      return res.status(200).json({
        success: true,
        data: {
          listTheoDoi: [],
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

exports.newFollow = async (req, res, next) => {
  var reqFilterFollowing = null;
  var reqFilterFollower = null;
  var values = req.query;
  console.log(values);

  if (typeof (values.idSelf) != 'undefined' && typeof (values.idAccount) != 'undefined') {
    reqFilterFollowing = { idNguoiDung: values.idAccount };
    reqFilterFollower = { idNguoiTheoDoi: values.idSelf };
  }

  try {
    let listTheoDoi = await theoDoiModel.find(reqFilterFollowing).find(reqFilterFollower).populate('idNguoiDung');
    let listNguoiDung = await nguoiDungModel.find({ _id: values.idAccount });
    let listNguoiTheoDoi = await nguoiDungModel.find({ _id: values.idSelf });

    // console.log(listTheoDoi);
    if (typeof (values.isFollow) != 'undefined') {
      var objData = new theoDoiModel();
      objData.idNguoiDung = values.idAccount;
      objData.idNguoiTheoDoi = values.idSelf;
      objData.trangThai = values.isFollow;


      if (listTheoDoi.length > 0) {
        objData._id = listTheoDoi[0]._id;
        await theoDoiModel.findByIdAndUpdate(objData._id, objData);
        updateAccount(values, listNguoiDung[0], listNguoiTheoDoi[0]);
        return res.status(200).json({
          success: true,
          data: {
            trangThai: values.isFollow,
          },
        });
      } else {
        await objData.save();
        updateAccount(values, listNguoiDung[0], listNguoiTheoDoi[0]);
        return res.status(200).json({
          success: true,
          data: {
            trangThai: values.isFollow,
          },
        });
      }
    }
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

async function updateAccount(values, account, self) {
  var objAccount = account;
  var objSelf = self;
  objAccount.arr_NguoiTheoDoi = [];
  objSelf.arr_TheoDoi = [];
  if (values.isFollow == 'true') {
    if (objAccount.arr_NguoiTheoDoi.indexOf(self._id) < 0) {
      objAccount.arr_NguoiTheoDoi.push(self._id);
    }
    if (objSelf.arr_TheoDoi.indexOf(account._id) < 0) {
      objSelf.arr_TheoDoi.push(account._id);
    }

    await nguoiDungModel.findByIdAndUpdate(objAccount._id, objAccount);
    await nguoiDungModel.findByIdAndUpdate(objSelf._id, objSelf);
  }
  if (values.isFollow == 'false') {
    if (objAccount.arr_NguoiTheoDoi.indexOf(self._id) >= 0) {
      objAccount.arr_NguoiTheoDoi.splice(objAccount.arr_NguoiTheoDoi.indexOf(self._id), 1);
    }
    if (objSelf.arr_TheoDoi.indexOf(account._id) >= 0) {
      objSelf.arr_TheoDoi.splice(objSelf.arr_TheoDoi.indexOf(account._id), 1);
    }

    await nguoiDungModel.findByIdAndUpdate(objAccount._id, objAccount);
    await nguoiDungModel.findByIdAndUpdate(objSelf._id, objSelf);
  }
}
