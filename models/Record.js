const mongoose = require("mongoose");

const RecordSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true
    },
    username: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    accountNo: {
        type: String,
        required: true
    },
    IFSC: {
        type: String,
        required: true
    },
    amount: {
        type: Number, 
        required: true
    },
    date: {
        type: String,
        required: true
    },
});

module.exports = mongoose.model("Record", RecordSchema);
