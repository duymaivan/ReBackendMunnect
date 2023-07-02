var db = require('../Modules/db');

const BaoCaoSchema = new db.mongoose.Schema(
  {
    idBaiViet: {
      type: db.mongoose.Schema.Types.ObjectId,
      ref: "BaiViet",
      required: true,
    },
    idNguoiDung: {
      type: db.mongoose.Schema.Types.ObjectId,
      ref: "NguoiDung",
      required: true,
    },
    noiDungBC: { type: String, required: true, },
  },
  { collection: "Bao_Cao" }
);

module.exports = db.mongoose.model("BaoCao", BaoCaoSchema);
