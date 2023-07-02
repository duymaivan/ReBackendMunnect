var db = require('../Modules/db');

const HoiNhomSchema = new db.mongoose.Schema(
  {
    idChuNhom: {
      type: db.mongoose.Schema.Types.ObjectId,
      ref: "NguoiDung",
      required: true,
    },
    tenNhom: { type: String, required: true, },
    anhNhom: { type: String, required: true, },
    anhBiaNhom: { type: String, required: true, },
    gioiThieu: { type: String, required: true, },
    ngayTaoNhom: { type: Date, required: true, },
    arr_ThanhVien: { type: Array, required: true, },
    arr_BaiViet: { type: Array, required: true, },
  },
  { collection: "Hoi_Nhom" }
);

module.exports = db.mongoose.model("HoiNhom", HoiNhomSchema);
