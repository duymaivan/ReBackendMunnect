var db = require('../Modules/db');

const TVNhomSchema = new db.mongoose.Schema(
  {
    idHoiNhom: {
      type: db.mongoose.Schema.Types.ObjectId,
      ref: "HoiNhom",
      required: true,
    },
    idNguoiDung: {
      type: db.mongoose.Schema.Types.ObjectId,
      ref: "NguoiDung",
      required: true,
    },
    vaiTro: { type: String, required: true, },
    trangThai: { type: String, required: true, },
    ngayThamGia: { type: Date, required: true, },
  },
  { collection: "TV_Nhom" }
);

module.exports = db.mongoose.model("TVNhom", TVNhomSchema);
