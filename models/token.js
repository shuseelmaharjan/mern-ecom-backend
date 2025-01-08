const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const tokenSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    red: "users",
    unique: true,
  },
  token: { type: String, require: true },
  cratedAt: { typel: Date, default: Date.now(), expires: 60 },
});

module.exports = mongoose.model("token", tokenSchema);
