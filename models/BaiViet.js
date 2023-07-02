var db = require('../Modules/db');

const BaiVietSchema = new db.mongoose.Schema(
  {
    idNguoiDung: {
      type: db.mongoose.Schema.Types.ObjectId,
      ref: "NguoiDung",
      required: true,
    },
    noiDung: { type: String, required: true, },
    phongChu: { type: String, required: true, },
    anhBaiViet: { type: String, required: false, },
    arr_binhLuan: { type: Array, required: false, },
    arr_dongTinh: { type: Array, required: false, },
    arr_phanDoi: { type: Array, required: false, },
    soLuongChiaSe: { type: Number, required: false, },
    soLuongBaoCao: { type: Number, required: false, },
    thoiGian: { type: Date, required: true, },
    viTriBaiViet: { type: String, required: true, },
  },
  { collection: "Bai_Viet" }
);

module.exports = db.mongoose.model("BaiViet", BaiVietSchema);
