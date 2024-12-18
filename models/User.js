const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name:{type:String, require:true},
    email:{type:String, require:true, unique:true},
    password:{type:String, require:true},
    isAdmin:{type:Boolean, default:false},
    isVendor:{type:Boolean, default:false},
    isUser:{type:Boolean, default:true},
    addressLine1:{type:String, require:false, null:true},
    addressLine2:{type:String, require:false, null:true},
    isActive: {type:Boolean, require:true, default:true},
    phoneNumber:{type:String, require:false, null:true},
    imageUrl:{type:String, require:false, null:true},
    createdAt:{type:Date, default: Date.now()},
    lastUpdate: {type:Date, require:false, null: true}, // last update time stamp
});

module.exports = mongoose.model('Users', userSchema);
