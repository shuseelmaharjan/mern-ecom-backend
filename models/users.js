const mongoose = require("mongoose");
const crypto = require("crypto");

const shippingAddressSchema = mongoose.Schema({
  fullName: { type: String, required: true },
  addressLine1: { type: String, required: true },
  addressLine2: { type: String, required: false, default: null },
  city: { type: String, required: true },
  state: { type: String, required: true },
  postalCode: { type: String, required: true },
  country: { type: String, required: true },
  phone: { type: String, require: true },
  isDefault: { type: Boolean, default: false },
  defaultBilling: { type: Boolean, default: false },
  isHome: { type: Boolean, default: false },
  isOffice: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: null },
});

const employeeSchema = mongoose.Schema({
  employeeId: { type: String, required: false, unique: true },
  designation: { type: String, required: true },
  dateOfJoining: { type: Date, default: Date.now },
  salary: { type: Number, required: true },
});

const emergencyContact = mongoose.Schema({
  name: { type: String, required: true },
  relationship: { type: String, required: true },
  phoneNumber: { type: String, required: true },
});

const userSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profileImg: { type: String, required: false, default: null },
  isAdmin: { type: Boolean, default: null },
  isVendor: { type: Boolean, default: null },
  isUser: { type: Boolean, default: null },
  isHr: { type: Boolean, default: null },
  isMarketing: { type: Boolean, default: null },
  isStaff: { type: Boolean, default: null },
  isActive: { type: Boolean, required: true, default: true },
  createdAt: { type: Date, default: Date.now },
  lastUpdate: { type: Date, required: false, default: null },
  verified: { type: Boolean, default: false },
  shippingAddresses: [shippingAddressSchema],
  employee: employeeSchema,
  emergencyContact: emergencyContact,
  gender: {
    type: String,
    enum: ["Male", "Female", "Other"],
    required: false,
    default: null,
  },
});

const generateEmployeeId = () => {
  return crypto.randomBytes(4).toString("hex").toUpperCase();
};

userSchema.pre("save", async function (next) {
  if (this.employee && !this.employee.employeeId) {
    let isUnique = false;
    let newEmployeeId = "";

    while (!isUnique) {
      newEmployeeId = generateEmployeeId();
      const existingEmployee = await this.constructor.findOne({
        "employee.employeeId": newEmployeeId,
      });

      if (!existingEmployee) {
        isUnique = true;
      }
    }

    this.employee.employeeId = newEmployeeId;
  }
  next();
});

module.exports = mongoose.model("Users", userSchema);
