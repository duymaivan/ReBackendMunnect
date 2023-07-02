var db = require('../Modules/db');

const TuongTacSchema = new db.mongoose.Schema(
  {
    idNguoiDung: {
      type: db.mongoose.Schema.Types.ObjectId,
      ref: "NguoiDung",
      required: true,
    },
    idBaiViet: {
      type: db.mongoose.Schema.Types.ObjectId,
      ref: "BaiViet",
      required: true,
    },
    loaiTuongTac: { type: String, required: true, },
    trangThai: { type: String, required: false, },
  },
  { collection: "Tuong_Tac" }
);

module.exports = db.mongoose.model("TuongTac", TuongTacSchema);
