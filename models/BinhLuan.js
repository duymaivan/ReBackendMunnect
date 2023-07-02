var db = require('../Modules/db');

const BinhLuanSchema = new db.mongoose.Schema(
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
    noiDung: { type: String, required: true, },
    anhBinhLuan: { type: String, required: false, },
    thoiGian: { type: Date, required: true, },
    arr_BinhLuan: { type: Array, required: false, },
  },
  { collection: "Binh_Luan" }
);

module.exports = db.mongoose.model("BinhLuan", BinhLuanSchema);
