const mongoose = require("mongoose");
const paymentSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});
module.exports = mongoose.model("PaymentMethod", paymentSchema);
