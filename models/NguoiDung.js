var db = require('../Modules/db');

const NguoiDungSchema = new db.mongoose.Schema(
  {
    tenTaiKhoan: { type: String, required: true, },
    email: {
      type: String, required: true, index: {
        unique: true,
        dropDups: true
      }
    },
    matKhau: { type: String, required: true, },
    sdt: { type: Number, required: false, },
    gioiThieu: { type: String, required: false, },
    queQuan: { type: String, required: false, },
    sinhNhat: { type: Date, required: true, },
    anhDaiDien: { type: String, required: true, },
    anhBia: { type: String, required: true, },
    arr_BaiViet: { type: Array, required: false, },
    arr_AnBaiViet: { type: Array, required: false, },
    arr_TheoDoi: { type: Array, required: false, },
    arr_NguoiTheoDoi: { type: Array, required: false, },
    arr_HoiNhom: { type: Array, required: false, },
  },
  { collection: "Nguoi_Dung" }
);

module.exports = db.mongoose.model("NguoiDung", NguoiDungSchema);
