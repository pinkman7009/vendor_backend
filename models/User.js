const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true,
        unique: true
    },
    // only for admin
   email: {
    type: String,
	default: null
  },
    password: {
        type: String,
        required: true
    },
    role: {
        type: Number,
        required: true
    },
    canLogin: {
        type: Boolean,
        default: false
    },
    date: {
        type: Date,
        default: Date.now,
    },
});




module.exports = mongoose.model("User", UserSchema);
