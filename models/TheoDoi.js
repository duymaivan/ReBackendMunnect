var db = require('../Modules/db');

const TheoDoiSchema = new db.mongoose.Schema(
  {
    idNguoiDung: {
      type: db.mongoose.Schema.Types.ObjectId,
      ref: "NguoiDung",
      required: true,
    },
    idNguoiTheoDoi: {
      type: db.mongoose.Schema.Types.ObjectId,
      ref: "NguoiDung",
      required: true,
    },
    trangThai: { type: String, required: true, },
  },
  { collection: "Theo_Doi" }
);

module.exports = db.mongoose.model("TheoDoi", TheoDoiSchema);
